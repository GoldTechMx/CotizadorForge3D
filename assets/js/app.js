/**
 * Forge3D Cotizador - Aplicación Principal con Branding Dinámico
 * Sistema de cotización profesional para impresión 3D
 * Version: 2.1
 */

'use strict';

// ===== VARIABLES GLOBALES =====
let totalGeneral = 0;
let densidadActual = 1.24;
let currentTheme = 'dark';
let sidebarVisible = false;
let piezasData = [];
let activeConfigTab = 'cotizador';

// Variables persistentes
let impresoraPersistente = 'manual';
let comisionPersistente = '17.4';
let desperdicioPersistente = 10;
let tipoFilamentoPersistente = '1.24';
let densidadPersonalizadaPersistente = 1.24;

// ===== UTILIDADES GENERALES =====
const Utils = {
  /**
   * Debounce function para optimizar rendimiento
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
  },

  /**
   * Valida si un número está dentro de un rango
   */
  validateRange(value, min, max) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  },

  /**
   * Formatea números con separadores de miles
   */
  formatNumber(num, decimals = 2) {
    return parseFloat(num).toLocaleString('es-MX', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  /**
   * Sanitiza entrada de texto
   */
  sanitizeText(text) {
    if (typeof text !== 'string') return '';
    return text.trim().slice(0, VALIDATION_RULES.nameMaxLength);
  },

  /**
   * Genera ID único
   */
  generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  },

  /**
   * Convierte archivo a base64
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },

  /**
   * Valida URL
   */
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  },

  /**
   * Valida color hexadecimal
   */
  isValidHex(hex) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
  }
};

// ===== GESTIÓN DE TEMAS =====
const ThemeManager = {
  init() {
    // Detectar preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      this.setTheme('light');
    }
    
    // Cargar tema guardado
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
  },

  setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeText = document.getElementById('theme-text');
    
    if (theme === 'light') {
      themeText.textContent = 'Oscuro';
    } else {
      themeText.textContent = 'Claro';
    }
    
    // Actualizar logos según tema
    BrandingUIManager.updateLogosForTheme(theme);
    
    // Guardar preferencia
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  },

  toggle() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
};

// ===== GESTIÓN DE CONFIGURACIÓN =====
const ConfigManager = {
  save() {
    const config = {
      tarifaLuz: parseFloat(document.getElementById('tarifaLuz').value) || CONFIG_DEFAULT.tarifaLuz,
      tarifaHora: parseFloat(document.getElementById('tarifaHora').value) || CONFIG_DEFAULT.tarifaHora,
      porcentajeUtilidad: parseFloat(document.getElementById('porcentajeUtilidad').value) || CONFIG_DEFAULT.porcentajeUtilidad,
      desgasteMaquina: parseFloat(document.getElementById('desgasteMaquina').value) || CONFIG_DEFAULT.desgasteMaquina,
      desgasteCarrete: parseFloat(document.getElementById('desgasteCarrete').value) || CONFIG_DEFAULT.desgasteCarrete,
      timestamp: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
    return config;
  },

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.config);
      if (saved) {
        const config = JSON.parse(saved);
        this.apply(config);
        return config;
      }
    } catch (error) {
      console.warn('Error cargando configuración:', error);
    }
    
    // Aplicar configuración por defecto
    this.apply(CONFIG_DEFAULT);
    return CONFIG_DEFAULT;
  },

  apply(config) {
    Object.keys(CONFIG_DEFAULT).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        element.value = config[key] || CONFIG_DEFAULT[key];
      }
    });
  },

  reset() {
    this.apply(CONFIG_DEFAULT);
    this.save();
    NotificationManager.show(NOTIFICATION_MESSAGES.success.configRestored, 'success');
  },

  export() {
    const config = this.getCurrentConfig();
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `forge3d_configuracion_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    NotificationManager.show(NOTIFICATION_MESSAGES.success.configExported, 'success');
  },

  import(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        
        // Validar configuración
        if (this.validateConfig(config)) {
          this.apply(config);
          this.save();
          NotificationManager.show(NOTIFICATION_MESSAGES.success.configImported, 'success');
        } else {
          throw new Error('Configuración inválida');
        }
      } catch (error) {
        console.error('Error importando configuración:', error);
        NotificationManager.show(NOTIFICATION_MESSAGES.error.configImportError, 'error');
      }
    };
    reader.readAsText(file);
  },

  validateConfig(config) {
    const requiredKeys = Object.keys(CONFIG_DEFAULT);
    return requiredKeys.every(key => 
      config.hasOwnProperty(key) && 
      typeof config[key] === 'number' && 
      config[key] >= 0
    );
  },

  getCurrentConfig() {
    return {
      tarifaLuz: parseFloat(document.getElementById('tarifaLuz').value) || CONFIG_DEFAULT.tarifaLuz,
      tarifaHora: parseFloat(document.getElementById('tarifaHora').value) || CONFIG_DEFAULT.tarifaHora,
      porcentajeUtilidad: parseFloat(document.getElementById('porcentajeUtilidad').value) || CONFIG_DEFAULT.porcentajeUtilidad,
      desgasteMaquina: parseFloat(document.getElementById('desgasteMaquina').value) || CONFIG_DEFAULT.desgasteMaquina,
      desgasteCarrete: parseFloat(document.getElementById('desgasteCarrete').value) || CONFIG_DEFAULT.desgasteCarrete
    };
  }
};

// ===== GESTIÓN DE BRANDING UI =====
const BrandingUIManager = {
  /**
   * Inicializa la interfaz de branding
   */
  init() {
    this.loadBrandingToUI();
    this.setupEventListeners();
  },

  /**
   * Carga la configuración de branding a la interfaz
   */
  loadBrandingToUI() {
    const branding = APP_CONFIG.branding;
    
    // Información de empresa
    const companyName = document.getElementById('brandingCompanyName');
    const slogan = document.getElementById('brandingSlogan');
    const website = document.getElementById('brandingWebsite');
    const email = document.getElementById('brandingEmail');
    
    if (companyName) companyName.value = branding.company.name || '';
    if (slogan) slogan.value = branding.company.slogan || '';
    if (website) website.value = branding.company.website || '';
    if (email) email.value = branding.company.email || '';
    
    // Colores
    this.updateColorInputs(branding.colors);
    
    // Redes sociales
    this.updateSocialInputs(branding.social);
    
    // Opciones de personalización
    this.updateCustomizationInputs(branding.customization);
    
    // Logos
    this.updateLogoPreview();
  },

  /**
   * Actualiza los inputs de colores
   */
  updateColorInputs(colors) {
    if (!colors) return;
    
    const primaryColor = document.getElementById('brandingColorPrimary');
    const primaryText = document.getElementById('brandingColorPrimaryText');
    const secondaryColor = document.getElementById('brandingColorSecondary');
    const secondaryText = document.getElementById('brandingColorSecondaryText');
    
    if (primaryColor && colors.primary) {
      primaryColor.value = colors.primary;
      primaryText.value = colors.primary;
    }
    if (secondaryColor && colors.secondary) {
      secondaryColor.value = colors.secondary;
      secondaryText.value = colors.secondary;
    }
  },

  /**
   * Actualiza los inputs de redes sociales
   */
  updateSocialInputs(social) {
    if (!social) return;
    
    Object.keys(social).forEach(platform => {
      const input = document.getElementById(`brandingSocial${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
      if (input && social[platform]) {
        input.value = social[platform];
      }
    });
  },

  /**
   * Actualiza los inputs de personalización
   */
  updateCustomizationInputs(customization) {
    if (!customization) return;
    
    const showCompanyInfo = document.getElementById('brandingShowCompanyInfo');
    const showSocialLinks = document.getElementById('brandingShowSocialLinks');
    const showBrandingFooter = document.getElementById('brandingShowBrandingFooter');
    const showForge3DLogo = document.getElementById('brandingShowForge3DLogo');
    const allowThemeToggle = document.getElementById('brandingAllowThemeToggle');
    
    if (showCompanyInfo) showCompanyInfo.checked = customization.showCompanyInfo ?? true;
    if (showSocialLinks) showSocialLinks.checked = customization.showSocialLinks ?? true;
    if (showBrandingFooter) showBrandingFooter.checked = customization.showBrandingFooter ?? true;
    if (showForge3DLogo) showForge3DLogo.checked = customization.showForge3DLogo ?? true;
    if (allowThemeToggle) allowThemeToggle.checked = customization.allowThemeToggle ?? true;
  },

  /**
   * Actualiza la vista previa de los logos
   */
  updateLogoPreview() {
    const branding = APP_CONFIG.branding;
    const theme = currentTheme;
    
    // Logo Forge3D
    const forgePreview = document.getElementById('logoPreviewForge');
    if (forgePreview && branding.logos.forge && branding.logos.forge[theme]) {
      forgePreview.src = branding.logos.forge[theme];
      forgePreview.classList.add('loaded');
    }
    
    // Logo Empresa
    const companyPreview = document.getElementById('logoPreviewCompany');
    if (companyPreview && branding.logos.company && branding.logos.company[theme]) {
      companyPreview.src = branding.logos.company[theme];
      companyPreview.classList.add('loaded');
    }
  },

  /**
   * Actualiza los logos según el tema
   */
  updateLogosForTheme(theme) {
    const branding = APP_CONFIG.branding;
    
    // Logo principal Forge3D
    const forgeLogo = document.getElementById('forge-logo');
    if (forgeLogo && branding.logos.forge) {
      forgeLogo.src = branding.logos.forge[theme] || branding.logos.forge.dark;
    }
    
    // Logo de empresa en footer
    const companyLogo = document.getElementById('company-footer-logo');
    if (companyLogo && branding.logos.company) {
      companyLogo.src = branding.logos.company[theme] || branding.logos.company.dark;
    }
    
    // Actualizar previews
    this.updateLogoPreview();
  },

  /**
   * Configura los event listeners para branding
   */
  setupEventListeners() {
    // Sincronizar inputs de color
    const primaryColor = document.getElementById('brandingColorPrimary');
    const primaryText = document.getElementById('brandingColorPrimaryText');
    const secondaryColor = document.getElementById('brandingColorSecondary');
    const secondaryText = document.getElementById('brandingColorSecondaryText');
    
    if (primaryColor && primaryText) {
      primaryColor.addEventListener('input', (e) => {
        primaryText.value = e.target.value;
        this.updateBrandingColors();
      });
      
      primaryText.addEventListener('input', (e) => {
        if (Utils.isValidHex(e.target.value)) {
          primaryColor.value = e.target.value;
          this.updateBrandingColors();
        }
      });
    }
    
    if (secondaryColor && secondaryText) {
      secondaryColor.addEventListener('input', (e) => {
        secondaryText.value = e.target.value;
        this.updateBrandingColors();
      });
      
      secondaryText.addEventListener('input', (e) => {
        if (Utils.isValidHex(e.target.value)) {
          secondaryColor.value = e.target.value;
          this.updateBrandingColors();
        }
      });
    }
  },

  /**
   * Actualiza los colores de branding en tiempo real
   */
  updateBrandingColors() {
    const primaryColor = document.getElementById('brandingColorPrimary').value;
    const secondaryColor = document.getElementById('brandingColorSecondary').value;
    
    // Aplicar colores inmediatamente
    const root = document.documentElement;
    root.style.setProperty('--accent-primary', primaryColor);
    root.style.setProperty('--accent-secondary', secondaryColor);
    
    // Guardar en configuración
    this.saveBrandingFromUI();
  }
};

// ===== GESTIÓN DE NOTIFICACIONES =====
const NotificationManager = {
  show(message, type = 'info', duration = PERFORMANCE_CONFIG.notificationDuration) {
    const notification = document.createElement('div');
    notification.className = `notificacion ${type}`;
    notification.textContent = message;
    
    const colors = {
      success: '#22c55e',
      error: '#ef4444',
      info: '#3b82f6',
      warning: '#f59e0b'
    };
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      color: white;
      font-weight: bold;
      z-index: 1000;
      transform: translateX(400px);
      transition: transform 0.3s ease;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      background: ${colors[type] || colors.info};
      max-width: 350px;
      word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animar salida
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
    
    return notification;
  },

  showError(message) {
    return this.show(message, 'error');
  },

  showSuccess(message) {
    return this.show(message, 'success');
  },

  showInfo(message) {
    return this.show(message, 'info');
  },

  showWarning(message) {
    return this.show(message, 'warning');
  }
};

// ===== GESTIÓN DE SIDEBAR =====
const SidebarManager = {
  toggle() {
    sidebarVisible = !sidebarVisible;
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const toggleBtn = document.getElementById('configToggleBtn');
    
    if (sidebarVisible) {
      sidebar.classList.add('show');
      overlay.classList.add('show');
      toggleBtn.classList.add('active');
    } else {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
      toggleBtn.classList.remove('active');
    }
  },

  close() {
    if (sidebarVisible) {
      this.toggle();
    }
  }
};

// ===== GESTIÓN DE PESTAÑAS DE CONFIGURACIÓN =====
const ConfigTabsManager = {
  switch(tabName) {
    activeConfigTab = tabName;
    
    // Actualizar botones de pestañas
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[onclick="switchConfigTab('${tabName}')"]`).classList.add('active');
    
    // Mostrar panel correspondiente
    document.querySelectorAll('.config-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(`panel-${tabName}`).classList.add('active');
    
    // Mostrar/ocultar botones de acción
    document.querySelectorAll('.action-group').forEach(group => {
      group.style.display = 'none';
    });
    document.getElementById(`${tabName}-actions`).style.display = 'flex';
  }
};

// ===== GESTIÓN DE TIEMPO =====
const TimeManager = {
  updateDisplay() {
    const horas = parseInt(document.getElementById('horas').value) || 0;
    let minutos = parseInt(document.getElementById('minutos').value) || 0;
    let segundos = parseInt(document.getElementById('segundos').value) || 0;
    
    // Validar rangos
    if (minutos > 59) {
      document.getElementById('minutos').value = 59;
      minutos = 59;
    }
    if (segundos > 59) {
      document.getElementById('segundos').value = 59;
      segundos = 59;
    }
    
    const tiempoTotalHoras = horas + (minutos / 60) + (segundos / 3600);
    
    const tiempoDisplay = document.getElementById('tiempoTotal');
    tiempoDisplay.textContent = `Tiempo total: ${horas}h ${minutos}m ${segundos}s (${tiempoTotalHoras.toFixed(2)} horas)`;
    
    return tiempoTotalHoras;
  },

  convertToHours() {
    const horas = parseInt(document.getElementById('horas').value) || 0;
    const minutos = parseInt(document.getElementById('minutos').value) || 0;
    const segundos = parseInt(document.getElementById('segundos').value) || 0;
    
    return horas + (minutos / 60) + (segundos / 3600);
  },

  formatTime(horasDecimal) {
    const horas = Math.floor(horasDecimal);
    const minutosDecimal = (horasDecimal - horas) * 60;
    const minutos = Math.floor(minutosDecimal);
    const segundos = Math.round((minutosDecimal - minutos) * 60);
    
    return `${horas}h ${minutos}m ${segundos}s`;
  }
};

// ===== GESTIÓN DE MATERIALES =====
const MaterialManager = {
  updateUnit() {
    const unidad = document.getElementById('unidadMaterial').value;
    const labelTexto = document.getElementById('labelTexto');
    const input = document.getElementById('cantidadMaterial');
    const conversionDisplay = document.getElementById('conversionDisplay');
    
    if (unidad === 'metros') {
      labelTexto.textContent = 'Metros estimados a usar';
      input.placeholder = 'Ej: 30';
      input.setAttribute('step', '0.1');
    } else {
      labelTexto.textContent = 'Gramos estimados a usar';
      input.placeholder = 'Ej: 75';
      input.setAttribute('step', '1');
    }
    
    input.value = '';
    conversionDisplay.style.display = 'none';
    input.oninput = () => this.showConversion();
  },

  updateDensity() {
    const select = document.getElementById('tipoFilamento');
    const densidadCustomDiv = document.getElementById('densidadPersonalizada');
    
    if (select.value === 'personalizado') {
      densidadCustomDiv.style.display = 'block';
      densidadActual = parseFloat(document.getElementById('densidadCustom').value) || densidadPersonalizadaPersistente;
    } else {
      densidadCustomDiv.style.display = 'none';
      densidadActual = parseFloat(select.value);
    }
    
    // Mantener persistencia
    tipoFilamentoPersistente = select.value;
    if (select.value === 'personalizado') {
      densidadPersonalizadaPersistente = densidadActual;
    }
    
    this.showConversion();
  },

  showConversion() {
    const unidad = document.getElementById('unidadMaterial').value;
    const cantidad = parseFloat(document.getElementById('cantidadMaterial').value);
    const conversionDisplay = document.getElementById('conversionDisplay');
    
    if (!cantidad || cantidad <= 0) {
      conversionDisplay.style.display = 'none';
      return;
    }
    
    let textoConversion = '';
    
    if (unidad === 'metros') {
      const gramos = this.convertMetersToGrams(cantidad);
      textoConversion = `≈ ${gramos.toFixed(1)} gramos de filamento`;
    } else {
      const metros = this.convertGramsToMeters(cantidad);
      textoConversion = `≈ ${metros.toFixed(1)} metros de filamento`;
    }
    
    conversionDisplay.textContent = textoConversion;
    conversionDisplay.style.display = 'block';
  },

  convertMetersToGrams(metros) {
    const longitudMm = metros * 1000;
    const volumenMm3 = longitudMm * FILAMENT_CONSTANTS.AREA_SECCION;
    const volumenCm3 = volumenMm3 / 1000;
    const gramos = volumenCm3 * densidadActual;
    
    return gramos;
  },

  convertGramsToMeters(gramos) {
    const volumenCm3 = gramos / densidadActual;
    const volumenMm3 = volumenCm3 * 1000;
    const longitudMm = volumenMm3 / FILAMENT_CONSTANTS.AREA_SECCION;
    const metros = longitudMm / 1000;
    
    return metros;
  },

  getUsedMeters() {
    const unidad = document.getElementById('unidadMaterial').value;
    const cantidad = parseFloat(document.getElementById('cantidadMaterial').value) || 0;
    
    if (unidad === 'metros') {
      return cantidad;
    } else {
      return this.convertGramsToMeters(cantidad);
    }
  },

  getMaterialText() {
    const unidad = document.getElementById('unidadMaterial').value;
    const cantidad = parseFloat(document.getElementById('cantidadMaterial').value) || 0;
    const tipoFilamento = document.getElementById('tipoFilamento');
    const tipoTexto = tipoFilamento.options[tipoFilamento.selectedIndex].text;
    
    if (unidad === 'metros') {
      return `${cantidad}m ${tipoTexto}`;
    } else {
      return `${cantidad}g ${tipoTexto}`;
    }
  }
};

// ===== GESTIÓN DE IMPRESORAS =====
const PrinterManager = {
  applyConsumption() {
    const impresora = document.getElementById('impresora').value;
    const wattsInput = document.getElementById('watts');
    
    if (impresora !== 'manual') {
      wattsInput.value = impresora;
      impresoraPersistente = impresora;
      const impresoraNombre = document.getElementById('impresora').options[document.getElementById('impresora').selectedIndex].text;
      NotificationManager.showInfo(`🖨️ ${impresoraNombre} aplicada`);
    } else {
      wattsInput.value = '';
      wattsInput.focus();
      NotificationManager.showInfo(NOTIFICATION_MESSAGES.info.manualEntry);
    }
  }
};

// ===== GESTIÓN DE COMISIONES =====
const CommissionManager = {
  handle() {
    const select = document.getElementById('comisionMarketplace');
    const comisionCustomDiv = document.getElementById('comisionPersonalizada');
    
    if (select.value === 'personalizada') {
      comisionCustomDiv.style.display = 'block';
      document.getElementById('comisionCustom').focus();
      NotificationManager.showInfo(NOTIFICATION_MESSAGES.info.customPercent);
    } else {
      comisionCustomDiv.style.display = 'none';
      comisionPersistente = select.value;
      const opcionTexto = select.options[select.selectedIndex].text;
      NotificationManager.showInfo(`💼 ${opcionTexto} aplicado`);
    }
  },

  getCommission() {
    const select = document.getElementById('comisionMarketplace');
    
    if (select.value === 'personalizada') {
      return parseFloat(document.getElementById('comisionCustom').value) || 0;
    } else {
      return parseFloat(select.value) || 0;
    }
  }
};

// ===== GESTIÓN DE PRESETS =====
const PresetManager = {
  apply(presetName) {
    const preset = PROJECT_PRESETS[presetName];
    if (!preset) return;
    
    document.getElementById('nombrePieza').value = preset.name;
    document.getElementById('horas').value = preset.hours;
    document.getElementById('minutos').value = preset.minutes;
    document.getElementById('segundos').value = preset.seconds || 0;
    document.getElementById('cantidadMaterial').value = preset.material;
    document.getElementById('unidadMaterial').value = preset.unit;
    document.getElementById('costoCarrete').value = preset.cost;
    document.getElementById('costoExtra').value = preset.extra;
    
    MaterialManager.updateUnit();
    TimeManager.updateDisplay();
    MaterialManager.showConversion();
    
    NotificationManager.showInfo(`⚡ Preset "${presetName}" aplicado`);
  }
};

// ===== CALCULADORA DE PRECIOS =====
const PriceCalculator = {
  calculatePiece(data) {
    const config = ConfigManager.getCurrentConfig();
    
    // Consumo eléctrico
    const consumoKWh = (data.watts * data.tiempoHoras) / 1000;
    const costoLuz = consumoKWh * config.tarifaLuz;
    
    // Material
    const gramosUsados = MaterialManager.convertMetersToGrams(data.metrosUsados);
    const factorDesperdicio = 1 + (data.porcentajeDesperdicio / 100);
    const gramosConDesperdicio = gramosUsados * factorDesperdicio;
    
    const costoFilamento = (gramosConDesperdicio / FILAMENT_CONSTANTS.PESO_CARRETE_ESTANDAR) * data.costoCarrete;
    
    // Trabajo y desgaste
    const costoHoraBase = data.tiempoHoras * config.tarifaHora;
    const desgasteMaquina = data.tiempoHoras * config.desgasteMaquina;
    const desgasteCarrete = (gramosConDesperdicio / 100) * config.desgasteCarrete;

    // Costo base
    const costoBase = costoHoraBase + costoFilamento + costoLuz + desgasteMaquina + desgasteCarrete + data.extra;
    
    // Precio con utilidad
    const precioConUtilidad = costoBase * (1 + config.porcentajeUtilidad / 100);
    
    // Precio final con comisión
    const precioFinal = precioConUtilidad * (1 + data.comision / 100);
    
    return {
      costoBase,
      costoFilamento,
      costoLuz,
      desgasteMaquina,
      desgasteCarrete,
      gramosUsados,
      gramosConDesperdicio,
      precioConUtilidad,
      precioFinal,
      precioTotal: precioFinal * data.cantidad
    };
  },

  detectSmallPiece(precioFinal, tiempoHoras, gramosUsados) {
    const esPiezaPequeña = (
      tiempoHoras < 2 ||
      gramosUsados < 25 ||
      precioFinal > 60
    );
    
    if (!esPiezaPequeña) return null;
    
    let precioObjetivo = 25;
    
    if (tiempoHoras < 1) precioObjetivo = 15;
    else if (tiempoHoras < 1.5) precioObjetivo = 20;
    else if (tiempoHoras < 2) precioObjetivo = 25;
    
    if (gramosUsados > 15) precioObjetivo += 5;
    if (gramosUsados > 30) precioObjetivo += 10;
    
    const cantidadMinima = Math.ceil(precioFinal / precioObjetivo);
    const descuentoPorVolumen = Math.max(0, Math.min(30, (cantidadMinima - 1) * 3));
    const precioConDescuento = precioFinal * (1 - descuentoPorVolumen / 100);
    
    return {
      tipo: 'pieza_pequeña',
      precioActual: precioFinal,
      precioObjetivo: precioObjetivo,
      cantidadMinima: cantidadMinima,
      descuentoPorVolumen: descuentoPorVolumen,
      precioConDescuento: precioConDescuento,
      ahorroTotal: (precioFinal - precioConDescuento) * cantidadMinima
    };
  }
};

// ===== GESTIÓN DE PIEZAS =====
const PieceManager = {
  add() {
    // Validar datos de entrada
    const validationResult = this.validateInput();
    if (!validationResult.valid) {
      NotificationManager.showError(validationResult.message);
      if (validationResult.element) {
        validationResult.element.focus();
      }
      return;
    }

    const data = this.gatherInputData();
    const calculation = PriceCalculator.calculatePiece(data);
    
    // Detectar alertas de pieza pequeña
    const alertaPiezaPequeña = PriceCalculator.detectSmallPiece(
      calculation.precioFinal, 
      data.tiempoHoras, 
      calculation.gramosUsados
    );
    
    // Crear datos de la pieza
    const piezaData = {
      id: Utils.generateId(),
      nombre: data.nombre,
      cantidad: data.cantidad,
      tiempoHoras: data.tiempoHoras,
      tiempoFormateado: TimeManager.formatTime(data.tiempoHoras),
      materialTexto: MaterialManager.getMaterialText(),
      tipoFilamento: data.tipoFilamentoTexto,
      gramosConDesperdicio: calculation.gramosConDesperdicio,
      porcentajeDesperdicio: data.porcentajeDesperdicio,
      nombreImpresora: data.nombreImpresora,
      precioUnitario: calculation.precioFinal,
      precioTotal: calculation.precioTotal,
      watts: data.watts,
      ...calculation
    };

    piezasData.push(piezaData);
    this.addToTable(piezaData);
    this.updateTotal(calculation.precioTotal);
    this.clearForm();
    
    // Scroll a la tabla
    setTimeout(() => {
      document.getElementById('tablaResultados').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
    
    NotificationManager.showSuccess(`${NOTIFICATION_MESSAGES.success.pieceAdded}: ${calculation.precioTotal.toFixed(2)} MXN`);
    
    // Mostrar alerta de pieza pequeña si es necesario
    if (alertaPiezaPequeña) {
      setTimeout(() => {
        this.showSmallPieceAlert(alertaPiezaPequeña, data.nombre);
      }, 800);
    }
  },

  validateInput() {
    const nombre = Utils.sanitizeText(document.getElementById('nombrePieza')?.value);
    const tiempoHoras = TimeManager.convertToHours();
    const metrosUsados = MaterialManager.getUsedMeters();
    const costoCarrete = parseFloat(document.getElementById('costoCarrete')?.value) || 0;
    const watts = parseFloat(document.getElementById('watts')?.value) || 0;

    if (!nombre || nombre.length < VALIDATION_RULES.nameMinLength) {
      return {
        valid: false,
        message: NOTIFICATION_MESSAGES.error.nameRequired,
        element: document.getElementById('nombrePieza')
      };
    }
    
    if (tiempoHoras <= 0) {
      return {
        valid: false,
        message: NOTIFICATION_MESSAGES.error.timeRequired,
        element: document.getElementById('horas')
      };
    }

    if (metrosUsados <= 0) {
      return {
        valid: false,
        message: NOTIFICATION_MESSAGES.error.materialRequired,
        element: document.getElementById('cantidadMaterial')
      };
    }

    if (costoCarrete <= 0) {
      return {
        valid: false,
        message: NOTIFICATION_MESSAGES.error.costRequired,
        element: document.getElementById('costoCarrete')
      };
    }

    if (watts <= 0) {
      return {
        valid: false,
        message: NOTIFICATION_MESSAGES.error.printerRequired,
        element: document.getElementById('impresora')
      };
    }

    return { valid: true };
  },

  gatherInputData() {
    const impresora = document.getElementById('impresora');
    const tipoFilamento = document.getElementById('tipoFilamento');
    
    return {
      nombre: Utils.sanitizeText(document.getElementById('nombrePieza').value),
      cantidad: parseInt(document.getElementById('cantidad').value) || 1,
      tiempoHoras: TimeManager.convertToHours(),
      watts: parseFloat(document.getElementById('watts').value) || 0,
      costoCarrete: parseFloat(document.getElementById('costoCarrete').value) || 0,
      metrosUsados: MaterialManager.getUsedMeters(),
      extra: parseFloat(document.getElementById('costoExtra').value) || 0,
      comision: CommissionManager.getCommission(),
      porcentajeDesperdicio: parseFloat(document.getElementById('porcentajeDesperdicio').value) || 10,
      nombreImpresora: impresora.options[impresora.selectedIndex].text,
      tipoFilamentoTexto: tipoFilamento.options[tipoFilamento.selectedIndex].text
    };
  },

  addToTable(piezaData) {
    const tbody = document.querySelector('#resumenTabla tbody');
    const fila = document.createElement('tr');
    fila.setAttribute('data-pieza-id', piezaData.id);
    
    fila.innerHTML = `
      <td>
        <strong>${piezaData.nombre}</strong>
        <br><small style="color: var(--text-secondary);">${piezaData.nombreImpresora}</small>
      </td>
      <td>
        <input type="number" value="${piezaData.cantidad}" min="1" max="999" 
               onchange="PieceManager.updateQuantity(this, ${piezaData.precioUnitario.toFixed(2)}, '${piezaData.id}')" 
               style="width: 80px;" />
      </td>
      <td>${piezaData.tiempoFormateado}</td>
      <td>
        <span class="material-info">${piezaData.materialTexto}</span>
        <br><small style="color: var(--text-secondary);">${piezaData.gramosConDesperdicio.toFixed(0)}g total (${piezaData.porcentajeDesperdicio}% desp.)</small>
      </td>
      <td>${piezaData.precioUnitario.toFixed(2)}</td>
      <td class="total-fila"><strong>${piezaData.precioTotal.toFixed(2)}</strong></td>
      <td>
        <button class="edit-btn" onclick="PieceManager.edit('${piezaData.id}')">✏️ Editar</button>
        <button class="eliminar-btn" onclick="PieceManager.remove(this, ${piezaData.precioTotal}, '${piezaData.id}')">🗑️ Eliminar</button>
      </td>
    `;

    tbody.appendChild(fila);
    document.getElementById('tablaResultados').style.display = 'block';
  },

  updateQuantity(input, precioUnitario, piezaId) {
    const nuevaCantidad = parseInt(input.value) || 1;
    if (nuevaCantidad < 1) {
      input.value = 1;
      return;
    }
    
    const fila = input.closest('tr');
    const totalCell = fila.querySelector('.total-fila');
    const eliminarBtn = fila.querySelector('.eliminar-btn');
    
    // Obtener el total anterior
    const totalAnteriorText = totalCell.textContent.replace(/[$,\s]/g, '');
    const totalAnterior = parseFloat(totalAnteriorText) || 0;
    
    // Calcular nuevo total
    const nuevoTotal = precioUnitario * nuevaCantidad;
    
    // Actualizar la celda del total
    totalCell.innerHTML = `<strong>${nuevoTotal.toFixed(2)}</strong>`;
    
    // Actualizar el onclick del botón eliminar
    eliminarBtn.setAttribute('onclick', `PieceManager.remove(this, ${nuevoTotal}, '${piezaId}')`);
    
    // Actualizar datos estructurados
    const piezaData = piezasData.find(p => p.id === piezaId);
    if (piezaData) {
      piezaData.cantidad = nuevaCantidad;
      piezaData.precioTotal = nuevoTotal;
    }
    
    // Actualizar total general
    totalGeneral = totalGeneral - totalAnterior + nuevoTotal;
    document.getElementById('totalGeneral').textContent = totalGeneral.toFixed(2);
    
    NotificationManager.showInfo(`${NOTIFICATION_MESSAGES.info.quantityUpdated}: ${nuevaCantidad} piezas = ${nuevoTotal.toFixed(2)}`);
  },

  edit(piezaId) {
    const piezaData = piezasData.find(p => p.id === piezaId);
    if (!piezaData) {
      NotificationManager.showError(NOTIFICATION_MESSAGES.error.pieceNotFound);
      return;
    }

    // Precargar datos en el formulario
    document.getElementById('nombrePieza').value = piezaData.nombre;
    document.getElementById('cantidad').value = piezaData.cantidad;
    
    // Convertir horas decimales de vuelta a h:m:s
    const horas = Math.floor(piezaData.tiempoHoras);
    const minutosDecimal = (piezaData.tiempoHoras - horas) * 60;
    const minutos = Math.floor(minutosDecimal);
    const segundos = Math.round((minutosDecimal - minutos) * 60);
    
    document.getElementById('horas').value = horas;
    document.getElementById('minutos').value = minutos;
    document.getElementById('segundos').value = segundos;
    
    // Aproximar material
    const gramosOriginales = piezaData.gramosConDesperdicio / (1 + piezaData.porcentajeDesperdicio / 100);
    document.getElementById('cantidadMaterial').value = gramosOriginales.toFixed(0);
    document.getElementById('unidadMaterial').value = 'gramos';
    
    // Eliminar la pieza actual
    this.remove(document.querySelector(`tr[data-pieza-id="${piezaId}"] .eliminar-btn`), piezaData.precioTotal, piezaId, false);
    
    // Actualizar displays
    TimeManager.updateDisplay();
    MaterialManager.updateUnit();
    
    // Scroll al formulario
    document.getElementById('nombrePieza').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('nombrePieza').focus();
    
    NotificationManager.showInfo(NOTIFICATION_MESSAGES.info.loadedForEdit);
  },

  remove(boton, monto, piezaId, confirmar = true) {
    if (confirmar && !confirm('¿Estás seguro de que quieres eliminar esta pieza de la cotización?')) {
      return;
    }
    
    const fila = boton.closest('tr');
    
    // Obtener el monto actual de la fila
    const totalCell = fila.querySelector('.total-fila');
    const totalActual = totalCell ? parseFloat(totalCell.textContent.replace(/[$,\s]/g, '')) || 0 : monto;
    
    // Eliminar de datos estructurados
    const index = piezasData.findIndex(p => p.id === piezaId);
    if (index > -1) {
      piezasData.splice(index, 1);
    }
    
    // Animar eliminación
    fila.style.transform = 'scale(0.8)';
    fila.style.opacity = '0.5';
    
    setTimeout(() => {
      fila.remove();
      totalGeneral -= totalActual;
      document.getElementById('totalGeneral').textContent = totalGeneral.toFixed(2);
      
      const filas = document.querySelectorAll('#resumenTabla tbody tr');
      if (filas.length === 0) {
        document.getElementById('tablaResultados').style.display = 'none';
        totalGeneral = 0;
        piezasData = [];
      }
      
      if (confirmar) {
        NotificationManager.showInfo(NOTIFICATION_MESSAGES.info.pieceDeleted);
      }
    }, 300);
  },

  clearForm() {
    document.getElementById('nombrePieza').value = '';
    document.getElementById('cantidad').value = '1';
    document.getElementById('horas').value = '0';
    document.getElementById('minutos').value = '0';
    document.getElementById('segundos').value = '0';
    document.getElementById('cantidadMaterial').value = '';
    document.getElementById('costoCarrete').value = '';
    document.getElementById('costoExtra').value = '';
    
    // Mantener configuraciones persistentes
    document.getElementById('impresora').value = impresoraPersistente;
    document.getElementById('comisionMarketplace').value = comisionPersistente;
    document.getElementById('porcentajeDesperdicio').value = desperdicioPersistente;
    document.getElementById('tipoFilamento').value = tipoFilamentoPersistente;
    
    // Restaurar densidad personalizada si es necesaria
    if (tipoFilamentoPersistente === 'personalizado') {
      document.getElementById('densidadCustom').value = densidadPersonalizadaPersistente;
      document.getElementById('densidadPersonalizada').style.display = 'block';
    } else {
      document.getElementById('densidadPersonalizada').style.display = 'none';
    }
    
    if (impresoraPersistente !== 'manual') {
      document.getElementById('watts').value = impresoraPersistente;
    } else {
      document.getElementById('watts').value = '';
    }
    
    document.getElementById('comisionPersonalizada').style.display = 'none';
    document.getElementById('conversionDisplay').style.display = 'none';
    
    TimeManager.updateDisplay();
    MaterialManager.updateDensity();
    
    document.getElementById('nombrePieza').focus();
  },

  updateTotal(amount) {
    totalGeneral += amount;
    document.getElementById('totalGeneral').textContent = totalGeneral.toFixed(2);
  },

  clearAll() {
    if (confirm('¿Estás seguro de que quieres eliminar todas las piezas de la cotización?')) {
      document.querySelector('#resumenTabla tbody').innerHTML = '';
      totalGeneral = 0;
      piezasData = [];
      document.getElementById('totalGeneral').textContent = '0.00';
      document.getElementById('tablaResultados').style.display = 'none';
      NotificationManager.showInfo(NOTIFICATION_MESSAGES.info.tableCleared);
    }
  },

  showSmallPieceAlert(alerta, nombrePieza) {
    const mensaje = `
      <div style="text-align: left; line-height: 1.4;">
        <strong>💡 Sugerencia para "${nombrePieza}"</strong><br><br>
        
        <strong>Situación actual:</strong><br>
        • Precio unitario: $${alerta.precioActual.toFixed(2)} MXN<br>
        • Precio objetivo competitivo: $${alerta.precioObjetivo.toFixed(2)} MXN<br><br>
        
        <strong>💰 Recomendación:</strong><br>
        • Vender mínimo <strong>${alerta.cantidadMinima} piezas</strong><br>
        • Con descuento por volumen: <strong>${alerta.descuentoPorVolumen}%</strong><br>
        • Precio final: <strong>$${alerta.precioConDescuento.toFixed(2)} por pieza</strong><br>
        • Ahorro para el cliente: $${alerta.ahorroTotal.toFixed(2)} MXN<br><br>
        
        <em style="color: #CD9430;">🎯 Esto hace tu producto más competitivo y atractivo</em>
      </div>
    `;
    
    ModalManager.show(mensaje, [
      {
        text: '✅ Entendido',
        onclick: 'ModalManager.close()'
      },
      {
        text: '🚀 Aplicar Sugerencia',
        onclick: `PieceManager.applySuggestion(${alerta.cantidadMinima}, ${alerta.precioConDescuento.toFixed(2)}); ModalManager.close();`
      }
    ]);
  },

  applySuggestion(cantidad, precioSugerido) {
    document.getElementById('cantidad').value = cantidad;
    NotificationManager.showSuccess(`${NOTIFICATION_MESSAGES.info.suggestionApplied}: ${cantidad} piezas a ${precioSugerido} c/u`);
  }
};

// ===== GESTIÓN DE MODALES =====
const ModalManager = {
  show(content, buttons = []) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      font-family: inherit;
    `;
    
    const contenido = document.createElement('div');
    contenido.style.cssText = `
      background: linear-gradient(135deg, #1a1a2e 0%, #2d2d3a 100%);
      color: #e0e0e0;
      padding: 2rem;
      border-radius: 15px;
      max-width: 500px;
      margin: 1rem;
      border: 2px solid #CD9430;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    `;
    
    const buttonsHtml = buttons.map(btn => 
      `<button onclick="${btn.onclick}" style="
        padding: 0.8rem 1.5rem;
        background: ${btn.color || '#CD9430'};
        color: ${btn.textColor || '#0e0e0e'};
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        margin: 0.3rem;
      ">${btn.text}</button>`
    ).join('');
    
    contenido.innerHTML = `
      ${content}
      <div style="text-align: center; margin-top: 1.5rem;">
        ${buttonsHtml}
      </div>
    `;
    
    modal.appendChild(contenido);
    document.body.appendChild(modal);
    
    // Cerrar con Escape
    const cerrarConEsc = (e) => {
      if (e.key === 'Escape') {
        this.close();
        document.removeEventListener('keydown', cerrarConEsc);
      }
    };
    document.addEventListener('keydown', cerrarConEsc);
    
    return modal;
  },

  close() {
    const modales = document.querySelectorAll('.modal-overlay');
    modales.forEach(modal => modal.remove());
  }
};

// ===== GENERADOR DE PDF =====
const PDFGenerator = {
  generate() {
    if (piezasData.length === 0) {
      NotificationManager.showError(NOTIFICATION_MESSAGES.error.noPiecesForPDF);
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const branding = APP_CONFIG.branding;

    this.addHeader(doc, branding);
    this.addPieceDetails(doc);
    this.addSummary(doc);
    this.addFooter(doc, branding);

    const nombreArchivo = `cotizacion_forge3d_${new Date().toISOString().slice(0, 10)}_${new Date().getTime()}.pdf`;
    doc.save(nombreArchivo);
    
    NotificationManager.showSuccess(NOTIFICATION_MESSAGES.success.pdfGenerated);
  },

  addHeader(doc, branding) {
    // Título principal
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(branding.company.name || 'Cotizador Forge3D', 20, 25);
    
    doc.setFontSize(16);
    doc.text("Cotización Forge3D", 20, 40);
    
    // Información de empresa
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    let yPos = 50;
    if (branding.company.website) {
      doc.text(`Web: ${branding.company.website}`, 20, yPos);
      yPos += 4;
    }
    if (branding.company.email) {
      doc.text(`Email: ${branding.company.email}`, 20, yPos);
      yPos += 4;
    }
    
    // Fecha y hora
    const fecha = new Date().toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Fecha de cotización: ${fecha}`, 20, yPos + 5);
  },

  addPieceDetails(doc) {
    let y = 75;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("Detalle de piezas:", 20, y);
    y += 15;

    doc.setFont(undefined, 'normal');
    piezasData.forEach((pieza, index) => {
      // Verificar si necesita nueva página
      if (y > 250) {
        doc.addPage();
        y = 30;
      }

      // Título de la pieza
      doc.setFont(undefined, 'bold');
      doc.setFontSize(11);
      doc.text(`${index + 1}. ${pieza.nombre}`, 25, y);
      y += 7;
      
      // Información básica
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      doc.text(`   Cantidad: ${pieza.cantidad} piezas | Tiempo: ${pieza.tiempoFormateado}`, 30, y);
      y += 5;
      
      doc.text(`   Material: ${pieza.tipoFilamento}`, 30, y);
      y += 4;
      doc.text(`   Consumo: ${pieza.materialTexto} (${pieza.gramosConDesperdicio.toFixed(0)}g total con ${pieza.porcentajeDesperdicio}% desperdicio)`, 30, y);
      y += 5;
      
      doc.text(`   Impresora: ${pieza.nombreImpresora} (${pieza.watts}W)`, 30, y);
      y += 5;
      
      doc.text(`   Costo base: ${pieza.costoBase.toFixed(2)} | Filamento: ${pieza.costoFilamento.toFixed(2)} | Luz: ${pieza.costoLuz.toFixed(2)}`, 30, y);
      y += 5;
      
      // Precios
      doc.setFont(undefined, 'bold');
      doc.text(`   Precio unitario: ${pieza.precioUnitario.toFixed(2)} | Total: ${pieza.precioTotal.toFixed(2)} MXN`, 30, y);
      y += 10;
    });

    return y;
  },

  addSummary(doc) {
    let y = this.addPieceDetails(doc);

    // Total general
    y += 10;
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(`TOTAL GENERAL: ${totalGeneral.toFixed(2)} MXN`, 20, y);

    // Resumen estadístico
    y += 15;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text("RESUMEN ESTADÍSTICO:", 20, y);
    y += 7;
    
    doc.setFont(undefined, 'normal');
    const totalPiezas = piezasData.reduce((sum, p) => sum + p.cantidad, 0);
    const tiempoTotal = piezasData.reduce((sum, p) => sum + (p.tiempoHoras * p.cantidad), 0);
    const gramosTotal = piezasData.reduce((sum, p) => sum + (p.gramosConDesperdicio * p.cantidad), 0);
    
    doc.text(`• Total de piezas: ${totalPiezas}`, 25, y);
    y += 5;
    doc.text(`• Tiempo total de impresión: ${TimeManager.formatTime(tiempoTotal)}`, 25, y);
    y += 5;
    doc.text(`• Material total requerido: ${gramosTotal.toFixed(0)}g (${(gramosTotal/1000).toFixed(2)}kg)`, 25, y);
    y += 5;
    doc.text(`• Promedio por pieza: ${(totalGeneral/totalPiezas).toFixed(2)} MXN`, 25, y);

    return y;
  },

  addFooter(doc, branding) {
    let y = this.addSummary(doc);

    // Notas legales
    y += 15;
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text("NOTAS IMPORTANTES:", 20, y);
    y += 8;
    doc.setFont(undefined, 'normal');
    doc.text("• Los precios son estimaciones y pueden cambiar sin previo aviso", 25, y);
    y += 6;
    doc.text("• No se incluye costo de entrega y/o envío", 25, y);
    y += 6;
    doc.text("• Precios expresados en pesos mexicanos más IVA", 25, y);
    y += 6;
    doc.text("• Cotización válida por 30 días", 25, y);
    y += 6;
    doc.text("• Tiempo de entrega: 3-7 días hábiles", 25, y);

    // Footer empresarial
    y += 20;
    doc.setFont(undefined, 'bold');
    doc.text(`${branding.company.name} - ${branding.company.slogan || 'Cotizador Forge3D'}`, 20, y);
    y += 6;
    doc.setFont(undefined, 'normal');
    doc.text(`Cotizador Forge3D - ${branding.company.website || 'https://goldtech.mx'}`, 20, y);
    y += 4;
    doc.text("Síguenos: @goldtechmx en todas las redes sociales", 20, y);
  }
};

// ===== GESTIÓN DE ATAJOS DE TECLADO =====
const KeyboardManager = {
  init() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        PieceManager.add();
      }
      if (e.key === 'Escape') {
        const modales = document.querySelectorAll('.modal-overlay');
        if (modales.length > 0) {
          ModalManager.close();
          return;
        }
        if (sidebarVisible) {
          SidebarManager.close();
          return;
        }
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => input.blur());
      }
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        PieceManager.clearForm();
      }
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        if (document.getElementById('tablaResultados').style.display !== 'none') {
          PDFGenerator.generate();
        }
      }
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        ThemeManager.toggle();
      }
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        SidebarManager.toggle();
      }
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        SidebarManager.toggle();
        ConfigTabsManager.switch('branding');
      }
    });
  }
};

// ===== FUNCIONES GLOBALES DE BRANDING =====
function updateBranding() {
  BrandingUIManager.saveBrandingFromUI();
}

function updateBrandingColors() {
  BrandingUIManager.updateBrandingColors();
}

function uploadLogo(type) {
  const fileInput = document.getElementById(`logo${type.charAt(0).toUpperCase() + type.slice(1)}Upload`);
  const file = fileInput.files[0];
  
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    NotificationManager.showError('Por favor selecciona un archivo de imagen válido');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB
    NotificationManager.showError('El archivo es demasiado grande. Máximo 5MB');
    return;
  }
  
  Utils.fileToBase64(file)
    .then(base64 => {
      const branding = APP_CONFIG.branding;
      const theme = currentTheme;
      
      // Actualizar configuración
      if (!branding.logos[type]) {
        branding.logos[type] = {};
      }
      branding.logos[type][theme] = base64;
      
      // Guardar configuración
      BrandingManager.save(branding);
      
      // Actualizar preview
      const preview = document.getElementById(`logoPreview${type.charAt(0).toUpperCase() + type.slice(1)}`);
      if (preview) {
        preview.src = base64;
        preview.classList.add('loaded');
      }
      
      // Actualizar interfaz
      BrandingManager.apply();
      
      NotificationManager.showSuccess(NOTIFICATION_MESSAGES.success.logoUploaded);
    })
    .catch(error => {
      console.error('Error uploading logo:', error);
      NotificationManager.showError(NOTIFICATION_MESSAGES.error.logoUploadError);
    });
}

function resetBranding() {
  if (confirm('¿Estás seguro de que quieres resetear toda la configuración de marca a los valores por defecto?')) {
    BrandingManager.reset();
    BrandingUIManager.loadBrandingToUI();
    NotificationManager.showSuccess('🔄 Configuración de marca reseteada');
  }
}

function exportBranding() {
  try {
    BrandingManager.export();
    NotificationManager.showSuccess(NOTIFICATION_MESSAGES.success.brandingExported);
  } catch (error) {
    console.error('Error exporting branding:', error);
    NotificationManager.showError('Error al exportar configuración de marca');
  }
}

function importBranding() {
  const fileInput = document.getElementById('importBranding');
  const file = fileInput.files[0];
  
  if (!file) return;
  
  BrandingManager.import(file)
    .then(branding => {
      BrandingUIManager.loadBrandingToUI();
      NotificationManager.showSuccess(NOTIFICATION_MESSAGES.success.brandingImported);
    })
    .catch(error => {
      console.error('Error importing branding:', error);
      NotificationManager.showError(NOTIFICATION_MESSAGES.error.brandingImportError);
    });
}

function switchConfigTab(tabName) {
  ConfigTabsManager.switch(tabName);
}

// Extensión del BrandingUIManager
BrandingUIManager.saveBrandingFromUI = function() {
  const branding = {
    company: {
      name: document.getElementById('brandingCompanyName')?.value || '',
      slogan: document.getElementById('brandingSlogan')?.value || '',
      website: document.getElementById('brandingWebsite')?.value || '',
      email: document.getElementById('brandingEmail')?.value || ''
    },
    colors: {
      primary: document.getElementById('brandingColorPrimary')?.value || '#CD9430',
      secondary: document.getElementById('brandingColorSecondary')?.value || '#e1aa4a'
    },
    social: {
      tiktok: document.getElementById('brandingSocialTiktok')?.value || '',
      instagram: document.getElementById('brandingSocialInstagram')?.value || '',
      youtube: document.getElementById('brandingSocialYoutube')?.value || '',
      linkedin: document.getElementById('brandingSocialLinkedin')?.value || '',
      facebook: document.getElementById('brandingSocialFacebook')?.value || '',
      whatsapp: document.getElementById('brandingSocialWhatsapp')?.value || ''
    },
    customization: {
      showCompanyInfo: document.getElementById('brandingShowCompanyInfo')?.checked ?? true,
      showSocialLinks: document.getElementById('brandingShowSocialLinks')?.checked ?? true,
      showBrandingFooter: document.getElementById('brandingShowBrandingFooter')?.checked ?? true,
      showForge3DLogo: document.getElementById('brandingShowForge3DLogo')?.checked ?? true,
      allowThemeToggle: document.getElementById('brandingAllowThemeToggle')?.checked ?? true
    }
  };
  
  // Mantener logos existentes
  branding.logos = APP_CONFIG.branding.logos;
  
  BrandingManager.save(branding);
};

// ===== FUNCIONES GLOBALES (para compatibilidad con HTML) =====
function toggleSidebar() {
  SidebarManager.toggle();
}

function closeSidebar() {
  SidebarManager.close();
}

function toggleTheme() {
  ThemeManager.toggle();
}

function aplicarValorRapido(campo, valor) {
  document.getElementById(campo).value = valor;
  
  if (campo === 'porcentajeDesperdicio') {
    desperdicioPersistente = valor;
  }
  
  ConfigManager.save();
  NotificationManager.showInfo(`⚡ ${campo}: ${valor} aplicado`);
}

function aplicarOpcionRapida(campo, valor) {
  const elemento = document.getElementById(campo);
  elemento.value = valor;
  
  if (campo === 'comisionMarketplace') {
    comisionPersistente = valor;
    CommissionManager.handle();
  } else if (campo === 'impresora') {
    impresoraPersistente = valor;
    PrinterManager.applyConsumption();
  }
  
  const nombres = {
    'comisionMarketplace': 'Comisión',
    'impresora': 'Impresora'
  };
  
  NotificationManager.showInfo(`⚡ ${nombres[campo] || campo}: ${valor} aplicado`);
}

function guardarConfiguracion() {
  ConfigManager.save();
}

function restaurarConfiguracion() {
  ConfigManager.reset();
}

function exportarConfiguracion() {
  ConfigManager.export();
}

function importarConfiguracion() {
  const file = document.getElementById('importConfig').files[0];
  ConfigManager.import(file);
}

function actualizarTiempoTotal() {
  TimeManager.updateDisplay();
}

function cambiarUnidadMaterial() {
  MaterialManager.updateUnit();
}

function actualizarDensidad() {
  MaterialManager.updateDensity();
}

function aplicarConsumoImpresora() {
  PrinterManager.applyConsumption();
}

function manejarComisionMarketplace() {
  CommissionManager.handle();
}

function aplicarPresetRapido(preset) {
  PresetManager.apply(preset);
}

function agregarPieza() {
  PieceManager.add();
}

function limpiarTabla() {
  PieceManager.clearAll();
}

function generarPDF() {
  PDFGenerator.generate();
}

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
const App = {
  init() {
    try {
      // Inicializar componentes
      ThemeManager.init();
      ConfigManager.load();
      BrandingUIManager.init();
      KeyboardManager.init();
      
      // Configurar eventos
      this.setupEventListeners();
      
      // Aplicar configuración inicial
      this.applyInitialSettings();
      
      // Mostrar mensajes de bienvenida
      this.showWelcomeMessages();
      
      console.log('Forge3D App with Branding initialized successfully');
    } catch (error) {
      console.error('Error initializing app:', error);
      NotificationManager.showError('Error al inicializar la aplicación');
    }
  },

  setupEventListeners() {
    // Eventos de tiempo
    const timeInputs = ['horas', 'minutos', 'segundos'];
    timeInputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', TimeManager.updateDisplay);
        element.addEventListener('change', function() {
          if (id === 'minutos' || id === 'segundos') {
            if (this.value > 59) this.value = 59;
            if (this.value < 0) this.value = 0;
          }
          TimeManager.updateDisplay();
        });
      }
    });

    // Eventos de material
    const materialInput = document.getElementById('cantidadMaterial');
    if (materialInput) {
      materialInput.oninput = MaterialManager.showConversion.bind(MaterialManager);
    }

    const densidadCustom = document.getElementById('densidadCustom');
    if (densidadCustom) {
      densidadCustom.addEventListener('input', function() {
        if (document.getElementById('tipoFilamento').value === 'personalizado') {
          densidadActual = parseFloat(this.value) || 1.24;
          densidadPersonalizadaPersistente = densidadActual;
          MaterialManager.showConversion();
        }
      });
    }

    // Eventos de configuración
    const configInputs = document.querySelectorAll('.sidebar input');
    configInputs.forEach(input => {
      if (!input.id.startsWith('branding')) {
        input.addEventListener('change', ConfigManager.save);
      }
    });

    // Validación de números positivos
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
      input.addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
      });
    });

    // Eventos persistentes
    const porcentajeDesperdicioInput = document.getElementById('porcentajeDesperdicio');
    if (porcentajeDesperdicioInput) {
      porcentajeDesperdicioInput.addEventListener('change', function() {
        desperdicioPersistente = parseFloat(this.value) || 10;
      });
    }

    const tipoFilamentoSelect = document.getElementById('tipoFilamento');
    if (tipoFilamentoSelect) {
      tipoFilamentoSelect.addEventListener('change', function() {
        tipoFilamentoPersistente = this.value;
        MaterialManager.updateDensity();
      });
    }
  },

  applyInitialSettings() {
    // Aplicar branding
    BrandingManager.apply();
    
    // Inicializar displays
    TimeManager.updateDisplay();
    MaterialManager.updateUnit();
    
    // Enfocar primer campo
    const nombrePiezaInput = document.getElementById('nombrePieza');
    if (nombrePiezaInput) {
      nombrePiezaInput.focus();
    }
  },

  showWelcomeMessages() {
    setTimeout(() => {
      NotificationManager.showSuccess(NOTIFICATION_MESSAGES.success.welcome);
    }, 500);
    
    setTimeout(() => {
      NotificationManager.showInfo(NOTIFICATION_MESSAGES.info.configTip);
    }, 3500);
    
    setTimeout(() => {
      NotificationManager.showInfo(NOTIFICATION_MESSAGES.info.brandingTip);
    }, 6000);
    
    setTimeout(() => {
      NotificationManager.showInfo(NOTIFICATION_MESSAGES.info.smartAlerts);
    }, 8500);
    
    setTimeout(() => {
      NotificationManager.showInfo(NOTIFICATION_MESSAGES.info.editableTip);
    }, 11000);
  }
};

// ===== INICIALIZACIÓN AUTOMÁTICA =====
document.addEventListener('DOMContentLoaded', () => {
  // Verificar que las dependencias estén cargadas
  if (typeof window.ForgeConfig === 'undefined') {
    console.error('Config not loaded');
    return;
  }
  
  App.init();
});

// ===== EXPORTAR PARA MÓDULOS =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    App,
    Utils,
    ThemeManager,
    ConfigManager,
    BrandingUIManager,
    NotificationManager,
    SidebarManager,
    ConfigTabsManager,
    TimeManager,
    MaterialManager,
    PrinterManager,
    CommissionManager,
    PresetManager,
    PriceCalculator,
    PieceManager,
    ModalManager,
    PDFGenerator,
    KeyboardManager
  };
}