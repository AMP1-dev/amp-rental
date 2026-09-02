-- ============================================================
-- BLOIS IMÓVEIS / AMP RENTAL — SETUP COMPLETO SUPABASE
-- Execute todo este script de uma só vez no SQL Editor do Supabase!
-- ============================================================

-- 1. Extensão para UUIDs
create extension if not exists "pgcrypto";

-- 2. Tabela de Planos
create table if not exists planos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  dias_exibicao int not null default 30,
  prazo_dias int default 30,
  preco_centavos int not null default 0,
  valor_centavos int default 0,
  aparece_carrossel boolean not null default false,
  ordem int not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Inserção dos Planos Padrão
insert into planos (id, nome, descricao, dias_exibicao, prazo_dias, preco_centavos, valor_centavos, aparece_carrossel, ordem)
values
  ('d79e2a6c-54a8-4c12-9c12-000000000001', 'Destaque Premium', 'Anúncio no carrossel principal e vitrine', 60, 60, 19900, 19900, true, 1),
  ('d79e2a6c-54a8-4c12-9c12-000000000002', 'Padrão', 'Anúncio na listagem geral', 30, 30, 9900, 9900, false, 2),
  ('d79e2a6c-54a8-4c12-9c12-000000000003', 'Básico', 'Anúncio na listagem básica', 15, 15, 4900, 4900, false, 3)
on conflict (id) do update set
  nome = excluded.nome,
  aparece_carrossel = excluded.aparece_carrossel;

-- 3. Tabela de Termos de Uso
create table if not exists termos (
  id uuid primary key default gen_random_uuid(),
  versao text not null default '2026-07-14',
  conteudo text not null,
  vigente boolean not null default true,
  created_at timestamptz not null default now()
);

-- Termo Padrão Vigente
insert into termos (id, versao, conteudo, vigente)
values (
  'e89e2a6c-54a8-4c12-9c12-000000000001',
  '2026-07-14',
  'Ao cadastrar seu imóvel, você concorda que:
1. As informações e fotos enviadas são de sua responsabilidade e devem corresponder ao imóvel real.
2. O anúncio só entra no ar após aprovação do corretor responsável, podendo ser recusado sem necessidade de justificativa.
3. O valor pago varia conforme o plano escolhido e o tempo de exibição do anúncio.
4. O comprovante de pagamento enviado será conferido antes da aprovação.
5. Ao final do prazo do plano contratado, o anúncio sai do ar automaticamente, podendo ser renovado.
6. Interessados no imóvel entrarão em contato diretamente com o corretor responsável.',
  true
)
on conflict (id) do nothing;

-- 4. Tipo Enum para Status do Anúncio
do $$ begin
  if not exists (select 1 from pg_type where typname = 'status_anuncio') then
    create type status_anuncio as enum ('pendente', 'aprovado', 'reprovado', 'expirado');
  end if;
end $$;

-- 5. Tabela de Anúncios
create table if not exists anuncios (
  id uuid primary key default gen_random_uuid(),
  codigo text,
  titulo text not null,
  tipo text not null,
  finalidade text not null,
  cidade text not null,
  bairro text,
  logradouro text,
  valor_centavos bigint,
  area_m2 numeric,
  quartos int default 0,
  banheiros int default 0,
  vagas int default 0,
  descricao text,
  descricao_curta text,
  nome_contato text,
  whatsapp_contato text,
  nome_responsavel text,
  whatsapp_responsavel text,
  plano_id uuid references planos(id),
  data_aprovacao timestamptz default now(),
  data_expiracao timestamptz,
  termos_id uuid references termos(id),
  termos_aceitos_em timestamptz default now(),
  termos_ip text,
  comprovante_path text,
  status status_anuncio not null default 'aprovado',
  motivo_reprovacao text,
  created_at timestamptz not null default now()
);

-- 6. Tabela de Fotos do Anúncio
create table if not exists anuncio_fotos (
  id uuid primary key default gen_random_uuid(),
  anuncio_id uuid not null references anuncios(id) on delete cascade,
  path text not null,
  ordem int not null default 0,
  created_at timestamptz not null default now()
);

-- Índices úteis
create index if not exists idx_anuncios_status on anuncios(status);
create index if not exists idx_anuncios_plano on anuncios(plano_id);
create index if not exists idx_fotos_anuncio on anuncio_fotos(anuncio_id);

-- 7. View de Anúncios Públicos (Protege os dados privados dos proprietários)
create or replace view anuncios_publicos as
select
  id,
  codigo,
  titulo,
  tipo,
  finalidade,
  cidade,
  bairro,
  logradouro,
  valor_centavos,
  area_m2,
  quartos,
  banheiros,
  vagas,
  coalesce(descricao_curta, descricao) as descricao_curta,
  plano_id,
  created_at
from anuncios
where status = 'aprovado';

-- 8. Row Level Security (RLS)
alter table planos enable row level security;
alter table termos enable row level security;
alter table anuncios enable row level security;
alter table anuncio_fotos enable row level security;

-- Limpar policies existentes
drop policy if exists "planos visiveis a todos" on planos;
drop policy if exists "admin gerencia planos" on planos;
drop policy if exists "termos visiveis a todos" on termos;
drop policy if exists "admin gerencia termos" on termos;
drop policy if exists "publico ve anuncios aprovados" on anuncios;
drop policy if exists "qualquer um cadastra anuncio" on anuncios;
drop policy if exists "admin ve todos os anuncios" on anuncios;
drop policy if exists "admin atualiza anuncios" on anuncios;
drop policy if exists "publico ve fotos de anuncios aprovados" on anuncio_fotos;
drop policy if exists "qualquer um insere fotos ao cadastrar" on anuncio_fotos;
drop policy if exists "admin ve todas as fotos" on anuncio_fotos;

-- Criar Policies
create policy "planos visiveis a todos" on planos for select using (ativo = true);
create policy "admin gerencia planos" on planos for all using (auth.role() = 'authenticated');

create policy "termos visiveis a todos" on termos for select using (vigente = true);
create policy "admin gerencia termos" on termos for all using (auth.role() = 'authenticated');

create policy "publico ve anuncios aprovados" on anuncios for select using (status = 'aprovado');
create policy "qualquer um cadastra anuncio" on anuncios for insert with check (status = 'pendente');
create policy "admin ve todos os anuncios" on anuncios for select using (auth.role() = 'authenticated');
create policy "admin atualiza anuncios" on anuncios for update using (auth.role() = 'authenticated');

create policy "publico ve fotos de anuncios aprovados" on anuncio_fotos for select using (
  exists (select 1 from anuncios a where a.id = anuncio_id and a.status = 'aprovado')
);
create policy "qualquer um insere fotos ao cadastrar" on anuncio_fotos for insert with check (true);
create policy "admin ve todas as fotos" on anuncio_fotos for select using (auth.role() = 'authenticated');

-- 9. Storage Buckets
insert into storage.buckets (id, name, public)
values ('fotos-imoveis', 'fotos-imoveis', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('comprovantes', 'comprovantes', false)
on conflict (id) do update set public = false;

-- Policies de Storage
drop policy if exists "qualquer um envia foto no cadastro" on storage.objects;
drop policy if exists "qualquer um envia comprovante no cadastro" on storage.objects;
drop policy if exists "publico le fotos-imoveis" on storage.objects;
drop policy if exists "admin le fotos" on storage.objects;
drop policy if exists "admin le comprovantes" on storage.objects;

create policy "qualquer um envia foto no cadastro" on storage.objects for insert with check (bucket_id = 'fotos-imoveis');
create policy "qualquer um envia comprovante no cadastro" on storage.objects for insert with check (bucket_id = 'comprovantes');
create policy "publico le fotos-imoveis" on storage.objects for select using (bucket_id = 'fotos-imoveis');
create policy "admin le fotos" on storage.objects for select using (bucket_id = 'fotos-imoveis' and auth.role() = 'authenticated');
create policy "admin le comprovantes" on storage.objects for select using (bucket_id = 'comprovantes' and auth.role() = 'authenticated');

-- 10. Inserção de Imóveis Extraídos (Seed da Base)

-- Imóvel: AMP-0080 - Terreno Rua Sergipe, n91, Lote 31 da quadra 27- Parque Varotti
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Terreno Rua Sergipe, n91, Lote 31 da quadra 27- Parque Varotti',
  'Terreno disponível para venda em Rua Sergipe, n91, Lote 31 da quadra 27- Parque Varotti. Excelente oportunidade.',
  'Terreno',
  'Venda',
  'Santa Cruz das Palmeiras',
  'Parque Varotti',
  'Rua Sergipe, n91, Lote 31 da quadra 27- Parque Varotti',
  250,
  0,
  0,
  0,
  7000000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '1 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000001000001',
  'a0000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000001000002',
  'a0000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0220 - Casa Rua João Reitano, n106-Vila Prudente
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'Casa Rua João Reitano, n106-Vila Prudente',
  '• Área total do terreno :163,00mts² • área de construção:140,09mts²',
  'Casa',
  'Venda',
  'Santa Cruz das Palmeiras',
  'Vila Prudente',
  'Rua João Reitano, n106-Vila Prudente',
  120,
  3,
  2,
  0,
  22000000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '2 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000002000001',
  'a0000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000002000002',
  'a0000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000002000003',
  'a0000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  3
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0221 - Casa Residencial / Comercio Rua Dr José Mendes da Silva , n 20- Conjunto Habitacional Ada Dedini Ometto
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'Casa Residencial / Comercio Rua Dr José Mendes da Silva , n 20- Conjunto Habitacional Ada Dedini Ometto',
  'Esquina com Comércio , banheiro e escritório • Área total do terreno :232,00mts² • área de construção:198,00mts²',
  'Comercial',
  'Venda',
  'Santa Cruz das Palmeiras',
  'Conjunto Habitacional Ada Dedini Ometto',
  'Rua Dr José Mendes da Silva , n 20- Conjunto Habitacional Ada Dedini Ometto',
  65,
  3,
  2,
  0,
  39500000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '3 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000003000001',
  'a0000000-0000-0000-0000-000000000003',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000003000002',
  'a0000000-0000-0000-0000-000000000003',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0222 - Terreno Rua Jasmins , n 131, Lote 12 da quadra G - Jardim Bela Vista
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000004',
  'Terreno Rua Jasmins , n 131, Lote 12 da quadra G - Jardim Bela Vista',
  'área do terreno: 200,00 mts²',
  'Terreno',
  'Venda',
  'Santa Cruz das Palmeiras',
  'Jardim Bela Vista',
  'Rua Jasmins , n 131, Lote 12 da quadra G - Jardim Bela Vista',
  250,
  0,
  0,
  0,
  10000000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '4 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000004000001',
  'a0000000-0000-0000-0000-000000000004',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000004000002',
  'a0000000-0000-0000-0000-000000000004',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0223 - Casa Rua João Gaspar Letordi, n 222- Jardim Limoeiro, Cachoeira de Emas
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000005',
  'Casa Rua João Gaspar Letordi, n 222- Jardim Limoeiro, Cachoeira de Emas',
  'Casa disponível para venda em Rua João Gaspar Letordi, n 222- Jardim Limoeiro, Cachoeira de Emas. Excelente oportunidade.',
  'Casa',
  'Venda',
  'Cachoeira de Emas',
  'Jardim Limoeiro, Cachoeira de Emas',
  'Rua João Gaspar Letordi, n 222- Jardim Limoeiro, Cachoeira de Emas',
  120,
  1,
  1,
  0,
  16000000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000002',
  NOW() - INTERVAL '5 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000005000001',
  'a0000000-0000-0000-0000-000000000005',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000005000002',
  'a0000000-0000-0000-0000-000000000005',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000005000003',
  'a0000000-0000-0000-0000-000000000005',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  3
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0224 - Casa na Avenida do Café, n 1020- Centro
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000006',
  'Casa na Avenida do Café, n 1020- Centro',
  'Casa disponível para venda em Avenida do Café, n 1020- Centro. Excelente oportunidade.',
  'Casa',
  'Venda',
  'Santa Cruz das Palmeiras',
  'Centro',
  'Avenida do Café, n 1020- Centro',
  120,
  0,
  0,
  0,
  40000000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '6 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000006000001',
  'a0000000-0000-0000-0000-000000000006',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000006000002',
  'a0000000-0000-0000-0000-000000000006',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000006000003',
  'a0000000-0000-0000-0000-000000000006',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  3
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0225 - Casa Rua Espírito Santo, n 48- Parque Varotti
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000007',
  'Casa Rua Espírito Santo, n 48- Parque Varotti',
  'Casa disponível para venda em Rua Espírito Santo, n 48- Parque Varotti. Excelente oportunidade.',
  'Casa',
  'Venda',
  'Santa Cruz das Palmeiras',
  'Parque Varotti',
  'Rua Espírito Santo, n 48- Parque Varotti',
  120,
  0,
  0,
  0,
  28000000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '7 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000007000001',
  'a0000000-0000-0000-0000-000000000007',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000007000002',
  'a0000000-0000-0000-0000-000000000007',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000007000003',
  'a0000000-0000-0000-0000-000000000007',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  3
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0226 - Terreno Rua E esto Scatolin, n 120, Lote 12 da quadra F, Jardim Santa Cecília
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000008',
  'Terreno Rua E esto Scatolin, n 120, Lote 12 da quadra F, Jardim Santa Cecília',
  'Terreno disponível para venda em Rua E esto Scatolin, n 120, Lote 12 da quadra F, Jardim Santa Cecília. Excelente oportunidade.',
  'Terreno',
  'Venda',
  'Santa Cruz das Palmeiras',
  'Jardim Santa Cecília',
  'Rua E esto Scatolin, n 120, Lote 12 da quadra F, Jardim Santa Cecília',
  250,
  0,
  0,
  0,
  16500000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '8 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000008000001',
  'a0000000-0000-0000-0000-000000000008',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000008000002',
  'a0000000-0000-0000-0000-000000000008',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0227 - Casa Avenida Quinze de Novembro , n1200- CENTRO ( ÓTIMA LOCALIZAÇÃO)
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000009',
  'Casa Avenida Quinze de Novembro , n1200- CENTRO ( ÓTIMA LOCALIZAÇÃO)',
  'Casa disponível para venda em Avenida Quinze de Novembro , n1200- CENTRO ( ÓTIMA LOCALIZAÇÃO). Excelente oportunidade.',
  'Casa',
  'Venda',
  'Santa Cruz das Palmeiras',
  'CENTRO ( ÓTIMA LOCALIZAÇÃO)',
  'Avenida Quinze de Novembro , n1200- CENTRO ( ÓTIMA LOCALIZAÇÃO)',
  120,
  3,
  1,
  0,
  45000000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '9 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000009000001',
  'a0000000-0000-0000-0000-000000000009',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000009000002',
  'a0000000-0000-0000-0000-000000000009',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000009000003',
  'a0000000-0000-0000-0000-000000000009',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  3
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0228 - Casa Rua José Vieira Martins, n 19- Santa Luzia
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000010',
  'Casa Rua José Vieira Martins, n 19- Santa Luzia',
  'parte superior contendo : suíte e sacad',
  'Casa',
  'Venda',
  'Santa Cruz das Palmeiras',
  'Santa Luzia',
  'Rua José Vieira Martins, n 19- Santa Luzia',
  120,
  2,
  1,
  0,
  32000000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '10 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000010000001',
  'a0000000-0000-0000-0000-000000000010',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000010000002',
  'a0000000-0000-0000-0000-000000000010',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000010000003',
  'a0000000-0000-0000-0000-000000000010',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  3
) ON CONFLICT (id) DO NOTHING;
