import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RotaProtegida({ children }) {
  const { carregando, autenticado } = useAuth()

  if (carregando) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--ink-soft)' }}>Carregando…</div>
    )
  }

  if (!autenticado) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
