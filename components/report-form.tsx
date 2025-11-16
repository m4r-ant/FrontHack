'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useWebSocket } from '@/hooks/use-websocket'
import { AlertCircle, MapPin, FileText, AlertTriangle } from 'lucide-react'

interface ReportFormProps {
  wsUrl: string
}

export function ReportForm({ wsUrl }: ReportFormProps) {
  const { sendIncident, connected } = useWebSocket(wsUrl)
  const [type, setType] = useState('infraestructura')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState('medium')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!location || !description) {
      alert('Por favor completa todos los campos')
      return
    }

    sendIncident({
      type,
      location,
      description,
      urgency: urgency as 'low' | 'medium' | 'high',
      status: 'pendiente',
      timestamp: new Date().toISOString(),
    })

    setSubmitted(true)
    setTimeout(() => {
      setType('infraestructura')
      setLocation('')
      setDescription('')
      setUrgency('medium')
      setSubmitted(false)
    }, 2000)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <FileText className="h-5 w-5" />
          Nuevo Reporte de Incidente
        </CardTitle>
        <CardDescription>
          Proporciona detalles sobre el incidente que deseas reportar
        </CardDescription>
      </CardHeader>

      <CardContent>
        {submitted && (
          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg mb-6 flex items-start gap-3">
            <div className="text-green-600 dark:text-green-400 flex-shrink-0">✓</div>
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">Reporte enviado exitosamente</p>
              <p className="text-sm text-green-800 dark:text-green-200">Tu incidente ha sido registrado y está siendo procesado</p>
            </div>
          </div>
        )}

        {!connected && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg mb-6 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-900 dark:text-amber-100">Conexión en tiempo real offline</p>
              <p className="text-sm text-amber-800 dark:text-amber-200">Los reportes se enviarán cuando se restaure la conexión</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Incidente</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="infraestructura">Infraestructura</option>
              <option value="emergencia">Emergencia</option>
              <option value="servicios">Servicios</option>
              <option value="seguridad">Seguridad</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Ubicación
            </label>
            <Input
              placeholder="Ej: Laboratorio A, Edificio 3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Descripción
            </label>
            <textarea
              placeholder="Describe el incidente en detalle..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Nivel de Urgencia
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
            Enviar Reporte
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
