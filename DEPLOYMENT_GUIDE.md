# Guía Completa: Deployar AlertaUTEC en AWS Amplify

## Resumen
Este documento te guía paso a paso para deployar tu aplicación Next.js AlertaUTEC en AWS Amplify.

---

## Requisitos Previos
- Cuenta de AWS activa
- Repositorio GitHub con tu código
- Next.js 16 configurado
- Variables de entorno listas

---

## Paso 1: Preparar tu Código

### 1.1 Asegurar que tu código esté en GitHub

\`\`\`bash
git add .
git commit -m "Preparar para Amplify - Usar logo UTEC y optimizar"
git push origin main
\`\`\`

### 1.2 Verificar estructura del proyecto
\`\`\`
alerta-utec/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── dashboard.tsx
│   ├── auth-form.tsx
│   ├── report-form.tsx
│   ├── admin-panel.tsx
│   └── ui/
├── hooks/
│   ├── use-auth.ts
│   └── use-websocket.ts
├── public/
│   ├── utec-logo-full.jpg
│   └── utec-logo.png
├── package.json
├── next.config.mjs
├── amplify.yml
└── tsconfig.json
\`\`\`

---

## Paso 2: Configurar AWS Amplify

### 2.1 Ir a AWS Amplify Console
1. Abre https://console.aws.amazon.com/amplify/
2. Haz clic en **"New app"** → **"Host web app"**

### 2.2 Conectar tu Repositorio GitHub
1. Selecciona **GitHub**
2. Haz clic en **"Connect branch"**
3. Autoriza el acceso a tu cuenta de GitHub
4. Busca y selecciona tu repositorio: \`alerta-utec\`
5. Selecciona la rama: \`main\`
6. Haz clic en **"Next"**

### 2.3 Configurar Build Settings
En la pantalla "Configure build settings":

1. **App name**: \`AlertaUTEC\`
2. **Build command**: 
   \`\`\`
   npm run build
   \`\`\`
3. **Start command**:
   \`\`\`
   npm start
   \`\`\`
4. Los archivos de salida ya estarán configurados para Next.js
5. Haz clic en **"Next"**

---

## Paso 3: Configurar Variables de Entorno

En la sección "Environment variables", añade:

| Nombre | Valor | Descripción |
|--------|-------|-------------|
| NEXT_PUBLIC_WEBSOCKET_URL | \`wss://tu-endpoint.execute-api.region.amazonaws.com/dev\` | Tu WebSocket AWS |
| NEXT_PUBLIC_API_URL | \`https://tu-api.example.com\` | Tu API REST backend |
| NODE_ENV | \`production\` | Ambiente de producción |

**Ejemplo:**
\`\`\`
NEXT_PUBLIC_WEBSOCKET_URL=wss://abc123.execute-api.us-east-1.amazonaws.com/dev
NEXT_PUBLIC_API_URL=https://api.alerta-utec.edu.pe
\`\`\`

---

## Paso 4: Deploy

### 4.1 Iniciar Deploy
1. Verifica que todo esté correcto
2. Haz clic en **"Save and deploy"**
3. Amplify comienza automáticamente el build

### 4.2 Monitorear el Build
1. En la pestaña **"Deployments"**, verás el estado
2. El proceso toma 5-15 minutos (primer deploy)
3. Los logs aparecen en tiempo real

### 4.3 Acceder a tu App
Una vez completado, tu URL será:
\`\`\`
https://[rama].[nombre-app].amplifyapp.com
\`\`\`

**Ejemplo:**
\`\`\`
https://main.alertautec.amplifyapp.com
\`\`\`

---

## Paso 5: Configuración Post-Deploy

### 5.1 Verificar CORS en tu Backend
Si tienes backend personalizado, configura:

\`\`\`javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://main.alertautec.amplifyapp.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
\`\`\`

### 5.2 Configurar Dominio Personalizado (Opcional)
1. En Amplify Console → **"Domain management"**
2. Haz clic en **"Add domain"**
3. Ingresa tu dominio (ej: alerta.utec.edu.pe)
4. Sigue las instrucciones para actualizar DNS

### 5.3 Habilitar HTTPS
Amplify lo hace automáticamente con certificado SSL gratuito.

---

## Paso 6: Despliegues Posteriores

Cada vez que hagas push a \`main\`:
1. Amplify automáticamente:
   - Clona tu repositorio
   - Ejecuta \`npm run build\`
   - Deploy la nueva versión
2. Puedes monitorear en tiempo real en la Console

---

## Troubleshooting

### Error: "Build failed"
**Solución:**
1. Revisa los logs en "Deployments" → "Build logs"
2. Verifica que \`package.json\` sea válido
3. Confirma que todas las dependencias estén instaladas

### Error: "WebSocket connection failed"
**Solución:**
1. Revisa que NEXT_PUBLIC_WEBSOCKET_URL sea correcta
2. Verifica que tu backend esté corriendo
3. Comprueba CORS en tu backend

### Error: "Cannot find module"
**Solución:**
1. Ejecuta \`npm install\` localmente
2. Verifica que \`package-lock.json\` esté en git
3. Haz push nuevamente

### Logs en Amplify
Para ver logs detallados:
1. Ve a "Deployments"
2. Haz clic en el deployment
3. Scroll a "Build logs" o "Runtime logs"

---

## Monitoreo y Métricas

### Habilitar CloudWatch Logs
1. En Amplify Console → **"Monitoring"**
2. Haz clic en **"Enable logs"**
3. Los logs aparecerán en CloudWatch

### Configurar Alertas
1. Ve a CloudWatch Console
2. Crea alarms para:
   - Error rate > 5%
   - Response time > 3s
   - Deployment failures

---

## Scripts Útiles

### Local Testing antes de Deploy
\`\`\`bash
# Instalar dependencias
npm install

# Build local
npm run build

# Ejecutar producción local
npm start

# Verificar que se ve igual que en Amplify
\`\`\`

---

## Próximos Pasos

1. **Integrar AWS Cognito** para autenticación más robusta
2. **Usar DynamoDB** para almacenar incidentes
3. **Configurar Lambda** para procesamiento backend
4. **Configurar CloudFront** para mejor performance global

---

## Recursos
- [AWS Amplify Docs](https://docs.amplify.aws/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Amplify CLI Reference](https://docs.amplify.aws/cli/)
