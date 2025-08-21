/**
 * Forge3D Cotizador - Configuración de Branding Dinámico
 * Sistema completo de personalización de marca
 * Version: 2.2
 */

'use strict';

// ===== CONFIGURACIÓN DE BRANDING POR DEFECTO =====
const DEFAULT_BRANDING = {
  // Información de la empresa
  company: {
    name: "GoldTech MX",
    tagline: "Soluciones de Impresión 3D",
    description: "Empresa líder en servicios de impresión 3D",
    website: "https://goldtech.mx",
    email: "contacto@goldtech.mx",
    phone: "+52 477 123 4567",
    address: "León de los Aldama, Guanajuato, México"
  },

  // Logos y recursos visuales
  logos: {
    primary: {
      dark: "https://bio.goldtech.mx/forge3d_oscuro",
      light: "https://bio.goldtech.mx/forge3d_blanco",
      alt: "Logo Forge3D"
    },
    secondary: {
      dark: "https://bio.goldtech.mx/logogoldtech",
      light: "https://gtt.mx/logo-goldtech.oscuro", 
      alt: "Logo Empresa"
    },
    favicon: "https://bio.goldtech.mx/favicon.ico",
    appleTouchIcon: "https://bio.goldtech.mx/apple-touch-icon.png"
  },

  // Redes sociales
  social: {
    tiktok: {
      url: "https://tiktok.com/@goldtechmx",
      username: "@goldtechmx",
      enabled: true
    },
    instagram: {
      url: "https://instagram.com/goldtechmx",
      username: "@goldtechmx", 
      enabled: true
    },
    youtube: {
      url: "https://youtube.com/@goldtechmx",
      username: "@goldtechmx",
      enabled: true
    },
    linkedin: {
      url: "https://linkedin.com/company/goldtechmx",
      username: "goldtechmx",
      enabled: true
    },
    facebook: {
      url: "https://facebook.com/goldtechmx",
      username: "goldtechmx",
      enabled: true
    },
    twitter: {
      url: "",
      username: "",
      enabled: false
    },
    whatsapp: {
      url: "",
      number: "",
      enabled: false
    }
  },

  // Colores de marca (CSS custom properties)
  colors: {
    primary: "#CD9430",
    secondary: "#e1aa4a", 
    accent: "#B8851F",
    background: {
      dark: {
        primary: "linear-gradient(135deg, #0e0e0e 0%, #1a1a2e 100%)",
        secondary: "rgba(26, 26, 46, 0.9)",
        tertiary: "rgba(15, 15, 15, 0.6)"
      },
      light: {
        primary: "linear-gradient(135deg, #fffff0 0%, #faf7ed 100%)",
        secondary: "rgba(255, 255, 250, 0.95)",
        tertiary: "rgba(254, 252, 245, 0.9)"
      }
    },
    text: {
      dark: {
        primary: "#e0e0e0",
        secondary: "#aaa"
      },
      light: {
        primary: "#2d2d2d", 
        secondary: "#666"
      }
    }
  },

  // Configuración SEO
  seo: {
    title: "Cotizador Forge3D - Calculadora Profesional de Precios para Impresión 3D",
    description: "Herramienta profesional gratuita para calcular precios exactos de proyectos de impresión 3D.",
    keywords: "cotizador impresión 3D, calculadora precios 3D, Forge3D",
    ogImage: "https://bio.goldtech.mx/forge3d_oscuro",
    canonical: "https://tu-dominio.com/forge3d"
  },

  // Textos personalizables
  texts: {
    appName: "Cotizador Forge3D",
    appSubtitle: "Cotizador",
    welcomeMessage: "¡Bienvenido al Cotizador Forge3D! 🚀",
    footerText: "Los precios aquí calculados son estimaciones y pueden cambiar sin previo aviso.",
    disclaimers: [
      "🚚 No se incluye costo de entrega y/o envío. Los precios son únicamente por las piezas impresas.",
      "💵 Todos los precios están expresados en pesos mexicanos y no incluyen IVA."
    ]
  },

  // Configuración de archivos PDF
  pdf: {
    footer: {
      companyInfo: true,
      socialLinks: true,
      disclaimer: true
    },
    watermark: {
      enabled: false,
      text: "",
      opacity: 0.1
    }
  },

  // Configuración de PWA
  pwa: {
    name: "Cotizador Forge3D",
    shortName: "Forge3D",
    description: "Calculadora profesional para determinar precios de proyectos de impresión 3D",
    themeColor: "#CD9430",
    backgroundColor: "#0e0e0e"
  }
};

// ===== GESTIÓN DE BRANDING =====
class BrandingManager {
  constructor() {
    this.currentBranding = null;
    this.storageKey = 'forge3d_branding_config';
    this.init();
  }

  /**
   * Inicializa el sistema de branding
   */
  init() {
    this.loadBranding();
    this.applyBranding();
    this.setupCustomProperties();
  }

  /**
   * Carga la configuración de branding
   */
  loadBranding() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const savedBranding = JSON.parse(saved);
        this.currentBranding = this.mergeBranding(DEFAULT_BRANDING, savedBranding);
      } else {
        this.currentBranding = { ...DEFAULT_BRANDING };
      }
    } catch (error) {
      console.warn('Error cargando configuración de branding:', error);
      this.currentBranding = { ...DEFAULT_BRANDING };
    }
  }

  /**
   * Combina configuraciones de branding
   */
  mergeBranding(defaultConfig, userConfig) {
    const merged = JSON.parse(JSON.stringify(defaultConfig));
    
    const deepMerge = (target, source) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) target[key] = {};
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    };

    deepMerge(merged, userConfig);
    return merged;
  }

  /**
   * Aplica la configuración de branding al DOM
   */
  applyBranding() {
    this.updateLogos();
    this.updateTexts();
    this.updateSEO();
    this.updateSocialLinks();
    this.updatePWAConfig();
  }

  /**
   * Actualiza los logos en la aplicación
   */
  updateLogos() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    // Logo principal
    const forgeLogos = document.querySelectorAll('#forge-logo, .logo-forge');
    forgeLogos.forEach(logo => {
      logo.src = this.currentBranding.logos.primary[theme];
      logo.alt = this.currentBranding.logos.primary.alt;
    });

    // Logo secundario
    const secondaryLogos = document.querySelectorAll('#goldtech-footer-logo, .logo-secondary');
    secondaryLogos.forEach(logo => {
      logo.src = this.currentBranding.logos.secondary[theme];
      logo.alt = this.currentBranding.logos.secondary.alt;
    });

    // Favicon
    this.updateFavicon();
  }

  /**
   * Actualiza el favicon
   */
  updateFavicon() {
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = this.currentBranding.logos.favicon;

    // Apple Touch Icon
    let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleTouchIcon) {
      appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon';
      document.head.appendChild(appleTouchIcon);
    }
    appleTouchIcon.href = this.currentBranding.logos.appleTouchIcon;
  }

  /**
   * Actualiza los textos de la aplicación
   */
  updateTexts() {
    // Título de la aplicación
    const titleElements = document.querySelectorAll('.title-cotizador');
    titleElements.forEach(el => {
      el.textContent = this.currentBranding.texts.appSubtitle;
    });

    // Nombre de la empresa en el header
    const companyElements = document.querySelectorAll('.company-name');
    companyElements.forEach(el => {
      el.textContent = this.currentBranding.company.name;
    });

    // Footer disclaimers
    const footerParagraphs = document.querySelectorAll('footer p');
    if (footerParagraphs.length >= 3) {
      footerParagraphs[0].innerHTML = `⚠️ ${this.currentBranding.texts.footerText}`;
      footerParagraphs[1].innerHTML = this.currentBranding.texts.disclaimers[0] || '';
      footerParagraphs[2].innerHTML = this.currentBranding.texts.disclaimers[1] || '';
    }

    // Título de la página
    document.title = this.currentBranding.seo.title;
  }

  /**
   * Actualiza los metadatos SEO
   */
  updateSEO() {
    // Description
    let description = document.querySelector('meta[name="description"]');
    if (description) {
      description.content = this.currentBranding.seo.description;
    }

    // Keywords
    let keywords = document.querySelector('meta[name="keywords"]');
    if (keywords) {
      keywords.content = this.currentBranding.seo.keywords;
    }

    // Open Graph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.content = this.currentBranding.seo.title;
    }

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.content = this.currentBranding.seo.description;
    }

    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.content = this.currentBranding.seo.ogImage;
    }

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.href = this.currentBranding.seo.canonical;
    }
  }

  /**
   * Actualiza los enlaces de redes sociales
   */
  updateSocialLinks() {
    const socialContainer = document.querySelector('.social-icons');
    if (!socialContainer) return;

    socialContainer.innerHTML = '';

    Object.entries(this.currentBranding.social).forEach(([platform, config]) => {
      if (config.enabled && config.url) {
        const link = document.createElement('a');
        link.href = config.url;
        link.target = '_blank';
        link.className = platform;
        link.title = config.username || platform;
        
        const icon = document.createElement('i');
        icon.className = `fab fa-${platform}`;
        
        link.appendChild(icon);
        socialContainer.appendChild(link);
      }
    });
  }

  /**
   * Configura las custom properties CSS
   */
  setupCustomProperties() {
    const root = document.documentElement;
    
    // Colores primarios
    root.style.setProperty('--accent-primary', this.currentBranding.colors.primary);
    root.style.setProperty('--accent-secondary', this.currentBranding.colors.secondary);
    
    // Theme color para PWA
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      document.head.appendChild(themeColorMeta);
    }
    themeColorMeta.content = this.currentBranding.colors.primary;
  }

  /**
   * Actualiza la configuración de PWA
   */
  updatePWAConfig() {
    // Buscar y actualizar el manifest
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      // Crear un nuevo manifest dinámico
      const manifest = {
        name: this.currentBranding.pwa.name,
        short_name: this.currentBranding.pwa.shortName,
        description: this.currentBranding.pwa.description,
        theme_color: this.currentBranding.pwa.themeColor,
        background_color: this.currentBranding.pwa.backgroundColor,
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: this.currentBranding.logos.favicon,
            sizes: "16x16 32x32",
            type: "image/png"
          },
          {
            src: this.currentBranding.logos.appleTouchIcon,
            sizes: "180x180",
            type: "image/png"
          }
        ]
      };

      // Crear blob URL para el manifest
      const manifestBlob = new Blob([JSON.stringify(manifest)], {type: 'application/json'});
      const manifestUrl = URL.createObjectURL(manifestBlob);
      manifestLink.href = manifestUrl;
    }
  }

  /**
   * Guarda la configuración de branding
   */
  saveBranding(brandingConfig) {
    try {
      this.currentBranding = this.mergeBranding(DEFAULT_BRANDING, brandingConfig);
      localStorage.setItem(this.storageKey, JSON.stringify(this.currentBranding));
      this.applyBranding();
      return true;
    } catch (error) {
      console.error('Error guardando configuración de branding:', error);
      return false;
    }
  }

  /**
   * Obtiene la configuración actual
   */
  getCurrentBranding() {
    return { ...this.currentBranding };
  }

  /**
   * Restaura la configuración por defecto
   */
  resetBranding() {
    this.currentBranding = { ...DEFAULT_BRANDING };
    localStorage.removeItem(this.storageKey);
    this.applyBranding();
    this.setupCustomProperties();
  }

  /**
   * Exporta la configuración de branding
   */
  exportBranding() {
    const config = this.getCurrentBranding();
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `forge3d_branding_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  /**
   * Importa configuración de branding
   */
  importBranding(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No se proporcionó archivo'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const brandingConfig = JSON.parse(e.target.result);
          
          if (this.validateBrandingConfig(brandingConfig)) {
            const success = this.saveBranding(brandingConfig);
            if (success) {
              resolve(brandingConfig);
            } else {
              reject(new Error('Error al guardar la configuración'));
            }
          } else {
            reject(new Error('Configuración de branding inválida'));
          }
        } catch (error) {
          reject(new Error('Error al parsear el archivo JSON'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Valida la configuración de branding
   */
  validateBrandingConfig(config) {
    const requiredKeys = ['company', 'logos', 'social', 'colors', 'seo', 'texts'];
    return requiredKeys.every(key => config.hasOwnProperty(key));
  }

  /**
   * Actualiza un aspecto específico del branding
   */
  updateBrandingSection(section, data) {
    if (this.currentBranding[section]) {
      this.currentBranding[section] = { ...this.currentBranding[section], ...data };
      this.saveBranding(this.currentBranding);
      return true;
    }
    return false;
  }

  /**
   * Obtiene una configuración específica para GitHub deployment
   */
  getGitHubConfig() {
    return {
      // Configuración mínima para GitHub Pages
      repository: {
        name: "forge3d-cotizador",
        description: this.currentBranding.seo.description,
        topics: ["3d-printing", "calculator", "pricing", "forge3d"],
        homepage: this.currentBranding.company.website
      },
      deployment: {
        customDomain: "",
        httpsEnabled: true,
        customHeaders: true
      },
      branding: this.getCurrentBranding()
    };
  }
}

// ===== INSTANCIA GLOBAL =====
const brandingManager = new BrandingManager();

// ===== EXPORTAR PARA MÓDULOS =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DEFAULT_BRANDING,
    BrandingManager,
    brandingManager
  };
}

// ===== REGISTRAR GLOBALMENTE =====
if (typeof window !== 'undefined') {
  window.BrandingManager = BrandingManager;
  window.brandingManager = brandingManager;
  window.DEFAULT_BRANDING = DEFAULT_BRANDING;
}

console.log('🎨 Branding Manager initialized successfully');