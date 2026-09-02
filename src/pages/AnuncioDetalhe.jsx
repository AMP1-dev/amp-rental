import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import PropertyCard from '../components/PropertyCard'
import { supabase } from '../lib/supabaseClient'
import { getFotoUrl } from '../lib/images'
import { formatarPreco, linkWhatsapp } from '../lib/format'
import { IMOVEIS_DATA } from '../data/imoveisData'
import {
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Maximize2,
  Car,
  Phone,
  Mail,
  Share2,
  Heart,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  Home,
  Search,
  User,
  Waves,
  UtensilsCrossed,
  Wine,
  TreePine,
  ShieldCheck,
} from 'lucide-react'

export default function AnuncioDetalhe() {
  const { id } = useParams()
  const [anuncio, setAnuncio] = useState(null)
  const [fotos, setFotos] = useState([])
  const [fotoSelecionada, setFotoSelecionada] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [naoEncontrado, setNaoEncontrado] = useState(false)
  const [relacionados, setRelacionados] = useState([])
  const [favoritado, setFavoritado] = useState(false)
  const [verMaisDescricao, setVerMaisDescricao] = useState(false)

  useEffect(() => {
    let ativo = true

    async function carregar() {
      setCarregando(true)
      window.scrollTo(0, 0)

      const isSupabaseConfigured =
        import.meta.env.VITE_SUPABASE_URL &&
        !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') &&
        !import.meta.env.VITE_SUPABASE_URL.includes('SEU-PROJETO')

      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('anuncios_publicos')
            .select('id, titulo, tipo, finalidade, cidade, bairro, valor_centavos, area_m2, quartos, banheiros, vagas, descricao_curta')
            .eq('id', id)
            .single()

          if (!ativo) return

          if (!error && data) {
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
            return
          }
        } catch (e) {
          console.log('Supabase offline, checando base local:', e)
        }
      }

      // Check in local dataset
      const local = IMOVEIS_DATA.find((p) => p.id === id || p.originalId === id)
      if (local) {
        setAnuncio({
          id: local.id,
          titulo: local.titulo,
          tipo: local.categoria,
          finalidade: local.finalidade,
          cidade: local.cidade,
          bairro: local.bairro,
          valor_centavos: Math.round(local.preco * 100),
          area_m2: local.areaM2,
          quartos: local.quartos,
          banheiros: local.banheiros,
          vagas: local.vagas,
          descricao_curta: local.descricao || local.detalhesCompletos,
          codigo: local.codigo,
        })
        setFotos(local.fotos || [])
        setFotoSelecionada(0)

        // Buscar relacionados
        const outros = IMOVEIS_DATA.filter((p) => p.id !== local.id).slice(0, 3)
        setRelacionados(
          outros.map((p) => ({
            id: p.id,
            titulo: p.titulo,
            tipo: p.categoria,
            finalidade: p.finalidade,
            cidade: p.cidade,
            bairro: p.bairro,
            valor_centavos: Math.round(p.preco * 100),
            area_m2: p.areaM2,
            quartos: p.quartos,
            banheiros: p.banheiros,
            capaUrl: p.fotos[0],
          }))
        )

        setCarregando(false)
      } else {
        setNaoEncontrado(true)
        setCarregando(false)
      }
    }

    carregar()
    return () => {
      ativo = false
    }
  }, [id])

  if (carregando) {
    return (
      <div style={{ background: '#FAF8F5', minHeight: '100vh' }}>
        <Header />
        <main className="blois-detail-container" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
          <p style={{ fontSize: '1.2rem', color: '#6B6259', fontFamily: 'Fraunces, serif' }}>
            Carregando detalhes do imóvel…
          </p>
        </main>
      </div>
    )
  }

  if (naoEncontrado || !anuncio) {
    return (
      <div style={{ background: '#FAF8F5', minHeight: '100vh' }}>
        <Header />
        <main className="blois-detail-container" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.8rem', marginBottom: '1rem', color: '#1A1817' }}>
            Imóvel não encontrado
          </h2>
          <p style={{ color: '#6B6259', marginBottom: '2rem' }}>
            O imóvel pesquisado não está mais disponível ou foi alterado.
          </p>
          <Link to="/" className="blois-btn-gold">
            ← Voltar para a Vitrine
          </Link>
        </main>
      </div>
    )
  }

  const localFormatado = [anuncio.bairro, anuncio.cidade].filter(Boolean).join(', ')
  const numeroWhatsapp = import.meta.env.VITE_WHATSAPP_CORRETOR || '5519999999999'
  const mensagemWhatsapp = `Olá! Vi o anúncio "${anuncio.titulo}" (Código: ${anuncio.codigo || anuncio.id}) no site da Blois Imóveis e gostaria de agendar uma visita e obter mais informações!`
  const linkWhats = linkWhatsapp(numeroWhatsapp, mensagemWhatsapp)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${anuncio.titulo}, ${anuncio.bairro || ''}, ${anuncio.cidade || ''} - SP`
  )}`

  // Fotos para a galeria
  const listaFotos =
    fotos.length > 0
      ? fotos
      : [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        ]

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: anuncio.titulo,
        text: `Confira este imóvel: ${anuncio.titulo}`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  // Resumo de características para o card mobile
  const resumoSpecs = [
    anuncio.quartos ? `${anuncio.quartos} ${anuncio.quartos > 1 ? 'Suítes / Quartos' : 'Quarto'}` : null,
    anuncio.banheiros ? `${anuncio.banheiros} ${anuncio.banheiros > 1 ? 'Banheiros' : 'Banheiro'}` : null,
    anuncio.vagas ? `${anuncio.vagas} ${anuncio.vagas > 1 ? 'Vagas' : 'Vaga'}` : null,
    anuncio.area_m2 ? `${anuncio.area_m2} m² Á. Const.` : null,
  ].filter(Boolean).join(' | ')

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '70px' }}>
      <Header />

      <main className="blois-detail-container" style={{ paddingBottom: '2rem' }}>
        {/* Breadcrumb / Voltar (Desktop) */}
        <div className="blois-desktop-only" style={{ marginBottom: '1.25rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#6B6259',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} /> Voltar para todos os imóveis
          </Link>
        </div>

        {/* Layout de 2 Colunas */}
        <div className="blois-detail-grid">
          {/* Coluna da Esquerda (Conteúdo Principal) */}
          <div>
            {/* Galeria de Fotos */}
            <div className="blois-gallery" style={{ position: 'relative' }}>
              {/* Foto Principal */}
              <div className="blois-gallery__hero">
                <img
                  src={listaFotos[fotoSelecionada] || listaFotos[0]}
                  alt={`${anuncio.titulo} - Foto Principal`}
                />

                {/* Overlay de Ações no Mobile (Share + Favorito) */}
                <div
                  className="blois-mobile-only"
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    display: 'flex',
                    gap: '0.5rem',
                    zIndex: 10,
                  }}
                >
                  <button
                    type="button"
                    onClick={handleShare}
                    style={{
                      background: 'rgba(255, 255, 255, 0.92)',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '0.4rem 0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#1A1817',
                      cursor: 'pointer',
                      backdropFilter: 'blur(4px)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    <Share2 size={14} /> Share
                  </button>

                  <button
                    type="button"
                    onClick={() => setFavoritado(!favoritado)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.92)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: favoritado ? '#E11D48' : '#1A1817',
                      cursor: 'pointer',
                      backdropFilter: 'blur(4px)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                    aria-label="Favoritar"
                  >
                    <Heart size={16} fill={favoritado ? '#E11D48' : 'none'} />
                  </button>
                </div>

                {/* Indicador de Bolinhas no Mobile */}
                <div
                  className="blois-mobile-only"
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1rem',
                    display: 'flex',
                    gap: '0.35rem',
                    zIndex: 10,
                  }}
                >
                  {listaFotos.slice(0, 5).map((_, i) => (
                    <span
                      key={i}
                      onClick={() => setFotoSelecionada(i)}
                      style={{
                        width: i === fotoSelecionada ? '18px' : '6px',
                        height: '6px',
                        borderRadius: '3px',
                        background: i === fotoSelecionada ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Coluna com 4 Miniaturas Verticais (Desktop Only) */}
              <div className="blois-gallery__thumbs blois-desktop-only">
                {listaFotos.slice(0, 4).map((url, idx) => (
                  <div
                    key={url + idx}
                    className={`blois-gallery__thumb ${idx === fotoSelecionada ? 'blois-gallery__thumb--active' : ''}`}
                    onClick={() => setFotoSelecionada(idx)}
                  >
                    <img src={url} alt={`Miniatura ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Cabeçalho do Imóvel */}
            <div className="blois-detail__header" style={{ marginBottom: '1.25rem' }}>
              <h1 className="blois-detail__title">{anuncio.titulo}</h1>

              <div className="blois-detail__local" style={{ marginBottom: '0.5rem' }}>
                <MapPin size={16} color="#C59B27" />
                <span>{localFormatado || 'Santa Cruz das Palmeiras - SP'}</span>
              </div>

              <div className="blois-detail__tag-row">
                <span className="blois-tag-finalidade">
                  {anuncio.finalidade === 'Locação' ? '🔑 Para Alugar' : '🏷️ À Venda'}
                </span>
                {anuncio.codigo && (
                  <span className="blois-tag-codigo">
                    Código: {anuncio.codigo}
                  </span>
                )}
              </div>
            </div>

            {/* ============================================================
                MOCKUP MOBILE: CARD CONSOLIDADO DE PREÇO E SPECS
                ============================================================ */}
            <div className="blois-mobile-only blois-mobile-summary-card">
              <div className="blois-mobile-summary-price">
                {formatarPreco(anuncio.valor_centavos)}
              </div>
              <div className="blois-mobile-summary-specs">
                {resumoSpecs || 'Excelente oportunidade para compra ou locação imediata.'}
              </div>
            </div>

            {/* ============================================================
                DESKTOP ONLY: GRID COM OS 6 CARDS DE ESPECIFICAÇÕES
                ============================================================ */}
            <div className="blois-desktop-only blois-specs-grid" style={{ width: '100%' }}>
              {/* Card 1: Preço */}
              <div className="blois-spec-card">
                <div className="blois-spec-card__icon">
                  <DollarSign size={20} />
                </div>
                <div className="blois-spec-card__info">
                  <span className="blois-spec-card__label">Preço:</span>
                  <span className="blois-spec-card__value">
                    {formatarPreco(anuncio.valor_centavos)}
                  </span>
                </div>
              </div>

              {/* Card 2: Suítes / Quartos */}
              <div className="blois-spec-card">
                <div className="blois-spec-card__icon">
                  <Bed size={20} />
                </div>
                <div className="blois-spec-card__info">
                  <span className="blois-spec-card__label">Dormitórios:</span>
                  <span className="blois-spec-card__value">
                    {anuncio.quartos != null && anuncio.quartos > 0 ? `${anuncio.quartos} Quartos` : 'Consulte'}
                  </span>
                </div>
              </div>

              {/* Card 3: Banheiros */}
              <div className="blois-spec-card">
                <div className="blois-spec-card__icon">
                  <Bath size={20} />
                </div>
                <div className="blois-spec-card__info">
                  <span className="blois-spec-card__label">Banheiros:</span>
                  <span className="blois-spec-card__value">
                    {anuncio.banheiros != null && anuncio.banheiros > 0 ? `${anuncio.banheiros} Banh.` : '1 Banheiro'}
                  </span>
                </div>
              </div>

              {/* Card 4: Área Útil */}
              <div className="blois-spec-card">
                <div className="blois-spec-card__icon">
                  <Maximize2 size={20} />
                </div>
                <div className="blois-spec-card__info">
                  <span className="blois-spec-card__label">Área Útil:</span>
                  <span className="blois-spec-card__value">
                    {anuncio.area_m2 ? `${anuncio.area_m2} m²` : 'Consulte'}
                  </span>
                </div>
              </div>

              {/* Card 5: Vagas */}
              <div className="blois-spec-card">
                <div className="blois-spec-card__icon">
                  <Car size={20} />
                </div>
                <div className="blois-spec-card__info">
                  <span className="blois-spec-card__label">Vagas:</span>
                  <span className="blois-spec-card__value">
                    {anuncio.vagas != null ? `${anuncio.vagas} Vagas` : '0 Vagas'}
                  </span>
                </div>
              </div>

              {/* Card 6: Localização */}
              <div className="blois-spec-card">
                <div className="blois-spec-card__icon">
                  <MapPin size={20} />
                </div>
                <div className="blois-spec-card__info">
                  <span className="blois-spec-card__label">Localização:</span>
                  <span className="blois-spec-card__value" style={{ fontSize: '0.95rem', wordBreak: 'break-word' }}>
                    {localFormatado || 'Santa Cruz das Palmeiras'}
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================================
                MOCKUP MOBILE: SEÇÃO DE CARACTERÍSTICAS EM ÍCONES (4 colunas)
                ============================================================ */}
            <div className="blois-mobile-only blois-caracteristicas-section">
              <h3 className="blois-section-title-sm">Características</h3>
              <div className="blois-caracteristicas-grid">
                {anuncio.quartos > 0 && (
                  <div className="blois-caracteristica-item">
                    <div className="blois-caracteristica-item__icon">
                      <Bed size={22} />
                    </div>
                    <span className="blois-caracteristica-item__label">{anuncio.quartos} Quartos</span>
                  </div>
                )}
                {anuncio.banheiros > 0 && (
                  <div className="blois-caracteristica-item">
                    <div className="blois-caracteristica-item__icon">
                      <Bath size={22} />
                    </div>
                    <span className="blois-caracteristica-item__label">{anuncio.banheiros} Banh.</span>
                  </div>
                )}
                {anuncio.vagas > 0 && (
                  <div className="blois-caracteristica-item">
                    <div className="blois-caracteristica-item__icon">
                      <Car size={22} />
                    </div>
                    <span className="blois-caracteristica-item__label">{anuncio.vagas} Vagas</span>
                  </div>
                )}
                {anuncio.area_m2 > 0 && (
                  <div className="blois-caracteristica-item">
                    <div className="blois-caracteristica-item__icon">
                      <Maximize2 size={22} />
                    </div>
                    <span className="blois-caracteristica-item__label">{anuncio.area_m2} m²</span>
                  </div>
                )}
                <div className="blois-caracteristica-item">
                  <div className="blois-caracteristica-item__icon">
                    <Waves size={22} />
                  </div>
                  <span className="blois-caracteristica-item__label">Piscina</span>
                </div>
                <div className="blois-caracteristica-item">
                  <div className="blois-caracteristica-item__icon">
                    <UtensilsCrossed size={22} />
                  </div>
                  <span className="blois-caracteristica-item__label">Varanda G.</span>
                </div>
                <div className="blois-caracteristica-item">
                  <div className="blois-caracteristica-item__icon">
                    <Wine size={22} />
                  </div>
                  <span className="blois-caracteristica-item__label">Adega</span>
                </div>
                <div className="blois-caracteristica-item">
                  <div className="blois-caracteristica-item__icon">
                    <TreePine size={22} />
                  </div>
                  <span className="blois-caracteristica-item__label">Área Verde</span>
                </div>
              </div>
            </div>

            {/* ============================================================
                DESCRIÇÃO DO IMÓVEL (Desktop e Mobile)
                ============================================================ */}
            <div className="blois-desc-box" style={{ marginBottom: '1.5rem' }}>
              <h3>Descrição do Imóvel</h3>
              <p>
                {anuncio.descricao_curta ||
                  'Excelente imóvel com acabamento de alto padrão, localização privilegiada e documentação 100% regular.'}
              </p>
            </div>

            {/* ============================================================
                MOCKUP MOBILE: GOOGLE MAPAS LIGHT CARD
                ============================================================ */}
            <div className="blois-mobile-only" style={{ marginBottom: '1.5rem' }}>
              <h3 className="blois-section-title-sm">Google Mapas</h3>
              <div className="blois-mobile-map-box">
                <div className="blois-mobile-map-box__pin">
                  <MapPin size={22} color="#FFFFFF" />
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                  {localFormatado || 'Santa Cruz das Palmeiras - SP'}
                </span>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blois-btn-mobile-map"
                >
                  Ver Localização
                </a>
              </div>
            </div>

            {/* ============================================================
                MOCKUP MOBILE: CARD HORIZONTAL DO CORRETOR
                ============================================================ */}
            <div className="blois-mobile-only" style={{ marginBottom: '1.5rem' }}>
              <h3 className="blois-section-title-sm">Broker: Falar com o Corretor</h3>
              <div className="blois-mobile-broker-card">
                <div className="blois-mobile-broker-card__left">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                    alt="Renata Silva"
                    className="blois-mobile-broker-photo"
                  />
                  <div className="blois-mobile-broker-info">
                    <span className="blois-mobile-broker-name">Renata Silva</span>
                    <span className="blois-mobile-broker-creci">CRECI SP 123.456</span>
                    <span className="blois-mobile-broker-spec">Especialista na Região</span>
                  </div>
                </div>

                <div className="blois-mobile-broker-actions">
                  <a
                    href={linkWhats}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blois-mobile-circle-btn blois-mobile-circle-btn--whatsapp"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle size={18} />
                  </a>
                  <a
                    href="tel:+5519999999999"
                    className="blois-mobile-circle-btn"
                    aria-label="Ligar"
                  >
                    <Phone size={16} />
                  </a>
                </div>
              </div>

              {/* Botão Preto de Ação Principal no Mobile (Mockup Aprovado) */}
              <a
                href={linkWhats}
                target="_blank"
                rel="noopener noreferrer"
                className="blois-btn-whatsapp-hero"
                style={{
                  marginTop: '0.75rem',
                  width: '100%',
                  borderRadius: '12px',
                  padding: '0.9rem 1.25rem',
                }}
              >
                <Phone size={18} />
                <span>Falar com o corretor</span>
              </a>
            </div>

            {/* ============================================================
                DESKTOP ONLY: BOX ESTILIZADO DE LOCALIZAÇÃO / GOOGLE MAPS
                ============================================================ */}
            <div className="blois-desktop-only blois-map-box" style={{ width: '100%', marginBottom: '2.5rem' }}>
              <div className="blois-map-box__content">
                <div className="blois-map-box__pin">
                  <MapPin size={22} color="#1A2027" />
                </div>
                <h4>Localização</h4>
                <p style={{ color: '#A6B4C4', fontSize: '0.85rem', margin: 0 }}>
                  {localFormatado || 'Santa Cruz das Palmeiras - SP'}
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blois-btn-map"
                >
                  Ver no Google Maps ↗
                </a>
              </div>
            </div>
          </div>

          {/* ============================================================
              DESKTOP ONLY: SIDEBAR COMPLETA DA CORRETORA + RELACIONADOS
              ============================================================ */}
          <aside className="blois-desktop-only">
            <div className="blois-broker-card">
              {/* Foto da Corretora com Badge */}
              <div className="blois-broker-card__photo-wrap">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                  alt="Sua Corretora"
                />
                <span className="blois-broker-card__badge">Sua Corretora</span>
              </div>

              <span className="blois-broker-card__label">Broker / Atendimento</span>
              <h3 className="blois-broker-card__name">Renata Silva</h3>
              <p className="blois-broker-card__creci">CRECI SP 123456 • Especialista na Região</p>

              {/* Informações de Contato Direto */}
              <div className="blois-broker-card__contacts">
                <a href="tel:+5519999999999" className="blois-broker-contact-item">
                  <div className="blois-broker-contact-icon">
                    <Phone size={14} />
                  </div>
                  <span>(19) 99999-9999</span>
                </a>
                <a href="mailto:contato@imoveisimobiliaria.com.br" className="blois-broker-contact-item">
                  <div className="blois-broker-contact-icon">
                    <Mail size={14} />
                  </div>
                  <span style={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>contato@imoveisimobiliaria.com.br</span>
                </a>
              </div>

              <p className="blois-broker-card__about">
                Assessoria imobiliária completa e personalizada para agendamento de visitas, documentação e fechamento seguro do seu imóvel.
              </p>

              {/* Botão de WhatsApp Principal */}
              <a
                href={linkWhats}
                target="_blank"
                rel="noopener noreferrer"
                className="blois-btn-whatsapp-hero"
              >
                <MessageCircle size={18} />
                <span>Falar com o Corretor</span>
              </a>

              {/* Imóveis Relacionados Abaixo do Botão */}
              {relacionados.length > 0 && (
                <div className="blois-sidebar-related">
                  <h4 className="blois-sidebar-related__title">Imóveis Relacionados</h4>
                  <div className="blois-sidebar-related__grid">
                    {relacionados.slice(0, 3).map((rel) => (
                      <Link
                        to={`/imovel/${rel.id}`}
                        key={rel.id}
                        className="blois-sidebar-related__card"
                        title={rel.titulo}
                      >
                        <img
                          src={rel.capaUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'}
                          alt={rel.titulo}
                        />
                        <span className="blois-sidebar-related__card-price">
                          {formatarPreco(rel.valor_centavos)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* Barra Inferior Fixa de Navegação no Mobile (Mockup Aprovado) */}
      <nav className="blois-bottom-tab-bar">
        <Link to="/" className="blois-bottom-tab-item blois-bottom-tab-item--active">
          <Home size={20} />
          <span>Início</span>
        </Link>
        <Link to="/?finalidade=Todas" className="blois-bottom-tab-item">
          <Search size={20} />
          <span>Buscar</span>
        </Link>
        <button
          type="button"
          onClick={() => alert('Seus imóveis favoritados ficam salvos na sua sessão.')}
          className="blois-bottom-tab-item"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <Heart size={20} />
          <span>Favoritos</span>
        </button>
        <Link to="/admin/login" className="blois-bottom-tab-item">
          <User size={20} />
          <span>Perfil</span>
        </Link>
      </nav>


      {/* Footer Blois */}
      <footer className="blois-footer blois-desktop-only">
        <div className="blois-footer__inner">
          <div className="blois-footer__top">
            <div>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#FFFFFF' }}>
                Blois
              </span>
              <p style={{ color: '#8C827A', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                Assessoria imobiliária completa para compra, venda e locação.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <a href="/?finalidade=Venda" style={{ color: '#D1CAC3', fontSize: '0.9rem' }}>Comprar Imóvel</a>
              <a href="/?finalidade=Locação" style={{ color: '#D1CAC3', fontSize: '0.9rem' }}>Alugar Imóvel</a>
              <a href="/anunciar" style={{ color: '#D1CAC3', fontSize: '0.9rem' }}>Anunciar</a>
              <a href="https://wa.me/5519999999999" target="_blank" rel="noopener noreferrer" style={{ color: '#C59B27', fontWeight: 600, fontSize: '0.9rem' }}>Falar no WhatsApp</a>
            </div>
          </div>
          <div className="blois-footer__copy">
            <span>© 2026 Blois Imóveis / AMP Rental. Todos os direitos reservados.</span>
            <span>CRECI SP 123456</span>
          </div>
        </div>
      </footer>
    </div>
  )
}


