import React, { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Carousel from '../components/Carousel'

import PropertyCard from '../components/PropertyCard'
import { useAnunciosPublicos } from '../hooks/useAnunciosPublicos'
import { CIDADES_DISPONIVEIS, CATEGORIAS_DISPONIVEIS } from '../data/imoveisData'
import { Search, MapPin, Home as HomeIcon, Bed, DollarSign, SlidersHorizontal, Sparkles } from 'lucide-react'

export function Home() {
  const { carregando, erro, destaques, geral, todos } = useAnunciosPublicos()
  const location = useLocation()

  const [busca, setBusca] = useState('')
  const [cidadeSelecionada, setCidadeSelecionada] = useState('Todas')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos')
  const [dormitoriosSelecionados, setDormitoriosSelecionados] = useState('Todos')
  const [faixaPreco, setFaixaPreco] = useState('Todos')
  const [finalidadeSelecionada, setFinalidadeSelecionada] = useState('Todas')

  // Sincronizar parâmetros de URL (ex: ?finalidade=Venda)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const fin = params.get('finalidade')
    if (fin) {
      setFinalidadeSelecionada(fin)
    } else {
      setFinalidadeSelecionada('Todas')
    }
  }, [location.search])

  // Filtragem dinâmica e instantânea
  const imoveisFiltrados = useMemo(() => {
    const lista = todos && todos.length > 0 ? todos : [...destaques, ...geral]
    return lista.filter((imovel) => {
      // Filtro por texto da busca (bairro, cidade, título)
      const matchBusca =
        !busca ||
        imovel.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        (imovel.bairro && imovel.bairro.toLowerCase().includes(busca.toLowerCase())) ||
        (imovel.cidade && imovel.cidade.toLowerCase().includes(busca.toLowerCase())) ||
        (imovel.descricao_curta && imovel.descricao_curta.toLowerCase().includes(busca.toLowerCase()))

      // Filtro por cidade
      const matchCidade = cidadeSelecionada === 'Todas' || imovel.cidade === cidadeSelecionada

      // Filtro por categoria
      const matchCategoria = categoriaSelecionada === 'Todos' || imovel.tipo === categoriaSelecionada

      // Filtro por finalidade (Locação / Venda)
      const matchFinalidade = finalidadeSelecionada === 'Todas' || imovel.finalidade === finalidadeSelecionada

      // Filtro por dormitórios
      let matchDorms = true
      if (dormitoriosSelecionados !== 'Todos') {
        const minDorms = parseInt(dormitoriosSelecionados, 10)
        matchDorms = (imovel.quartos || 0) >= minDorms
      }

      // Filtro por faixa de preço
      let matchPreco = true
      const preco = (imovel.valor_centavos || 0) / 100
      if (faixaPreco === 'ate300k') matchPreco = preco <= 300000
      else if (faixaPreco === '300k-600k') matchPreco = preco > 300000 && preco <= 600000
      else if (faixaPreco === '600k-1.5m') matchPreco = preco > 600000 && preco <= 1500000
      else if (faixaPreco === 'acima1.5m') matchPreco = preco > 1500000

      return matchBusca && matchCidade && matchCategoria && matchFinalidade && matchDorms && matchPreco
    })
  }, [todos, destaques, geral, busca, cidadeSelecionada, categoriaSelecionada, finalidadeSelecionada, dormitoriosSelecionados, faixaPreco])

  const temFiltroAtivo =
    busca ||
    cidadeSelecionada !== 'Todas' ||
    categoriaSelecionada !== 'Todos' ||
    finalidadeSelecionada !== 'Todas' ||
    dormitoriosSelecionados !== 'Todos' ||
    faixaPreco !== 'Todos'

  const limparFiltros = () => {
    setBusca('')
    setCidadeSelecionada('Todas')
    setCategoriaSelecionada('Todos')
    setFinalidadeSelecionada('Todas')
    setDormitoriosSelecionados('Todos')
    setFaixaPreco('Todos')
  }

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {/* Hero Header Espaçador com Título Editorial */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #EAE6DF', padding: '3.5rem 1.5rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C59B27', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <Sparkles size={15} /> Imóveis Selecionados & Assessoria Exclusiva
          </span>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.8rem', fontWeight: 700, color: '#1A1817', lineHeight: '1.15', margin: '0 0 1rem' }}>
            Encontre o imóvel perfeito para morar ou investir
          </h1>
          <p style={{ color: '#6B6259', fontSize: '1.05rem', lineHeight: '1.6', margin: '0 auto', maxWidth: '640px' }}>
            Casas, apartamentos, áreas comerciais e terrenos selecionados nas melhores regiões de Santa Cruz das Palmeiras e região.
          </p>
        </div>
      </section>

      {/* Barra de Busca Horizontal Blois (Mockup Aprovado) */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', width: '100%' }}>
        <div className="blois-hero-search">
          <div className="blois-hero-search__grid">
            {/* Cidade / Região */}
            <div className="blois-search-field">
              <MapPin size={18} color="#C59B27" />
              <input
                type="text"
                placeholder="Cidade, bairro ou rua..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              {busca && (
                <button
                  type="button"
                  onClick={() => setBusca('')}
                  style={{ background: 'none', border: 'none', color: '#8C827A', cursor: 'pointer' }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Tipo de Imóvel */}
            <div className="blois-search-field">
              <HomeIcon size={18} color="#C59B27" />
              <select
                value={categoriaSelecionada}
                onChange={(e) => setCategoriaSelecionada(e.target.value)}
              >
                <option value="Todos">Tipo de Imóvel</option>
                {CATEGORIAS_DISPONIVEIS.filter((c) => c !== 'Todos').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Dormitórios */}
            <div className="blois-search-field">
              <Bed size={18} color="#C59B27" />
              <select
                value={dormitoriosSelecionados}
                onChange={(e) => setDormitoriosSelecionados(e.target.value)}
              >
                <option value="Todos">Dormitórios</option>
                <option value="1">1+ Dormitório</option>
                <option value="2">2+ Dormitórios</option>
                <option value="3">3+ Dormitórios</option>
                <option value="4">4+ Dormitórios</option>
              </select>
            </div>

            {/* Faixa de Preço */}
            <div className="blois-search-field">
              <DollarSign size={18} color="#C59B27" />
              <select
                value={faixaPreco}
                onChange={(e) => setFaixaPreco(e.target.value)}
              >
                <option value="Todos">Faixa de Preço</option>
                <option value="ate300k">Até R$ 300 mil</option>
                <option value="300k-600k">R$ 300k - R$ 600k</option>
                <option value="600k-1.5m">R$ 600k - R$ 1.5M</option>
                <option value="acima1.5m">Acima de R$ 1.5M</option>
              </select>
            </div>

            {/* Botão Buscar */}
            <button type="button" className="blois-btn-buscar" onClick={() => {}}>
              <Search size={18} />
              <span>Buscar</span>
            </button>
          </div>
        </div>

        {/* Seção 1: IMÓVEIS EM DESTAQUE (Carrossel / Banner Hero) */}
        {!temFiltroAtivo && destaques.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.8rem', fontWeight: 700, color: '#1A1817' }}>
                  Imóveis em Destaque
                </h2>
                <p style={{ color: '#8C827A', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                  Oportunidades especiais selecionadas pela nossa equipe
                </p>
              </div>
            </div>

            <Carousel anuncios={destaques} />
          </section>
        )}

        {/* Seção 2: CONFIRA AS NOVIDADES (Grid Geral de Imóveis) */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.75rem', fontWeight: 700, color: '#1A1817' }}>
                {temFiltroAtivo ? `Resultados da Busca (${imoveisFiltrados.length})` : 'Confira as Novidades'}
              </h2>
              <p style={{ color: '#8C827A', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                {temFiltroAtivo
                  ? 'Exibindo os imóveis correspondentes aos seus filtros'
                  : 'Catálogo atualizado de imóveis disponíveis para negociação'}
              </p>
            </div>

            {/* Chips de filtro rápido */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Todas', 'Venda', 'Locação'].map((fin) => (
                <button
                  key={fin}
                  onClick={() => setFinalidadeSelecionada(fin)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: finalidadeSelecionada === fin ? '1px solid #1A1817' : '1px solid #EAE6DF',
                    background: finalidadeSelecionada === fin ? '#1A1817' : '#FFFFFF',
                    color: finalidadeSelecionada === fin ? '#FFFFFF' : '#4A443F',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {fin === 'Todas' ? 'Todos' : fin === 'Venda' ? 'Comprar' : 'Alugar'}
                </button>
              ))}

              {temFiltroAtivo && (
                <button
                  onClick={limparFiltros}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#C59B27',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginLeft: '0.5rem',
                  }}
                >
                  Limpar Filtros ✕
                </button>
              )}
            </div>
          </div>

          {/* Grid de Imóveis */}
          {carregando && <p className="estado">Carregando imóveis…</p>}

          {!carregando && imoveisFiltrados.length === 0 && (
            <div className="estado" style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAE6DF', padding: '4rem 1.5rem' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1A1817', fontFamily: 'Fraunces, serif' }}>
                Nenhum imóvel encontrado com esses critérios.
              </p>
              <p style={{ fontSize: '0.95rem', color: '#8C827A', marginTop: '0.5rem' }}>
                Tente ajustar os filtros de cidade, dormitórios ou faixa de preço.
              </p>
              <button
                onClick={limparFiltros}
                className="blois-btn-gold"
                style={{ marginTop: '1.5rem' }}
              >
                Ver Todos os Imóveis
              </button>
            </div>
          )}

          {!carregando && imoveisFiltrados.length > 0 && (
            <div className="blois-grid">
              {imoveisFiltrados.map((a) => (
                <PropertyCard anuncio={a} key={a.id} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer Blois com Conformidade CRECI */}
      <Footer />
    </div>
  )
}

export default Home


