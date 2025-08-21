/**
 * Forge3D Cotizador - Configuración con Branding Dinámico
 * Configuración centralizada de la aplicación con sistema de marca personalizable
 * Version: 2.1
 */

// Configuración de branding por defecto (GoldTech MX)
const DEFAULT_BRANDING = {
  company: {
    name: "GoldTech MX",
    slogan: "Soluciones de Impresión 3D",
    website: "https://goldtech.mx",
    email: "contacto@goldtech.mx",
    phone: "+52 477 123 4567",
    address: "León de los Aldama, Guanajuato, MX"
  },
  
  logos: {
    forge: {
      dark: "https://bio.goldtech.mx/forge3d_oscuro",
      light: "https://bio.goldtech.mx/forge3d_blanco"
    },
    company: {
      dark: "https://bio.goldtech.mx/logogoldtech",
      light: "https://gtt.mx/logo-goldtech.oscuro"
    }
  },
  
  colors: {
    primary: "#CD9430",
    secondary: "#e1aa4a",
    accent: "#B8851F",
    background: {
      dark: "#0e0e0e",
      light: "#fffff0"
    }
  },
  
  social: {
    tiktok: "https://tiktok.com/@goldtechmx",
    instagram: "https://instagram.com/goldtechmx",
    youtube: "https://youtube.com/@goldtechmx",
    linkedin: "https://linkedin.com/company/goldtechmx",
    facebook: "https://facebook.com/goldtechmx",
    whatsapp: "https://wa.me/524771234567"
  },
  
  customization: {
    showCompanyInfo: true,
    showSocialLinks: true,
    showBrandingFooter: true,
    allowThemeToggle: true,
    showForge3DLogo: true
  }
};

// Configuración administrativa centralizada
const APP_CONFIG = {
  version: '2.1',
  name: 'Cotizador Forge3D',
  
  // Branding dinámico (se carga desde localStorage o usa default)
  branding: DEFAULT_BRANDING,
  
  api: {
    timeout: 5000,
    retries: 3
  },
  
  // Configuración para GitHub deployment
  deployment: {
    repository: "https://github.com/goldtechmx/forge3d-cotizador",
    license: "MIT",
    attribution: {
      required: false,
      text: "Desarrollado con ❤️ por GoldTech MX",
      link: "https://goldtech.mx"
    }
  }
};

// Configuración por defecto del cotizador
const CONFIG_DEFAULT = {
  tarifaLuz: 2.8,
  tarifaHora: 28,
  porcentajeUtilidad: 18,
  desgasteMaquina: 12,
  desgasteCarrete: 8
};

// Constantes para conversión metros-gramos (Filamento 1.75mm)
const FILAMENT_CONSTANTS = {
  DIAMETRO_FILAMENTO: 1.75,
  get RADIO_FILAMENTO() {
    return this.DIAMETRO_FILAMENTO / 2;
  },
  get AREA_SECCION() {
    return Math.PI * Math.pow(this.RADIO_FILAMENTO, 2);
  },
  PESO_CARRETE_ESTANDAR: 1000
};

// Tipos de filamento predefinidos
const FILAMENT_TYPES = {
  'PLA': { density: 1.24, name: 'PLA (1.24 g/cm³)' },
  'PLA+': { density: 1.25, name: 'PLA+ (1.25 g/cm³)' },
  'PLA_CARBON': { density: 1.35, name: 'PLA Fibra de Carbono (1.35 g/cm³)' },
  'ABS': { density: 1.27, name: 'ABS (1.27 g/cm³)' },
  'PETG': { density: 1.23, name: 'PETG (1.23 g/cm³)' },
  'TPU': { density: 1.20, name: 'TPU Flexible (1.20 g/cm³)' },
  'ASA': { density: 1.44, name: 'ASA (1.44 g/cm³)' },
  'WOOD': { density: 1.15, name: 'WOOD (1.15 g/cm³)' }
};

// Modelos de impresoras 3D predefinidos
const PRINTER_MODELS = {
  'manual': { watts: 0, name: '🔧 Manual' },
  'k1c': { watts: 120, name: 'Creality K1C (120W) ⭐' },
  'k1_max': { watts: 350, name: 'Creality K1 Max (350W)' },
  'ender3_v2': { watts: 85, name: 'Creality Ender 3 V2 (85W)' },
  'ender3_s1': { watts: 110, name: 'Creality Ender 3 S1 (110W)' },
  'prusa_mk3s': { watts: 80, name: 'Prusa i3 MK3S+ (80W)' },
  'bambu_x1': { watts: 350, name: 'Bambu Lab X1 Carbon (350W)' },
  'bambu_a1': { watts: 250, name: 'Bambu Lab A1 mini (250W)' },
  'bambu_p1p': { watts: 300, name: 'Bambu Lab P1P (300W)' },
  'artillery_x2': { watts: 95, name: 'Artillery Sidewinder X2 (95W)' },
  'anycubic_kobra2': { watts: 140, name: 'Anycubic Kobra 2 (140W)' },
  'flashforge_creator': { watts: 160, name: 'FlashForge Creator Pro (160W)' },
  'raise3d_e2': { watts: 200, name: 'Raise3D E2 (200W)' },
  'qidi_xmax3': { watts: 270, name: 'Qidi Tech X-Max 3 (270W)' }
};

// Configuración de comisiones de marketplaces
const MARKETPLACE_COMMISSIONS = {
  'direct': { rate: 0, name: '🏪 Venta directa (0%)' },
  'paypal': { rate: 3.48, name: '💳 PayPal/Stripe (3% + IVA = 3.48%)' },
  'own_store': { rate: 5.8, name: '🛒 Tienda propia + PayPal (5% + IVA = 5.8%)' },
  'shopify': { rate: 9.28, name: '🌐 Shopify + procesamiento (8% + IVA = 9.28%)' },
  'amazon_mx': { rate: 13.92, name: '📦 Amazon México (12% + IVA = 13.92%)' },
  'ml_basic': { rate: 17.4, name: '🟡 MercadoLibre Básico (15% + IVA = 17.4%)' },
  'ml_ads': { rate: 20.88, name: '🟡 MercadoLibre + Publicidad (18% + IVA = 20.88%)' },
  'ml_full': { rate: 25.52, name: '🟡 MercadoLibre Full Service (22% + IVA = 25.52%)' },
  'ml_premium': { rate: 29, name: '🟡 MercadoLibre Premium (25% + IVA = 29%)' }
};

// Presets rápidos para tipos de proyectos
const PROJECT_PRESETS = {
  miniatura: {
    name: 'Llavero miniatura',
    hours: 1,
    minutes: 30,
    seconds: 0,
    material: 15,
    unit: 'gramos',
    cost: 450,
    extra: 5,
    description: '1.5h, 15g - Ideal para llaveros y figuritas'
  },
  decorativo: {
    name: 'Objeto decorativo',
    hours: 4,
    minutes: 0,
    seconds: 0,
    material: 50,
    unit: 'gramos',
    cost: 500,
    extra: 15,
    description: '4h, 50g - Perfecto para objetos ornamentales'
  },
  funcional: {
    name: 'Pieza funcional',
    hours: 8,
    minutes: 0,
    seconds: 0,
    material: 120,
    unit: 'gramos',
    cost: 550,
    extra: 25,
    description: '8h, 120g - Herramientas y piezas útiles'
  },
  prototipo: {
    name: 'Prototipo complejo',
    hours: 12,
    minutes: 30,
    seconds: 0,
    material: 200,
    unit: 'gramos',
    cost: 650,
    extra: 40,
    description: '12.5h, 200g - Proyectos complejos'
  }
};

// Configuración de tarifas eléctricas CFE México
const CFE_RATES = {
  basic: { rate: 1.083, name: 'CFE Básica', description: 'Tarifa doméstica básica' },
  intermediate: { rate: 1.315, name: 'CFE Intermedio', description: 'Tarifa doméstica intermedia' },
  high: { rate: 3.847, name: 'CFE Alto', description: 'Tarifa doméstica alta' }
};

// Configuración de rangos de precios
const PRICE_RANGES = {
  labor: {
    basic: 10,
    standard: 20,
    premium: 30
  },
  utility: {
    basic: 10,
    standard: 15,
    premium: 20
  },
  machine_wear: {
    basic: 8,
    standard: 12,
    industrial: 18
  },
  filament_wear: {
    low: 5,
    normal: 8,
    high: 12
  },
  waste: {
    minimum: 5,
    normal: 10,
    high: 15
  }
};

// Configuración de validación
const VALIDATION_RULES = {
  nameMinLength: 2,
  nameMaxLength: 100,
  quantityMin: 1,
  quantityMax: 9999,
  timeMaxHours: 999,
  timeMaxMinutes: 59,
  timeMaxSeconds: 59,
  materialMin: 0.1,
  materialMax: 10000,
  costsMin: 0,
  costsMax: 100000,
  densityMin: 0.5,
  densityMax: 3.0,
  wasteMin: 0,
  wasteMax: 50,
  commissionMin: 0,
  commissionMax: 50
};

// Mensajes de notificación
const NOTIFICATION_MESSAGES = {
  success: {
    pieceAdded: '✅ Pieza agregada',
    configSaved: '💾 Configuración guardada',
    configExported: '📤 Configuración exportada',
    configImported: '📥 Configuración importada',
    configRestored: '🔄 Configuración restaurada',
    pdfGenerated: '📄 PDF generado correctamente',
    welcome: '¡Bienvenido al Cotizador Forge3D! 🚀',
    brandingUpdated: '🎨 Branding actualizado',
    logoUploaded: '🖼️ Logo subido correctamente',
    brandingExported: '📤 Configuración de marca exportada',
    brandingImported: '📥 Configuración de marca importada'
  },
  error: {
    nameRequired: '❌ Por favor ingresa un nombre para la pieza',
    timeRequired: '❌ Por favor ingresa un tiempo de impresión válido',
    materialRequired: '❌ Por favor ingresa una cantidad válida de material',
    costRequired: '❌ Por favor ingresa el costo del carrete',
    printerRequired: '❌ Por favor selecciona una impresora o ingresa el consumo',
    noPiecesForPDF: '❌ No hay piezas para generar el PDF',
    configImportError: '❌ Error al importar configuración',
    pieceNotFound: '❌ Error: No se encontró la pieza',
    logoUploadError: '❌ Error al subir el logo',
    brandingImportError: '❌ Error al importar configuración de marca'
  },
  info: {
    configTip: '💡 Tip: Usa Ctrl+K para configuración avanzada',
    smartAlerts: '🧠 El sistema te alertará sobre piezas pequeñas fuera de mercado',
    editableTip: '✏️ Nuevo: Puedes editar cantidades directamente en la tabla',
    manualEntry: '⚙️ Ingresa el consumo manualmente',
    customPercent: '✏️ Ingresa tu porcentaje personalizado',
    quantityUpdated: '📊 Cantidad actualizada',
    pieceDeleted: '🗑️ Pieza eliminada',
    tableCleared: '🗑️ Tabla limpia',
    loadedForEdit: '✏️ Pieza cargada para edición',
    suggestionApplied: '🚀 Aplicado',
    brandingTip: '🎨 Personaliza tu marca en la pestaña de Branding'
  }
};

// Atajos de teclado
const KEYBOARD_SHORTCUTS = {
  'Ctrl+Enter': 'Agregar pieza',
  'Ctrl+L': 'Limpiar formulario',
  'Ctrl+P': 'Generar PDF',
  'Ctrl+T': 'Cambiar tema',
  'Ctrl+K': 'Abrir configuración',
  'Ctrl+B': 'Panel de branding',
  'Escape': 'Cerrar modales/sidebar'
};

// Configuración de performance
const PERFORMANCE_CONFIG = {
  debounceTime: 300,
  animationDuration: 300,
  notificationDuration: 3000,
  autoSaveInterval: 30000,
  maxHistoryEntries: 50
};

// Configuración de localStorage keys
const STORAGE_KEYS = {
  config: 'forge3d_config',
  theme: 'forge3d_theme',
  history: 'forge3d_history',
  preferences: 'forge3d_preferences',
  branding: 'forge3d_branding',
  customLogos: 'forge3d_custom_logos'
};

// URLs de recursos externos
const EXTERNAL_RESOURCES = {
  jsPDF: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  fontAwesome: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
};

// Configuración de SEO
const SEO_CONFIG = {
  title: 'Cotizador Forge3D - Calculadora Profesional de Precios para Impresión 3D',
  description: 'Herramienta profesional gratuita para calcular precios exactos de proyectos de impresión 3D.',
  keywords: 'cotizador impresión 3D México, calculadora precios 3D, Forge3D, GoldTech MX',
  canonical: 'https://gtt.mx/forge3d',
  ogImage: 'https://bio.goldtech.mx/forge3d_oscuro'
};

// Configuración de analytics
const ANALYTICS_CONFIG = {
  trackingId: null, // Se puede configurar más tarde
  events: {
    pieceAdded: 'piece_added',
    pdfGenerated: 'pdf_generated',
    configChanged: 'config_changed',
    presetUsed: 'preset_used',
    brandingChanged: 'branding_changed'
  }
};

// Configuración de desarrollo/producción
const ENV_CONFIG = {
  isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
  debugMode: false // Se puede activar dinámicamente
};

// Configuración de cache
const CACHE_CONFIG = {
  version: 'v2.1',
  staticAssets: [
    './assets/css/styles.css',
    './assets/js/app.js',
    './assets/js/config.js'
  ],
  cacheTimeout: 24 * 60 * 60 * 1000 // 24 horas
};

// === SISTEMA DE BRANDING DINÁMICO ===

const BrandingManager = {
  /**
   * Carga la configuración de branding desde localStorage
   */
  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.branding);
      if (saved) {
        const branding = JSON.parse(saved);
        APP_CONFIG.branding = { ...DEFAULT_BRANDING, ...branding };
        this.apply();
        return branding;
      }
    } catch (error) {
      console.warn('Error cargando branding:', error);
    }
    
    // Aplicar branding por defecto
    APP_CONFIG.branding = DEFAULT_BRANDING;
    this.apply();
    return DEFAULT_BRANDING;
  },

  /**
   * Guarda la configuración de branding
   */
  save(branding) {
    try {
      APP_CONFIG.branding = { ...APP_CONFIG.branding, ...branding };
      localStorage.setItem(STORAGE_KEYS.branding, JSON.stringify(APP_CONFIG.branding));
      this.apply();
      return true;
    } catch (error) {
      console.error('Error guardando branding:', error);
      return false;
    }
  },

  /**
   * Aplica la configuración de branding a la interfaz
   */
  apply() {
    const branding = APP_CONFIG.branding;
    
    // Actualizar variables CSS
    this.updateCSSVariables(branding.colors);
    
    // Actualizar logos
    this.updateLogos(branding.logos);
    
    // Actualizar información de empresa
    this.updateCompanyInfo(branding.company);
    
    // Actualizar redes sociales
    this.updateSocialLinks(branding.social);
    
    // Aplicar personalizaciones
    this.applyCustomizations(branding.customization);
  },

  /**
   * Actualiza las variables CSS con los colores de marca
   */
  updateCSSVariables(colors) {
    if (!colors) return;
    
    const root = document.documentElement;
    
    if (colors.primary) {
      root.style.setProperty('--accent-primary', colors.primary);
    }
    if (colors.secondary) {
      root.style.setProperty('--accent-secondary', colors.secondary);
    }
    if (colors.accent) {
      root.style.setProperty('--brand-accent', colors.accent);
    }
  },

  /**
   * Actualiza los logos en la interfaz
   */
  updateLogos(logos) {
    if (!logos) return;
    
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    // Logo Forge3D
    const forgeLogo = document.getElementById('forge-logo');
    if (forgeLogo && logos.forge) {
      forgeLogo.src = logos.forge[theme] || logos.forge.dark;
    }
    
    // Logo de empresa
    const companyLogo = document.getElementById('company-footer-logo');
    if (companyLogo && logos.company) {
      companyLogo.src = logos.company[theme] || logos.company.dark;
    }
  },

  /**
   * Actualiza la información de empresa
   */
  updateCompanyInfo(company) {
    if (!company) return;
    
    // Actualizar título
    const titleElements = document.querySelectorAll('.company-name');
    titleElements.forEach(el => {
      if (company.name) el.textContent = company.name;
    });
    
    // Actualizar enlaces
    const websiteLinks = document.querySelectorAll('.company-website');
    websiteLinks.forEach(el => {
      if (company.website) el.href = company.website;
    });
  },

  /**
   * Actualiza los enlaces de redes sociales
   */
  updateSocialLinks(social) {
    if (!social) return;
    
    Object.keys(social).forEach(platform => {
      const link = document.querySelector(`.social-icons .${platform}`);
      if (link && social[platform]) {
        link.href = social[platform];
      }
    });
  },

  /**
   * Aplica personalizaciones de interfaz
   */
  applyCustomizations(customization) {
    if (!customization) return;
    
    // Mostrar/ocultar elementos según configuración
    const elements = {
      '.company-info': customization.showCompanyInfo,
      '.social-icons': customization.showSocialLinks,
      '.branding-footer': customization.showBrandingFooter,
      '.theme-toggle': customization.allowThemeToggle,
      '#forge-logo': customization.showForge3DLogo
    };
    
    Object.keys(elements).forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.style.display = elements[selector] ? '' : 'none';
      }
    });
  },

  /**
   * Exporta la configuración de branding
   */
  export() {
    const branding = APP_CONFIG.branding;
    const dataStr = JSON.stringify(branding, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `forge3d_branding_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    return true;
  },

  /**
   * Importa configuración de branding
   */
  import(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const branding = JSON.parse(e.target.result);
          
          if (this.validateBranding(branding)) {
            this.save(branding);
            resolve(branding);
          } else {
            reject(new Error('Invalid branding configuration'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  },

  /**
   * Valida la configuración de branding
   */
  validateBranding(branding) {
    // Validaciones básicas
    if (typeof branding !== 'object') return false;
    
    // Validar estructura básica
    const requiredSections = ['company', 'logos', 'colors', 'social'];
    return requiredSections.every(section => 
      branding.hasOwnProperty(section) && typeof branding[section] === 'object'
    );
  },

  /**
   * Resetea el branding a valores por defecto
   */
  reset() {
    APP_CONFIG.branding = { ...DEFAULT_BRANDING };
    localStorage.setItem(STORAGE_KEYS.branding, JSON.stringify(DEFAULT_BRANDING));
    this.apply();
    return true;
  },

  /**
   * Obtiene la configuración actual de branding
   */
  getCurrent() {
    return APP_CONFIG.branding;
  }
};

// Utilidades de configuración
const ConfigUtils = {
  /**
   * Obtiene un valor de configuración anidado
   * @param {string} path - Ruta separada por puntos
   * @param {*} defaultValue - Valor por defecto
   * @returns {*} Valor de configuración
   */
  get(path, defaultValue = null) {
    const keys = path.split('.');
    let current = window;
    
    for (const key of keys) {
      if (current[key] === undefined) {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current;
  },

  /**
   * Valida que las configuraciones requeridas estén presentes
   * @returns {boolean} true si todas las configuraciones están presentes
   */
  validateConfig() {
    const required = [
      'APP_CONFIG.branding.company.name',
      'CONFIG_DEFAULT.tarifaLuz',
      'FILAMENT_CONSTANTS.DIAMETRO_FILAMENTO'
    ];

    for (const path of required) {
      if (this.get(path) === null) {
        console.error(`Configuración requerida faltante: ${path}`);
        return false;
      }
    }

    return true;
  },

  /**
   * Inicializa la configuración de la aplicación
   */
  initialize() {
    if (!this.validateConfig()) {
      throw new Error('Configuración de aplicación inválida');
    }

    // Cargar branding personalizado
    BrandingManager.load();

    // Configurar modo debug si es necesario
    if (ENV_CONFIG.isDevelopment) {
      ENV_CONFIG.debugMode = true;
      console.log('Forge3D Config initialized in development mode');
    }

    // Registrar configuración global
    window.ForgeConfig = {
      APP_CONFIG,
      CONFIG_DEFAULT,
      FILAMENT_CONSTANTS,
      FILAMENT_TYPES,
      PRINTER_MODELS,
      MARKETPLACE_COMMISSIONS,
      PROJECT_PRESETS,
      CFE_RATES,
      PRICE_RANGES,
      VALIDATION_RULES,
      NOTIFICATION_MESSAGES,
      KEYBOARD_SHORTCUTS,
      PERFORMANCE_CONFIG,
      STORAGE_KEYS,
      EXTERNAL_RESOURCES,
      SEO_CONFIG,
      ANALYTICS_CONFIG,
      ENV_CONFIG,
      CACHE_CONFIG,
      BrandingManager,
      DEFAULT_BRANDING
    };

    return true;
  }
};

// Auto-inicializar cuando se carga el script
if (typeof window !== 'undefined') {
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ConfigUtils.initialize();
    });
  } else {
    ConfigUtils.initialize();
  }
}

// Exportar para módulos si es necesario
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    APP_CONFIG,
    CONFIG_DEFAULT,
    FILAMENT_CONSTANTS,
    FILAMENT_TYPES,
    PRINTER_MODELS,
    MARKETPLACE_COMMISSIONS,
    PROJECT_PRESETS,
    CFE_RATES,
    PRICE_RANGES,
    VALIDATION_RULES,
    NOTIFICATION_MESSAGES,
    KEYBOARD_SHORTCUTS,
    PERFORMANCE_CONFIG,
    STORAGE_KEYS,
    EXTERNAL_RESOURCES,
    SEO_CONFIG,
    ANALYTICS_CONFIG,
    ENV_CONFIG,
    CACHE_CONFIG,
    BrandingManager,
    DEFAULT_BRANDING,
    ConfigUtils
  };
}