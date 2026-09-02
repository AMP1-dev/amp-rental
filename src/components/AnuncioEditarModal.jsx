import { useState, useEffect } from 'react'
import {
  atualizarAnuncio,
  excluirAnuncio,
  removerFotoAnuncio,
  uploadFotoAnuncio,
  adicionarFotoUrl,
} from '../lib/adminApi'
import { getFotoUrl } from '../lib/images'
import { X, Upload, Trash2, Plus, Check, AlertCircle } from 'lucide-react'

export default function AnuncioEditarModal({ anuncio, planos = [], onSalvar, onFechar, onExcluir }) {
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState(false)

  // Campos do formulário
  const [titulo, setTitulo] = useState(anuncio.titulo || '')
  const [tipo, setTipo] = useState(anuncio.tipo || 'Casa')
  const [finalidade, setFinalidade] = useState(anuncio.finalidade || 'Venda')
  const [precoReais, setPrecoReais] = useState(
    anuncio.valor_centavos ? (anuncio.valor_centavos / 100).toString() : ''
  )
  const [areaM2, setAreaM2] = useState(anuncio.area_m2 || '')
  const [quartos, setQuartos] = useState(anuncio.quartos ?? 0)
  const [banheiros, setBanheiros] = useState(anuncio.banheiros ?? 0)
  const [vagas, setVagas] = useState(anuncio.vagas ?? 0)
  const [cidade, setCidade] = useState(anuncio.cidade || 'Santa Cruz das Palmeiras')
  const [bairro, setBairro] = useState(anuncio.bairro || '')
  const [logradouro, setLogradouro] = useState(anuncio.logradouro || '')
  const [descricao, setDescricao] = useState(anuncio.descricao || anuncio.descricao_curta || '')
  const [status, setStatus] = useState(anuncio.status || 'aprovado')
  const [planoId, setPlanoId] = useState(anuncio.plano_id || (planos[0]?.id ?? ''))

  // Fotos
  const [fotos, setFotos] = useState([])
  const [carregandoFotos, setCarregandoFotos] = useState(true)
  const [novaUrlFoto, setNovaUrlFoto] = useState('')
  const [enviandoFoto, setEnviandoFoto] = useState(false)

  useEffect(() => {
    carregarFotos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anuncio])

  async function carregarFotos() {
    setCarregandoFotos(true)
    const lista = (anuncio.anuncio_fotos || []).sort((a, b) => a.ordem - b.ordem)
    const comUrls = await Promise.all(
      lista.map(async (f) => ({
        id: f.id,
        path: f.path,
        url: await getFotoUrl(f.path),
        ordem: f.ordem,
      }))
    )
    setFotos(comUrls)
    setCarregandoFotos(false)
  }

  async function handleRemoverFoto(fotoId) {
    if (!confirm('Deseja realmente remover esta foto?')) return
    try {
      if (fotoId) {
        await removerFotoAnuncio(fotoId)
      }
      setFotos((prev) => prev.filter((f) => f.id !== fotoId))
    } catch (e) {
      alert('Erro ao remover foto: ' + e.message)
    }
  }

  async function handleUploadArquivo(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setEnviandoFoto(true)
    try {
      const novaFoto = await uploadFotoAnuncio(anuncio.id, file, fotos.length + 1)
      const url = await getFotoUrl(novaFoto.path)
      setFotos((prev) => [...prev, { id: novaFoto.id, path: novaFoto.path, url, ordem: novaFoto.ordem }])
    } catch (e) {
      alert('Erro ao enviar imagem: ' + e.message)
    } finally {
      setEnviandoFoto(false)
      e.target.value = ''
    }
  }

  async function handleAdicionarUrl() {
    if (!novaUrlFoto.trim()) return
    setEnviandoFoto(true)
    try {
      const novaFoto = await adicionarFotoUrl(anuncio.id, novaUrlFoto.trim(), fotos.length + 1)
      setFotos((prev) => [
        ...prev,
        { id: novaFoto.id, path: novaFoto.path, url: novaFoto.path, ordem: novaFoto.ordem },
      ])
      setNovaUrlFoto('')
    } catch (e) {
      alert('Erro ao adicionar URL da foto: ' + e.message)
    } finally {
      setEnviandoFoto(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSalvando(true)
    setErro(null)
    setSucesso(false)

    try {
      const valorCentavos = precoReais ? Math.round(parseFloat(precoReais) * 100) : null
      const campos = {
        titulo: titulo.trim(),
        tipo,
        finalidade,
        valor_centavos: valorCentavos,
        area_m2: areaM2 ? parseFloat(areaM2) : null,
        quartos: parseInt(quartos) || 0,
        banheiros: parseInt(banheiros) || 0,
        vagas: parseInt(vagas) || 0,
        cidade: cidade.trim(),
        bairro: bairro.trim(),
        logradouro: logradouro.trim(),
        descricao: descricao.trim(),
        descricao_curta: descricao.trim().substring(0, 160),
        status,
        plano_id: planoId || null,
      }

      await atualizarAnuncio(anuncio.id, campos)
      setSucesso(true)
      if (onSalvar) {
        onSalvar({ ...anuncio, ...campos })
      }
      setTimeout(() => {
        onFechar()
      }, 600)
    } catch (err) {
      setErro('Erro ao salvar alterações: ' + err.message)
    } finally {
      setSalvando(false)
    }
  }

  async function handleExcluir() {
    if (!confirm(`TEM CERTEZA que deseja excluir permanentemente o imóvel "${anuncio.titulo}"? Essa ação não pode ser desfeita.`)) {
      return
    }
    setSalvando(true)
    try {
      await excluirAnuncio(anuncio.id)
      if (onExcluir) onExcluir(anuncio.id)
      onFechar()
    } catch (err) {
      alert('Erro ao excluir: ' + err.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="blois-modal-overlay">
      <div className="blois-modal-card">
        <div className="blois-modal-header">
          <div>
            <h2 className="blois-modal-title">Editar Imóvel</h2>
            <span style={{ fontSize: '0.8rem', color: '#7A726A' }}>ID: {anuncio.id}</span>
          </div>
          <button type="button" onClick={onFechar} className="blois-modal-close-btn" aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        {erro && (
          <div className="blois-modal-alert blois-modal-alert--error">
            <AlertCircle size={18} />
            <span>{erro}</span>
          </div>
        )}

        {sucesso && (
          <div className="blois-modal-alert blois-modal-alert--success">
            <Check size={18} />
            <span>Alterações salvas com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="blois-modal-body">
          {/* Informações Básicas */}
          <div className="blois-form-group">
            <label className="blois-form-label">Título do Anúncio *</label>
            <input
              type="text"
              className="blois-form-input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className="blois-form-row">
            <div className="blois-form-group">
              <label className="blois-form-label">Tipo do Imóvel</label>
              <select className="blois-form-input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Terreno">Terreno</option>
                <option value="Comercial">Comercial</option>
                <option value="Chácara/Sítio">Chácara / Sítio</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>

            <div className="blois-form-group">
              <label className="blois-form-label">Finalidade</label>
              <select className="blois-form-input" value={finalidade} onChange={(e) => setFinalidade(e.target.value)}>
                <option value="Venda">Venda</option>
                <option value="Aluguel">Aluguel / Locação</option>
              </select>
            </div>

            <div className="blois-form-group">
              <label className="blois-form-label">Status do Anúncio</label>
              <select className="blois-form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="aprovado">Aprovado (No Ar)</option>
                <option value="pendente">Pendente</option>
                <option value="reprovado">Reprovado</option>
                <option value="expirado">Expirado</option>
              </select>
            </div>
          </div>

          <div className="blois-form-row">
            <div className="blois-form-group">
              <label className="blois-form-label">Valor de Venda/Locação (R$)</label>
              <input
                type="number"
                step="any"
                className="blois-form-input"
                placeholder="Ex: 220000"
                value={precoReais}
                onChange={(e) => setPrecoReais(e.target.value)}
              />
            </div>

            <div className="blois-form-group">
              <label className="blois-form-label">Área Construída / Terreno (m²)</label>
              <input
                type="number"
                step="any"
                className="blois-form-input"
                placeholder="Ex: 140"
                value={areaM2}
                onChange={(e) => setAreaM2(e.target.value)}
              />
            </div>
          </div>

          <div className="blois-form-row blois-form-row--3">
            <div className="blois-form-group">
              <label className="blois-form-label">Quartos</label>
              <input
                type="number"
                className="blois-form-input"
                value={quartos}
                onChange={(e) => setQuartos(e.target.value)}
              />
            </div>

            <div className="blois-form-group">
              <label className="blois-form-label">Banheiros</label>
              <input
                type="number"
                className="blois-form-input"
                value={banheiros}
                onChange={(e) => setBanheiros(e.target.value)}
              />
            </div>

            <div className="blois-form-group">
              <label className="blois-form-label">Vagas Garagem</label>
              <input
                type="number"
                className="blois-form-input"
                value={vagas}
                onChange={(e) => setVagas(e.target.value)}
              />
            </div>
          </div>

          {/* Localização */}
          <div className="blois-form-row">
            <div className="blois-form-group">
              <label className="blois-form-label">Cidade</label>
              <input
                type="text"
                className="blois-form-input"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>

            <div className="blois-form-group">
              <label className="blois-form-label">Bairro</label>
              <input
                type="text"
                className="blois-form-input"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
            </div>
          </div>

          <div className="blois-form-group">
            <label className="blois-form-label">Endereço Completo / Logradouro</label>
            <input
              type="text"
              className="blois-form-input"
              value={logradouro}
              onChange={(e) => setLogradouro(e.target.value)}
            />
          </div>

          {/* Descrição */}
          <div className="blois-form-group">
            <label className="blois-form-label">Descrição do Imóvel</label>
            <textarea
              rows={4}
              className="blois-form-input blois-form-textarea"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          {/* Galeria de Fotos */}
          <div className="blois-form-group" style={{ marginTop: '1rem' }}>
            <label className="blois-form-label">Fotos do Imóvel ({fotos.length})</label>
            
            <div className="blois-admin-photos-grid">
              {fotos.map((f, idx) => (
                <div key={f.id || idx} className="blois-admin-photo-thumb">
                  <img src={f.url || f.path} alt="Foto do imóvel" />
                  <button
                    type="button"
                    className="blois-admin-photo-delete"
                    onClick={() => handleRemoverFoto(f.id)}
                    title="Remover Foto"
                  >
                    <Trash2 size={14} />
                  </button>
                  <span className="blois-admin-photo-tag">#{idx + 1}</span>
                </div>
              ))}
              {fotos.length === 0 && !carregandoFotos && (
                <p style={{ color: '#8C827A', fontSize: '0.85rem' }}>Nenhuma foto cadastrada ainda.</p>
              )}
            </div>

            {/* Adicionar novas fotos */}
            <div className="blois-admin-add-photo-bar">
              <label className="blois-btn-upload">
                <Upload size={16} />
                <span>{enviandoFoto ? 'Enviando...' : 'Fazer Upload de Foto'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadArquivo}
                  disabled={enviandoFoto}
                  style={{ display: 'none' }}
                />
              </label>

              <div className="blois-admin-url-box">
                <input
                  type="url"
                  placeholder="Ou cole a URL da imagem aqui..."
                  className="blois-form-input"
                  value={novaUrlFoto}
                  onChange={(e) => setNovaUrlFoto(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAdicionarUrl}
                  disabled={enviandoFoto || !novaUrlFoto.trim()}
                  className="blois-btn-add-url"
                >
                  <Plus size={16} />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Ações do Rodapé do Modal */}
          <div className="blois-modal-footer">
            <button
              type="button"
              className="blois-btn-delete-ad"
              onClick={handleExcluir}
              disabled={salvando}
            >
              <Trash2 size={16} />
              <span>Excluir Imóvel</span>
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="blois-modal-btn-cancel"
                onClick={onFechar}
                disabled={salvando}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="blois-modal-btn-save"
                disabled={salvando}
              >
                {salvando ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
