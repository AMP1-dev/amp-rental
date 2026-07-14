import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { buscarPlanosAtivos, buscarTermoVigente, enviarCadastro } from '../lib/anuncioApi'
import { formatarPreco } from '../lib/format'

const MAX_FOTOS = 8
const TAMANHO_MAX_MB = 5

const ESTADO_INICIAL = {
  titulo: '',
  tipo: 'casa',
  finalidade: 'venda',
  cidade: '',
  bairro: '',
  valor_centavos: '',
  area_m2: '',
  quartos: '',
  descricao_curta: '',
  nome_contato: '',
  whatsapp_contato: '',
}

export default function Anunciar() {
  const navigate = useNavigate()

  const [etapa, setEtapa] = useState(1)
  const [dados, setDados] = useState(ESTADO_INICIAL)
  const [planos, setPlanos] = useState([])
  const [planoId, setPlanoId] = useState(null)
  const [termo, setTermo] = useState(null)
  const [aceiteTermos, setAceiteTermos] = useState(false)
  const [fotos, setFotos] = useState([])
  const [comprovante, setComprovante] = useState(null)
  const [carregandoBase, setCarregandoBase] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function carregar() {
      try {
        const [p, t] = await Promise.all([buscarPlanosAtivos(), buscarTermoVigente()])
        setPlanos(p)
        setPlanoId(p[0]?.id ?? null)
        setTermo(t)
      } catch (e) {
        setErro('Não deu pra carregar os dados do formulário. Recarregue a página.')
      } finally {
        setCarregandoBase(false)
      }
    }
    carregar()
  }, [])

  function atualizarCampo(campo, valor) {
    setDados((d) => ({ ...d, [campo]: valor }))
  }

  function escolherFotos(e) {
    const arquivos = Array.from(e.target.files || [])
    const validos = arquivos.filter((f) => f.size <= TAMANHO_MAX_MB * 1024 * 1024)
    if (validos.length < arquivos.length) {
      setErro(`Algumas fotos passaram de ${TAMANHO_MAX_MB}MB e foram ignoradas.`)
    }
    setFotos(validos.slice(0, MAX_FOTOS))
  }

  function escolherComprovante(e) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    if (arquivo.size > TAMANHO_MAX_MB * 1024 * 1024) {
      setErro(`O comprovante precisa ter até ${TAMANHO_MAX_MB}MB.`)
      return
    }
    setComprovante(arquivo)
  }

  function validarEtapa1() {
    return dados.titulo && dados.cidade && dados.nome_contato && dados.whatsapp_contato
  }

  function irPara(proxima) {
    setErro(null)
    setEtapa(proxima)
  }

  async function enviar() {
    if (!fotos.length) return setErro('Escolha pelo menos 1 foto do imóvel.')
    if (!comprovante) return setErro('Envie o comprovante de pagamento.')
    if (!aceiteTermos) return setErro('Você precisa aceitar as condições pra continuar.')
    if (!planoId) return setErro('Escolha um plano.')

    setEnviando(true)
    setErro(null)
    try {
      const payload = {
        ...dados,
        valor_centavos: dados.valor_centavos ? Math.round(Number(dados.valor_centavos) * 100) : null,
        area_m2: dados.area_m2 ? Number(dados.area_m2) : null,
        quartos: dados.quartos ? Number(dados.quartos) : null,
      }
      const anuncioId = await enviarCadastro({
        dadosImovel: payload,
        planoId,
        termo,
        fotos,
        comprovante,
      })
      navigate('/anunciar/enviado', { state: { anuncioId } })
    } catch (e) {
      setErro('Não deu pra enviar o cadastro agora. Tenta de novo em instantes.')
      console.error(e)
    } finally {
      setEnviando(false)
    }
  }

  if (carregandoBase) {
    return (
      <>
        <Header />
        <main className="container container--estreito">
          <p className="estado">Carregando…</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="container container--estreito">
        <h1 className="forms__titulo">Anuncie seu imóvel</h1>
        <p className="forms__subtitulo">
          Poucas informações, seu anúncio entra em análise e vai pro ar assim que aprovado.
        </p>

        <div className="etapas">
          <span className={etapa >= 1 ? 'etapas__item etapas__item--ativa' : 'etapas__item'}>1. Imóvel</span>
          <span className={etapa >= 2 ? 'etapas__item etapas__item--ativa' : 'etapas__item'}>2. Condições</span>
          <span className={etapa >= 3 ? 'etapas__item etapas__item--ativa' : 'etapas__item'}>3. Fotos e plano</span>
        </div>

        {erro && <p className="estado estado--erro">{erro}</p>}

        {etapa === 1 && (
          <section className="forms__secao">
            <label className="campo">
              Título do anúncio
              <input
                type="text"
                placeholder="Ex: Casa 3 quartos com quintal"
                value={dados.titulo}
                onChange={(e) => atualizarCampo('titulo', e.target.value)}
              />
            </label>

            <div className="campo-linha">
              <label className="campo">
                Tipo
                <select value={dados.tipo} onChange={(e) => atualizarCampo('tipo', e.target.value)}>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                </select>
              </label>
              <label className="campo">
                Finalidade
                <select value={dados.finalidade} onChange={(e) => atualizarCampo('finalidade', e.target.value)}>
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                </select>
              </label>
            </div>

            <div className="campo-linha">
              <label className="campo">
                Cidade
                <input type="text" value={dados.cidade} onChange={(e) => atualizarCampo('cidade', e.target.value)} />
              </label>
              <label className="campo">
                Bairro
                <input type="text" value={dados.bairro} onChange={(e) => atualizarCampo('bairro', e.target.value)} />
              </label>
            </div>

            <div className="campo-linha">
              <label className="campo">
                Valor (R$) — opcional
                <input
                  type="number"
                  placeholder="Deixe em branco p/ 'sob consulta'"
                  value={dados.valor_centavos}
                  onChange={(e) => atualizarCampo('valor_centavos', e.target.value)}
                />
              </label>
              <label className="campo">
                Área (m²)
                <input type="number" value={dados.area_m2} onChange={(e) => atualizarCampo('area_m2', e.target.value)} />
              </label>
              <label className="campo">
                Quartos
                <input type="number" value={dados.quartos} onChange={(e) => atualizarCampo('quartos', e.target.value)} />
              </label>
            </div>

            <label className="campo">
              Descrição curta — opcional
              <textarea
                maxLength={160}
                rows={2}
                placeholder="Uma frase. O visual das fotos fala mais que o texto."
                value={dados.descricao_curta}
                onChange={(e) => atualizarCampo('descricao_curta', e.target.value)}
              />
            </label>

            <div className="campo-linha">
              <label className="campo">
                Seu nome
                <input
                  type="text"
                  value={dados.nome_contato}
                  onChange={(e) => atualizarCampo('nome_contato', e.target.value)}
                />
              </label>
              <label className="campo">
                Seu WhatsApp
                <input
                  type="text"
                  placeholder="DDD + número"
                  value={dados.whatsapp_contato}
                  onChange={(e) => atualizarCampo('whatsapp_contato', e.target.value)}
                />
              </label>
            </div>
            <p className="forms__nota">
              Seu telefone fica visível só pro corretor, na análise do anúncio — nunca aparece publicamente no site.
            </p>

            <button className="botao-primario" disabled={!validarEtapa1()} onClick={() => irPara(2)}>
              Continuar
            </button>
          </section>
        )}

        {etapa === 2 && (
          <section className="forms__secao">
            <div className="termos-caixa">{termo?.conteudo}</div>
            <label className="campo-checkbox">
              <input type="checkbox" checked={aceiteTermos} onChange={(e) => setAceiteTermos(e.target.checked)} />
              Li e aceito as condições acima, incluindo os valores conforme o plano escolhido.
            </label>
            <div className="forms__acoes">
              <button className="botao-secundario" onClick={() => irPara(1)}>
                Voltar
              </button>
              <button className="botao-primario" disabled={!aceiteTermos} onClick={() => irPara(3)}>
                Continuar
              </button>
            </div>
          </section>
        )}

        {etapa === 3 && (
          <section className="forms__secao">
            <h3 className="forms__subtitulo-secao">Escolha o plano</h3>
            <div className="planos-grid">
              {planos.map((p) => (
                <label
                  key={p.id}
                  className={`plano-card${planoId === p.id ? ' plano-card--selecionado' : ''}`}
                >
                  <input
                    type="radio"
                    name="plano"
                    checked={planoId === p.id}
                    onChange={() => setPlanoId(p.id)}
                  />
                  <span className="plano-card__nome">{p.nome}</span>
                  <span className="plano-card__preco">{formatarPreco(p.preco_centavos)}</span>
                  <span className="plano-card__dias">{p.dias_exibicao} dias no ar</span>
                  {p.aparece_carrossel && <span className="plano-card__badge">Carrossel principal</span>}
                </label>
              ))}
            </div>

            <h3 className="forms__subtitulo-secao">Fotos do imóvel</h3>
            <label className="campo-arquivo">
              <input type="file" accept="image/*" multiple onChange={escolherFotos} />
              {fotos.length ? `${fotos.length} foto(s) selecionada(s)` : `Escolher fotos (até ${MAX_FOTOS})`}
            </label>

            <h3 className="forms__subtitulo-secao">Comprovante de pagamento</h3>
            <label className="campo-arquivo">
              <input type="file" accept="image/*,application/pdf" onChange={escolherComprovante} />
              {comprovante ? comprovante.name : 'Escolher arquivo (imagem ou PDF)'}
            </label>

            <div className="forms__acoes">
              <button className="botao-secundario" onClick={() => irPara(2)} disabled={enviando}>
                Voltar
              </button>
              <button className="botao-primario" onClick={enviar} disabled={enviando}>
                {enviando ? 'Enviando…' : 'Enviar para análise'}
              </button>
            </div>
          </section>
        )}
      </main>
    </>
  )
}
