import { Link } from 'react-router-dom'
import Header from '../components/Header'

export default function AnuncioEnviado() {
  return (
    <>
      <Header />
      <main className="container container--estreito">
        <div className="confirmacao">
          <h1>Cadastro enviado ✓</h1>
          <p>
            Seu anúncio entrou em análise. Assim que for aprovado, ele aparece na vitrine
            automaticamente — não precisa fazer mais nada.
          </p>
          <Link to="/" className="botao-primario botao-primario--link">
            Voltar para a vitrine
          </Link>
        </div>
      </main>
    </>
  )
}
