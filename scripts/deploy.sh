#!/bin/bash

# ================================
# Forge3D Cotizador - Deploy Script
# ================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
BUILD_DIR="dist"
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Funciones de utilidad
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Banner
echo "================================"
echo "🚀 Forge3D Cotizador Deploy"
echo "================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "index.html" ]; then
    print_error "No se encontró index.html. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Leer argumentos
DEPLOYMENT_TYPE=${1:-"production"}
TARGET_SERVER=${2:-""}

print_status "Tipo de despliegue: $DEPLOYMENT_TYPE"

# Función para validar código
validate_code() {
    print_status "Validando código..."
    
    # Validar HTML
    if command -v html-validate &> /dev/null; then
        print_status "Validando HTML..."
        html-validate index.html || {
            print_error "Validación HTML falló"
            exit 1
        }
        print_success "HTML válido"
    fi
    
    # Validar CSS
    if command -v stylelint &> /dev/null; then
        print_status "Validando CSS..."
        stylelint "assets/css/*.css" || {
            print_error "Validación CSS falló"
            exit 1
        }
        print_success "CSS válido"
    fi
    
    # Validar JavaScript
    if command -v eslint &> /dev/null; then
        print_status "Validando JavaScript..."
        eslint "assets/js/*.js" || {
            print_error "Validación JavaScript falló"
            exit 1
        }
        print_success "JavaScript válido"
    fi
}

# Función para crear build optimizado
create_build() {
    print_status "Creando build optimizado..."
    
    # Limpiar directorio de build anterior
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
    fi
    
    # Crear estructura de directorios
    mkdir -p "$BUILD_DIR/assets/css"
    mkdir -p "$BUILD_DIR/assets/js"
    mkdir -p "$BUILD_DIR/assets/images"
    mkdir -p "$BUILD_DIR/docker"
    
    # Copiar archivos estáticos
    cp index.html "$BUILD_DIR/"
    cp manifest.json "$BUILD_DIR/"
    cp sw.js "$BUILD_DIR/"
    cp .htaccess "$BUILD_DIR/"
    cp -r assets/images/* "$BUILD_DIR/assets/images/"
    
    # Optimizar CSS
    if command -v cleancss &> /dev/null; then
        print_status "Optimizando CSS..."
        cleancss -o "$BUILD_DIR/assets/css/styles.min.css" assets/css/styles.css
        print_success "CSS optimizado"
    else
        print_warning "cleancss no encontrado, copiando CSS sin optimizar"
        cp assets/css/styles.css "$BUILD_DIR/assets/css/"
    fi
    
    # Optimizar JavaScript
    if command -v terser &> /dev/null; then
        print_status "Optimizando JavaScript..."
        terser assets/js/config.js -o "$BUILD_DIR/assets/js/config.min.js" --compress --mangle
        terser assets/js/app.js -o "$BUILD_DIR/assets/js/app.min.js" --compress --mangle
        print_success "JavaScript optimizado"
        
        # Actualizar referencias en HTML
        sed -i.bak 's/assets\/js\/config\.js/assets\/js\/config.min.js/g' "$BUILD_DIR/index.html"
        sed -i.bak 's/assets\/js\/app\.js/assets\/js\/app.min.js/g' "$BUILD_DIR/index.html"
        sed -i.bak 's/assets\/css\/styles\.css/assets\/css\/styles.min.css/g' "$BUILD_DIR/index.html"
        rm "$BUILD_DIR/index.html.bak"
    else
        print_warning "terser no encontrado, copiando JavaScript sin optimizar"
        cp assets/js/*.js "$BUILD_DIR/assets/js/"
    fi
    
    # Optimizar HTML
    if command -v html-minifier-terser &> /dev/null; then
        print_status "Optimizando HTML..."
        html-minifier-terser --input-dir "$BUILD_DIR" --output-dir "$BUILD_DIR" --file-ext html \
            --remove-comments --collapse-whitespace --minify-css --minify-js
        print_success "HTML optimizado"
    fi
    
    print_success "Build creado en $BUILD_DIR/"
}

# Función para crear backup
create_backup() {
    if [ -n "$TARGET_SERVER" ]; then
        print_status "Creando backup del servidor..."
        
        # Crear directorio de backup
        mkdir -p "$BACKUP_DIR"
        
        # Crear backup (esto dependerá de tu configuración específica)
        BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
        
        if [ "$DEPLOYMENT_TYPE" = "docker" ]; then
            # Backup para Docker
            print_status "Creando backup de contenedores Docker..."
            docker-compose down
            tar -czf "$BACKUP_FILE" -C /var/lib/docker/volumes .
        else
            # Backup para servidor tradicional
            print_status "Creando backup de archivos del servidor..."
            tar -czf "$BACKUP_FILE" "$BUILD_DIR"
        fi
        
        print_success "Backup creado: $BACKUP_FILE"
    fi
}

# Función para desplegar
deploy() {
    case $DEPLOYMENT_TYPE in
        "docker")
            deploy_docker
            ;;
        "server")
            deploy_server
            ;;
        "netlify")
            deploy_netlify
            ;;
        "github-pages")
            deploy_github_pages
            ;;
        *)
            print_status "Despliegue local - archivos listos en $BUILD_DIR/"
            ;;
    esac
}

# Despliegue con Docker
deploy_docker() {
    print_status "Desplegando con Docker..."
    
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml no encontrado"
        exit 1
    fi
    
    # Construir imagen
    print_status "Construyendo imagen Docker..."
    docker build -t forge3d-cotizador:$TIMESTAMP .
    docker tag forge3d-cotizador:$TIMESTAMP forge3d-cotizador:latest
    
    # Desplegar
    print_status "Iniciando servicios..."
    docker-compose up -d
    
    # Verificar salud
    sleep 10
    if docker-compose ps | grep -q "Up"; then
        print_success "Despliegue Docker completado"
        print_status "Aplicación disponible en: http://localhost:8080"
    else
        print_error "Error en el despliegue Docker"
        docker-compose logs
        exit 1
    fi
}

# Despliegue en servidor tradicional
deploy_server() {
    if [ -z "$TARGET_SERVER" ]; then
        print_error "TARGET_SERVER no especificado para despliegue en servidor"
        exit 1
    fi
    
    print_status "Desplegando en servidor: $TARGET_SERVER"
    
    # Subir archivos (requiere configuración SSH)
    print_status "Subiendo archivos..."
    rsync -avz --delete "$BUILD_DIR/" "$TARGET_SERVER:/var/www/html/"
    
    # Reiniciar servicios web (opcional)
    print_status "Reiniciando servicios web..."
    ssh "$TARGET_SERVER" "sudo systemctl reload nginx"
    
    print_success "Despliegue en servidor completado"
}

# Despliegue en Netlify
deploy_netlify() {
    print_status "Desplegando en Netlify..."
    
    if command -v netlify &> /dev/null; then
        netlify deploy --prod --dir="$BUILD_DIR"
        print_success "Despliegue en Netlify completado"
    else
        print_error "Netlify CLI no encontrado. Instala con: npm install -g netlify-cli"
        exit 1
    fi
}

# Despliegue en GitHub Pages
deploy_github_pages() {
    print_status "Desplegando en GitHub Pages..."
    
    # Verificar que estamos en un repositorio Git
    if [ ! -d ".git" ]; then
        print_error "No es un repositorio Git"
        exit 1
    fi
    
    # Crear rama gh-pages
    git checkout -b gh-pages || git checkout gh-pages
    
    # Limpiar y copiar archivos del build
    git rm -rf . || true
    cp -r "$BUILD_DIR"/* .
    
    # Commit y push
    git add .
    git commit -m "Deploy to GitHub Pages - $TIMESTAMP"
    git push origin gh-pages --force
    
    # Volver a la rama principal
    git checkout main || git checkout master
    
    print_success "Despliegue en GitHub Pages completado"
}

# Función para verificar despliegue
verify_deployment() {
    print_status "Verificando despliegue..."
    
    # URLs de verificación según el tipo de despliegue
    case $DEPLOYMENT_TYPE in
        "docker")
            VERIFY_URL="http://localhost:8080/health"
            ;;
        "server")
            VERIFY_URL="$TARGET_SERVER/health"
            ;;
        *)
            print_status "Verificación manual requerida"
            return
            ;;
    esac
    
    if [ -n "$VERIFY_URL" ]; then
        if command -v curl &> /dev/null; then
            if curl -f "$VERIFY_URL" &> /dev/null; then
                print_success "Verificación exitosa: $VERIFY_URL"
            else
                print_warning "Verificación falló: $VERIFY_URL"
            fi
        fi
    fi
}

# Script principal
main() {
    print_status "Iniciando proceso de despliegue..."
    
    # Validar código
    validate_code
    
    # Crear backup si es necesario
    if [ "$DEPLOYMENT_TYPE" != "local" ]; then
        create_backup
    fi
    
    # Crear build optimizado
    create_build
    
    # Desplegar
    deploy
    
    # Verificar despliegue
    verify_deployment
    
    print_success "🎉 Despliegue completado exitosamente!"
    
    # Información adicional
    echo ""
    print_status "Información del despliegue:"
    echo "  - Tipo: $DEPLOYMENT_TYPE"
    echo "  - Timestamp: $TIMESTAMP"
    echo "  - Build dir: $BUILD_DIR"
    
    if [ -n "$TARGET_SERVER" ]; then
        echo "  - Servidor: $TARGET_SERVER"
    fi
}

# Mostrar ayuda
show_help() {
    echo "Uso: $0 [TIPO_DESPLIEGUE] [SERVIDOR_DESTINO]"
    echo ""
    echo "Tipos de despliegue:"
    echo "  local          - Solo crear build local"
    echo "  docker         - Desplegar con Docker"
    echo "  server         - Desplegar en servidor remoto"
    echo "  netlify        - Desplegar en Netlify"
    echo "  github-pages   - Desplegar en GitHub Pages"
    echo ""
    echo "Ejemplos:"
    echo "  $0                                    # Build local"
    echo "  $0 docker                            # Docker local"
    echo "  $0 server user@servidor.com          # Servidor remoto"
    echo "  $0 netlify                           # Netlify"
    echo "  $0 github-pages                      # GitHub Pages"
}

# Manejar argumentos
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_help
    exit 0
fi

# Ejecutar script principal
main