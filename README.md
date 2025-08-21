# Cotizador Forge3D - GoldTech MX

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/goldtechmx/forge3d)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Production-brightgreen.svg)]()

## 📝 Descripción

**Cotizador Forge3D** es una herramienta profesional y gratuita para calcular precios exactos de proyectos de impresión 3D. Incluye cálculos automáticos de costos de material, tiempo de impresión, electricidad, desgaste de máquina y más.

### ✨ Características Principales

- 🧮 **Cálculo automático** de costos de material PLA, ABS, PETG, TPU y más
- ⏱️ **Estimación precisa** de tiempo y costos de impresión
- ⚡ **Cálculo de consumo eléctrico** por modelo de impresora
- 💰 **Gestión de comisiones** de marketplaces (MercadoLibre, Amazon, etc.)
- 📄 **Generación de PDF** profesional para cotizaciones
- 🎨 **Tema claro/oscuro** con diseño responsive
- ⚙️ **Configuración avanzada** personalizable
- 🚀 **Presets rápidos** para tipos de proyectos comunes

## 🚀 Instalación

### Requisitos

- Servidor web (Apache/Nginx)
- PHP 7.4+ (opcional, solo para funciones avanzadas)
- Navegador moderno con soporte para ES6+

### Instalación Básica

1. **Descarga los archivos:**
   ```bash
   git clone https://github.com/goldtechmx/forge3d-cotizador.git
   cd forge3d-cotizador
   ```

2. **Configura el servidor web:**
   - Copia todos los archivos a tu directorio web
   - Asegúrate de que `.htaccess` esté habilitado (Apache)
   - Configura SSL si planeas usar HTTPS

3. **Configuración inicial:**
   - Edita `assets/js/config.js` para personalizar tu información
   - Modifica los logos y branding según tus necesidades
   - Ajusta las tarifas eléctricas por defecto para tu región

### Estructura de Archivos

```
forge3d-cotizador/
├── index.html                 # Página principal
├── manifest.json             # Configuración PWA
├── sw.js                     # Service Worker offline
├── .htaccess                 # Optimizaciones del servidor
├── README.md                 # Esta documentación
├── assets/
│   ├── css/
│   │   └── styles.css        # Estilos optimizados
│   ├── js/
│   │   ├── config.js         # Configuración de la app
│   │   └── app.js           # Lógica principal
│   └── images/              # Iconos y screenshots
├── docs/                    # Documentación adicional
└── tests/                   # Pruebas automatizadas
```

## 🎯 Uso

### Inicio Rápido

1. **Abrir la aplicación** en tu navegador
2. **Completar el formulario:**
   - Nombre de la pieza
   - Tiempo de impresión (horas:minutos:segundos)
   - Cantidad de material (metros o gramos)
   - Tipo de filamento
   - Modelo de impresora
   - Costo del carrete

3. **Hacer clic en "Agregar pieza"**
4. **Generar PDF** de la cotización

### Configuración Avanzada

Accede al panel de configuración con el botón flotante o presionando `Ctrl+K`:

- **Tarifa eléctrica:** Costo por kWh en tu región
- **Tarifa por hora:** Valor de tu trabajo por hora
- **Porcentaje de utilidad:** Margen de ganancia
- **Desgaste de máquina:** Costo de mantenimiento por hora
- **Desgaste de carrete:** Costo adicional por material usado

### Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+Enter` | Agregar pieza |
| `Ctrl+L` | Limpiar formulario |
| `Ctrl+P` | Generar PDF |
| `Ctrl+T` | Cambiar tema |
| `Ctrl+K` | Abrir configuración |
| `Escape` | Cerrar modales |

## 🔧 Personalización

### Modificar Branding

1. **Actualizar logos:**
   ```javascript
   // En config.js
   const APP_CONFIG = {
     logos: {
       forge: {
         dark: "tu-logo-oscuro.png",
         light: "tu-logo-claro.png"
       }
     }
   }
   ```

2. **Cambiar información de empresa:**
   ```javascript
   company: {
     name: "Tu Empresa",
     website: "https://tuempresa.com",
     description: "Tu descripción"
   }
   ```

### Agregar Nuevos Filamentos

```javascript
// En config.js, agregar a FILAMENT_TYPES
'TU_FILAMENTO': { 
  density: 1.30, 
  name: 'Tu Filamento (1.30 g/cm³)' 
}
```

### Personalizar Colores

Modifica las variables CSS en `assets/css/styles.css`:

```css
:root {
  --accent-primary: #tu-color-principal;
  --accent-secondary: #tu-color-secundario;
}
```

## 📱 PWA (Progressive Web App)

La aplicación está configurada como PWA y puede:

- **Instalarse** en dispositivos móviles y escritorio
- **Funcionar offline** con cache de archivos estáticos
- **Recibir actualizaciones** automáticas
- **Acceder** desde la pantalla de inicio

### Configurar PWA

1. Asegúrate de que `manifest.json` esté enlazado en `index.html`
2. Configura HTTPS para funcionalidad completa
3. Personaliza iconos y screenshots en el manifest

## 🎨 Temas y Estilos

### Modo Claro/Oscuro

El sistema detecta automáticamente la preferencia del usuario y permite cambio manual.

### Responsive Design

- **Desktop:** Layout completo con sidebar
- **Tablet:** Diseño adaptado con navigation optimizada
- **Mobile:** Interface simplificada y touch-friendly

## 📊 Analytics y Seguimiento

Para habilitar analytics, configura en `config.js`:

```javascript
const ANALYTICS_CONFIG = {
  trackingId: 'TU-TRACKING-ID',
  events: {
    pieceAdded: 'piece_added',
    pdfGenerated: 'pdf_generated'
  }
};
```

## 🔒 Seguridad

### Configuración Incluida

- **Content Security Policy** configurado
- **Headers de seguridad** implementados
- **Validación de entrada** en cliente y servidor
- **Protección contra XSS** y CSRF

### Recomendaciones

1. **Usar HTTPS** en producción
2. **Actualizar dependencias** regularmente
3. **Configurar backups** automáticos
4. **Monitorear logs** de seguridad

## 🚀 Optimización de Rendimiento

### Características Implementadas

- **Compresión GZIP** habilitada
- **Cache headers** optimizados
- **Lazy loading** de imágenes
- **Minificación** de CSS/JS
- **Debouncing** en inputs
- **Virtual scrolling** para listas grandes

### Métricas Objetivo

- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **TTI (Time to Interactive):** < 3.5s

## 🧪 Testing

### Pruebas Manuales

1. **Funcionalidad básica:**
   - Agregar/editar/eliminar piezas
   - Cálculos de precios
   - Generación de PDF

2. **Responsive design:**
   - Diferentes tamaños de pantalla
   - Orientación portrait/landscape

3. **Compatibilidad:**
   - Chrome, Firefox, Safari, Edge
   - iOS y Android

### Automatización

```bash
# Ejecutar pruebas (si están configuradas)
npm test

# Validar HTML
w3c-validator index.html

# Auditoría de rendimiento
lighthouse index.html
```

## 📈 Monitoreo

### Métricas Importantes

- **Tiempo de carga** de la página
- **Errores JavaScript** en consola
- **Uso de memoria** del navegador
- **Conversión** de visitantes a usuarios

### Herramientas Recomendadas

- Google Analytics 4
- Google Search Console
- GTmetrix
- Pingdom

## 🤝 Contribución

### Cómo Contribuir

1. **Fork** el repositorio
2. **Crear** una rama para tu feature
3. **Hacer commit** de los cambios
4. **Push** a la rama
5. **Crear** un Pull Request

### Estándares de Código

- **JavaScript:** ES6+ con JSDoc
- **CSS:** Metodología BEM
- **HTML:** Semántico y accesible
- **Commits:** Conventional Commits

## 📞 Soporte

### Canales de Soporte

- **Email:** soporte@goldtech.mx
- **WhatsApp:** +52 477 123 4567
- **Discord:** [GoldTech Community](https://discord.gg/goldtech)
- **GitHub Issues:** Para reportar bugs

### FAQ

**P: ¿Puedo usar esto comercialmente?**  
R: Sí, bajo la licencia MIT puedes usar, modificar y distribuir comercialmente.

**P: ¿Funciona offline?**  
R: Sí, como PWA puede funcionar sin conexión una vez cargada.

**P: ¿Puedo personalizar los cálculos?**  
R: Completamente, todos los factores son configurables en el panel de configuración.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🔄 Changelog

### Version 2.1.0 (Actual)
- ✨ Separación modular de archivos
- 🎨 Mejoras en UI/UX
- 🚀 Optimizaciones de rendimiento
- 📱 PWA completamente funcional
- 🔧 Sistema de configuración mejorado

### Version 2.0.0
- 🔄 Reescritura completa
- 📊 Cálculos más precisos
- 🎨 Nuevo diseño responsive
- ⚙️ Panel de configuración avanzado

### Version 1.0.0
- 🎉 Lanzamiento inicial
- 🧮 Cálculos básicos
- 📄 Generación de PDF

## 🙏 Agradecimientos

- **GoldTech MX** - Desarrollo y mantenimiento
- **Comunidad 3D** - Feedback y sugerencias
- **Contributors** - Mejoras y reportes de bugs

---

**Desarrollado con ❤️ por [GoldTech MX](https://goldtech.mx)**

*¿Te gusta el proyecto? ¡Dale una ⭐ en GitHub!*