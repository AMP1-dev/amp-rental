import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User, Menu, X, PlusCircle, Home, Key, Tag, Phone } from 'lucide-react'

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)
  const location = useLocation()

  const linkAtivo = (path) => location.pathname === path

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
          <span className="blois-logo__title">Blois</span>
          <span className="blois-logo__subtitle">Aqui se faz negócio</span>
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
            href="https://wa.me/5519999999999?text=Ol%C3%A1,%20gostaria%20de%20falar%20com%20um%20corretor%20da%20Blois%20Im%C3%B3veis"
            target="_blank"
            rel="noopener noreferrer"
            className="blois-nav__link"
          >
            Contato
          </a>
        </nav>

        {/* Actions (Anunciar + Login) */}
        <div className="blois-header__actions">
          <Link to="/anunciar" className="blois-btn-anunciar blois-desktop-only">
            <PlusCircle size={16} />
            <span>Anunciar Imóvel</span>
          </Link>

          <Link
            to="/admin/login"
            className="blois-btn-icon"
            title="Acesso Corretor / Admin"
            aria-label="Painel Administrativo"
          >
            <User size={18} />
          </Link>
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
            <Tag size={18} color="#C59B27" /> Comprar (Venda)
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
            <Key size={18} color="#C59B27" /> Alugar (Locação)
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
            href="https://wa.me/5519999999999?text=Ol%C3%A1,%20gostaria%20de%20falar%20com%20um%20corretor%20da%20Blois%20Im%C3%B3veis"
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
        </div>
      )}
    </header>
  )
}
