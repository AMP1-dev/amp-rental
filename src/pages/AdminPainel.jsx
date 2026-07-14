import { useEffect, useState } from 'react'
import Header from '../components/Header'
import AnuncioAdminCard from '../components/AnuncioAdminCard'
import PlanoEditor from '../components/PlanoEditor'
import {
  listarAnuncios,
  aprovarAnuncio,
  reprovarAnuncio,
  listarPlanosAdmin,
  atualizarPlano,
} from '../lib/adminApi'
import { sair } from '../lib/auth'
import { useNavigate } from 'react-router-dom'

const ABAS = [
  { chave: 'pendente', rotulo: 'Pendentes' },
  { chave: 'aprovado', rotulo: 'Aprovados' },
  { chave: 'reprovado', rotulo: 'Reprovados' },
  { chave: 'planos', rotulo: 'Planos' },
]

export default function AdminPainel() {
  const navigate = useNavigate()
  const [aba, setAba] = useState('pendente')
  const [anuncios, setAnuncios] = useState([])
  const [planos, setPlanos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    carregarAba()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aba])

  async function carregarAba() {
    setCarregando(true)
    setErro(null)
    try {
      if (aba === 'planos') {
        setPlanos(await listarPlanosAdmin())
      } else {
        setAnuncios(await listarAnuncios(aba))
      }
    } catch (e) {
      setErro('Não deu pra carregar os dados agora.')
    } finally {
      setCarregando(false)
    }
  }

  async function handleAprovar(anuncio) {
    await aprovarAnuncio(anuncio)
    await carregarAba()
  }

  async function handleReprovar(id, motivo) {
    await reprovarAnuncio(id, motivo)
    await carregarAba()
  }

  async function handleSalvarPlano(id, campos) {
    await atualizarPlano(id, campos)
  }

  async function handleSair() {
    await sair()
    navigate('/admin/login')
  }

  return (
    <>
      <Header />
      <main className="container">
        <div className="admin-topo">
          <h1 className="forms__titulo">Painel do corretor</h1>
          <button className="botao-secundario admin-sair" onClick={handleSair}>
            Sair
          </button>
        </div>

        <div className="etapas admin-abas">
          {ABAS.map((a) => (
            <button
              key={a.chave}
              className={aba === a.chave ? 'etapas__item etapas__item--ativa' : 'etapas__item'}
              onClick={() => setAba(a.chave)}
            >
              {a.rotulo}
            </button>
          ))}
        </div>

        {carregando && <p className="estado">Carregando…</p>}
        {erro && <p className="estado estado--erro">{erro}</p>}

        {!carregando && aba !== 'planos' && anuncios.length === 0 && (
          <p className="estado">Nenhum anúncio {aba} no momento.</p>
        )}

        {!carregando && aba !== 'planos' && (
          <div className="admin-lista">
            {anuncios.map((a) => (
              <AnuncioAdminCard
                anuncio={a}
                key={a.id}
                onAprovar={handleAprovar}
                onReprovar={handleReprovar}
              />
            ))}
          </div>
        )}

        {!carregando && aba === 'planos' && (
          <div className="planos-admin-grid">
            {planos.map((p) => (
              <PlanoEditor plano={p} key={p.id} onSalvar={handleSalvarPlano} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
