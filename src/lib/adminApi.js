import { supabase } from './supabaseClient'

export async function listarAnuncios(status) {
  const { data, error } = await supabase
    .from('anuncios')
    .select(
      `id, titulo, tipo, finalidade, cidade, bairro, valor_centavos, area_m2, quartos,
       descricao_curta, nome_contato, whatsapp_contato, comprovante_path,
       termos_aceitos_em, data_aprovacao, data_expiracao, status, motivo_reprovacao, created_at,
       planos ( id, nome, dias_exibicao ),
       termos ( versao ),
       anuncio_fotos ( path, ordem )`
    )
    .eq('status', status)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function aprovarAnuncio(anuncio) {
  const dias = anuncio.planos?.dias_exibicao ?? 30
  const agora = new Date()
  const expiracao = new Date(agora.getTime() + dias * 24 * 60 * 60 * 1000)

  const { error } = await supabase
    .from('anuncios')
    .update({
      status: 'aprovado',
      data_aprovacao: agora.toISOString(),
      data_expiracao: expiracao.toISOString(),
      motivo_reprovacao: null,
    })
    .eq('id', anuncio.id)
  if (error) throw error
}

export async function reprovarAnuncio(id, motivo) {
  const { error } = await supabase
    .from('anuncios')
    .update({ status: 'reprovado', motivo_reprovacao: motivo || null })
    .eq('id', id)
  if (error) throw error
}

export async function listarPlanosAdmin() {
  const { data, error } = await supabase.from('planos').select('*').order('ordem', { ascending: true })
  if (error) throw error
  return data || []
}

export async function atualizarPlano(id, campos) {
  const { error } = await supabase.from('planos').update(campos).eq('id', id)
  if (error) throw error
}
