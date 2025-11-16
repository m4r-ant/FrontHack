# Guía de Deployment en AWS Amplify - AlertaUTEC

## Opción 1: Deploy con Next.js (Recomendado para este proyecto)

### Requisitos
- Cuenta de AWS
- GitHub con tu repositorio
- AWS CLI instalado

### Pasos

1. **Push tu código a GitHub**
   \`\`\`bash
   git add .
   git commit -m "Preparar para Amplify"
   git push origin main
   \`\`\`

2. **Conectar a AWS Amplify**
   - Ve a https://console.aws.amazon.com/amplify/
   - Click en "New app" → "Host web app"
   - Selecciona GitHub y autoriza
   - Elige tu repositorio y rama "main"

3. **Configurar Build Settings**
   - Amplify detectará automáticamente que es Next.js
   - Usa la configuración por defecto
   - Los archivos `amplify.yml` está creado

4. **Configurar Variables de Entorno**
   - En Amplify Console → Environment variables
   - Añade:
     - `NEXT_PUBLIC_WEBSOCKET_URL`: Tu WebSocket URL
     - `NEXT_PUBLIC_API_URL`: Tu API URL

5. **Deploy**
   - Click en "Save and deploy"
   - Espera ~5-10 minutos
   - Tu app estará en: `https://[nombre].amplifyapp.com`

### Monitorar Builds
- Logs en tiempo real en Amplify Console
- Revisar errores en "Build logs"

---

## Opción 2: Migrar a Vite + React (Si necesitas más integración con AWS)

Si necesitas usar AppSync, Cognito, DynamoDB directamente:

1. Clonar template
   \`\`\`bash
   git clone https://github.com/aws-samples/amplify-vite-react-template
   \`\`\`

2. Copiar componentes
   - Copiar `/components` a `/src/components`
   - Copiar `/hooks` a `/src/hooks`
   - Ajustar imports

3. Configurar Amplify Gen 2
   \`\`\`bash
   npm create amplify@latest
   \`\`\`

4. Deploy
   \`\`\`bash
   npm run deploy
   \`\`\`

---

## Variables de Entorno Necesarias

\`\`\`env
# WebSocket (Backend)
NEXT_PUBLIC_WEBSOCKET_URL=wss://tu-endpoint.execute-api.region.amazonaws.com/dev

# API REST (Backend)
NEXT_PUBLIC_API_URL=https://tu-api.example.com

# Opcional: Si usas Amplify Auth
NEXT_PUBLIC_AMPLIFY_REGION=us-east-1
NEXT_PUBLIC_AMPLIFY_USER_POOL_ID=us-east-1_xxxxxxxxx
NEXT_PUBLIC_AMPLIFY_USER_POOL_CLIENT_ID=xxxxxxxxx
\`\`\`

---

## Troubleshooting

### Error: Build falló
- Revisar logs en Amplify Console
- Verificar que todas las variables de entorno estén configuradas
- Asegurar que `package.json` y `package-lock.json` estén en sync

### Error: WebSocket no conecta
- Verificar URL de WebSocket en variables de entorno
- Confirmar que tu backend está corriendo
- Revisar CORS en tu backend

### Deploy lento
- Amplify cachea dependencias
- Primer deploy tarda 10-15 minutos
- Siguientes deploys son más rápidos

---

## Próximos Pasos

1. Integrar AWS Amplify Auth (Cognito) para autenticación más robusta
2. Usar Amplify Data para sincizar incidentes en tiempo real
3. Configurar alertas y monitoreo en CloudWatch
4. Añadir CI/CD con pruebas automáticas

\`\`\`

```tsx file="" isHidden
