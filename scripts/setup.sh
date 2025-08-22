#!/bin/bash

# ================================
# Forge3D Cotizador - Setup Script
# ================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
echo "🚀 Forge3D Cotizador Setup"
echo "================================"
echo ""

# Verificar requisitos
print_status "Verificando requisitos del sistema..."

# Verificar Git
if ! command -v git &> /dev/null; then
    print_error "Git no está instalado. Por favor instala Git primero."
    exit 1
fi

# Verificar Node.js (opcional para herramientas de desarrollo)
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js encontrado: $NODE_VERSION"
else
    print_warning "Node.js no encontrado. Será necesario para herramientas de desarrollo."
fi

# Verificar Docker (opcional)
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_success "Docker encontrado: $DOCKER_VERSION"
else
    print_warning "Docker no encontrado. Será necesario para containerización."
fi

# Crear directorios necesarios
print_status "Creando estructura de directorios..."

mkdir -p logs
mkdir -p config
mkdir -p backups
mkdir -p uploads

print_success "Directorios creados correctamente"

# Copiar archivo de configuración de ejemplo
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        print_status "Copiando archivo de configuración de ejemplo..."
        cp .env.example .env
        print_success "Archivo .env creado desde .env.example"
        print_warning "¡IMPORTANTE! Edita el archivo .env con tu configuración específica"
    else
        print_warning "Archivo .env.example no encontrado"
    fi
else
    print_status "Archivo .env ya existe, saltando..."
fi

# Configurar permisos
print_status "Configurando permisos..."

chmod +x scripts/*.sh
chmod 755 assets/
chmod 755 assets/css/
chmod 755 assets/js/
chmod 755 assets/images/

print_success "Permisos configurados correctamente"

# Instalar herramientas de desarrollo (si Node.js está disponible)
if command -v npm &> /dev/null; then
    print_status "¿Deseas instalar herramientas de desarrollo? (y/n)"
    read -r INSTALL_DEV_TOOLS
    
    if [[ $INSTALL_DEV_TOOLS =~ ^[Yy]$ ]]; then
        print_status "Instalando herramientas de desarrollo..."
        
        npm install -g live-server html-validate stylelint eslint clean-css-cli terser html-minifier-terser
        
        print_success "Herramientas de desarrollo instaladas"
        print_status "Comandos disponibles:"
        echo "  - live-server: Servidor de desarrollo"
        echo "  - html-validate: Validar HTML"
        echo "  - stylelint: Linter para CSS"
        echo "  - eslint: Linter para JavaScript"
    fi
fi

# Configurar Git hooks (opcional)
if [ -d .git ]; then
    print_status "¿Deseas configurar Git hooks para validación automática? (y/n)"
    read -r SETUP_GIT_HOOKS
    
    if [[ $SETUP_GIT_HOOKS =~ ^[Yy]$ ]]; then
        print_status "Configurando Git hooks..."
        
        # Pre-commit hook
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Ejecutando validaciones pre-commit..."

# Validar HTML
if command -v html-validate &> /dev/null; then
    html-validate index.html || exit 1
fi

# Validar CSS
if command -v stylelint &> /dev/null; then
    stylelint "assets/css/*.css" || exit 1
fi

# Validar JavaScript
if command -v eslint &> /dev/null; then
    eslint "assets/js/*.js" || exit 1
fi

echo "✅ Todas las validaciones pasaron"
EOF
        
        chmod +x .git/hooks/pre-commit
        print_success "Git hooks configurados"
    fi
fi

# Configurar Docker (si está disponible)
if command -v docker &> /dev/null; then
    print_status "¿Deseas construir la imagen Docker? (y/n)"
    read -r BUILD_DOCKER
    
    if [[ $BUILD_DOCKER =~ ^[Yy]$ ]]; then
        print_status "Construyendo imagen Docker..."
        docker build -t forge3d-cotizador .
        print_success "Imagen Docker construida: forge3d-cotizador"
        
        print_status "Para ejecutar el contenedor:"
        echo "  docker run -p 8080:8080 forge3d-cotizador"
        echo "  O usar: docker-compose up"
    fi
fi

# Verificar configuración final
print_status "Verificando configuración final..."

# Verificar archivos críticos
CRITICAL_FILES=("index.html" "assets/css/styles.css" "assets/js/app.js" "assets/js/config.js" "manifest.json" "sw.js")

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file"
    else
        print_error "✗ $file - FALTANTE"
    fi
done

echo ""
echo "================================"
print_success "🎉 Setup completado exitosamente!"
echo "================================"
echo ""

print_status "Próximos pasos:"
echo "1. Edita el archivo .env con tu configuración"
echo "2. Personaliza el branding desde la interfaz web"
echo "3. Inicia un servidor web o usa Docker"
echo ""

print_status "Comandos útiles:"
echo "  - Servidor de desarrollo: live-server --port=3000"
echo "  - Docker: docker-compose up"
echo "  - Validar código: ./scripts/validate.sh"
echo ""

print_status "Documentación:"
echo "  - README.md: Información general"
echo "  - CONTRIBUTING.md: Guía para contribuir"
echo "  - PROJECT_STRUCTURE.md: Estructura del proyecto"
echo ""

print_success "¡Forge3D Cotizador está listo para usar! 🚀"
