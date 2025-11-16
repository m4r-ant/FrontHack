'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useWebSocket, Incident } from '@/hooks/use-websocket'
import { Button } from '@/components/ui/button'
import { BarChart, AlertCircle, TrendingUp, Clock } from 'lucide-react'

interface AdminPanelProps {
  wsUrl: string
}

export function AdminPanel({ wsUrl }: AdminPanelProps) {
  const { incidents } = useWebSocket(wsUrl)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  })

  useEffect(() => {
    setStats({
      total: incidents.length,
      pending: incidents.filter((i) => i.status === 'pendiente').length,
      inProgress: incidents.filter((i) => i.status === 'en atención').length,
      resolved: incidents.filter((i) => i.status === 'resuelto').length,
    })
  }, [incidents])

  const urgentIncidents = incidents.filter((i) => i.urgency === 'high' && i.status !== 'resuelto')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {[
          { label: 'Total Reportes', value: stats.total, icon: BarChart },
          { label: 'Pendientes', value: stats.pending, icon: Clock },
          { label: 'En Atención', value: stats.inProgress, icon: TrendingUp },
          { label: 'Resueltos', value: stats.resolved, icon: AlertCircle },
        ].map((stat, i) => (
          <Card key={i} className="border-border">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground truncate">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                </div>
                <div className="p-2 md:p-3 bg-primary/10 rounded-lg flex-shrink-0">
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Urgent Incidents */}
      {urgentIncidents.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive text-lg md:text-xl">
              <AlertCircle className="h-5 w-5" />
              Incidentes Urgentes
            </CardTitle>
            <CardDescription>
              Hay {urgentIncidents.length} incidente(s) que requieren atención inmediata
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {urgentIncidents.slice(0, 5).map((incident) => (
                <div
                  key={incident.incidentId}
                  className="p-3 bg-background border border-destructive/20 rounded-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{incident.type}</p>
                      <p className="text-sm text-muted-foreground mt-1 truncate">{incident.location}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full md:w-auto">
                      Atender
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Incidents */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Todos los Incidentes</CardTitle>
          <CardDescription>
            Gestiona y monitorea todos los reportes del campus
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {incidents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No hay incidentes registrados</p>
            ) : (
              incidents.map((incident) => (
                <div
                  key={incident.incidentId}
                  className="p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">{incident.description.slice(0, 50)}</p>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{incident.location}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          incident.urgency === 'high'
                            ? 'bg-destructive/10 text-destructive'
                            : incident.urgency === 'medium'
                              ? 'bg-accent/10 text-accent'
                              : 'bg-secondary/10 text-secondary'
                        }`}
                      >
                        {incident.urgency.toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          incident.status === 'resuelto'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                            : incident.status === 'en atención'
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
                              : 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100'
                        }`}
                      >
                        {incident.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
