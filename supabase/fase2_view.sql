-- ============================================================
-- FASE 2 — rode isto além do schema.sql da Fase 1
-- (schema.sql já tinha RLS liberando SELECT de anúncios aprovados,
-- mas isso libera a LINHA toda, incluindo o telefone do dono do
-- imóvel. Essa view expõe só as colunas que o site público usa.)
-- ============================================================

create or replace view anuncios_publicos as
select
  id, titulo, tipo, finalidade, cidade, bairro,
  valor_centavos, area_m2, quartos, descricao_curta,
  plano_id, created_at
from anuncios
where status = 'aprovado';

-- a view herda a RLS da tabela base (leitura pública de aprovados já
-- permitida), então não precisa de policy própria.
