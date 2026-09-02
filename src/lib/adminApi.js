import { supabase } from './supabaseClient'

export async function listarAnuncios(status) {
  const { data, error } = await supabase
    .from('anuncios')
    .select(
      `id, titulo, tipo, finalidade, cidade, bairro, logradouro, valor_centavos, area_m2, quartos, banheiros, vagas,
       descricao, descricao_curta, nome_contato, whatsapp_contato, nome_responsavel, whatsapp_responsavel, comprovante_path,
       termos_aceitos_em, data_aprovacao, data_expiracao, status, motivo_reprovacao, created_at,
       planos ( id, nome, dias_exibicao ),
       termos ( versao ),
       anuncio_fotos ( id, path, ordem )`
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

export async function atualizarAnuncio(id, campos) {
  const { error } = await supabase.from('anuncios').update(campos).eq('id', id)
  if (error) throw error
}

export async function excluirAnuncio(id) {
  const { error } = await supabase.from('anuncios').delete().eq('id', id)
  if (error) throw error
}

export async function uploadFotoAnuncio(anuncioId, file, ordem = 0) {
  const ext = file.name.split('.').pop()
  const path = `${anuncioId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
  const { error: uploadError } = await supabase.storage.from('fotos-imoveis').upload(path, file)
  if (uploadError) throw uploadError

  const { data: foto, error: insertError } = await supabase
    .from('anuncio_fotos')
    .insert({
      anuncio_id: anuncioId,
      path: path,
      ordem: ordem,
    })
    .select()
    .single()

  if (insertError) throw insertError
  return foto
}

export async function adicionarFotoUrl(anuncioId, url, ordem = 0) {
  const { data: foto, error } = await supabase
    .from('anuncio_fotos')
    .insert({
      anuncio_id: anuncioId,
      path: url,
      ordem: ordem,
    })
    .select()
    .single()
  if (error) throw error
  return foto
}

export async function removerFotoAnuncio(fotoId) {
  const { error } = await supabase.from('anuncio_fotos').delete().eq('id', fotoId)
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

