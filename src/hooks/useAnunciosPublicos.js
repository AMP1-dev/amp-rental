import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getFotoUrl } from '../lib/images'
import { IMOVEIS_DATA } from '../data/imoveisData'

export function useAnunciosPublicos() {
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [destaques, setDestaques] = useState([])
  const [geral, setGeral] = useState([])
  const [todos, setTodos] = useState([])

  useEffect(() => {
    let ativo = true

    async function carregar() {
      setCarregando(true)
      setErro(null)

      const isSupabaseConfigured =
        import.meta.env.VITE_SUPABASE_URL &&
        !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') &&
        !import.meta.env.VITE_SUPABASE_URL.includes('SEU-PROJETO')

      if (isSupabaseConfigured) {
        try {
          const [{ data: anuncios, error: erroAnuncios }, { data: planos, error: erroPlanos }] =
            await Promise.all([
              supabase
                .from('anuncios_publicos')
                .select('id, titulo, tipo, finalidade, cidade, bairro, valor_centavos, area_m2, quartos, plano_id, created_at')
                .order('created_at', { ascending: false }),
              supabase.from('planos').select('id, nome, aparece_carrossel'),
            ])

          if (!ativo) return

          if (!erroAnuncios && !erroPlanos && anuncios && anuncios.length > 0) {
            const idsAnuncios = (anuncios || []).map((a) => a.id)
            const { data: fotos } = idsAnuncios.length
              ? await supabase
                  .from('anuncio_fotos')
                  .select('anuncio_id, path, ordem')
                  .in('anuncio_id', idsAnuncios)
                  .order('ordem', { ascending: true })
              : { data: [] }

            const planosPorId = new Map((planos || []).map((p) => [p.id, p]))
            const primeiraFotoPorAnuncio = new Map()
            for (const f of fotos || []) {
              if (!primeiraFotoPorAnuncio.has(f.anuncio_id)) {
                primeiraFotoPorAnuncio.set(f.anuncio_id, f.path)
              }
            }

            const comFoto = await Promise.all(
              (anuncios || []).map(async (a) => {
                const capaUrl = await getFotoUrl(primeiraFotoPorAnuncio.get(a.id))
                const plano = planosPorId.get(a.plano_id)
                return { ...a, capaUrl, plano }
              })
            )

            if (!ativo) return

            setTodos(comFoto)
            setDestaques(comFoto.filter((a) => a.plano?.aparece_carrossel))
            setGeral(comFoto.filter((a) => !a.plano?.aparece_carrossel))
            setCarregando(false)
            return
          }
        } catch (e) {
          console.log('Supabase offline ou sem registros, usando base importada do WordPress:', e)
        }
      }

      // Fallback robusto para os imóveis extraídos do WordPress
      if (!ativo) return

      const formatados = IMOVEIS_DATA.map((p) => ({
        id: p.id,
        titulo: p.titulo,
        tipo: p.categoria,
        finalidade: p.finalidade,
        cidade: p.cidade,
        bairro: p.bairro,
        valor_centavos: Math.round(p.preco * 100),
        area_m2: p.areaM2,
        quartos: p.quartos,
        capaUrl: p.fotos[0],
        fotos: p.fotos,
        descricao_curta: p.descricao,
        destaque: p.destaque,
        plano: { aparece_carrossel: p.destaque }
      }))

      setTodos(formatados)
      setDestaques(formatados.filter((p) => p.destaque))
      setGeral(formatados.filter((p) => !p.destaque))
      setCarregando(false)
    }

    carregar()
    return () => {
      ativo = false
    }
  }, [])

  return { carregando, erro, destaques, geral, todos }
}
