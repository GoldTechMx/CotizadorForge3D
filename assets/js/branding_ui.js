/**
 * Forge3D Cotizador - UI de Configuración de Branding
 * Gestión completa de la interfaz de usuario para configuración de marca
 * Version: 2.2
 */

'use strict';

// ===== GESTIÓN DE UI DE BRANDING =====
class BrandingUI {
  constructor() {
    this.isOpen = false;
    this.previewMode = false;
    this.originalBranding = null;
    this.currentTab = 'company';
    this.colorPresets = {
      goldtech: { primary: '#CD9430', secondary: '#e1aa4a', accent: '#B8851F' },
      blue: { primary: '#3b82f6', secondary: '#60a5fa', accent: '#1d4ed8' },
      green: { primary: '#10b981', secondary: '#34d399', accent: '#047857' },
      purple: { primary: '#8b5cf6', secondary: '#a78bfa', accent: '#6d28d9' },
      red: { primary: '#ef4444', secondary: '#f87171', accent: '#dc2626' }
    };
    this.init();
  }

  /**
   * Inicializa la UI de branding
   */
  init() {
    this.setupEventListeners();
    this.loadCurrentConfig();
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    // Event listeners para inputs de logo con preview
    const logoInputs = ['brand-logo-primary-dark', 'brand-logo-primary-light', 
                       'brand-logo-secondary-dark', 'brand-logo-secondary-light'];
    
    logoInputs.forEach(inputId => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('input', () => this.updateLogoPreview(inputId));
        input.addEventListener('change', () => this.updateLogoPreview(inputId));
      }
    });

    // Event listeners para inputs de color
    const colorInputs = ['brand-color-primary', 'brand-color-secondary', 'brand-color-accent'];
    colorInputs.forEach(inputId => {
      const colorInput = document.getElementById(inputId);
      const hexInput = document.getElementById(inputId + '-hex');
      
      if (colorInput && hexInput) {
        colorInput.addEventListener('input', (e) => {
          hexInput.value = e.target.value.toUpperCase();
          this.updateColorPreview();
        });
        
        hexInput.addEventListener('input', (e) => {
          if (this.isValidHex(e.target.value)) {
            colorInput.value = e.target.value;
            this.updateColorPreview();
          }
        });
      }
    });

    // Event listeners para checkboxes de redes sociales
    const socialPlatforms = ['tiktok', 'instagram', 'youtube', 'linkedin', 'facebook', 'twitter', 'whatsapp'];
    socialPlatforms.forEach(platform => {
      const checkbox = document.getElementById(`social-${platform}-enabled`);
      if (checkbox) {
        checkbox.addEventListener('change', () => this.updateSocialPreview());
      }
    });

    // Auto-save mientras se escribe
    const allInputs = document.querySelectorAll('.branding-panel input, .branding-panel textarea');
    allInputs.forEach(input => {
      input.addEventListener('input', this.debounce(() => {
        if (this.previewMode) {
          this.applyPreview();
        }
      }, 500));
    });
  }

  /**
   * Función debounce para optimizar rendimiento
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Abre el panel de branding
   */
  open() {
    const panel = document.getElementById('brandingPanel');
    if (panel) {
      this.originalBranding = brandingManager.getCurrentBranding();
      this.loadCurrentConfig();
      panel.style.display = 'block';
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
      
      // Animar entrada
      setTimeout(() => {
        panel.style.opacity = '1';
      }, 10);
    }
  }

  /**
   * Cierra el panel de branding
   */
  close() {
    const panel = document.getElementById('brandingPanel');
    if (panel) {
      panel.style.display = 'none';
      this.isOpen = false;
      document.body.style.overflow = '';
      
      // Restaurar configuración original si estaba en preview
      if (this.previewMode) {
        brandingManager.saveBranding(this.originalBranding);
        this.previewMode = false;
        this.updatePreviewButton();
      }
    }
  }

  /**
   * Cambia entre tabs
   */
  showTab(tabName) {
    // Desactivar tab actual
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Activar nuevo tab
    document.querySelector(`[onclick="BrandingUI.showTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    this.currentTab = tabName;
  }

  /**
   * Carga la configuración actual en los campos
   */
  loadCurrentConfig() {
    const branding = brandingManager.getCurrentBranding();
    
    // Información de empresa
    this.setInputValue('brand-company-name', branding.company.name);
    this.setInputValue('brand-company-tagline', branding.company.tagline);
    this.setInputValue('brand-company-description', branding.company.description);
    this.setInputValue('brand-company-website', branding.company.website);
    this.setInputValue('brand-company-email', branding.company.email);
    this.setInputValue('brand-company-phone', branding.company.phone);
    this.setInputValue('brand-company-address', branding.company.address);
    
    // Logos
    this.setInputValue('brand-logo-primary-dark', branding.logos.primary.dark);
    this.setInputValue('brand-logo-primary-light', branding.logos.primary.light);
    this.setInputValue('brand-logo-secondary-dark', branding.logos.secondary.dark);
    this.setInputValue('brand-logo-secondary-light', branding.logos.secondary.light);
    this.setInputValue('brand-favicon', branding.logos.favicon);
    this.setInputValue('brand-apple-touch-icon', branding.logos.appleTouchIcon);
    
    // Colores
    this.setInputValue('brand-color-primary', branding.colors.primary);
    this.setInputValue('brand-color-primary-hex', branding.colors.primary);
    this.setInputValue('brand-color-secondary', branding.colors.secondary);
    this.setInputValue('brand-color-secondary-hex', branding.colors.secondary);
    this.setInputValue('brand-color-accent', branding.colors.accent);
    this.setInputValue('brand-color-accent-hex', branding.colors.accent);
    
    // Redes sociales
    Object.entries(branding.social).forEach(([platform, config]) => {
      this.setInputValue(`social-${platform}-url`, config.url);
      this.setInputValue(`social-${platform}-username`, config.username);
      this.setCheckboxValue(`social-${platform}-enabled`, config.enabled);
    });
    
    // SEO
    this.setInputValue('brand-seo-title', branding.seo.title);
    this.setInputValue('brand-seo-description', branding.seo.description);
    this.setInputValue('brand-seo-keywords', branding.seo.keywords);
    this.setInputValue('brand-seo-canonical', branding.seo.canonical);
    this.setInputValue('brand-seo-og-image', branding.seo.ogImage);
    
    // Textos
    this.setInputValue('brand-text-app-name', branding.texts.appName);
    this.setInputValue('brand-text-app-subtitle', branding.texts.appSubtitle);
    this.setInputValue('brand-text-welcome', branding.texts.welcomeMessage);
    this.setInputValue('brand-text-footer', branding.texts.footerText);
    
    // PWA
    this.setInputValue('brand-pwa-name', branding.pwa.name);
    this.setInputValue('brand-pwa-short-name', branding.pwa.shortName);
    
    // Actualizar previews
    this.updateAllPreviews();
  }

  /**
   * Establece el valor de un input
   */
  setInputValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.value = value || '';
    }
  }

  /**
   * Establece el valor de un checkbox
   */
  setCheckboxValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.checked = Boolean(value);
    }
  }

  /**
   * Obtiene el valor de un input
   */
  getInputValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
  }

  /**
   * Obtiene el valor de un checkbox
   */
  getCheckboxValue(id) {
    const element = document.getElementById(id);
    return element ? element.checked : false;
  }

  /**
   * Actualiza el preview de un logo
   */
  updateLogoPreview(inputId) {
    const input = document.getElementById(inputId);
    const previewId = inputId.replace('brand-', 'preview-');
    const preview = document.getElementById(previewId);
    
    if (input && preview) {
      const url = input.value.trim();
      if (url && this.isValidUrl(url)) {
        preview.src = url;
        preview.style.display = 'block';
        preview.onerror = () => {
          preview.style.display = 'none';
        };
      } else {
        preview.style.display = 'none';
      }
    }
  }

  /**
   * Actualiza el preview de colores
   */
  updateColorPreview() {
    const primaryColor = this.getInputValue('brand-color-primary');
    const secondaryColor = this.getInputValue('brand-color-secondary');
    const accentColor = this.getInputValue('brand-color-accent');
    
    const primaryPreview = document.getElementById('preview-primary');
    const secondaryPreview = document.getElementById('preview-secondary');
    const accentPreview = document.getElementById('preview-accent');
    
    if (primaryPreview) primaryPreview.style.backgroundColor = primaryColor;
    if (secondaryPreview) secondaryPreview.style.backgroundColor = secondaryColor;
    if (accentPreview) accentPreview.style.backgroundColor = accentColor;
    
    // Aplicar en tiempo real si está en modo preview
    if (this.previewMode) {
      document.documentElement.style.setProperty('--accent-primary', primaryColor);
      document.documentElement.style.setProperty('--accent-secondary', secondaryColor);
    }
  }

  /**
   * Actualiza el preview de redes sociales
   */
  updateSocialPreview() {
    // Esta función se puede expandir para mostrar un preview en tiempo real
    console.log('Social preview updated');
  }

  /**
   * Actualiza todos los previews
   */
  updateAllPreviews() {
    // Logos
    ['brand-logo-primary-dark', 'brand-logo-primary-light', 
     'brand-logo-secondary-dark', 'brand-logo-secondary-light'].forEach(id => {
      this.updateLogoPreview(id);
    });
    
    // Colores
    this.updateColorPreview();
    
    // Redes sociales
    this.updateSocialPreview();
  }

  /**
   * Aplica un preset de colores
   */
  applyColorPreset(presetName) {
    const preset = this.colorPresets[presetName];
    if (preset) {
      this.setInputValue('brand-color-primary', preset.primary);
      this.setInputValue('brand-color-primary-hex', preset.primary);
      this.setInputValue('brand-color-secondary', preset.secondary);
      this.setInputValue('brand-color-secondary-hex', preset.secondary);
      this.setInputValue('brand-color-accent', preset.accent);
      this.setInputValue('brand-color-accent-hex', preset.accent);
      
      this.updateColorPreview();
      
      // Mostrar notificación
      if (typeof NotificationManager !== 'undefined') {
        NotificationManager.showSuccess(`🎨 Preset de colores "${presetName}" aplicado`);
      }
    }
  }

  /**
   * Alterna el modo de vista previa
   */
  togglePreview() {
    this.previewMode = !this.previewMode;
    
    if (this.previewMode) {
      this.applyPreview();
    } else {
      // Restaurar configuración original
      brandingManager.saveBranding(this.originalBranding);
    }
    
    this.updatePreviewButton();
  }

  /**
   * Actualiza el botón de preview
   */
  updatePreviewButton() {
    const previewText = document.getElementById('previewText');
    const previewBtn = document.querySelector('.preview-btn');
    
    if (previewText && previewBtn) {
      if (this.previewMode) {
        previewText.textContent = 'Salir Preview';
        previewBtn.style.background = '#ef4444';
      } else {
        previewText.textContent = 'Vista Previa';
        previewBtn.style.background = '#3b82f6';
      }
    }
  }

  /**
   * Aplica la configuración actual como preview
   */
  applyPreview() {
    const config = this.gatherFormData();
    brandingManager.saveBranding(config);
    
    if (typeof NotificationManager !== 'undefined') {
      NotificationManager.showInfo('👀 Vista previa aplicada');
    }
  }

  /**
   * Recopila todos los datos del formulario
   */
  gatherFormData() {
    return {
      company: {
        name: this.getInputValue('brand-company-name'),
        tagline: this.getInputValue('brand-company-tagline'),
        description: this.getInputValue('brand-company-description'),
        website: this.getInputValue('brand-company-website'),
        email: this.getInputValue('brand-company-email'),
        phone: this.getInputValue('brand-company-phone'),
        address: this.getInputValue('brand-company-address')
      },
      logos: {
        primary: {
          dark: this.getInputValue('brand-logo-primary-dark'),
          light: this.getInputValue('brand-logo-primary-light'),
          alt: "Logo Principal"
        },
        secondary: {
          dark: this.getInputValue('brand-logo-secondary-dark'),
          light: this.getInputValue('brand-logo-secondary-light'),
          alt: "Logo Empresa"
        },
        favicon: this.getInputValue('brand-favicon'),
        appleTouchIcon: this.getInputValue('brand-apple-touch-icon')
      },
      colors: {
        primary: this.getInputValue('brand-color-primary'),
        secondary: this.getInputValue('brand-color-secondary'),
        accent: this.getInputValue('brand-color-accent')
      },
      social: {
        tiktok: {
          url: this.getInputValue('social-tiktok-url'),
          username: this.getInputValue('social-tiktok-username'),
          enabled: this.getCheckboxValue('social-tiktok-enabled')
        },
        instagram: {
          url: this.getInputValue('social-instagram-url'),
          username: this.getInputValue('social-instagram-username'),
          enabled: this.getCheckboxValue('social-instagram-enabled')
        },
        youtube: {
          url: this.getInputValue('social-youtube-url'),
          username: this.getInputValue('social-youtube-username'),
          enabled: this.getCheckboxValue('social-youtube-enabled')
        },
        linkedin: {
          url: this.getInputValue('social-linkedin-url'),
          username: this.getInputValue('social-linkedin-username'),
          enabled: this.getCheckboxValue('social-linkedin-enabled')
        },
        facebook: {
          url: this.getInputValue('social-facebook-url'),
          username: this.getInputValue('social-facebook-username'),
          enabled: this.getCheckboxValue('social-facebook-enabled')
        },
        twitter: {
          url: this.getInputValue('social-twitter-url'),
          username: this.getInputValue('social-twitter-username'),
          enabled: this.getCheckboxValue('social-twitter-enabled')
        },
        whatsapp: {
          url: this.getInputValue('social-whatsapp-url'),
          number: this.getInputValue('social-whatsapp-number'),
          enabled: this.getCheckboxValue('social-whatsapp-enabled')
        }
      },
      seo: {
        title: this.getInputValue('brand-seo-title'),
        description: this.getInputValue('brand-seo-description'),
        keywords: this.getInputValue('brand-seo-keywords'),
        canonical: this.getInputValue('brand-seo-canonical'),
        ogImage: this.getInputValue('brand-seo-og-image')
      },
      texts: {
        appName: this.getInputValue('brand-text-app-name'),
        appSubtitle: this.getInputValue('brand-text-app-subtitle'),
        welcomeMessage: this.getInputValue('brand-text-welcome'),
        footerText: this.getInputValue('brand-text-footer'),
        disclaimers: [
          "🚚 No se incluye costo de entrega y/o envío. Los precios son únicamente por las piezas impresas.",
          "💵 Todos los precios están expresados en pesos mexicanos y no incluyen IVA."
        ]
      },
      pwa: {
        name: this.getInputValue('brand-pwa-name'),
        shortName: this.getInputValue('brand-pwa-short-name'),
        description: this.getInputValue('brand-seo-description'),
        themeColor: this.getInputValue('brand-color-primary'),
        backgroundColor: "#0e0e0e"
      }
    };
  }

  /**
   * Guarda la configuración
   */
  saveConfig() {
    const config = this.gatherFormData();
    const success = brandingManager.saveBranding(config);
    
    if (success) {
      this.originalBranding = brandingManager.getCurrentBranding();
      
      if (typeof NotificationManager !== 'undefined') {
        NotificationManager.showSuccess('✅ Configuración de branding guardada');
      }
    } else {
      if (typeof NotificationManager !== 'undefined') {
        NotificationManager.showError('❌ Error al guardar la configuración');
      }
    }
  }

  /**
   * Aplica y cierra el panel
   */
  applyAndClose() {
    this.saveConfig();
    this.close();
  }

  /**
   * Restaura la configuración por defecto
   */
  resetConfig() {
    if (confirm('¿Estás seguro de que quieres restaurar la configuración por defecto? Esto eliminará todos los cambios.')) {
      brandingManager.resetBranding();
      this.loadCurrentConfig();
      
      if (typeof NotificationManager !== 'undefined') {
        NotificationManager.showInfo('🔄 Configuración restaurada por defecto');
      }
    }
  }

  /**
   * Exporta la configuración
   */
  exportConfig() {
    brandingManager.exportBranding();
    
    if (typeof NotificationManager !== 'undefined') {
      NotificationManager.showSuccess('📤 Configuración exportada');
    }
  }

  /**
   * Importa configuración desde archivo
   */
  importConfig(input) {
    const file = input.files[0];
    if (!file) return;
    
    brandingManager.importBranding(file)
      .then((config) => {
        this.loadCurrentConfig();
        if (typeof NotificationManager !== 'undefined') {
          NotificationManager.showSuccess('📥 Configuración importada correctamente');
        }
      })
      .catch((error) => {
        console.error('Error importing branding:', error);
        if (typeof NotificationManager !== 'undefined') {
          NotificationManager.showError('❌ Error al importar la configuración');
        }
      });
    
    // Limpiar el input
    input.value = '';
  }

  /**
   * Genera configuración para GitHub
   */
  generateGitHubConfig() {
    const config = this.gatherFormData();
    const githubConfig = {
      name: "forge3d-cotizador",
      description: config.seo.description,
      homepage: config.company.website,
      topics: ["3d-printing", "calculator", "pricing", "forge3d"],
      branding: config,
      deployment: {
        customDomain: "",
        httpsEnabled: true,
        customHeaders: true
      },
      instructions: {
        setup: [
          "1. Fork este repositorio",
          "2. Habilitar GitHub Pages en Settings > Pages",
          "3. Seleccionar source: Deploy from a branch",
          "4. Seleccionar branch: main / (root)",
          "5. Tu cotizador estará disponible en: https://username.github.io/forge3d-cotizador"
        ],
        customization: [
          "1. Editar branding-config.js con tu información",
          "2. Reemplazar logos en la carpeta assets/images/",
          "3. Modificar colores en styles.css si es necesario",
          "4. Actualizar manifest.json con tu información PWA"
        ]
      }
    };
    
    const dataStr = JSON.stringify(githubConfig, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `forge3d_github_config_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    if (typeof NotificationManager !== 'undefined') {
      NotificationManager.showSuccess('🐙 Configuración para GitHub generada');
    }
  }

  /**
   * Valida si una URL es válida
   */
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Valida si un color hex es válido
   */
  isValidHex(hex) {
    return /^#[0-9A-F]{6}$/i.test(hex);
  }
}

// ===== INSTANCIA GLOBAL =====
const brandingUI = new BrandingUI();

// ===== FUNCIONES GLOBALES PARA HTML =====
window.BrandingUI = {
  open: () => brandingUI.open(),
  close: () => brandingUI.close(),
  showTab: (tab) => brandingUI.showTab(tab),
  saveConfig: () => brandingUI.saveConfig(),
  resetConfig: () => brandingUI.resetConfig(),
  exportConfig: () => brandingUI.exportConfig(),
  importConfig: (input) => brandingUI.importConfig(input),
  applyAndClose: () => brandingUI.applyAndClose(),
  togglePreview: () => brandingUI.togglePreview(),
  applyColorPreset: (preset) => brandingUI.applyColorPreset(preset),
  generateGitHubConfig: () => brandingUI.generateGitHubConfig()
};

// ===== EXPORTAR PARA MÓDULOS =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BrandingUI,
    brandingUI
  };
}

console.log('🎨 Branding UI initialized successfully');