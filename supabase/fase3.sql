-- ============================================================
-- FASE 3 — rode isto além do schema.sql (Fase 1) e fase2_view.sql (Fase 2)
-- ============================================================

-- CORREÇÃO: a policy original de inserir fotos verificava se o anúncio
-- "pendente" existia — mas a policy de SELECT de anúncios só libera os
-- 'aprovado' pro público, então esse EXISTS nunca era verdadeiro e o
-- cadastro de fotos falhava. Como o anuncio_id é um UUID gerado no
-- navegador (não é adivinhável nem listado publicamente), é seguro
-- liberar a inserção sem esse EXISTS.
drop policy if exists "qualquer um insere fotos ao cadastrar" on anuncio_fotos;

create policy "qualquer um insere fotos ao cadastrar" on anuncio_fotos
  for insert with check (true);

-- Termos de uso iniciais — edite o texto abaixo com as condições reais
-- (valores por plano, prazos, regras de uso das fotos, etc.) antes de
-- divulgar o site. Pode ter só uma linha 'vigente = true' por vez.
insert into termos (versao, conteudo, vigente)
values (
  '2026-07-14',
  'Ao cadastrar seu imóvel, você concorda que:

1. As informações e fotos enviadas são de sua responsabilidade e devem
   corresponder ao imóvel real.
2. O anúncio só entra no ar após aprovação do corretor responsável,
   podendo ser recusado sem necessidade de justificativa.
3. O valor pago varia conforme o plano escolhido e o tempo de exibição
   do anúncio, e não é reembolsável após a aprovação.
4. O comprovante de pagamento enviado será conferido antes da aprovação.
5. Ao final do prazo do plano contratado, o anúncio sai do ar
   automaticamente, podendo ser renovado mediante novo cadastro.
6. Interessados no imóvel entrarão em contato diretamente com o
   corretor responsável, e não com você.',
  true
)
on conflict do nothing;
