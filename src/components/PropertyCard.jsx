import { Link } from 'react-router-dom'
import { formatarPreco } from '../lib/format'

export default function PropertyCard({ anuncio, destaque = false }) {
  const local = [anuncio.bairro, anuncio.cidade].filter(Boolean).join(' · ')

  return (
    <Link
      to={`/imovel/${anuncio.id}`}
      className={`card${destaque ? ' card--destaque' : ''}`}
    >
      <div className="card__foto">
        {anuncio.capaUrl ? (
          <img src={anuncio.capaUrl} alt={anuncio.titulo} loading="lazy" />
        ) : (
          <div className="card__foto-vazia" />
        )}
        {destaque && <span className="card__fita">Destaque</span>}
        <div className="card__overlay">
          <span className="card__preco">{formatarPreco(anuncio.valor_centavos)}</span>
          <span className="card__local">{local}</span>
        </div>
      </div>
    </Link>
  )
}
