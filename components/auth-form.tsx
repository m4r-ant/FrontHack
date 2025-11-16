'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { AlertCircle, Lock, Mail, User } from 'lucide-react'
import Image from 'next/image'

export function AuthForm() {
  const { login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    try {
      login(email, password, role)
      window.location.reload()
    } catch (err) {
      setError('Error al iniciar sesión')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-6">
            <Image
              src="utec-logo-full.jpg"
              alt="UTEC Logo"
              width={240}
              height={80}
              className="h-auto object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-2 mb-4 justify-center">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold">AlertaUTEC</h1>
          </div>
          <CardTitle className="text-center">Sistema de Reportes de Incidentes</CardTitle>
          <CardDescription className="text-center">
            {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea una nueva cuenta'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Correo Institucional
              </label>
              <Input
                type="email"
                placeholder="tu@utec.edu.pe"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Contraseña
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Rol
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
              >
                <option value="student">Estudiante</option>
                <option value="admin">Personal Administrativo</option>
                <option value="authority">Autoridad</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {isLogin ? 'Cuenta de demostración disponible' : 'Ya tienes cuenta?'}
            {' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? 'Usar demo' : 'Inicia sesión'}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
