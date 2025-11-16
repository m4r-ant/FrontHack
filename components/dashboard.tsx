'use client'

import { useState, useEffect } from 'react'
import { User } from '@/hooks/use-auth'
import { ReportForm } from './report-form'
import { IncidentsList } from './incidents-list'
import { AdminPanel } from './admin-panel'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogOut, Menu, X } from 'lucide-react'
import Image from 'next/image'

interface DashboardProps {
  user: User
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [wsUrl, setWsUrl] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Set initial sidebar state based on screen size
    setSidebarOpen(window.innerWidth >= 768)
    
    // Listen for window resize
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setWsUrl(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'wss://echo.websocket.org')
  }, [])

  const isAdmin = user.role === 'admin' || user.role === 'authority'

  return (
    <div className="flex h-screen bg-background">
      <div
        className={`fixed md:relative z-40 h-full transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 md:w-20'
        } bg-sidebar border-r border-sidebar-border`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8 flex-col">
            {sidebarOpen && (
              <Image
                src="/utec-logo-full.jpg"
                alt="UTEC Logo"
                width={160}
                height={60}
                className="h-auto object-contain"
                priority
              />
            )}
            {!sidebarOpen && (
              <div className="bg-sidebar-primary text-sidebar-primary-foreground rounded-lg p-2">
                <AlertCircleIcon className="h-5 w-5" />
              </div>
            )}
          </div>

          <nav className="flex-1" />

          <div className="border-t border-sidebar-border pt-4 space-y-3">
            {sidebarOpen && (
              <div className="text-sm">
                <p className="text-sidebar-foreground/60 text-xs">Conectado como</p>
                <p className="font-medium text-sidebar-foreground truncate">{user.email}</p>
                <p className="text-sidebar-foreground/60 text-xs">
                  {user.role === 'student'
                    ? 'Estudiante'
                    : user.role === 'admin'
                      ? 'Admin'
                      : 'Autoridad'}
                </p>
              </div>
            )}
            <Button
              onClick={onLogout}
              className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground font-medium"
            >
              <LogOut className="h-4 w-4" />
              {sidebarOpen && 'Salir'}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden bg-sidebar border-b border-sidebar-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/utec-logo-full.jpg"
              alt="UTEC Logo"
              width={120}
              height={40}
              className="h-auto object-contain"
            />
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-sidebar-accent rounded-lg text-sidebar-foreground"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                {isAdmin ? 'Panel de Control' : 'Mis Reportes'}
              </h2>
              <p className="text-muted-foreground mt-2">
                {isAdmin
                  ? 'Gestiona todos los incidentes del campus'
                  : 'Reporta y monitorea incidentes en tiempo real'}
              </p>
            </div>

            {isAdmin ? (
              <AdminPanel wsUrl={wsUrl} />
            ) : (
              <Tabs defaultValue="reportar" className="space-y-6">
                <TabsList className="bg-muted w-full grid grid-cols-2">
                  <TabsTrigger value="reportar">Reportar Incidente</TabsTrigger>
                  <TabsTrigger value="mis-reportes">Mis Reportes</TabsTrigger>
                </TabsList>

                <TabsContent value="reportar" className="space-y-6">
                  <ReportForm wsUrl={wsUrl} />
                </TabsContent>

                <TabsContent value="mis-reportes">
                  <IncidentsList wsUrl={wsUrl} userRole={user.role} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AlertCircleIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  )
}
