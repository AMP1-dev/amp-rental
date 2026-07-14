import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        {/* Troque por <img src="/logo.svg" /> quando tiver o arquivo da logo */}
        Imóveis
      </Link>
      <Link to="/anunciar" className="header__cta">
        Anunciar meu imóvel
      </Link>
    </header>
  )
}
