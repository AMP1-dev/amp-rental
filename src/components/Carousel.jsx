import { useRef } from 'react'
import PropertyCard from './PropertyCard'

export default function Carousel({ anuncios }) {
  const trilhoRef = useRef(null)

  function rolar(direcao) {
    const trilho = trilhoRef.current
    if (!trilho) return
    trilho.scrollBy({ left: direcao * trilho.clientWidth * 0.85, behavior: 'smooth' })
  }

  if (!anuncios.length) return null

  return (
    <div className="carrossel">
      <div className="carrossel__trilho" ref={trilhoRef}>
        {anuncios.map((a) => (
          <div className="carrossel__item" key={a.id}>
            <PropertyCard anuncio={a} destaque />
          </div>
        ))}
      </div>
      {anuncios.length > 1 && (
        <>
          <button
            type="button"
            className="carrossel__seta carrossel__seta--esq"
            onClick={() => rolar(-1)}
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className="carrossel__seta carrossel__seta--dir"
            onClick={() => rolar(1)}
            aria-label="Próximo"
          >
            ›
          </button>
        </>
      )}
    </div>
  )
}
