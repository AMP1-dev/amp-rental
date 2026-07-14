import { supabase } from './supabaseClient'

export async function buscarPlanosAtivos() {
  const { data, error } = await supabase
    .from('planos')
    .select('id, nome, descricao, dias_exibicao, preco_centavos, aparece_carrossel')
    .eq('ativo', true)
    .order('ordem', { ascending: true })
  if (error) throw error
  return data || []
}

export async function buscarTermoVigente() {
  const { data, error } = await supabase
    .from('termos')
    .select('id, versao, conteudo')
    .eq('vigente', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  if (error) throw error
  return data
}

// Sobe um arquivo pro Storage e devolve o path salvo (usado depois na tabela).
async function subirArquivo(bucket, path, arquivo) {
  const { error } = await supabase.storage.from(bucket).upload(path, arquivo, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  return path
}

// Envia o cadastro completo: gera um id, sobe fotos + comprovante nesse
// "namespace", cria o anúncio e por fim registra as fotos.
// Ordem importa por causa das policies de RLS (o anúncio 'pendente'
// precisa existir antes de inserir as linhas de anuncio_fotos).
export async function enviarCadastro({ dadosImovel, planoId, termo, fotos, comprovante }) {
  const anuncioId = crypto.randomUUID()

  const extComprovante = comprovante.name.split('.').pop()
  const comprovantePath = await subirArquivo(
    'comprovantes',
    `${anuncioId}/comprovante.${extComprovante}`,
    comprovante
  )

  const fotoPaths = []
  for (let i = 0; i < fotos.length; i++) {
    const ext = fotos[i].name.split('.').pop()
    const path = await subirArquivo('fotos-imoveis', `${anuncioId}/foto-${i + 1}.${ext}`, fotos[i])
    fotoPaths.push(path)
  }

  const { error: erroAnuncio } = await supabase.from('anuncios').insert({
    id: anuncioId,
    ...dadosImovel,
    plano_id: planoId,
    termos_id: termo.id,
    comprovante_path: comprovantePath,
    status: 'pendente',
  })
  if (erroAnuncio) throw erroAnuncio

  const { error: erroFotos } = await supabase.from('anuncio_fotos').insert(
    fotoPaths.map((path, i) => ({ anuncio_id: anuncioId, path, ordem: i }))
  )
  if (erroFotos) throw erroFotos

  return anuncioId
}
