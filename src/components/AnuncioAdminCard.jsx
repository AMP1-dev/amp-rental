import { useEffect, useState } from 'react'
import { getFotoUrl, getComprovanteUrl } from '../lib/images'
import { formatarPreco } from '../lib/format'

export default function AnuncioAdminCard({ anuncio, onAprovar, onReprovar }) {
  const [fotosUrls, setFotosUrls] = useState([])
  const [comprovanteUrl, setComprovanteUrl] = useState(null)
  const [motivo, setMotivo] = useState('')
  const [mostrarMotivo, setMostrarMotivo] = useState(false)
  const [processando, setProcessando] = useState(false)

  useEffect(() => {
    let ativo = true
    async function carregar() {
      const fotos = (anuncio.anuncio_fotos || []).sort((a, b) => a.ordem - b.ordem)
      const urls = await Promise.all(fotos.map((f) => getFotoUrl(f.path)))
      const compUrl = await getComprovanteUrl(anuncio.comprovante_path)
      if (!ativo) return
      setFotosUrls(urls.filter(Boolean))
      setComprovanteUrl(compUrl)
    }
    carregar()
    return () => {
      ativo = false
    }
  }, [anuncio])

  async function aprovar() {
    setProcessando(true)
    try {
      await onAprovar(anuncio)
    } finally {
      setProcessando(false)
    }
  }

  async function confirmarReprovar() {
    setProcessando(true)
    try {
      await onReprovar(anuncio.id, motivo)
    } finally {
      setProcessando(false)
    }
  }

  return (
    <article className="admin-card">
      <div className="admin-card__fotos">
        {fotosUrls.length ? (
          fotosUrls.map((url) => <img src={url} key={url} alt={anuncio.titulo} />)
        ) : (
          <div className="card__foto-vazia" style={{ aspectRatio: '1/1' }} />
        )}
      </div>

      <div className="admin-card__info">
        <div className="admin-card__cabecalho">
          <h3>{anuncio.titulo}</h3>
          <span className={`status-badge status-badge--${anuncio.status}`}>{anuncio.status}</span>
        </div>

        <p className="admin-card__linha">
          {anuncio.tipo} · {anuncio.finalidade} · {[anuncio.bairro, anuncio.cidade].filter(Boolean).join(' - ')}
        </p>
        <p className="admin-card__linha">
          {formatarPreco(anuncio.valor_centavos)}
          {anuncio.area_m2 ? ` · ${anuncio.area_m2} m²` : ''}
          {anuncio.quartos != null ? ` · ${anuncio.quartos} quarto(s)` : ''}
        </p>
        {anuncio.descricao_curta && <p className="admin-card__linha">{anuncio.descricao_curta}</p>}

        <div className="admin-card__bloco">
          <strong>Contato do proprietário</strong>
          <p className="admin-card__linha">
            {anuncio.nome_contato} · {anuncio.whatsapp_contato}
          </p>
        </div>

        <div className="admin-card__bloco">
          <strong>Plano e condições</strong>
          <p className="admin-card__linha">
            {anuncio.planos?.nome} ({anuncio.planos?.dias_exibicao} dias) · termos v.{anuncio.termos?.versao} aceitos em{' '}
            {new Date(anuncio.termos_aceitos_em).toLocaleString('pt-BR')}
          </p>
          {comprovanteUrl && (
            <a href={comprovanteUrl} target="_blank" rel="noopener noreferrer" className="admin-card__link">
              Ver comprovante de pagamento
            </a>
          )}
        </div>

        {anuncio.status === 'aprovado' && anuncio.data_expiracao && (
          <p className="admin-card__linha">
            No ar até {new Date(anuncio.data_expiracao).toLocaleDateString('pt-BR')}
          </p>
        )}

        {anuncio.status === 'reprovado' && anuncio.motivo_reprovacao && (
          <p className="admin-card__linha">Motivo: {anuncio.motivo_reprovacao}</p>
        )}

        {anuncio.status === 'pendente' && (
          <div className="admin-card__acoes">
            {!mostrarMotivo ? (
              <>
                <button className="botao-primario" onClick={aprovar} disabled={processando}>
                  Aprovar
                </button>
                <button
                  className="botao-secundario"
                  onClick={() => setMostrarMotivo(true)}
                  disabled={processando}
                >
                  Reprovar
                </button>
              </>
            ) : (
              <div className="admin-card__reprovar">
                <textarea
                  rows={2}
                  placeholder="Motivo (opcional)"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                />
                <div className="forms__acoes">
                  <button className="botao-secundario" onClick={() => setMostrarMotivo(false)} disabled={processando}>
                    Cancelar
                  </button>
                  <button className="botao-primario" onClick={confirmarReprovar} disabled={processando}>
                    Confirmar reprovação
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
