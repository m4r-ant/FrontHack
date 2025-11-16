# AlertaUTEC - Sistema de Reportes de Incidentes

**AlertaUTEC** es una plataforma web para reportar y gestionar incidentes en el campus de la Universidad de Ingeniería y Tecnología (UTEC). Permite a estudiantes, personal administrativo y autoridades comunicarse en tiempo real sobre emergencias y situaciones de seguridad.

## Características

### Para Estudiantes
- Reportar incidentes con descripción, ubicación y fotos
- Monitorear el estado de sus reportes en tiempo real
- Recibir actualizaciones automáticas vía WebSocket
- Historial completo de reportes enviados

### Para Administradores
- Dashboard centralizado de todos los incidentes
- Filtrado por estado (pendiente, en-proceso, resuelto, urgente)
- Estadísticas en tiempo real
- Capacidad de actualizar estados de incidentes

### Para Autoridades
- Acceso a panel de control administrativo
- Visualización de incidentes críticos
- Gestión de prioridades y asignación de tareas

## Arquitectura

\`\`\`
Frontend (Next.js 16)
├── Components (React)
│   ├── AuthForm - Login/Registro
│   ├── Dashboard - Interfaz principal
│   ├── ReportForm - Formulario de reportes
│   ├── IncidentsList - Lista de incidentes
│   └── AdminPanel - Panel administrativo
├── Hooks
│   ├── use-auth - Gestión de autenticación
│   └── use-websocket - Conexión WebSocket real-time
└── Styles (Tailwind CSS v4)

Backend (Node.js/AWS)
├── WebSocket Server
│   ├── Conexión real-time de estudiantes y autoridades
│   ├── Broadcasting de actualizaciones de incidentes
│   └── Sincronización de estados
├── REST API
│   ├── POST /incidents - Crear reporte
│   ├── GET /incidents - Obtener reportes
│   ├── PUT /incidents/:id - Actualizar estado
│   └── GET /incidents/:id - Detalles de incidente
└── Base de Datos (PostgreSQL)
    ├── users - Usuarios del sistema
    ├── incidents - Reportes de incidentes
    └── incident_updates - Historial de cambios
\`\`\`

## Tecnologías Utilizadas

### Frontend
- **Next.js 16** - Framework React con SSR
- **React 19** - Componentes interactivos
- **TypeScript** - Tipado seguro
- **Tailwind CSS v4** - Diseño responsivo
- **shadcn/ui** - Componentes de UI profesionales
- **Lucide Icons** - Iconografía moderna
- **WebSocket** - Comunicación real-time

### Backend (Necesario)
- **Node.js** - Runtime JavaScript
- **Express/Fastify** - Framework web
- **WebSocket Server** - Comunicación real-time
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación

## Cómo Funciona

### Flujo de Autenticación
1. Usuario entra a la aplicación
2. Si no está autenticado, ve el formulario de login
3. Completa email, contraseña y selecciona su rol
4. Sistema verifica credenciales en el backend
5. Genera token JWT y lo almacena en localStorage
6. Redirige al dashboard

### Flujo de Reporte de Incidentes
1. Estudiante accede a "Reportar Incidente"
2. Completa formulario: tipo, descripción, ubicación, fotos
3. Frontend envía datos al backend vía API REST
4. Backend almacena en base de datos
5. WebSocket notifica a administradores en tiempo real
6. Estado se actualiza en tiempo real para todos los usuarios

### Sincronización Real-Time
1. Frontend abre conexión WebSocket al conectarse
2. Se suscribe a canales de incidentes
3. Backend envía actualizaciones vía WebSocket
4. Frontend actualiza UI sin recargar
5. Todos los usuarios ven cambios instantáneamente

## Instalación

### Requisitos
- Node.js 18+
- npm o yarn
- Vercel CLI (opcional)

### Pasos

\`\`\`bash
# 1. Clonar el repositorio
git clone <tu-repo>
cd alertautec

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear archivo .env.local con:
NEXT_PUBLIC_WEBSOCKET_URL=wss://tu-backend-url/ws
NEXT_PUBLIC_API_URL=https://tu-backend-url/api

# 4. Ejecutar en desarrollo
npm run dev

# 5. Abrir en navegador
# http://localhost:3000
\`\`\`

## Variables de Entorno

\`\`\`env
# URL del servidor WebSocket para comunicación real-time
NEXT_PUBLIC_WEBSOCKET_URL=wss://tu-backend-url/ws

# URL base de la API REST
NEXT_PUBLIC_API_URL=https://tu-backend-url/api

# (Opcional) URL de redirección después de login
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

## Credenciales de Demostración

El sistema funciona en modo demo sin necesidad de backend:

\`\`\`
Email: demo@utec.edu.pe
Contraseña: demo123
Rol: Estudiante / Admin / Autoridad
\`\`\`

## Qué le Falta para Producción

### Backend (CRÍTICO)
- [ ] Implementar API REST con Express/Fastify
- [ ] Configurar WebSocket Server (socket.io o ws)
- [ ] Base de datos PostgreSQL con tablas
- [ ] Autenticación JWT en backend
- [ ] Validación de entrada de datos
- [ ] Encriptación de contraseñas (bcrypt)
- [ ] CORS configurado correctamente
- [ ] Rate limiting para evitar abuso
- [ ] Logging y monitoreo de errores

### Base de Datos
\`\`\`sql
-- Tabla usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  role ENUM('student', 'admin', 'authority') NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla incidentes
CREATE TABLE incidents (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR NOT NULL,
  status ENUM('pendiente', 'en-proceso', 'resuelto', 'urgente') DEFAULT 'pendiente',
  photos TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla actualizaciones
CREATE TABLE incident_updates (
  id UUID PRIMARY KEY,
  incident_id UUID REFERENCES incidents(id),
  old_status VARCHAR,
  new_status VARCHAR,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Seguridad
- [ ] Validar tokens JWT en cada request
- [ ] Implementar Row-Level Security (RLS) en BD
- [ ] HTTPS obligatorio en producción
- [ ] CSRF protection
- [ ] Sanitización de inputs
- [ ] Autenticación de dos factores (2FA)
- [ ] Auditoría de acciones críticas

### Optimización
- [ ] Caché de incidentes (Redis)
- [ ] Compresión de imágenes
- [ ] Almacenamiento de fotos en cloud (S3, Blob Storage)
- [ ] Paginación de lista de incidentes
- [ ] Lazy loading de componentes

### Testing
- [ ] Tests unitarios (Jest)
- [ ] Tests de integración API
- [ ] Tests E2E (Playwright)
- [ ] Tests de carga WebSocket

### DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Deployment a Vercel (frontend)
- [ ] Deployment a AWS/Heroku (backend)
- [ ] Variables de entorno seguras
- [ ] Backups automáticos de BD
- [ ] Monitoring y alertas

### Documentación
- [ ] Documentación de API (Swagger/OpenAPI)
- [ ] Guía de usuario
- [ ] Guía de administrador
- [ ] Procesos de escalamiento

### Funcionalidades Adicionales (Nice-to-have)
- [ ] Mapas para visualizar ubicación de incidentes
- [ ] Exportar reportes a PDF
- [ ] Notificaciones por email/SMS
- [ ] Integración con sistemas de emergencia
- [ ] Clasificación automática de incidentes
- [ ] Chat en vivo con autoridades
- [ ] Historial de cambios auditable
- [ ] Roles personalizables
- [ ] API pública para terceros
- [ ] Dashboard de análisis avanzado

## Próximos Pasos

1. **Implementar Backend**: Crear servidor Node.js con WebSocket
2. **Configurar BD**: Crear PostgreSQL y ejecutar migraciones
3. **Conectar Frontend**: Actualizar `NEXT_PUBLIC_WEBSOCKET_URL` y `NEXT_PUBLIC_API_URL`
4. **Testing**: Probar flujos completos end-to-end
5. **Deployment**: Publicar frontend en Vercel y backend en AWS/Heroku
6. **Monitoreo**: Configurar alertas y logging

## Soporte

Para reportar errores o sugerencias, contacta al equipo de desarrollo de UTEC.

---

**Versión**: 1.0.0  
**Última actualización**: 2025-11-16  
**Estado**: En desarrollo - Requiere backend para producción
