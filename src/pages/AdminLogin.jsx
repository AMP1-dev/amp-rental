import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { entrar } from '../lib/auth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)
    try {
      await entrar(email, senha)
      navigate('/admin')
    } catch (err) {
      setErro('Email ou senha incorretos.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="container container--estreito">
      <form className="forms__secao login-caixa" onSubmit={onSubmit}>
        <h1 className="forms__titulo">Painel do corretor</h1>
        {erro && <p className="estado estado--erro">{erro}</p>}
        <label className="campo">
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="campo">
          Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </label>
        <button className="botao-primario" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}
