# Site de Divulgação de Imóveis — Fase 1 (setup)

Esqueleto do projeto: banco de dados, identidade visual (tokens) e
estrutura de rotas. Ainda **sem telas reais** — isso vem nas próximas
fases. Serve pra você já deixar o Supabase e o Vercel prontos.

## O que tem nesta fase

- `supabase/schema.sql` → tabelas, políticas de segurança (RLS) e
  buckets de arquivo. **Rode isso primeiro.**
- `src/styles/tokens.css` → paleta e tipografia (preto + marrom, tom
  claro, serif Fraunces + Inter).
- Estrutura de rotas vazia (`/`, `/anunciar`, `/admin/login`, `/admin`).

## Passo a passo

### 1. Criar o projeto no Supabase (gratuito)
1. Crie um projeto novo em supabase.com (mesma conta que você já usa).
2. Vá em **SQL Editor** → cole o conteúdo de `supabase/schema.sql` →
   Run. Isso cria as tabelas, os 3 planos de exemplo, as políticas de
   segurança e os buckets `fotos-imoveis` e `comprovantes`.
3. Em **Authentication → Users**, crie o usuário do corretor (seu
   email + senha) — é o login que vai acessar o painel admin.

### 2. Configurar variáveis de ambiente
Copie `.env.example` para `.env` e preencha:
- `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` → em Supabase,
  **Project Settings → API**.
- `VITE_WHATSAPP_CORRETOR` → número do corretor com DDI/DDD, só
  números (ex: `5511999999999`), usado no botão de contato.

### 3. Rodar localmente
```
npm install
npm run dev
```

### 4. Deploy (Vercel, gratuito)
Suba este projeto num repositório do GitHub e conecte no Vercel.
Nas configurações do projeto na Vercel, adicione as mesmas 3
variáveis de ambiente do `.env`. Build command e output já são
detectados automaticamente (Vite).

## Sobre os planos
Os 3 planos (Básico, Padrão, Destaque) já estão cadastrados com
valores de exemplo — você edita nome, prazo, preço e quem aparece no
carrossel direto pelo painel admin (Fase 4), sem precisar mexer em
código.

## Fase 2 — o que foi adicionado
- **Vitrine (`/`)**: carrossel dos anúncios em Destaque no topo (só
  aparece se houver algum) + grid geral estilo Instagram (foto
  quadrada, quase sem texto — só preço e bairro no rodapé da foto).
- **Detalhe do anúncio (`/imovel/:id`)**: galeria com todas as fotos,
  specs (m², quartos, finalidade) e botão "Falar no WhatsApp", que
  abre conversa **com o corretor** (número em `VITE_WHATSAPP_CORRETOR`)
  — o telefone do dono do imóvel nunca aparece pro público, fica só
  no painel admin.
- **Importante**: rode também `supabase/fase2_view.sql` no SQL
  Editor (além do `schema.sql` da Fase 1) — ele cria uma view que
  garante que o site público nunca consegue ler o telefone do dono
  do imóvel, só o corretor logado no painel.

Pra testar com dados de verdade antes da Fase 3 (que vai trazer o
formulário de cadastro), você pode inserir um anúncio de teste direto
pelo SQL Editor do Supabase, com status `'aprovado'` e um `plano_id`
válido, e subir uma foto manualmente pelo painel do Storage no bucket
`fotos-imoveis`.

## Fase 3 — o que foi adicionado
- **Cadastro (`/anunciar`)**: formulário em 3 etapas — dados do
  imóvel, aceite das condições (texto vem do banco, editável sem
  mexer em código), e escolha de plano + upload de fotos (até 8) e
  comprovante de pagamento. Ao enviar, o anúncio entra como
  `pendente` e some da vitrine até o admin aprovar.
- **Importante**: rode também `supabase/fase3.sql` no SQL Editor
  (além dos anteriores). Ele:
  1. corrige uma falha de segurança que eu tinha deixado nas fotos
     (a policy de inserir fotos dependia de uma leitura que o
     público não tem permissão de fazer — sem esse ajuste, o envio
     de fotos ia falhar).
  2. cadastra o texto inicial das condições/termos — **edite esse
     texto no banco** (tabela `termos`) com as regras e valores
     reais antes de divulgar o site pra valer.

## Fase 4 — o que foi adicionado
- **Login (`/admin/login`)** com o email/senha criado no passo 1.3.
- **Painel (`/admin`)**, protegido — só abre logado:
  - Abas **Pendentes / Aprovados / Reprovados**: cada anúncio mostra
    todas as fotos, dados completos, contato do dono (nome +
    WhatsApp — só o admin vê), o link do comprovante de pagamento e
    a versão dos termos aceitos com data/hora. Pendentes têm botão
    **Aprovar** (calcula a data de expiração automaticamente pelo
    prazo do plano) e **Reprovar** (com motivo opcional).
  - Aba **Planos**: edita nome, prazo, preço e se aparece no
    carrossel — sem precisar mexer no banco.
- Nenhum SQL novo é necessário nesta fase — as políticas de acesso
  do admin já tinham sido criadas lá na Fase 1.

## Observação sobre expiração automática
Quando o prazo do plano acaba, o anúncio **não sai do ar sozinho** —
ele só some da vitrine se alguém marcar `status = 'expirado'` (ou
reprovar de novo) manualmente, ou se você quiser automatizar isso
depois com um agendamento no Supabase (pg_cron, ainda dentro do
free tier). Por enquanto, o painel mostra "no ar até [data]" em
cada anúncio aprovado pra você acompanhar visualmente.

## Projeto completo
Com as 4 fases, o fluxo está fechado:
cliente cadastra → aceita termos → paga e envia comprovante →
admin aprova → anúncio aparece na vitrine → interessado chama o
corretor no WhatsApp.
