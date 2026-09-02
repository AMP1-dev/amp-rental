import React from 'react'
import { Link } from 'react-router-dom'
import { EMPRESA_CONFIG } from '../config/empresa'
import { ShieldCheck, MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="blois-footer">
      <div className="blois-footer__inner">
        {/* Topo do Rodapé: Logo, Slogan e Links de Navegação */}
        <div className="blois-footer__top">
          <div style={{ maxWidth: '380px' }}>
            {EMPRESA_CONFIG.logoUrl ? (
              <img
                src={EMPRESA_CONFIG.logoUrl}
                alt={EMPRESA_CONFIG.nomeFantasia}
                style={{ maxHeight: '48px', objectFit: 'contain', marginBottom: '0.75rem' }}
              />
            ) : (
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', fontWeight: 700, color: '#FFFFFF' }}>
                {EMPRESA_CONFIG.nomeFantasia}
              </span>
            )}
            <p style={{ color: '#C59B27', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '0.2rem' }}>
              {EMPRESA_CONFIG.slogan}
            </p>
            <p style={{ color: '#A89E94', fontSize: '0.88rem', marginTop: '0.6rem', lineHeight: 1.5 }}>
              Intermediação e assessoria imobiliária segura para compra, venda e locação de imóveis residenciais, comerciais e rurais.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.85rem' }}>Navegação</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/" style={{ color: '#D1CAC3', fontSize: '0.88rem', textDecoration: 'none' }}>Home</Link>
                <Link to="/?finalidade=Venda" style={{ color: '#D1CAC3', fontSize: '0.88rem', textDecoration: 'none' }}>Comprar Imóvel</Link>
                <Link to="/?finalidade=Locação" style={{ color: '#D1CAC3', fontSize: '0.88rem', textDecoration: 'none' }}>Alugar Imóvel</Link>
                <Link to="/anunciar" style={{ color: '#D1CAC3', fontSize: '0.88rem', textDecoration: 'none' }}>Anunciar meu Imóvel</Link>
                <Link to="/admin/login" style={{ color: '#A89E94', fontSize: '0.82rem', textDecoration: 'none', marginTop: '0.4rem' }}>Acesso do Corretor</Link>
              </div>
            </div>

            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.85rem' }}>Atendimento</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', color: '#D1CAC3', fontSize: '0.86rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={15} color="#C59B27" />
                  <span>{EMPRESA_CONFIG.telefone}</span>
                </div>
                <a
                  href={`https://wa.me/${EMPRESA_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#25D366', fontWeight: 600, textDecoration: 'none' }}
                >
                  <MessageCircle size={16} />
                  <span>{EMPRESA_CONFIG.whatsappFormatado}</span>
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={15} color="#C59B27" />
                  <span>{EMPRESA_CONFIG.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8C827A', fontSize: '0.8rem' }}>
                  <Clock size={14} />
                  <span>{EMPRESA_CONFIG.horarioAtendimento}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Técnicas e Exigências Legais do Conselho (CRECI / COFECI) */}
        <div style={{
          background: '#231F1C',
          border: '1px solid #38312B',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          margin: '2rem 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#C59B27',
              color: '#1A1817',
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}>
              <ShieldCheck size={14} />
              <span>REGULAMENTADO CRECI</span>
            </div>
            <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem' }}>
              {EMPRESA_CONFIG.creci}
            </span>
            <span style={{ color: '#8C827A', fontSize: '0.85rem' }}>•</span>
            <span style={{ color: '#D1CAC3', fontSize: '0.85rem' }}>
              {EMPRESA_CONFIG.creciResponsavel}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', fontSize: '0.82rem', color: '#B0A79E', marginBottom: '0.85rem' }}>
            <div>
              <strong style={{ color: '#ECE7DE' }}>Razão Social:</strong> {EMPRESA_CONFIG.razaoSocial}
            </div>
            <div>
              <strong style={{ color: '#ECE7DE' }}>CNPJ:</strong> {EMPRESA_CONFIG.cnpj}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={14} color="#C59B27" style={{ flexShrink: 0 }} />
              <span><strong>Endereço:</strong> {EMPRESA_CONFIG.endereco} — {EMPRESA_CONFIG.cidade} / {EMPRESA_CONFIG.estado} — CEP: {EMPRESA_CONFIG.cep}</span>
            </div>
          </div>

          <p style={{ color: '#7E756D', fontSize: '0.75rem', margin: 0, lineHeight: 1.4, borderTop: '1px solid #2E2823', paddingTop: '0.65rem' }}>
            * As atividades de corretagem e intermediação imobiliária são executadas sob estrito cumprimento da Lei Federal nº 6.530/1978 e do Decreto nº 81.871/1978, registradas e fiscalizadas pelo Conselho Regional de Corretores de Imóveis. As informações, valores e disponibilidades dos imóveis estão sujeitos a alterações a qualquer momento.
          </p>
        </div>

        {/* Linha Final de Copyright */}
        <div className="blois-footer__copy">
          <span>© {new Date().getFullYear()} {EMPRESA_CONFIG.nomeFantasia}. Todos os direitos reservados.</span>
          <span style={{ fontSize: '0.75rem', color: '#6E665F' }}>Plataforma AMP Rental</span>
        </div>
      </div>
    </footer>
  )
}
