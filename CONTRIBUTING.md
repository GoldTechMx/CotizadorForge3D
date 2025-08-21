# 🤝 Contribuir a Forge3D Cotizador

¡Gracias por tu interés en contribuir a Forge3D! Este documento te guiará a través del proceso de contribución.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Formas de Contribuir](#formas-de-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Envío de Pull Requests](#envío-de-pull-requests)
- [Reportar Bugs](#reportar-bugs)
- [Solicitar Características](#solicitar-características)

## 📜 Código de Conducta

Este proyecto sigue el [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). Al participar, se espera que mantengas este código. Reporta comportamientos inaceptables a [soporte@goldtech.mx](mailto:soporte@goldtech.mx).

## 🎯 Formas de Contribuir

### 🐛 Reportar Bugs
- Busca issues existentes antes de crear uno nuevo
- Usa el template de bug report
- Incluye pasos claros para reproducir
- Agrega screenshots si es relevante

### ✨ Solicitar Características
- Verifica si la característica ya está solicitada
- Usa el template de feature request
- Explica el caso de uso y beneficios
- Considera alternativas

### 💻 Contribuir Código
- Correcciones de bugs
- Nuevas características
- Mejoras de rendimiento
- Optimizaciones de UI/UX
- Actualizaciones de documentación

### 📚 Mejorar Documentación
- Corregir errores de ortografía/gramática
- Clarificar instrucciones confusas
- Agregar ejemplos
- Traducir a otros idiomas

### 🧪 Testing
- Escribir nuevos tests
- Mejorar cobertura de tests
- Reportar tests que fallan
- Optimizar tests existentes

## ⚙️ Configuración del Entorno

### Requisitos Previos
```bash
# Node.js 18+ (para herramientas de desarrollo)
node --version

# Git
git --version

# Docker (opcional)
docker --version
```

### Configuración Local
```bash
# 1. Fork el repositorio en GitHub
# 2. Clona tu fork
git clone https://github.com/TU-USUARIO/forge3d-cotizador.git
cd forge3d-cotizador

# 3. Configura upstream
git remote add upstream https://github.com/goldtechmx/forge3d-cotizador.git

# 4. Instala herramientas de desarrollo
npm install -g live-server eslint stylelint html-validate

# 5. Inicia servidor de desarrollo
live-server --port=3000
```

### Configuración con Docker
```bash
# Construcción local
docker build -t forge3d-local .

# Ejecutar
docker run -p 8080:8080 forge3d-local

# Con docker-compose
docker-compose up -d
```

## 🔄 Proceso de Desarrollo

### 1. Crear una Rama
```bash
# Actualiza tu fork
git checkout main
git pull upstream main

# Crea una nueva rama
git checkout -b feature/nombre-caracteristica
# o
git checkout -b fix/descripcion-bug
# o
git checkout -b docs/mejora-documentacion
```

### 2. Hacer Cambios
- Mantén commits pequeños y focalizados
- Escribe mensajes de commit descriptivos
- Sigue las convenciones de código
- Agrega tests cuando sea apropiado

### 3. Probar Cambios
```bash
# Validar HTML
html-validate index.html

# Lint CSS
stylelint "assets/css/*.css"

# Lint JavaScript
eslint "assets/js/*.js"

# Pruebas manuales
# - Funcionalidad básica
# - Responsive design
# - Diferentes navegadores
```

### 4. Commit y Push
```bash
# Commit usando conventional commits
git add .
git commit -m "feat: agregar sistema de notificaciones push"

# Push a tu fork
git push origin feature/nombre-caracteristica
```

## 📏 Estándares de Código

### JavaScript
```javascript
// ✅ Bueno
const calculatePrice = (material, time, settings) => {
  if (!material || !time) {
    throw new Error('Material y tiempo son requeridos');
  }
  
  return {
    base: material.cost * time,
    total: applySettings(material.cost * time, settings)
  };
};

// ❌ Malo
function calc(m,t,s){return m*t+s}
```

### CSS
```css
/* ✅ Bueno - Metodología BEM */
.calculator-form__input {
  padding: 0.8rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  transition: border-color var(--transition-normal);
}

.calculator-form__input--error {
  border-color: var(--error-color);
}

/* ❌ Malo */
.input{padding:10px;border:1px solid red}
```

### HTML
```html
<!-- ✅ Bueno - Semántico y accesible -->
<form class="calculator-form" role="form" aria-labelledby="form-title">
  <h2 id="form-title">Datos de la Pieza</h2>
  <label for="piece-name">
    Nombre de la pieza
    <span aria-hidden="true">*</span>
  </label>
  <input 
    id="piece-name" 
    type="text" 
    required 
    aria-describedby="piece-name-help"
  />
  <div id="piece-name-help" class="help-text">
    Nombre descriptivo para identificar la pieza
  </div>
</form>

<!-- ❌ Malo -->
<div>
  <div>Name</div>
  <input type="text" />
</div>
```

### Commits Convencionales
```bash
# Tipos permitidos:
feat:     # Nueva característica
fix:      # Corrección de bug
docs:     # Solo documentación
style:    # Cambios que no afectan significado (espacios, formato, etc.)
refactor: # Cambio de código que no es feature ni fix
perf:     # Cambio que mejora rendimiento
test:     # Agregar tests faltantes
chore:    # Cambios en proceso de build o herramientas auxiliares

# Ejemplos:
git commit -m "feat: agregar soporte para nuevos tipos de filamento"
git commit -m "fix: corregir cálculo de desperdicio en materiales TPU"
git commit -m "docs: actualizar guía de instalación con Docker"
git commit -m "style: aplicar formato consistente a archivos CSS"
git commit -m "perf: optimizar carga de configuración de branding"
```

## 📝 Envío de Pull Requests

### Antes de Enviar
- [ ] Los tests pasan localmente
- [ ] El código sigue los estándares establecidos
- [ ] La documentación está actualizada
- [ ] Los commits siguen conventional commits
- [ ] Se probó en múltiples navegadores

### Template de PR
```markdown
## 📋 Descripción
Breve descripción de los cambios realizados.

## 🎯 Tipo de Cambio
- [ ] Bug fix (cambio que corrige un issue)
- [ ] Nueva característica (cambio que agrega funcionalidad)
- [ ] Breaking change (fix o feature que causa incompatibilidad)
- [ ] Actualización de documentación

## 🧪 Cómo se Probó
Describe las pruebas realizadas para verificar los cambios.

## 📷 Screenshots (si aplica)
Agrega screenshots para cambios de UI.

## ✅ Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado auto-review de mi código
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevos warnings
- [ ] He agregado tests que prueban mi fix/feature
- [ ] Los tests nuevos y existentes pasan localmente
```

## 🐛 Reportar Bugs

### Template de Bug Report
```markdown
**Describe el bug**
Una descripción clara y concisa del problema.

**Para Reproducir**
Pasos para reproducir el comportamiento:
1. Ve a '...'
2. Haz clic en '....'
3. Desplázate hacia '....'
4. Ve el error

**Comportamiento Esperado**
Descripción clara de lo que esperabas que pasara.

**Screenshots**
Si aplica, agrega screenshots para explicar el problema.

**Información del Sistema:**
 - OS: [ej. iOS]
 - Navegador [ej. chrome, safari]
 - Versión [ej. 22]
 - Dispositivo [ej. iPhone X, Desktop]

**Contexto Adicional**
Cualquier otra información relevante sobre el problema.
```

## ✨ Solicitar Características

### Template de Feature Request
```markdown
**¿Tu solicitud está relacionada con un problema?**
Descripción clara del problema. Ej: Me frustra cuando [...]

**Describe la solución que te gustaría**
Descripción clara de lo que quieres que pase.

**Describe alternativas consideradas**
Descripción de soluciones alternativas que consideraste.

**Casos de Uso**
Explica cómo esta característica sería útil para otros usuarios.

**Contexto adicional**
Cualquier otra información sobre la solicitud.
```

## 🏷️ Proceso de Review

### Para Reviewers
- [ ] El código es legible y mantenible
- [ ] La funcionalidad es correcta
- [ ] Los tests son adecuados
- [ ] La documentación está actualizada
- [ ] No hay problemas de rendimiento
- [ ] Es compatible con navegadores soportados

### Para Contributors
- Responde a comentarios de manera constructiva
- Realiza cambios solicitados promptamente
- Pregunta si algo no está claro
- Mantén la rama actualizada con main

## 🎉 Reconocimiento

Los contribuidores serán reconocidos en:
- [Contributors.md](CONTRIBUTORS.md)
- Release notes
- README principal
- Página de créditos en la aplicación

## 📞 Obtener Ayuda

### Canales de Comunicación
- **GitHub Discussions:** Para preguntas generales
- **GitHub Issues:** Para bugs y features específicos
- **Discord:** [GoldTech Community](https://discord.gg/goldtech)
- **Email:** [soporte@goldtech.mx](mailto:soporte@goldtech.mx)

### Documentación Adicional
- [README.md](README.md) - Información general del proyecto
- [API Documentation](docs/API.md) - Documentación de la API
- [Architecture Guide](docs/ARCHITECTURE.md) - Guía de arquitectura
- [Deployment Guide](docs/DEPLOYMENT.md) - Guía de despliegue

---

## 🙏 ¡Gracias por Contribuir!

Tu tiempo y esfuerzo para mejorar Forge3D es muy valorado. Cada contribución, sin importar su tamaño, hace que el proyecto sea mejor para toda la comunidad.

**¡Esperamos tu contribución! 🚀**