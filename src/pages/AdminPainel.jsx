import { useEffect, useState } from 'react'
import Header from '../components/Header'
import AnuncioAdminCard from '../components/AnuncioAdminCard'
import PlanoEditor from '../components/PlanoEditor'
import AnuncioEditarModal from '../components/AnuncioEditarModal'
import {
  listarAnuncios,
  aprovarAnuncio,
  reprovarAnuncio,
  listarPlanosAdmin,
  atualizarPlano,
} from '../lib/adminApi'
import { sair } from '../lib/auth'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, Settings } from 'lucide-react'
import AdminPerfilModal from '../components/AdminPerfilModal'

const ABAS = [
  { chave: 'aprovado', rotulo: 'Aprovados' },
  { chave: 'pendente', rotulo: 'Pendentes' },
  { chave: 'reprovado', rotulo: 'Reprovados' },
  { chave: 'planos', rotulo: 'Planos' },
  { chave: 'configuracoes', rotulo: '⚙️ Configurações & CRECI' },
]

export default function AdminPainel() {
  const navigate = useNavigate()
  const [aba, setAba] = useState('aprovado')
  const [anuncios, setAnuncios] = useState([])
  const [planos, setPlanos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [anuncioEditando, setAnuncioEditando] = useState(null)
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false)

  useEffect(() => {
    if (aba === 'configuracoes') {
      setModalPerfilAberto(true)
      setAba('aprovado')
      return
    }
    carregarAba()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aba])


  async function carregarAba() {
    setCarregando(true)
    setErro(null)
    try {
      if (planos.length === 0) {
        try {
          const listaPlanos = await listarPlanosAdmin()
          setPlanos(listaPlanos)
        } catch (_) {}
      }

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

  async function handleSalvarEdicao() {
    await carregarAba()
  }

  async function handleExcluirAnuncio() {
    await carregarAba()
  }

  async function handleSair() {
    await sair()
    navigate('/admin/login')
  }

  return (
    <>
      <Header />
      <main className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
        <div className="admin-topo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 className="forms__titulo" style={{ margin: 0, fontFamily: 'Fraunces, serif' }}>Painel do Corretor</h1>
            <p style={{ color: '#7A726A', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
              Gerencie seus imóveis, fotos, preços, contatos e aprovações.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setModalPerfilAberto(true)}
              className="botao-secundario"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Settings size={18} />
              <span>Dados da Imobiliária, CRECI & Senha</span>
            </button>

            <Link
              to="/anunciar"
              className="botao-primario"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
            >
              <Plus size={18} />
              <span>Cadastrar Novo Imóvel</span>
            </Link>

            <button className="botao-secundario admin-sair" onClick={handleSair}>
              Sair
            </button>
          </div>

        </div>

        <div className="etapas admin-abas" style={{ marginBottom: '2rem' }}>
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
          <div className="admin-lista" style={{ display: 'grid', gap: '1.5rem' }}>
            {anuncios.map((a) => (
              <AnuncioAdminCard
                anuncio={a}
                key={a.id}
                onAprovar={handleAprovar}
                onReprovar={handleReprovar}
                onEditar={(anuncio) => setAnuncioEditando(anuncio)}
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

        {/* Modal de Edição Visual do Imóvel */}
        {anuncioEditando && (
          <AnuncioEditarModal
            anuncio={anuncioEditando}
            planos={planos}
            onSalvar={handleSalvarEdicao}
            onExcluir={handleExcluirAnuncio}
            onFechar={() => setAnuncioEditando(null)}
          />
        )}

        {/* Modal de Gestão da Imobiliária, CRECI & Senha */}
        {modalPerfilAberto && (
          <AdminPerfilModal onFechar={() => setModalPerfilAberto(false)} />
        )}
      </main>
    </>
  )
}


