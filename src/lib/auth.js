import { supabase } from './supabaseClient'

export async function entrar(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })
  if (error) throw error
  return data.session
}

export async function sair() {
  await supabase.auth.signOut()
}

export async function obterUsuarioAtual() {
  const { data } = await supabase.auth.getUser()
  return data?.user || null
}

export async function alterarSenha(novaSenha) {
  const { data, error } = await supabase.auth.updateUser({ password: novaSenha })
  if (error) throw error
  return data
}

