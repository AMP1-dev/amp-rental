import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { formatarPreco } from '../lib/format'

export default function Carousel({ anuncios }) {
  const [indiceAtual, setIndiceAtual] = useState(0)

  useEffect(() => {
    if (!anuncios || anuncios.length <= 1) return
    const timer = setInterval(() => {
      setIndiceAtual((prev) => (prev + 1) % anuncios.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [anuncios])

  if (!anuncios || !anuncios.length) return null

  const atual = anuncios[indiceAtual]
  const local = [atual.bairro, atual.cidade].filter(Boolean).join(', ')

  return (
    <div style={{ position: 'relative' }}>
      <div className="blois-featured-banner">
        <img
          src={atual.capaUrl || atual.fotos?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'}
          alt={atual.titulo}
        />

        <div className="blois-featured-banner__overlay">
          <div className="blois-featured-banner__info">
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C59B27', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
              <Sparkles size={14} /> Imóvel em Destaque
            </span>
            <h3>{atual.titulo}</h3>
            <div className="blois-featured-banner__specs">
              <span>📍 {local}</span>
              <span>•</span>
              <strong style={{ color: '#FFFFFF', fontSize: '1.15rem', fontFamily: 'Fraunces, serif' }}>
                {formatarPreco(atual.valor_centavos)}
              </strong>
              {atual.quartos > 0 && (
                <>
                  <span>•</span>
                  <span>🛏️ {atual.quartos} Dormitórios</span>
                </>
              )}
              {atual.area_m2 && (
                <>
                  <span>•</span>
                  <span>📐 {atual.area_m2} m²</span>
                </>
              )}
            </div>
          </div>

          <Link to={`/imovel/${atual.id}`} className="blois-btn-gold">
            Ver Detalhes →
          </Link>
        </div>

        {/* Setas de Navegação */}
        {anuncios.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIndiceAtual((prev) => (prev - 1 + anuncios.length) % anuncios.length)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '1.25rem',
                transform: 'translateY(-50%)',
                background: 'rgba(26, 24, 23, 0.65)',
                color: '#FFFFFF',
                border: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
              }}
              aria-label="Anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              onClick={() => setIndiceAtual((prev) => (prev + 1) % anuncios.length)}
              style={{
                position: 'absolute',
                top: '50%',
                right: '1.25rem',
                transform: 'translateY(-50%)',
                background: 'rgba(26, 24, 23, 0.65)',
                color: '#FFFFFF',
                border: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
              }}
              aria-label="Próximo"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Indicadores de bolinhas */}
      {anuncios.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '-2.5rem', marginBottom: '2.5rem', position: 'relative', zIndex: 10 }}>
          {anuncios.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndiceAtual(i)}
              style={{
                width: i === indiceAtual ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === indiceAtual ? '#C59B27' : 'rgba(255, 255, 255, 0.5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

