import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AnuncioDetalhe from './pages/AnuncioDetalhe'
import Anunciar from './pages/Anunciar'
import AnuncioEnviado from './pages/AnuncioEnviado'
import AdminLogin from './pages/AdminLogin'
import AdminPainel from './pages/AdminPainel'
import RotaProtegida from './components/RotaProtegida'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/imovel/:id" element={<AnuncioDetalhe />} />
      <Route path="/anunciar" element={<Anunciar />} />
      <Route path="/anunciar/enviado" element={<AnuncioEnviado />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RotaProtegida>
            <AdminPainel />
          </RotaProtegida>
        }
      />
    </Routes>
  )
}
