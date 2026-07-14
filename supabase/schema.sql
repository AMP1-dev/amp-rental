-- ============================================================
-- SITE DE DIVULGAÇÃO DE IMÓVEIS — SCHEMA SUPABASE
-- Rode este arquivo inteiro no SQL Editor do Supabase (projeto novo)
-- ============================================================

-- 1) PLANOS (editáveis pelo admin no painel) -------------------
create table if not exists planos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,                -- ex: "Básico", "Padrão", "Destaque"
  descricao text,
  dias_exibicao int not null,        -- quantos dias o anúncio fica no ar
  preco_centavos int not null,       -- valor em centavos (evita float)
  aparece_carrossel boolean not null default false,
  ordem int not null default 0,      -- ordem de exibição no formulário
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Seed inicial — 3 planos, valores de exemplo (edite depois no painel admin)
insert into planos (nome, descricao, dias_exibicao, preco_centavos, aparece_carrossel, ordem)
values
  ('Básico',  'Anúncio na listagem geral',              15, 4900,  false, 1),
  ('Padrão',  'Anúncio na listagem geral, prazo maior',  30, 8900,  false, 2),
  ('Destaque','Anúncio no carrossel principal da home',  30, 14900, true,  3)
on conflict do nothing;

-- 2) TERMOS DE USO (versionado — cada aceite referencia a versão vigente)
create table if not exists termos (
  id uuid primary key default gen_random_uuid(),
  versao text not null,              -- ex: "2026-07-13"
  conteudo text not null,            -- texto completo dos termos
  vigente boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3) ANÚNCIOS -----------------------------------------------------
create type status_anuncio as enum ('pendente', 'aprovado', 'reprovado', 'expirado');

create table if not exists anuncios (
  id uuid primary key default gen_random_uuid(),

  -- dados do imóvel (mínimo necessário)
  titulo text not null,
  tipo text not null,                -- casa, apartamento, terreno, comercial...
  finalidade text not null,          -- venda / aluguel
  cidade text not null,
  bairro text,
  valor_centavos int,                -- valor do imóvel anunciado (opcional, pode ser "sob consulta")
  area_m2 numeric,
  quartos int,
  descricao_curta text,              -- texto curto, foco é visual

  -- dados de contato (do proprietário/cliente que cadastrou)
  nome_contato text not null,
  whatsapp_contato text not null,    -- usado no botão wa.me do anúncio publicado

  -- plano escolhido
  plano_id uuid not null references planos(id),
  data_aprovacao timestamptz,
  data_expiracao timestamptz,        -- calculada = data_aprovacao + dias_exibicao do plano

  -- aceite de termos (auditável)
  termos_id uuid not null references termos(id),
  termos_aceitos_em timestamptz not null default now(),
  termos_ip text,

  -- comprovante de pagamento (arquivo no Storage, bucket 'comprovantes')
  comprovante_path text not null,

  status status_anuncio not null default 'pendente',
  motivo_reprovacao text,

  created_at timestamptz not null default now()
);

-- 4) FOTOS DO ANÚNCIO (várias por anúncio, bucket 'fotos-imoveis') --
create table if not exists anuncio_fotos (
  id uuid primary key default gen_random_uuid(),
  anuncio_id uuid not null references anuncios(id) on delete cascade,
  path text not null,
  ordem int not null default 0,
  created_at timestamptz not null default now()
);

-- 5) ÍNDICES ÚTEIS -------------------------------------------------
create index if not exists idx_anuncios_status on anuncios(status);
create index if not exists idx_anuncios_plano on anuncios(plano_id);
create index if not exists idx_fotos_anuncio on anuncio_fotos(anuncio_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table planos enable row level security;
alter table termos enable row level security;
alter table anuncios enable row level security;
alter table anuncio_fotos enable row level security;

-- Planos e termos vigentes: leitura pública (precisa aparecer no formulário público)
create policy "planos visiveis a todos" on planos
  for select using (ativo = true);

create policy "termos visiveis a todos" on termos
  for select using (vigente = true);

-- Anúncios: público só enxerga os APROVADOS (para a vitrine);
-- inserir um anúncio novo é permitido a qualquer visitante (é o cadastro público);
-- ver TODOS (inclusive pendentes) e atualizar é só para usuário autenticado (admin).
create policy "publico ve anuncios aprovados" on anuncios
  for select using (status = 'aprovado');

create policy "qualquer um cadastra anuncio" on anuncios
  for insert with check (status = 'pendente');

create policy "admin ve todos os anuncios" on anuncios
  for select using (auth.role() = 'authenticated');

create policy "admin atualiza anuncios" on anuncios
  for update using (auth.role() = 'authenticated');

-- Fotos: seguem a mesma regra do anúncio pai (via join simplificado por policy separada)
create policy "publico ve fotos de anuncios aprovados" on anuncio_fotos
  for select using (
    exists (select 1 from anuncios a where a.id = anuncio_id and a.status = 'aprovado')
  );

create policy "qualquer um insere fotos ao cadastrar" on anuncio_fotos
  for insert with check (
    exists (select 1 from anuncios a where a.id = anuncio_id and a.status = 'pendente')
  );

create policy "admin ve todas as fotos" on anuncio_fotos
  for select using (auth.role() = 'authenticated');

-- Admin (login) gerencia planos e termos
create policy "admin gerencia planos" on planos
  for all using (auth.role() = 'authenticated');

create policy "admin gerencia termos" on termos
  for all using (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS
-- Crie manualmente em Storage (ou rode o bloco abaixo no SQL editor):
--   - fotos-imoveis   (privado)
--   - comprovantes    (privado — NUNCA público, tem dado sensível de pagamento)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('fotos-imoveis', 'fotos-imoveis', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('comprovantes', 'comprovantes', false)
on conflict (id) do nothing;

-- Política de upload público (cadastro) e leitura só para admin/URLs assinadas:
create policy "qualquer um envia foto no cadastro" on storage.objects
  for insert with check (bucket_id = 'fotos-imoveis');

create policy "qualquer um envia comprovante no cadastro" on storage.objects
  for insert with check (bucket_id = 'comprovantes');

create policy "admin le fotos" on storage.objects
  for select using (bucket_id = 'fotos-imoveis' and auth.role() = 'authenticated');

create policy "admin le comprovantes" on storage.objects
  for select using (bucket_id = 'comprovantes' and auth.role() = 'authenticated');

-- Observação: as FOTOS de anúncios APROVADOS precisam aparecer no site público.
-- Como o bucket é privado, o front gera URL assinada (signed URL) na hora de
-- montar a vitrine — isso será resolvido no código do Fase 2, sem custo extra.
