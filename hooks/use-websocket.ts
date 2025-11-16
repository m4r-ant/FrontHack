import { useEffect, useRef, useState, useCallback } from 'react'

export interface Incident {
  incidentId: string
  type: string
  location: string
  description: string
  urgency: 'low' | 'medium' | 'high'
  status: 'pendiente' | 'en atención' | 'resuelto'
  timestamp: string
  createdBy?: string
}

export function useWebSocket(wsUrl: string) {
  const ws = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [incidents, setIncidents] = useState<Incident[]>([])

  useEffect(() => {
    if (!wsUrl || !wsUrl.startsWith('wss://')) {
      console.log('[v0] WebSocket URL not configured, running in demo mode')
      return
    }

    try {
      ws.current = new WebSocket(wsUrl)

      ws.current.onopen = () => {
        console.log('[WebSocket] Connected')
        setConnected(true)
      }

      ws.current.onmessage = (event) => {
        try {
          if (!event.data || typeof event.data !== 'string') {
            console.log('[WebSocket] Received non-string message, ignoring')
            return
          }

          // Try to parse JSON, skip if not valid JSON
          let data
          try {
            data = JSON.parse(event.data)
          } catch {
            // Message is not JSON (could be ping/pong or other protocol), ignore silently
            console.log('[v0] Received non-JSON message:', event.data.substring(0, 50))
            return
          }

          // Only process incident updates
          if (data.type === 'incident_update' && data.incident) {
            setIncidents((prev) => {
              const exists = prev.find((i) => i.incidentId === data.incident.incidentId)
              if (exists) {
                return prev.map((i) =>
                  i.incidentId === data.incident.incidentId ? data.incident : i
                )
              }
              return [data.incident, ...prev]
            })
          }
        } catch (err) {
          console.error('[WebSocket] Unexpected error processing message:', err)
        }
      }

      ws.current.onerror = (error) => {
        console.error('[WebSocket] Error:', error)
      }

      ws.current.onclose = () => {
        console.log('[WebSocket] Disconnected')
        setConnected(false)
      }
    } catch (err) {
      console.error('[WebSocket] Failed to create connection:', err)
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [wsUrl])

  const sendIncident = useCallback((incident: Omit<Incident, 'incidentId'>) => {
    if (ws.current && connected) {
      ws.current.send(
        JSON.stringify({
          action: 'notify',
          incident: {
            ...incident,
            incidentId: Math.random().toString(36).substr(2, 9),
          },
        })
      )
    }
  }, [connected])

  return { connected, incidents, sendIncident }
}
