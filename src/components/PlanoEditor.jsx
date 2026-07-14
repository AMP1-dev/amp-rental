import { useState } from 'react'

export default function PlanoEditor({ plano, onSalvar }) {
  const [nome, setNome] = useState(plano.nome)
  const [dias, setDias] = useState(plano.dias_exibicao)
  const [preco, setPreco] = useState((plano.preco_centavos / 100).toFixed(2))
  const [carrossel, setCarrossel] = useState(plano.aparece_carrossel)
  const [ativo, setAtivo] = useState(plano.ativo)
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)

  async function salvar() {
    setSalvando(true)
    setSalvo(false)
    try {
      await onSalvar(plano.id, {
        nome,
        dias_exibicao: Number(dias),
        preco_centavos: Math.round(Number(preco) * 100),
        aparece_carrossel: carrossel,
        ativo,
      })
      setSalvo(true)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="plano-editor">
      <label className="campo">
        Nome
        <input value={nome} onChange={(e) => setNome(e.target.value)} />
      </label>
      <div className="campo-linha">
        <label className="campo">
          Dias no ar
          <input type="number" value={dias} onChange={(e) => setDias(e.target.value)} />
        </label>
        <label className="campo">
          Preço (R$)
          <input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} />
        </label>
      </div>
      <label className="campo-checkbox">
        <input type="checkbox" checked={carrossel} onChange={(e) => setCarrossel(e.target.checked)} />
        Aparece no carrossel principal
      </label>
      <label className="campo-checkbox">
        <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
        Plano ativo (visível no formulário de cadastro)
      </label>
      <button className="botao-primario" onClick={salvar} disabled={salvando}>
        {salvando ? 'Salvando…' : salvo ? 'Salvo ✓' : 'Salvar plano'}
      </button>
    </div>
  )
}
