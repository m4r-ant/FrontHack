'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useWebSocket, Incident } from '@/hooks/use-websocket'
import { Clock, MapPin, AlertCircle } from 'lucide-react'

interface IncidentsListProps {
  wsUrl: string
  userRole: string
}

export function IncidentsList({ wsUrl, userRole }: IncidentsListProps) {
  const { incidents } = useWebSocket(wsUrl)
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([])
  const [statusFilter, setStatusFilter] = useState('todos')

  useEffect(() => {
    let filtered = incidents

    if (statusFilter !== 'todos') {
      filtered = filtered.filter((i) => i.status === statusFilter)
    }

    setFilteredIncidents(filtered)
  }, [incidents, statusFilter])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'medium':
        return 'bg-accent/10 text-accent border-accent/20'
      case 'low':
        return 'bg-secondary/10 text-secondary border-secondary/20'
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resuelto':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
      case 'en atención':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
      default:
        return 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {['todos', 'pendiente', 'en atención', 'resuelto'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredIncidents.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">No hay incidentes para mostrar</p>
            </CardContent>
          </Card>
        ) : (
          filteredIncidents.map((incident) => (
            <Card
              key={incident.incidentId}
              className="border-border hover:border-primary/50 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-lg">{incident.type}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4" />
                          {incident.location}
                        </p>
                      </div>
                    </div>

                    <p className="text-foreground/80 mb-4">{incident.description}</p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {new Date(incident.timestamp).toLocaleString('es-PE')}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(incident.urgency)}`}>
                      {incident.urgency === 'high'
                        ? 'Urgente'
                        : incident.urgency === 'medium'
                          ? 'Normal'
                          : 'Baja'}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
