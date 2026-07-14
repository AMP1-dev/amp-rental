import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import { supabase } from '../lib/supabaseClient'
import { getFotoUrl } from '../lib/images'
import { formatarPreco, linkWhatsapp } from '../lib/format'

export default function AnuncioDetalhe() {
  const { id } = useParams()
  const [anuncio, setAnuncio] = useState(null)
  const [fotos, setFotos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [naoEncontrado, setNaoEncontrado] = useState(false)

  useEffect(() => {
    let ativo = true

    async function carregar() {
      setCarregando(true)

      // anuncios_publicos (view) não expõe o whatsapp_contato: é o telefone
      // do dono do imóvel, só o admin precisa ver isso (fica no painel).
      // Quem o visitante interessado contata é sempre o corretor.
      const { data, error } = await supabase
        .from('anuncios_publicos')
        .select('id, titulo, tipo, finalidade, cidade, bairro, valor_centavos, area_m2, quartos, descricao_curta')
        .eq('id', id)
        .single()

      if (!ativo) return

      if (error || !data) {
        setNaoEncontrado(true)
        setCarregando(false)
        return
      }

      const { data: fotosRows } = await supabase
        .from('anuncio_fotos')
        .select('path, ordem')
        .eq('anuncio_id', id)
        .order('ordem', { ascending: true })

      const urls = await Promise.all((fotosRows || []).map((f) => getFotoUrl(f.path)))

      if (!ativo) return

      setAnuncio(data)
      setFotos(urls.filter(Boolean))
      setCarregando(false)
    }

    carregar()
    return () => {
      ativo = false
    }
  }, [id])

  return (
    <>
      <Header />
      <main className="container container--estreito">
        {carregando && <p className="estado">Carregando…</p>}

        {naoEncontrado && (
          <div className="estado">
            <p>Não encontramos esse imóvel — pode já ter saído do ar.</p>
            <Link to="/">Voltar para a vitrine</Link>
          </div>
        )}

        {anuncio && (
          <article className="detalhe">
            <div className="detalhe__galeria">
              {fotos.length > 0 ? (
                fotos.map((url, i) => <img src={url} alt={`${anuncio.titulo} - foto ${i + 1}`} key={url} />)
              ) : (
                <div className="card__foto-vazia" />
              )}
            </div>

            <div className="detalhe__info">
              <h1>{anuncio.titulo}</h1>
              <p className="detalhe__preco">{formatarPreco(anuncio.valor_centavos)}</p>
              <p className="detalhe__local">
                {[anuncio.bairro, anuncio.cidade].filter(Boolean).join(' · ')}
              </p>

              <ul className="detalhe__specs">
                {anuncio.area_m2 && <li>{anuncio.area_m2} m²</li>}
                {anuncio.quartos != null && <li>{anuncio.quartos} quarto(s)</li>}
                <li>{anuncio.finalidade}</li>
              </ul>

              {anuncio.descricao_curta && <p className="detalhe__descricao">{anuncio.descricao_curta}</p>}

              <a
                className="botao-whatsapp"
                href={linkWhatsapp(
                  import.meta.env.VITE_WHATSAPP_CORRETOR,
                  `Olá! Vi o anúncio "${anuncio.titulo}" no site e tenho interesse.`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar no WhatsApp
              </a>
            </div>
          </article>
        )}
      </main>
    </>
  )
}
