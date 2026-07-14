import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getFotoUrl } from '../lib/images'

// Busca em 3 passos simples (mais robusto que depender de embed automático
// de relacionamento numa view do PostgREST):
//   1. anuncios_publicos -> só colunas seguras dos anúncios aprovados
//   2. planos             -> pra saber quais aparecem no carrossel
//   3. anuncio_fotos      -> pra pegar a foto de capa de cada anúncio
export function useAnunciosPublicos() {
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [destaques, setDestaques] = useState([])
  const [geral, setGeral] = useState([])

  useEffect(() => {
    let ativo = true

    async function carregar() {
      setCarregando(true)
      setErro(null)

      const [{ data: anuncios, error: erroAnuncios }, { data: planos, error: erroPlanos }] =
        await Promise.all([
          supabase
            .from('anuncios_publicos')
            .select('id, titulo, cidade, bairro, valor_centavos, area_m2, quartos, plano_id, created_at')
            .order('created_at', { ascending: false }),
          supabase.from('planos').select('id, nome, aparece_carrossel'),
        ])

      if (!ativo) return

      if (erroAnuncios || erroPlanos) {
        setErro((erroAnuncios || erroPlanos).message)
        setCarregando(false)
        return
      }

      const idsAnuncios = (anuncios || []).map((a) => a.id)
      const { data: fotos } = idsAnuncios.length
        ? await supabase
            .from('anuncio_fotos')
            .select('anuncio_id, path, ordem')
            .in('anuncio_id', idsAnuncios)
            .order('ordem', { ascending: true })
        : { data: [] }

      if (!ativo) return

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

      setDestaques(comFoto.filter((a) => a.plano?.aparece_carrossel))
      setGeral(comFoto.filter((a) => !a.plano?.aparece_carrossel))
      setCarregando(false)
    }

    carregar()
    return () => {
      ativo = false
    }
  }, [])

  return { carregando, erro, destaques, geral }
}
