import Header from '../components/Header'
import Carousel from '../components/Carousel'
import PropertyCard from '../components/PropertyCard'
import { useAnunciosPublicos } from '../hooks/useAnunciosPublicos'

export default function Home() {
  const { carregando, erro, destaques, geral } = useAnunciosPublicos()

  return (
    <>
      <Header />
      <main className="container">
        {carregando && <p className="estado">Carregando imóveis…</p>}
        {erro && <p className="estado estado--erro">Não deu pra carregar os imóveis agora.</p>}

        {!carregando && !erro && (
          <>
            {destaques.length > 0 && (
              <section className="secao">
                <Carousel anuncios={destaques} />
              </section>
            )}

            <section className="secao">
              {geral.length === 0 && destaques.length === 0 ? (
                <p className="estado">Nenhum imóvel disponível no momento.</p>
              ) : (
                <div className="grid">
                  {geral.map((a) => (
                    <PropertyCard anuncio={a} key={a.id} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  )
}
