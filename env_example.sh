# ================================
# Forge3D Cotizador - Configuración de Ejemplo
# ================================

# Información básica de la aplicación
APP_NAME="Forge3D Cotizador"
APP_VERSION="2.1.0"
APP_DESCRIPTION="Calculadora profesional de precios para impresión 3D"

# Configuración de la empresa (será usado por defecto si no hay branding personalizado)
COMPANY_NAME="Tu Empresa 3D"
COMPANY_SLOGAN="Soluciones de Impresión 3D"
COMPANY_WEBSITE="https://tu-empresa.com"
COMPANY_EMAIL="contacto@tu-empresa.com"
COMPANY_PHONE="+52 477 123 4567"
COMPANY_ADDRESS="León de los Aldama, Guanajuato, MX"

# URLs de logos (si no se suben archivos personalizados)
LOGO_FORGE_DARK="https://bio.goldtech.mx/forge3d_oscuro"
LOGO_FORGE_LIGHT="https://bio.goldtech.mx/forge3d_blanco"
LOGO_COMPANY_DARK="https://bio.goldtech.mx/logogoldtech"
LOGO_COMPANY_LIGHT="https://gtt.mx/logo-goldtech.oscuro"

# Colores de marca por defecto
BRAND_COLOR_PRIMARY="#CD9430"
BRAND_COLOR_SECONDARY="#e1aa4a"
BRAND_COLOR_ACCENT="#B8851F"

# Redes sociales
SOCIAL_TIKTOK="https://tiktok.com/@tu_usuario"
SOCIAL_INSTAGRAM="https://instagram.com/tu_usuario"
SOCIAL_YOUTUBE="https://youtube.com/@tu_usuario"
SOCIAL_LINKEDIN="https://linkedin.com/company/tu_empresa"
SOCIAL_FACEBOOK="https://facebook.com/tu_usuario"
SOCIAL_WHATSAPP="https://wa.me/1234567890"

# Configuración de analytics (opcional)
GOOGLE_ANALYTICS_ID=""
GOOGLE_TAG_MANAGER_ID=""
HOTJAR_ID=""
FACEBOOK_PIXEL_ID=""

# Configuración de SEO
SEO_TITLE="Cotizador Forge3D - Calculadora Profesional de Precios para Impresión 3D"
SEO_DESCRIPTION="Herramienta profesional gratuita para calcular precios exactos de proyectos de impresión 3D."
SEO_KEYWORDS="cotizador impresión 3D, calculadora precios 3D, Forge3D, presupuesto impresión 3D"
SEO_CANONICAL_URL="https://tu-dominio.com"
SEO_OG_IMAGE="https://tu-dominio.com/assets/images/og-image.png"

# Configuración del servidor
SERVER_PORT=8080
SERVER_HOST="0.0.0.0"
NODE_ENV="production"

# Configuración de cache (en segundos)
CACHE_STATIC_ASSETS=31536000    # 1 año
CACHE_HTML=86400               # 1 día
CACHE_API=3600                 # 1 hora

# Configuración de seguridad
ENABLE_HTTPS_REDIRECT=true
ENABLE_CSP=true
ENABLE_HSTS=true
CSP_REPORT_URI=""

# Base de datos (para futuras funcionalidades)
DB_HOST="localhost"
DB_PORT=5432
DB_NAME="forge3d"
DB_USER="forge3d_user"
DB_PASSWORD=""
DB_SSL=false

# Redis (para cache y sesiones - futuro)
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""

# Email (para notificaciones - futuro)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM_NAME="Forge3D Cotizador"
SMTP_FROM_EMAIL="noreply@tu-dominio.com"

# APIs externas (futuras integraciones)
MERCADOLIBRE_API_KEY=""
AMAZON_API_KEY=""
STRIPE_PUBLIC_KEY=""
STRIPE_SECRET_KEY=""
PAYPAL_CLIENT_ID=""

# Configuración de uploads
UPLOAD_MAX_SIZE=5242880        # 5MB
UPLOAD_ALLOWED_TYPES="image/jpeg,image/png,image/gif,image/webp"
UPLOAD_PATH="/uploads"

# Configuración de logs
LOG_LEVEL="info"
LOG_FILE="logs/app.log"
LOG_MAX_SIZE=10485760          # 10MB
LOG_MAX_FILES=5

# Configuración de desarrollo
DEBUG=false
ENABLE_CORS=false
CORS_ORIGIN="*"

# Configuración de backup (futuro)
BACKUP_ENABLED=false
BACKUP_SCHEDULE="0 2 * * *"    # Diario a las 2 AM
BACKUP_RETENTION_DAYS=30

# Configuración de monitoreo
SENTRY_DSN=""
DATADOG_API_KEY=""
NEW_RELIC_LICENSE_KEY=""

# ================================
# NOTAS:
# ================================
# 1. Copia este archivo como .env y configura tus valores
# 2. Nunca subas el archivo .env a Git
# 3. Las variables marcadas como "futuro" no están implementadas aún
# 4. Los valores de ejemplo son funcionales pero debes personalizarlos
# 5. Para producción, usa secretos seguros para APIs y passwords