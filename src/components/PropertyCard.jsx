import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Bed, Bath, Maximize2, ArrowRight } from 'lucide-react'
import { formatarPreco } from '../lib/format'

export default function PropertyCard({ anuncio, destaque = false }) {
  const local = [anuncio.bairro, anuncio.cidade].filter(Boolean).join(', ')

  return (
    <Link to={`/imovel/${anuncio.id}`} className="blois-card">
      <div className="blois-card__media">
        {anuncio.capaUrl ? (
          <img src={anuncio.capaUrl} alt={anuncio.titulo} loading="lazy" />
        ) : (
          <div className="card__foto-vazia" />
        )}
        <span className="blois-card__tag">
          {anuncio.finalidade || 'Venda'}
        </span>
      </div>

      <div className="blois-card__body">
        <h3 className="blois-card__title" title={anuncio.titulo}>
          {anuncio.titulo}
        </h3>

        <div className="blois-card__local">
          <MapPin size={14} color="#C59B27" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {local || 'Santa Cruz das Palmeiras - SP'}
          </span>
        </div>

        <div className="blois-card__price-row">
          <span className="blois-card__price">
            {formatarPreco(anuncio.valor_centavos)}
          </span>
          {anuncio.area_m2 && (
            <span style={{ fontSize: '0.8rem', color: '#8C827A', fontWeight: 600 }}>
              {anuncio.area_m2} m²
            </span>
          )}
        </div>

        <div className="blois-card__specs-row">
          {anuncio.quartos != null && anuncio.quartos > 0 && (
            <div className="blois-card__spec-item" title={`${anuncio.quartos} Quartos`}>
              <Bed size={14} color="#1A1817" />
              <span>{anuncio.quartos} Dorms</span>
            </div>
          )}
          {anuncio.banheiros != null && anuncio.banheiros > 0 && (
            <div className="blois-card__spec-item" title={`${anuncio.banheiros} Banheiros`}>
              <Bath size={14} color="#1A1817" />
              <span>{anuncio.banheiros} Banh</span>
            </div>
          )}
          {anuncio.area_m2 && (
            <div className="blois-card__spec-item" title={`${anuncio.area_m2} m²`}>
              <Maximize2 size={14} color="#1A1817" />
              <span>{anuncio.area_m2} m²</span>
            </div>
          )}
        </div>

        <div className="blois-card__btn">
          Ver Imóvel →
        </div>
      </div>
    </Link>
  )
}

