import React, { useState, useEffect } from 'react'
import { getEmpresaConfig, salvarEmpresaConfig } from '../config/empresa'
import { obterUsuarioAtual, alterarSenha, sair } from '../lib/auth'
import { useNavigate } from 'react-router-dom'
import {
  X,
  Building2,
  Lock,
  LogOut,
  Check,
  AlertCircle,
  ShieldCheck,
  Save,
  KeyRound,
  User,
} from 'lucide-react'

export default function AdminPerfilModal({ onFechar }) {
  const navigate = useNavigate()
  const [abaAtiva, setAbaAtiva] = useState('empresa') // 'empresa' | 'senha'
  const [usuario, setUsuario] = useState(null)

  // Mensagens
  const [mensagemSucesso, setMensagemSucesso] = useState(null)
  const [mensagemErro, setMensagemErro] = useState(null)
  const [processando, setProcessando] = useState(false)

  // Campos da Empresa
  const [empresa, setEmpresa] = useState(getEmpresaConfig)

  // Campos de Senha
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')

  useEffect(() => {
    async function carregar() {
      const user = await obterUsuarioAtual()
      setUsuario(user)
    }
    carregar()
  }, [])

  function handleChangeEmpresa(campo, valor) {
    setEmpresa((prev) => ({ ...prev, [campo]: valor }))
  }

  function handleSalvarEmpresa(e) {
    e.preventDefault()
    setMensagemErro(null)
    setMensagemSucesso(null)
    try {
      salvarEmpresaConfig(empresa)
      setMensagemSucesso('Dados da imobiliária e CRECI salvos com sucesso!')
      setTimeout(() => setMensagemSucesso(null), 4000)
    } catch (err) {
      setMensagemErro('Erro ao salvar configurações: ' + err.message)
    }
  }

  async function handleTrocarSenha(e) {
    e.preventDefault()
    setMensagemErro(null)
    setMensagemSucesso(null)

    if (novaSenha.length < 6) {
      setMensagemErro('A nova senha deve ter no mínimo 6 caracteres.')
      return
    }

    if (novaSenha !== confirmaSenha) {
      setMensagemErro('As senhas digitadas não coincidem.')
      return
    }

    setProcessando(true)
    try {
      await alterarSenha(novaSenha)
      setMensagemSucesso('Sua senha foi alterada com sucesso!')
      setNovaSenha('')
      setConfirmaSenha('')
      setTimeout(() => setMensagemSucesso(null), 4000)
    } catch (err) {
      setMensagemErro('Erro ao trocar senha: ' + (err.message || 'Verifique seus dados.'))
    } finally {
      setProcessando(false)
    }
  }

  async function handleLogout() {
    if (confirm('Deseja realmente sair do sistema administrativo?')) {
      await sair()
      if (onFechar) onFechar()
      navigate('/admin/login')
    }
  }

  return (
    <div className="blois-modal-overlay">
      <div className="blois-modal-card" style={{ maxWidth: '850px' }}>
        {/* Header do Modal */}
        <div className="blois-modal-header" style={{ alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  background: '#1A1817',
                  color: '#FAF7F2',
                  padding: '0.4rem',
                  borderRadius: '8px',
                  display: 'flex',
                }}
              >
                <User size={20} />
              </div>
              <h2 className="blois-modal-title">Gestão do Corretor & Empresa</h2>
            </div>
            {usuario?.email && (
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#7A726A' }}>
                Conectado como: <strong>{usuario.email}</strong>
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onFechar}
            className="blois-modal-close-btn"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Abas Internas */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #EAE6DF',
            background: '#FAF8F5',
            padding: '0 1.5rem',
            gap: '1rem',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setAbaAtiva('empresa')
              setMensagemErro(null)
              setMensagemSucesso(null)
            }}
            style={{
              padding: '0.85rem 0.5rem',
              border: 'none',
              background: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: abaAtiva === 'empresa' ? '#1A1817' : '#8C827A',
              borderBottom: abaAtiva === 'empresa' ? '2px solid #1A1817' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Building2 size={16} />
            <span>Dados da Imobiliária & CRECI</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAbaAtiva('senha')
              setMensagemErro(null)
              setMensagemSucesso(null)
            }}
            style={{
              padding: '0.85rem 0.5rem',
              border: 'none',
              background: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: abaAtiva === 'senha' ? '#1A1817' : '#8C827A',
              borderBottom: abaAtiva === 'senha' ? '2px solid #1A1817' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Lock size={16} />
            <span>Trocar Senha</span>
          </button>
        </div>

        {/* Alertas */}
        {mensagemErro && (
          <div className="blois-modal-alert blois-modal-alert--error">
            <AlertCircle size={18} />
            <span>{mensagemErro}</span>
          </div>
        )}

        {mensagemSucesso && (
          <div className="blois-modal-alert blois-modal-alert--success">
            <Check size={18} />
            <span>{mensagemSucesso}</span>
          </div>
        )}

        {/* Conteúdo Aba 1: Dados da Empresa & CRECI */}
        {abaAtiva === 'empresa' && (
          <form onSubmit={handleSalvarEmpresa} className="blois-modal-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={18} color="#C59B27" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1A1817' }}>
                Exigências Legais do Conselho (CRECI / COFECI)
              </span>
            </div>

            <div className="blois-form-row">
              <div className="blois-form-group">
                <label className="blois-form-label">Nome Fantasia / Marca</label>
                <input
                  type="text"
                  className="blois-form-input"
                  value={empresa.nomeFantasia}
                  onChange={(e) => handleChangeEmpresa('nomeFantasia', e.target.value)}
                  placeholder="Ex: Blois Imóveis"
                  required
                />
              </div>

              <div className="blois-form-group">
                <label className="blois-form-label">Slogan do Site</label>
                <input
                  type="text"
                  className="blois-form-input"
                  value={empresa.slogan}
                  onChange={(e) => handleChangeEmpresa('slogan', e.target.value)}
                  placeholder="Ex: Aqui se faz negócio"
                />
              </div>
            </div>

            <div className="blois-form-row">
              <div className="blois-form-group">
                <label className="blois-form-label">Razão Social (PJ) *</label>
                <input
                  type="text"
                  className="blois-form-input"
                  value={empresa.razaoSocial}
                  onChange={(e) => handleChangeEmpresa('razaoSocial', e.target.value)}
                  placeholder="Ex: Blois Intermediação Imobiliária Ltda"
                  required
                />
              </div>

              <div className="blois-form-group">
                <label className="blois-form-label">CNPJ *</label>
                <input
                  type="text"
                  className="blois-form-input"
                  value={empresa.cnpj}
                  onChange={(e) => handleChangeEmpresa('cnpj', e.target.value)}
                  placeholder="00.000.000/0001-00"
                  required
                />
              </div>
            </div>

            <div className="blois-form-row">
              <div className="blois-form-group">
                <label className="blois-form-label">Número do CRECI (PJ) *</label>
                <input
                  type="text"
                  className="blois-form-input"
                  value={empresa.creci}
                  onChange={(e) => handleChangeEmpresa('creci', e.target.value)}
                  placeholder="Ex: CRECI-SP nº 123.456-J"
                  required
                />
              </div>

              <div className="blois-form-group">
                <label className="blois-form-label">Responsável Técnico (PF)</label>
                <input
                  type="text"
                  className="blois-form-input"
                  value={empresa.creciResponsavel}
                  onChange={(e) => handleChangeEmpresa('creciResponsavel', e.target.value)}
                  placeholder="Ex: Responsável Técnico: Renata Silva - CRECI-SP 123.456-F"
                />
              </div>
            </div>

            <div className="blois-form-group">
              <label className="blois-form-label">Endereço Completo da Sede *</label>
              <input
                type="text"
                className="blois-form-input"
                value={empresa.endereco}
                onChange={(e) => handleChangeEmpresa('endereco', e.target.value)}
                placeholder="Rua/Avenida, Número e Bairro"
                required
              />
            </div>

            <div className="blois-form-row blois-form-row--3">
              <div className="blois-form-group">
                <label className="blois-form-label">Cidade</label>
                <input
                  type="text"
                  className="blois-form-input"
                  value={empresa.cidade}
                  onChange={(e) => handleChangeEmpresa('cidade', e.target.value)}
                />
              </div>

              <div className="blois-form-group">
                <label className="blois-form-label">Estado</label>
                <input
                  type="text"
                  className="blois-form-input"
                  value={empresa.estado}
                  onChange={(e) => handleChangeEmpresa('estado', e.target.value)}
                />
              </div>

              <div className="blois-form-group">
                <label className="blois-form-label">CEP</label>
                <input
                  type="text"
                  className="blois-form-input"
                  value={empresa.cep}
                  onChange={(e) => handleChangeEmpresa('cep', e.target.value)}
                />
              </div>
            </div>

            <div className="blois-form-row">
              <div className="blois-form-group">
                <label className="blois-form-label">Telefone Fixo</label>
                <input
                  type="text"
                  className="blois-form-input"
                  value={empresa.telefone}
                  onChange={(e) => handleChangeEmpresa('telefone', e.target.value)}
                  placeholder="(19) 3672-0000"
                />
              </div>

              <div className="blois-form-group">
                <label className="blois-form-label">WhatsApp de Atendimento</label>
                <input
                  type="text"
                  className="blois-form-input"
                  value={empresa.whatsappFormatado}
                  onChange={(e) => {
                    handleChangeEmpresa('whatsappFormatado', e.target.value)
                    handleChangeEmpresa('whatsapp', e.target.value.replace(/\D/g, ''))
                  }}
                  placeholder="(19) 99999-9999"
                />
              </div>

              <div className="blois-form-group">
                <label className="blois-form-label">E-mail Oficial</label>
                <input
                  type="email"
                  className="blois-form-input"
                  value={empresa.email}
                  onChange={(e) => handleChangeEmpresa('email', e.target.value)}
                  placeholder="contato@imoveisimobiliaria.com.br"
                />
              </div>
            </div>

            <div className="blois-form-group">
              <label className="blois-form-label">Horário de Atendimento</label>
              <input
                type="text"
                className="blois-form-input"
                value={empresa.horarioAtendimento}
                onChange={(e) => handleChangeEmpresa('horarioAtendimento', e.target.value)}
                placeholder="Ex: Segunda a Sexta: 08h às 18h | Sábado: 08h às 12h"
              />
            </div>

            {/* Imagem do Logotipo */}
            <div className="blois-form-group">
              <label className="blois-form-label">URL do Logotipo da Empresa</label>
              <input
                type="text"
                className="blois-form-input"
                value={empresa.logoUrl}
                onChange={(e) => handleChangeEmpresa('logoUrl', e.target.value)}
                placeholder="Cole a URL da sua logo ou deixe em branco para usar a tipografia padrão"
              />
              <p style={{ fontSize: '0.78rem', color: '#8C827A', margin: '0.2rem 0 0' }}>
                Se preenchido, o site usará essa imagem no cabeçalho e rodapé.
              </p>
              {empresa.logoUrl && (
                <div style={{ marginTop: '0.5rem', background: '#FAF8F5', padding: '0.75rem', borderRadius: '8px', border: '1px solid #EAE6DF', display: 'inline-block' }}>
                  <img src={empresa.logoUrl} alt="Prévia do Logo" style={{ maxHeight: '45px' }} />
                </div>
              )}
            </div>

            {/* Rodapé do Form */}
            <div className="blois-modal-footer" style={{ marginTop: '1.5rem', padding: '1rem 0 0' }}>
              <button
                type="button"
                className="blois-btn-delete-ad"
                onClick={handleLogout}
                style={{ background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB' }}
              >
                <LogOut size={16} />
                <span>Sair da Conta</span>
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="blois-modal-btn-cancel" onClick={onFechar}>
                  Fechar
                </button>
                <button type="submit" className="blois-modal-btn-save">
                  <Save size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                  Salvar Dados
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Conteúdo Aba 2: Troca de Senha */}
        {abaAtiva === 'senha' && (
          <form onSubmit={handleTrocarSenha} className="blois-modal-body" style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ background: '#F7F4EE', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', color: '#C59B27' }}>
                <KeyRound size={26} />
              </div>
              <h3 style={{ margin: '0 0 0.35rem', fontFamily: 'Fraunces, serif' }}>Alterar Senha de Acesso</h3>
              <p style={{ color: '#8C827A', fontSize: '0.85rem', margin: 0 }}>
                Digite sua nova senha abaixo para atualizar seu login no painel administrativo.
              </p>
            </div>

            <div className="blois-form-group">
              <label className="blois-form-label">Nova Senha *</label>
              <input
                type="password"
                className="blois-form-input"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div className="blois-form-group">
              <label className="blois-form-label">Confirmar Nova Senha *</label>
              <input
                type="password"
                className="blois-form-input"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                placeholder="Digite a mesma senha novamente"
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="blois-modal-btn-cancel" onClick={onFechar}>
                Cancelar
              </button>
              <button type="submit" className="blois-modal-btn-save" disabled={processando}>
                {processando ? 'Atualizando...' : 'Atualizar Senha'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
