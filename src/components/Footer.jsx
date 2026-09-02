import React from 'react'
import { Link } from 'react-router-dom'
import { useEmpresaConfig } from '../config/empresa'
import { ShieldCheck, MapPin, Phone, Mail, Clock, MessageCircle, Building2, FileText } from 'lucide-react'

export default function Footer() {
  const empresa = useEmpresaConfig()

  return (
    <footer className="blois-footer">
      <div className="blois-footer__inner">
        {/* Topo do Rodapé: 3 Colunas Perfeitamente Alinhadas */}
        <div className="blois-footer__grid-top">
          {/* Coluna 1: Marca & Descrição */}
          <div className="blois-footer__col-brand">
            {empresa.logoUrl ? (
              <img
                src={empresa.logoUrl}
                alt={empresa.nomeFantasia}
                style={{ maxHeight: '44px', objectFit: 'contain', marginBottom: '0.75rem' }}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  Blois
                </span>
                <span style={{ color: '#C59B27', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {empresa.slogan}
                </span>
              </div>
            )}

            <p style={{ color: '#9E948A', fontSize: '0.88rem', lineHeight: '1.6', margin: '0.5rem 0 0', maxWidth: '360px' }}>
              Assessoria imobiliária completa e intermediação segura para compra, venda e locação de imóveis residenciais, comerciais e áreas especiais.
            </p>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div className="blois-footer__col-links">
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, margin: '0 0 1rem', letterSpacing: '0.02em' }}>
              Navegação
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><Link to="/" style={{ color: '#C7BFB5', fontSize: '0.88rem', textDecoration: 'none' }}>Página Inicial</Link></li>
              <li><Link to="/?finalidade=Venda" style={{ color: '#C7BFB5', fontSize: '0.88rem', textDecoration: 'none' }}>Comprar Imóvel</Link></li>
              <li><Link to="/?finalidade=Locação" style={{ color: '#C7BFB5', fontSize: '0.88rem', textDecoration: 'none' }}>Alugar Imóvel</Link></li>
              <li><Link to="/anunciar" style={{ color: '#C7BFB5', fontSize: '0.88rem', textDecoration: 'none' }}>Anunciar meu Imóvel</Link></li>
              <li><Link to="/admin/login" style={{ color: '#8C827A', fontSize: '0.82rem', textDecoration: 'none' }}>Acesso do Corretor / Painel</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Atendimento Oficial */}
          <div className="blois-footer__col-contact">
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, margin: '0 0 1rem', letterSpacing: '0.02em' }}>
              Atendimento Oficial
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: '#C7BFB5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={16} color="#C59B27" style={{ flexShrink: 0 }} />
                <span>{empresa.telefone}</span>
              </div>
              <a
                href={`https://wa.me/${empresa.whatsapp}?text=Ol%C3%A1,%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20im%C3%B3veis`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#25D366', fontWeight: 600, textDecoration: 'none' }}
              >
                <MessageCircle size={17} style={{ flexShrink: 0 }} />
                <span>WhatsApp: {empresa.whatsappFormatado}</span>
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={16} color="#C59B27" style={{ flexShrink: 0 }} />
                <span>{empresa.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#8C827A', fontSize: '0.82rem' }}>
                <Clock size={15} style={{ flexShrink: 0 }} />
                <span>{empresa.horarioAtendimento}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Técnicas e Exigências Legais do Conselho (CRECI / COFECI) */}
        <div className="blois-footer__legal-box">
          <div className="blois-footer__legal-header">
            <div className="blois-footer__badge-creci">
              <ShieldCheck size={15} />
              <span>REGULAMENTADO CRECI</span>
            </div>
            <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem' }}>
              {empresa.creci}
            </span>
            <span className="blois-desktop-only" style={{ color: '#6E665F' }}>•</span>
            <span className="blois-footer__resp-tecnico">
              {empresa.creciResponsavel}
            </span>
          </div>

          {/* Grid 2x2 Perfeitamente Alinhado */}
          <div className="blois-footer__legal-grid">
            <div className="blois-footer__legal-item">
              <Building2 size={15} color="#C59B27" style={{ flexShrink: 0 }} />
              <div>
                <span className="blois-footer__label">Razão Social:</span>
                <span className="blois-footer__value">{empresa.razaoSocial}</span>
              </div>
            </div>

            <div className="blois-footer__legal-item">
              <FileText size={15} color="#C59B27" style={{ flexShrink: 0 }} />
              <div>
                <span className="blois-footer__label">CNPJ:</span>
                <span className="blois-footer__value">{empresa.cnpj}</span>
              </div>
            </div>

            <div className="blois-footer__legal-item blois-footer__legal-item--span2">
              <MapPin size={15} color="#C59B27" style={{ flexShrink: 0 }} />
              <div>
                <span className="blois-footer__label">Sede / Endereço Físico:</span>
                <span className="blois-footer__value">
                  {empresa.endereco} — {empresa.cidade}/{empresa.estado} — CEP {empresa.cep}
                </span>
              </div>
            </div>
          </div>

          <p className="blois-footer__disclaimer">
            * As atividades de corretagem e intermediação imobiliária são executadas sob estrito cumprimento da Lei Federal nº 6.530/1978 e do Decreto nº 81.871/1978, registradas e fiscalizadas pelo Conselho Regional de Corretores de Imóveis (CRECI-SP). As informações, valores e disponibilidades dos imóveis estão sujeitos a confirmação junto aos corretores responsáveis.
          </p>
        </div>

        {/* Linha Final de Copyright */}
        <div className="blois-footer__copy">
          <span>© {new Date().getFullYear()} {empresa.nomeFantasia}. Todos os direitos reservados.</span>
          <span style={{ fontSize: '0.78rem', color: '#6E665F' }}>Plataforma Imobiliária Profissional</span>
        </div>

      </div>
    </footer>
  )
}
