import { supabase } from './supabaseClient'

// Buckets são privados (fotos e comprovantes não podem ficar públicos por
// padrão), então pra exibir uma foto no site geramos uma URL assinada e
// temporária. Cache simples em memória evita pedir a mesma URL de novo
// enquanto o usuário navega pela vitrine.
const cache = new Map()
const EXPIRA_EM_SEGUNDOS = 60 * 60 // 1 hora — suficiente pra uma sessão de navegação

export async function getFotoUrl(path) {
  return getUrlAssinada('fotos-imoveis', path)
}

export async function getComprovanteUrl(path) {
  return getUrlAssinada('comprovantes', path)
}

async function getUrlAssinada(bucket, path) {
  if (!path) return null
  const chave = `${bucket}/${path}`
  if (cache.has(chave)) return cache.get(chave)

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, EXPIRA_EM_SEGUNDOS)

  if (error) {
    console.error('Erro ao gerar URL do arquivo:', error.message)
    return null
  }

  cache.set(chave, data.signedUrl)
  return data.signedUrl
}
