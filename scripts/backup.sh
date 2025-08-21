#!/bin/bash

# ================================
# Forge3D Cotizador - Backup Script
# ================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=30

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
echo "💾 Forge3D Cotizador Backup"
echo "================================"
echo ""

# Crear directorio de backups si no existe
mkdir -p "$BACKUP_DIR"

# Función para crear backup completo
create_full_backup() {
    print_status "Creando backup completo..."
    
    BACKUP_FILE="$BACKUP_DIR/forge3d_full_backup_$TIMESTAMP.tar.gz"
    
    # Archivos a incluir en el backup
    INCLUDE_FILES=(
        "index.html"
        "manifest.json"
        "sw.js"
        ".htaccess"
        "assets/"
        "docker/"
        "docs/"
        "scripts/"
        "README.md"
        "CONTRIBUTING.md"
        "LICENSE"
        "PROJECT_STRUCTURE.md"
        "docker-compose.yml"
        "Dockerfile"
        ".env.example"
    )
    
    # Archivos a excluir
    EXCLUDE_PATTERNS=(
        "node_modules"
        ".git"
        "logs/*"
        "backups/*"
        "dist/*"
        "*.log"
        ".env"
        "uploads/*"
    )
    
    # Construir comando tar
    TAR_CMD="tar -czf $BACKUP_FILE"
    
    # Agregar exclusiones
    for pattern in "${EXCLUDE_PATTERNS[@]}"; do
        TAR_CMD="$TAR_CMD --exclude=$pattern"
    done
    
    # Agregar archivos a incluir
    for file in "${INCLUDE_FILES[@]}"; do
        if [ -e "$file" ]; then
            TAR_CMD="$TAR_CMD $file"
        fi
    done
    
    # Ejecutar backup
    eval "$TAR_CMD"
    
    if [ -f "$BACKUP_FILE" ]; then
        BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
        print_success "Backup completo creado: $BACKUP_FILE ($BACKUP_SIZE)"
    else
        print_error "Error al crear backup completo"
        exit 1
    fi
}

# Función para crear backup de configuración
create_config_backup() {
    print_status "Creando backup de configuración..."
    
    CONFIG_BACKUP_FILE="$BACKUP_DIR/forge3d_config_backup_$TIMESTAMP.tar.gz"
    
    # Archivos de configuración
    CONFIG_FILES=(
        ".env"
        "config/"
        "docker-compose.yml"
        "docker/nginx.conf"
        "docker/default.conf"
    )
    
    TAR_CMD="tar -czf $CONFIG_BACKUP_FILE"
    
    for file in "${CONFIG_FILES[@]}"; do
        if [ -e "$file" ]; then
            TAR_CMD="$TAR_CMD $file"
        fi
    done
    
    eval "$TAR_CMD" 2>/dev/null || {
        print_warning "Algunos archivos de configuración no existen"
    }
    
    if [ -f "$CONFIG_BACKUP_FILE" ]; then
        CONFIG_SIZE=$(du -h "$CONFIG_BACKUP_FILE" | cut -f1)
        print_success "Backup de configuración creado: $CONFIG_BACKUP_FILE ($CONFIG_SIZE)"
    fi
}

# Función para crear backup de datos de usuario
create_user_data_backup() {
    print_status "Creando backup de datos de usuario..."
    
    USER_DATA_BACKUP_FILE="$BACKUP_DIR/forge3d_userdata_backup_$TIMESTAMP.tar.gz"
    
    # Directorios de datos de usuario
    USER_DATA_DIRS=(
        "uploads/"
        "user-data/"
        "storage/"
        "logs/"
    )
    
    TAR_CMD="tar -czf $USER_DATA_BACKUP_FILE"
    FOUND_DATA=false
    
    for dir in "${USER_DATA_DIRS[@]}"; do
        if [ -d "$dir" ] && [ "$(ls -A "$dir" 2>/dev/null)" ]; then
            TAR_CMD="$TAR_CMD $dir"
            FOUND_DATA=true
        fi
    done
    
    if [ "$FOUND_DATA" = true ]; then
        eval "$TAR_CMD"
        
        if [ -f "$USER_DATA_BACKUP_FILE" ]; then
            USER_DATA_SIZE=$(du -h "$USER_DATA_BACKUP_FILE" | cut -f1)
            print_success "Backup de datos de usuario creado: $USER_DATA_BACKUP_FILE ($USER_DATA_SIZE)"
        fi
    else
        print_status "No se encontraron datos de usuario para respaldar"
    fi
}

# Función para crear backup de Docker
create_docker_backup() {
    if command -v docker &> /dev/null; then
        print_status "Creando backup de Docker..."
        
        DOCKER_BACKUP_FILE="$BACKUP_DIR/forge3d_docker_backup_$TIMESTAMP.tar.gz"
        
        # Guardar configuración de contenedores
        docker-compose config > "$BACKUP_DIR/docker-compose_$TIMESTAMP.yml" 2>/dev/null || true
        
        # Crear backup de volúmenes Docker si existen
        if docker volume ls | grep -q forge3d; then
            docker run --rm -v forge3d_data:/data -v "$PWD/$BACKUP_DIR":/backup \
                alpine tar -czf "/backup/docker_volumes_$TIMESTAMP.tar.gz" -C /data . 2>/dev/null || true
        fi
        
        # Comprimir archivos Docker
        tar -czf "$DOCKER_BACKUP_FILE" \
            docker-compose.yml \
            Dockerfile \
            docker/ \
            "$BACKUP_DIR/docker-compose_$TIMESTAMP.yml" 2>/dev/null || true
        
        if [ -f "$DOCKER_BACKUP_FILE" ]; then
            DOCKER_SIZE=$(du -h "$DOCKER_BACKUP_FILE" | cut -f1)
            print_success "Backup de Docker creado: $DOCKER_BACKUP_FILE ($DOCKER_SIZE)"
        fi
        
        # Limpiar archivos temporales
        rm -f "$BACKUP_DIR/docker-compose_$TIMESTAMP.yml"
    else
        print_status "Docker no encontrado, saltando backup de Docker"
    fi
}

# Función para limpiar backups antiguos
cleanup_old_backups() {
    print_status "Limpiando backups antiguos (mayores a $RETENTION_DAYS días)..."
    
    if [ -d "$BACKUP_DIR" ]; then
        DELETED_COUNT=0
        
        # Buscar y eliminar archivos antiguos
        while IFS= read -r -d '' file; do
            rm "$file"
            ((DELETED_COUNT++))
            print_status "Eliminado: $(basename "$file")"
        done < <(find "$BACKUP_DIR" -name "*.tar.gz" -type f -mtime +$RETENTION_DAYS -print0 2>/dev/null)
        
        if [ $DELETED_COUNT -gt 0 ]; then
            print_success "Se eliminaron $DELETED_COUNT backups antiguos"
        else
            print_status "No se encontraron backups antiguos para eliminar"
        fi
    fi
}

# Función para listar backups existentes
list_backups() {
    print_status "Backups existentes:"
    echo ""
    
    if [ -d "$BACKUP_DIR" ] && [ "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
        # Mostrar backups ordenados por fecha
        ls -lt "$BACKUP_DIR"/*.tar.gz 2>/dev/null | while read -r line; do
            echo "  $line"
        done
        
        echo ""
        TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
        print_status "Tamaño total de backups: $TOTAL_SIZE"
    else
        print_status "No se encontraron backups existentes"
    fi
}

# Función para restaurar backup
restore_backup() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        print_error "Especifica el archivo de backup a restaurar"
        return 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        print_error "Archivo de backup no encontrado: $backup_file"
        return 1
    fi
    
    print_warning "¡ATENCIÓN! Esta operación sobrescribirá archivos existentes"
    print_status "¿Continuar con la restauración? (y/N)"
    read -r CONFIRM
    
    if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
        print_status "Restauración cancelada"
        return 0
    fi
    
    print_status "Restaurando desde: $backup_file"
    
    # Crear backup de seguridad antes de restaurar
    SAFETY_BACKUP="$BACKUP_DIR/safety_backup_before_restore_$TIMESTAMP.tar.gz"
    tar -czf "$SAFETY_BACKUP" . --exclude="$BACKUP_DIR" 2>/dev/null || true
    print_status "Backup de seguridad creado: $SAFETY_BACKUP"
    
    # Restaurar
    tar -xzf "$backup_file" || {
        print_error "Error al restaurar backup"
        return 1
    }
    
    print_success "Backup restaurado exitosamente"
}

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [COMANDO] [OPCIONES]"
    echo ""
    echo "Comandos:"
    echo "  full              - Crear backup completo (por defecto)"
    echo "  config            - Backup solo de configuración"
    echo "  userdata          - Backup solo de datos de usuario"
    echo "  docker            - Backup solo de configuración Docker"
    echo "  cleanup           - Limpiar backups antiguos"
    echo "  list              - Listar backups existentes"
    echo "  restore [archivo] - Restaurar desde backup"
    echo ""
    echo "Ejemplos:"
    echo "  $0                                    # Backup completo"
    echo "  $0 config                            # Solo configuración"
    echo "  $0 list                              # Listar backups"
    echo "  $0 restore backups/backup.tar.gz     # Restaurar backup"
    echo "  $0 cleanup                           # Limpiar antiguos"
}

# Script principal
main() {
    local command="${1:-full}"
    
    case $command in
        "full")
            create_full_backup
            create_config_backup
            create_user_data_backup
            create_docker_backup
            cleanup_old_backups
            ;;
        "config")
            create_config_backup
            ;;
        "userdata")
            create_user_data_backup
            ;;
        "docker")
            create_docker_backup
            ;;
        "cleanup")
            cleanup_old_backups
            ;;
        "list")
            list_backups
            ;;
        "restore")
            restore_backup "$2"
            ;;
        "--help"|"-h")
            show_help
            ;;
        *)
            print_error "Comando no reconocido: $command"
            show_help
            exit 1
            ;;
    esac
}

# Verificar que estamos en el directorio correcto
if [ ! -f "index.html" ]; then
    print_error "No se encontró index.html. Ejecuta este script desde el directorio raíz del proyecto."
    exit 1
fi

# Ejecutar script principal
main "$@"

print_success "🎉 Operación de backup completada!"