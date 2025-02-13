import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { useAuthStore } from '../store/auth.store'

interface Props {
  children: ReactNode
}

export default function PrivateRoute({ children }: Props) {
  const token = useAuthStore(state => state.token)
  
  if (!token) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}