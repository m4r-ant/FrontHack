'use client'

import { useState } from 'react'
import { AuthForm } from '@/components/auth-form'
import { Dashboard } from '@/components/dashboard'
import { useAuth } from '@/hooks/use-auth'

export default function Home() {
  const { user, logout } = useAuth()

  if (!user) {
    return <AuthForm />
  }

  return <Dashboard user={user} onLogout={logout} />
}
