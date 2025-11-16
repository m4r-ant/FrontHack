import { useState, useEffect } from 'react'

export interface User {
  id: string
  email: string
  role: 'student' | 'admin' | 'authority'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('alerta_user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = (email: string, password: string, role: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role: role as 'student' | 'admin' | 'authority',
    }
    localStorage.setItem('alerta_user', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    localStorage.removeItem('alerta_user')
    setUser(null)
  }

  return { user, loading, login, logout }
}
