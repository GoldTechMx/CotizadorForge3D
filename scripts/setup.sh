#!/bin/bash

# ================================
# Forge3D Cotizador v2.1 Setup
# Script de Instalación Completo
# ================================

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # Sin color

# Configuración
PROJECT_NAME="Forge3D Cotizador"
VERSION="2.1.0"
REPO_URL="https://github.com/goldtechmx/forge3d-cotizador"
NODE_MIN_VERSION="16"

# Funciones de utilidad
print_banner() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}🚀 ${PROJECT_NAME} v${VERSION}${NC}"
    echo -e "${BLUE}   Setup y Configuración${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[ÉXITO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[ADVERTENCIA]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${PURPLE}[PASO]${NC} $1"
}

# Función para verificar prerrequisitos
check_prerequisites() {
    print_step "Verificando prerrequisitos del sistema..."
    
    # Verificar Git
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version | cut -d' ' -f3)
        print_success "✓ Git encontrado: v$GIT_VERSION"
    else
        print_error "✗ Git no encontrado. Por favor instala Git primero."
        return 1
    fi
    
    # Verificar Node.js (opcional pero recomendado)
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version | cut -c2-)
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
        
        if [ "$NODE_MAJOR" -ge "$NODE_MIN_VERSION" ]; then
            print_success "✓ Node.js encontrado: v$NODE_VERSION"
            HAS_NODE=true
        else
            print_warning "⚠ Node.js v$NODE_VERSION encontrado (recomendado v$NODE_MIN_VERSION+)"
            HAS_NODE=false
        fi
    else
        print_warning "⚠ Node.js no encontrado (opcional para herramientas de desarrollo)"
        HAS_NODE=false
    fi
    
    # Verificar Docker (opcional)
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        print_success "✓ Docker encontrado: v$DOCKER_VERSION"
        HAS_DOCKER=true
    else
        print_warning "⚠ Docker no encontrado (opcional para despliegue)"
        HAS_DOCKER=false
    fi
    
    # Verificar servidor web
    if command -v python3 &> /dev/null; then
        print_success "✓ Python3 encontrado (para servidor de desarrollo)"
        HAS_PYTHON=true
    elif command -v python &> /dev/null; then
        print_success "✓ Python encontrado (para servidor de desarrollo)"
        HAS_PYTHON=true
    else
        print_warning "⚠ Python no encontrado (recomendado para servidor local)"
        HAS_PYTHON=false
    fi
    
    return 0
}

# Función para crear estructura de directorios
create_directory_structure() {
    print_step "Creando estructura de directorios..."
    
    # Directorios principales
    DIRECTORIES=(
        "assets/css"
        "assets/js"
        "assets/images"
        "docs"
        "scripts"
        "tests"
        "backup"
        ".github/workflows"
        ".github/ISSUE_TEMPLATE"
        "docker"
    )
    
    for dir in "${DIRECTORIES[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            print_success "✓ Directorio creado: $dir"
        else
            print_status "→ Directorio existe: $dir"
        fi
    done
    
    return 0
}

# Función para verificar archivos principales
verify_core_files() {
    print_step "Verificando archivos principales..."
    
    CORE_FILES=(
        "index.html"
        "manifest.json"
        "sw.js"
        "assets/css/styles.css"
        "assets/js/app.js"
        "assets/js/branding_config.js"
        "assets/js/branding_ui.js"
        "assets/js/whatsapp_floating.js"
        "assets/js/email_templates.js"
    )
    
    MISSING_FILES=()
    
    for file in "${CORE_FILES[@]}"; do
        if [ -f "$file" ]; then
            print_success "✓ $file"
        else
            print_error "✗ $file - FALTANTE"
            MISSING_FILES+=("$file")
        fi
    done
    
    if [ ${#MISSING_FILES[@]} -gt 0 ]; then
        print_error "Archivos faltantes detectados. Creando archivos básicos..."
        create_missing_files "${MISSING_FILES[@]}"
    fi
    
    return 0
}

# Función para crear archivos faltantes básicos
create_missing_files() {
    local files=("$@")
    
    for file in "${files[@]}"; do
        case "$file" in
            "manifest.json")
                create_manifest_json
                ;;
            "sw.js")
                create_service_worker
                ;;
            ".htaccess")
                create_htaccess
                ;;
            *)
                print_warning "⚠ No se puede crear automáticamente: $file"
                ;;
        esac
    done
}

# Función para crear manifest.json
create_manifest_json() {
    print_status "Creando manifest.json..."
    
    cat > manifest.json << 'EOF'
{
  "name": "Cotizador Forge3D",
  "short_name": "Forge3D",
  "description": "Calculadora profesional de precios para impresión 3D",
  "theme_color": "#CD9430",
  "background_color": "#0e0e0e",
  "display": "standalone",
  "start_url": "/",
  "scope": "/",
  "icons": [
    {
      "src": "https://bio.goldtech.mx/forge3d-icon",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "https://bio.goldtech.mx/forge3d-icon",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF
    
    print_success "✓ manifest.json creado"
}

# Función para crear service worker básico
create_service_worker() {
    print_status "Creando sw.js..."
    
    cat > sw.js << 'EOF'
const CACHE_NAME = 'forge3d-v2.1.0';
const urlsToCache = [
  '/',
  '/assets/css/styles.css',
  '/assets/js/app.js',
  '/assets/js/branding_config.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
EOF
    
    print_success "✓ sw.js creado"
}

# Función para crear .htaccess
create_htaccess() {
    print_status "Creando .htaccess..."
    
    cat > .htaccess << 'EOF'
# Forge3D Cotizador - Configuración Apache
RewriteEngine On

# Comprimir archivos
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Headers de seguridad
<IfModule mod_headers.c>
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
EOF
    
    print_success "✓ .htaccess creado"
}

# Función para configurar herramientas de desarrollo
setup_dev_tools() {
    print_step "Configurando herramientas de desarrollo..."
    
    if [ "$HAS_NODE" = true ]; then
        print_status "Instalando herramientas de desarrollo con npm..."
        
        # Crear package.json si no existe
        if [ ! -f "package.json" ]; then
            cat > package.json << EOF
{
  "name": "forge3d-cotizador",
  "version": "2.1.0",
  "description": "Calculadora profesional de precios para impresión 3D",
  "main": "index.html",
  "scripts": {
    "dev": "live-server --port=3000 --open=/",
    "build": "node scripts/build.js",
    "test": "node scripts/test.js",
    "validate": "html-validate index.html && stylelint assets/css/*.css && eslint assets/js/*.js"
  },
  "devDependencies": {
    "live-server": "^1.2.2",
    "html-validate": "^8.0.0",
    "stylelint": "^15.0.0",
    "eslint": "^8.0.0"
  },
  "keywords": ["3d-printing", "calculator", "pricing", "forge3d"],
  "author": "GoldTech MX",
  "license": "MIT"
}
EOF
            print_success "✓ package.json creado"
        fi
        
        # Preguntar si instalar dependencias
        echo ""
        print_status "¿Deseas instalar las dependencias de desarrollo? (y/n)"
        read -r INSTALL_DEPS
        
        if [[ $INSTALL_DEPS =~ ^[Yy]$ ]]; then
            print_status "Instalando dependencias..."
            if npm install; then
                print_success "✓ Dependencias instaladas correctamente"
            else
                print_warning "⚠ Error al instalar dependencias"
            fi
        fi
    else
        print_warning "⚠ Node.js no disponible, saltando configuración de herramientas"
    fi
}

# Función para configurar Git
setup_git() {
    print_step "Configurando Git..."
    
    # Crear .gitignore si no existe
    if [ ! -f ".gitignore" ]; then
        cat > .gitignore << 'EOF'
# Dependencias
node_modules/
npm-debug.log*

# Archivos de sistema
.DS_Store
Thumbs.db

# Archivos de IDE
.vscode/
.idea/
*.swp
*.swo

# Archivos temporales
*.tmp
*.temp
.cache/

# Logs
logs/
*.log

# Archivos de configuración local
.env.local
config.local.js

# Backups
backup/
*.backup
*.bak

# Archivos de build
dist/
build/

# Coverage
coverage/
.nyc_output/
EOF
        print_success "✓ .gitignore creado"
    fi
    
    # Inicializar repo si no existe
    if [ ! -d ".git" ]; then
        print_status "¿Deseas inicializar un repositorio Git? (y/n)"
        read -r INIT_GIT
        
        if [[ $INIT_GIT =~ ^[Yy]$ ]]; then
            git init
            git add .
            git commit -m "feat: setup inicial Forge3D v2.1.0"
            print_success "✓ Repositorio Git inicializado"
            
            print_status "¿Deseas configurar el remote origin? (y/n)"
            read -r SET_REMOTE
            
            if [[ $SET_REMOTE =~ ^[Yy]$ ]]; then
                print_status "Ingresa la URL del repositorio remoto:"
                read -r REMOTE_URL
                
                if [ -n "$REMOTE_URL" ]; then
                    git remote add origin "$REMOTE_URL"
                    print_success "✓ Remote origin configurado: $REMOTE_URL"
                fi
            fi
        fi
    else
        print_status "→ Repositorio Git ya existe"
    fi
}

# Función para configurar Docker
setup_docker() {
    if [ "$HAS_DOCKER" = true ]; then
        print_step "Configurando Docker..."
        
        # Crear Dockerfile si no existe
        if [ ! -f "Dockerfile" ]; then
            cat > Dockerfile << 'EOF'
FROM nginx:alpine

# Copiar archivos de la aplicación
COPY . /usr/share/nginx/html

# Copiar configuración de nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
EOF
            print_success "✓ Dockerfile creado"
        fi
        
        # Crear docker-compose.yml si no existe
        if [ ! -f "docker-compose.yml" ]; then
            cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  forge3d:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    volumes:
      - ./logs:/var/log/nginx
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.forge3d.rule=Host(\`forge3d.local\`)"
EOF
            print_success "✓ docker-compose.yml creado"
        fi
        
        # Crear configuración de nginx
        mkdir -p docker
        
        if [ ! -f "docker/nginx.conf" ]; then
            cat > docker/nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    include /etc/nginx/conf.d/*.conf;
}
EOF
            print_success "✓ docker/nginx.conf creado"
        fi
        
        if [ ! -f "docker/default.conf" ]; then
            cat > docker/default.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(html)$ {
        expires 1h;
        add_header Cache-Control "public";
    }
}
EOF
            print_success "✓ docker/default.conf creado"
        fi
        
        print_status "¿Deseas construir la imagen Docker? (y/n)"
        read -r BUILD_DOCKER
        
        if [[ $BUILD_DOCKER =~ ^[Yy]$ ]]; then
            print_status "Construyendo imagen Docker..."
            if docker build -t forge3d-cotizador .; then
                print_success "✓ Imagen Docker construida: forge3d-cotizador"
                
                print_status "Para ejecutar el contenedor usa:"
                echo "  docker run -p 8080:80 forge3d-cotizador"
                echo "  O: docker-compose up"
            else
                print_error "✗ Error al construir imagen Docker"
            fi
        fi
    else
        print_warning "⚠ Docker no disponible, saltando configuración Docker"
    fi
}

# Función para actualizar contactos
update_contacts() {
    print_step "Actualizando información de contacto..."
    
    NEW_EMAIL="github@goldtech.mx"
    NEW_WHATSAPP="4771756028"
    
    # Buscar y reemplazar en archivos de configuración
    if [ -f "assets/js/branding_config.js" ]; then
        # Actualizar email
        sed -i.bak "s/contacto@goldtech\.mx/$NEW_EMAIL/g" assets/js/branding_config.js
        
        # Actualizar WhatsApp
        sed -i.bak "s/number: \"\"/number: \"$NEW_WHATSAPP\"/g" assets/js/branding_config.js
        sed -i.bak "s/enabled: false/enabled: true/g" assets/js/branding_config.js
        
        # Limpiar archivos backup
        rm -f assets/js/branding_config.js.bak
        
        print_success "✓ Contactos actualizados en branding_config.js"
    fi
    
    # Actualizar otros archivos si existen
    if [ -f "CONTRIBUTING.md" ]; then
        sed -i.bak "s/soporte@goldtech\.mx/$NEW_EMAIL/g" CONTRIBUTING.md
        rm -f CONTRIBUTING.md.bak
        print_success "✓ Contactos actualizados en CONTRIBUTING.md"
    fi
}

# Función para crear documentación
create_documentation() {
    print_step "Creando documentación..."
    
    # Crear README básico si no existe
    if [ ! -f "README.md" ]; then
        cat > README.md << EOF
# 🚀 Forge3D Cotizador v2.1

Calculadora profesional de precios para impresión 3D desarrollada por GoldTech MX.

## ✨ Características

- 🧮 Cálculo automático de costos de material, tiempo y electricidad
- 📱 PWA con funcionalidad offline
- 🎨 Sistema de branding personalizable
- 💬 WhatsApp flotante integrado
- 📧 Sistema de templates de email
- 🌓 Modo claro/oscuro
- 📱 Diseño completamente responsive

## 🚀 Inicio Rápido

### Instalación
\`\`\`bash
# Clonar el repositorio
git clone $REPO_URL
cd forge3d-cotizador

# Ejecutar setup
chmod +x scripts/setup.sh
./scripts/setup.sh
\`\`\`

### Desarrollo Local
\`\`\`bash
# Con Python
python -m http.server 8000

# Con Node.js
npm run dev

# Con Docker
docker-compose up
\`\`\`

## 📞 Contacto

- **Email**: $NEW_EMAIL
- **WhatsApp**: +52 477 175 6028
- **GitHub**: [goldtechmx](https://github.com/goldtechmx)

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

**Desarrollado con ❤️ por [GoldTech MX](https://goldtech.mx)**
EOF
        print_success "✓ README.md creado"
    fi
    
    # Crear documentación en docs/
    mkdir -p docs
    
    if [ ! -f "docs/INSTALLATION.md" ]; then
        cat > docs/INSTALLATION.md << 'EOF'
# 📥 Guía de Instalación - Forge3D v2.1

## Métodos de Instalación

### 1. Instalación Local Simple
```bash
# Descargar y extraer archivos
# Abrir index.html en navegador
```

### 2. Servidor de Desarrollo
```bash
# Python
python -m http.server 8000

# Node.js
npx live-server --port=3000
```

### 3. Docker
```bash
docker-compose up
```

## Configuración Inicial

1. Abrir la aplicación
2. Ir a Configuración (Ctrl+K)
3. Personalizar branding (Ctrl+B)
4. Configurar contactos y precios

## Solución de Problemas

- **PWA no se instala**: Verificar HTTPS
- **WhatsApp no funciona**: Verificar número en configuración
- **PDF no genera**: Verificar jsPDF está cargado
EOF
        print_success "✓ docs/INSTALLATION.md creado"
    fi
}

# Función para validar instalación
validate_installation() {
    print_step "Validando instalación..."
    
    VALIDATION_ERRORS=0
    
    # Verificar archivos críticos
    CRITICAL_FILES=(
        "index.html"
        "manifest.json"
        "assets/css/styles.css"
        "assets/js/app.js"
    )
    
    for file in "${CRITICAL_FILES[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "✗ Archivo crítico faltante: $file"
            VALIDATION_ERRORS=$((VALIDATION_ERRORS + 1))
        fi
    done
    
    # Verificar sintaxis de archivos JavaScript (si Node.js está disponible)
    if [ "$HAS_NODE" = true ]; then
        for js_file in assets/js/*.js; do
            if [ -f "$js_file" ]; then
                if node -c "$js_file" 2>/dev/null; then
                    print_success "✓ Sintaxis válida: $js_file"
                else
                    print_error "✗ Error de sintaxis: $js_file"
                    VALIDATION_ERRORS=$((VALIDATION_ERRORS + 1))
                fi
            fi
        done
    fi
    
    # Verificar manifest.json
    if [ -f "manifest.json" ]; then
        if python -m json.tool manifest.json > /dev/null 2>&1; then
            print_success "✓ manifest.json válido"
        else
            print_error "✗ manifest.json inválido"
            VALIDATION_ERRORS=$((VALIDATION_ERRORS + 1))
        fi
    fi
    
    if [ $VALIDATION_ERRORS -eq 0 ]; then
        print_success "🎉 Validación completada sin errores"
        return 0
    else
        print_error "❌ Validación completada con $VALIDATION_ERRORS errores"
        return 1
    fi
}

# Función para mostrar resumen final
show_final_summary() {
    echo ""
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}🎉 SETUP COMPLETADO EXITOSAMENTE${NC}"
    echo -e "${GREEN}================================${NC}"
    echo ""
    
    print_status "📋 Resumen de la instalación:"
    echo "  📂 Estructura de directorios: ✓"
    echo "  📄 Archivos principales: ✓"
    echo "  ⚙️ Configuración: ✓"
    echo "  📞 Contactos actualizados: ✓"
    echo "  📚 Documentación: ✓"
    
    if [ "$HAS_NODE" = true ]; then
        echo "  🛠️ Herramientas de desarrollo: ✓"
    fi
    
    if [ "$HAS_DOCKER" = true ]; then
        echo "  🐳 Docker: ✓"
    fi
    
    echo ""
    print_status "🚀 Próximos pasos:"
    echo "  1. Abrir index.html en tu navegador"
    echo "  2. Configurar branding (Ctrl+B)"
    echo "  3. Personalizar precios (Ctrl+K)"
    echo "  4. ¡Empezar a cotizar!"
    
    echo ""
    print_status "📖 Comandos útiles:"
    
    if [ "$HAS_PYTHON" = true ]; then
        echo "  • Servidor local: python -m http.server 8000"
    fi
    
    if [ "$HAS_NODE" = true ]; then
        echo "  • Desarrollo: npm run dev"
        echo "  • Validar: npm run validate"
    fi
    
    if [ "$HAS_DOCKER" = true ]; then
        echo "  • Docker: docker-compose up"
    fi
    
    echo ""
    print_status "📞 Soporte:"
    echo "  • Email: github@goldtech.mx"
    echo "  • WhatsApp: +52 477 175 6028"
    echo "  • GitHub: https://github.com/goldtechmx/forge3d-cotizador"
    
    echo ""
    print_success "¡Forge3D Cotizador v2.1 está listo para usar! 🎊"
}

# ===== FUNCIÓN PRINCIPAL =====
main() {
    print_banner
    
    # Verificar prerrequisitos
    if ! check_prerequisites; then
        print_error "❌ Fallan los prerrequisitos del sistema"
        exit 1
    fi
    
    echo ""
    
    # Crear estructura
    create_directory_structure
    echo ""
    
    # Verificar archivos
    verify_core_files
    echo ""
    
    # Configurar herramientas
    setup_dev_tools
    echo ""
    
    # Configurar Git
    setup_git
    echo ""
    
    # Configurar Docker
    setup_docker
    echo ""
    
    # Actualizar contactos
    update_contacts
    echo ""
    
    # Crear documentación
    create_documentation
    echo ""
    
    # Validar instalación
    if validate_installation; then
        show_final_summary
        exit 0
    else
        print_error "❌ La instalación tiene errores. Revisa los mensajes anteriores."
        exit 1
    fi
}

# Ejecutar función principal
main "$@"