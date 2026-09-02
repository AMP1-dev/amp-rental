import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { User, Menu, X, PlusCircle, Home, Key, Tag, Phone, Settings } from 'lucide-react'
import { EMPRESA_CONFIG, useEmpresaConfig } from '../config/empresa'
import { obterUsuarioAtual } from '../lib/auth'
import AdminPerfilModal from './AdminPerfilModal'

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false)
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const empresa = useEmpresaConfig()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    let ativo = true
    obterUsuarioAtual().then((u) => {
      if (ativo) setUsuarioLogado(u)
    })
    return () => {
      ativo = false
    }
  }, [location.pathname])

  const linkAtivo = (path) => location.pathname === path

  function handleCliqueBoneco() {
    if (usuarioLogado || location.pathname.startsWith('/admin')) {
      setModalPerfilAberto(true)
    } else {
      navigate('/admin/login')
    }
  }


  return (
    <header className="blois-header">
      <div className="blois-header__inner">
        {/* Botão Mobile Menu (Esquerda no Mobile) */}
        <button
          type="button"
          onClick={() => setMenuAberto(!menuAberto)}
          className="blois-btn-icon blois-mobile-only"
          aria-label="Menu"
        >
          {menuAberto ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo Blois (Centro no Mobile, Esquerda no Desktop) */}
        <Link to="/" className="blois-logo">
          {empresa.logoUrl ? (
            <img
              src={empresa.logoUrl}
              alt={empresa.nomeFantasia}
              style={{ maxHeight: '40px', objectFit: 'contain' }}
            />
          ) : (
            <>
              <span className="blois-logo__title">Blois</span>
              <span className="blois-logo__subtitle">{empresa.slogan}</span>
            </>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="blois-nav">
          <Link
            to="/"
            className={`blois-nav__link ${linkAtivo('/') && !location.search ? 'blois-nav__link--active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/?finalidade=Todas"
            className="blois-nav__link"
          >
            Imóveis
          </Link>
          <Link
            to="/?finalidade=Venda"
            className={`blois-nav__link ${location.search.includes('Venda') ? 'blois-nav__link--active' : ''}`}
          >
            Venda
          </Link>
          <Link
            to="/?finalidade=Locação"
            className={`blois-nav__link ${location.search.includes('Loca') ? 'blois-nav__link--active' : ''}`}
          >
            Aluguel
          </Link>
          <a
            href={`https://wa.me/${empresa.whatsapp}?text=Ol%C3%A1,%20gostaria%20de%20falar%20com%20um%20corretor%20da%20Blois%20Im%C3%B3veis`}
            target="_blank"
            rel="noopener noreferrer"
            className="blois-nav__link"
          >
            Contato
          </a>
        </nav>

        {/* Actions (CRECI + Anunciar + Boneco Perfil/Admin) */}
        <div className="blois-header__actions" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span
            className="blois-desktop-only"
            style={{
              fontSize: '0.75rem',
              color: '#6B6259',
              fontWeight: 600,
              letterSpacing: '0.02em',
              background: '#F7F4EE',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #E5DFD5',
              whiteSpace: 'nowrap',
            }}
          >
            {empresa.creci}
          </span>

          <Link to="/anunciar" className="blois-btn-anunciar blois-desktop-only">
            <PlusCircle size={16} />
            <span>Anunciar Imóvel</span>
          </Link>

          {/* Boneco: Abre o modal de gestão e troca de senha se logado */}
          <button
            type="button"
            onClick={handleCliqueBoneco}
            className="blois-btn-icon"
            title={usuarioLogado || location.pathname.startsWith('/admin') ? "Gestão da Imobiliária, CRECI & Senha" : "Acesso Corretor / Admin"}
            aria-label="Painel Administrativo e Perfil"
            style={{
              background: (usuarioLogado || location.pathname.startsWith('/admin')) ? '#F5EFE6' : '#ECE7DE',
              border: (usuarioLogado || location.pathname.startsWith('/admin')) ? '1px solid #D5CEC5' : 'none',
              cursor: 'pointer',
              color: '#1A1817'
            }}
          >
            <User size={18} />
          </button>
        </div>

      </div>

      {/* Drawer Mobile Menu */}
      {menuAberto && (
        <div
          style={{
            background: '#FFFFFF',
            borderTop: '1px solid #EAE6DF',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link
            to="/"
            onClick={() => setMenuAberto(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1A1817',
            }}
          >
            <Home size={18} color="#C59B27" /> Início
          </Link>
          <Link
            to="/?finalidade=Venda"
            onClick={() => setMenuAberto(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1A1817',
            }}
          >
            <Tag size={18} color="#C59B27" /> Comprar Imóveis
          </Link>
          <Link
            to="/?finalidade=Locação"
            onClick={() => setMenuAberto(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1A1817',
            }}
          >
            <Key size={18} color="#C59B27" /> Alugar Imóveis
          </Link>
          <Link
            to="/anunciar"
            onClick={() => setMenuAberto(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1A1817',
            }}
          >
            <PlusCircle size={18} color="#C59B27" /> Anunciar meu imóvel
          </Link>
          <a
            href={`https://wa.me/${empresa.whatsapp}?text=Ol%C3%A1,%20gostaria%20de%20falar%20com%20um%20corretor%20da%20Blois%20Im%C3%B3veis`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuAberto(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1A1817',
            }}
          >
            <Phone size={18} color="#C59B27" /> Falar com o Corretor
          </a>

          {/* Opção de Gestão / Perfil no Menu Mobile */}
          <button
            type="button"
            onClick={() => {
              setMenuAberto(false)
              handleCliqueBoneco()
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1A1817',
              background: '#FAF7F2',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid #EAE6DF',
              cursor: 'pointer',
              marginTop: '0.5rem'
            }}
          >
            <Settings size={18} color="#C59B27" />
            <span>{usuarioLogado || location.pathname.startsWith('/admin') ? 'Gestão da Imobiliária, CRECI & Senha' : 'Painel do Corretor / Login'}</span>
          </button>
        </div>
      )}

      {/* Modal de Gestão da Imobiliária & Perfil */}
      {modalPerfilAberto && (
        <AdminPerfilModal onFechar={() => setModalPerfilAberto(false)} />
      )}
    </header>
  )
}
