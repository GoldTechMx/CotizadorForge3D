/**
 * WhatsApp Floating Button
 * Forge3D Cotizador v2.1
 */

'use strict';

class WhatsAppFloating {
  constructor() {
    this.config = null;
    this.button = null;
    this.showTimer = null;
    this.scrollHandler = null;
    this.isVisible = false;
    
    this.init();
  }

  /**
   * Inicializar el componente
   */
  init() {
    // Esperar a que se cargue la configuración de branding
    if (typeof brandingManager !== 'undefined' && brandingManager.currentBranding) {
      this.loadConfig();
      this.createButton();
      this.setupEvents();
    } else {
      // Reintentar en 500ms
      setTimeout(() => this.init(), 500);
    }
  }

  /**
   * Cargar configuración
   */
  loadConfig() {
    const branding = brandingManager.currentBranding;
    this.config = {
      enabled: branding.whatsappFloating?.enabled || false,
      number: branding.social?.whatsapp?.number || '',
      position: branding.whatsappFloating?.position || 'bottom-right',
      showAfterSeconds: branding.whatsappFloating?.showAfterSeconds || 10,
      hideOnScroll: branding.whatsappFloating?.hideOnScroll || false,
      animation: branding.whatsappFloating?.animation || 'bounce',
      message: branding.whatsappFloating?.message || 'Hola! Vengo del cotizador Forge3D',
      customMessages: branding.whatsappFloating?.customMessages || {},
      styles: branding.whatsappFloating?.styles || {},
      responsive: branding.whatsappFloating?.responsive || {}
    };

    // No crear si está deshabilitado o no hay número
    if (!this.config.enabled || !this.config.number) {
      return;
    }

    this.applyCSSVariables();
  }

  /**
   * Aplicar variables CSS dinámicas
   */
  applyCSSVariables() {
    const root = document.documentElement;
    const styles = this.config.styles;
    
    if (styles.backgroundColor) {
      root.style.setProperty('--whatsapp-bg', styles.backgroundColor);
    }
    if (styles.hoverColor) {
      root.style.setProperty('--whatsapp-hover', styles.hoverColor);
    }
    if (styles.iconColor) {
      root.style.setProperty('--whatsapp-color', styles.iconColor);
    }
    if (styles.shadow) {
      root.style.setProperty('--whatsapp-shadow', styles.shadow);
    }
    if (styles.size) {
      root.style.setProperty('--whatsapp-size', styles.size);
    }
    if (styles.zIndex) {
      root.style.setProperty('--whatsapp-z-index', styles.zIndex);
    }

    // Responsive
    const responsive = this.config.responsive;
    if (responsive.mobile?.size) {
      root.style.setProperty('--whatsapp-size-mobile', responsive.mobile.size);
    }
    if (responsive.mobile?.margin) {
      root.style.setProperty('--whatsapp-margin-mobile', responsive.mobile.margin);
    }
  }

  /**
   * Crear el botón flotante
   */
  createButton() {
    if (!this.config.enabled || !this.config.number) return;

    // Crear elemento
    this.button = document.createElement('a');
    this.button.className = `whatsapp-floating ${this.config.position} animation-${this.config.animation}`;
    this.button.href = this.getWhatsAppURL();
    this.button.target = '_blank';
    this.button.rel = 'noopener noreferrer';
    this.button.setAttribute('aria-label', 'Contactar por WhatsApp');
    this.button.setAttribute('data-tooltip', 'Chatea con nosotros');

    // Aplicar estilos dinámicos
    if (this.config.styles.size) {
      this.button.style.width = this.config.styles.size;
      this.button.style.height = this.config.styles.size;
    }

    // Crear icono
    const icon = document.createElement('i');
    icon.className = 'fab fa-whatsapp';
    this.button.appendChild(icon);

    // Agregar al DOM
    document.body.appendChild(this.button);

    // Programar aparición
    this.scheduleShow();
  }

  /**
   * Generar URL de WhatsApp
   */
  getWhatsAppURL(messageType = 'general') {
    const number = this.config.number;
    let message = this.config.message;

    // Usar mensaje personalizado si existe
    if (messageType && this.config.customMessages[messageType]) {
      message = this.config.customMessages[messageType];
    }

    // Codificar mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${number}?text=${encodedMessage}`;
  }

  /**
   * Programar aparición del botón
   */
  scheduleShow() {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
    }

    this.showTimer = setTimeout(() => {
      this.show();
    }, this.config.showAfterSeconds * 1000);
  }

  /**
   * Mostrar el botón
   */
  show() {
    if (!this.button || this.isVisible) return;
    
    this.button.classList.add('show');
    this.isVisible = true;

    // Analytics opcional
    this.trackEvent('whatsapp_button_shown');
  }

  /**
   * Ocultar el botón
   */
  hide() {
    if (!this.button || !this.isVisible) return;
    
    this.button.classList.remove('show');
    this.isVisible = false;
  }

  /**
   * Configurar eventos
   */
  setupEvents() {
    if (!this.button) return;

    // Click en el botón
    this.button.addEventListener('click', (e) => {
      this.trackEvent('whatsapp_button_clicked');
      
      // Permitir navegación normal
      return true;
    });

    // Ocultar al hacer scroll (opcional)
    if (this.config.hideOnScroll) {
      this.scrollHandler = this.throttle(() => {
        if (window.scrollY > 100) {
          this.hide();
        } else {
          this.show();
        }
      }, 100);

      window.addEventListener('scroll', this.scrollHandler);
    }

    // Reconfigurar si cambia el branding
    document.addEventListener('brandingUpdated', () => {
      this.destroy();
      this.init();
    });
  }

  /**
   * Cambiar mensaje dinámicamente
   */
  setMessage(messageType = 'general') {
    if (!this.button) return;
    
    this.button.href = this.getWhatsAppURL(messageType);
  }

  /**
   * Actualizar configuración
   */
  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);
    this.applyCSSVariables();
    
    if (this.button) {
      this.button.href = this.getWhatsAppURL();
    }
  }

  /**
   * Destruir el componente
   */
  destroy() {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
    }
    
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
    
    if (this.button) {
      this.button.remove();
      this.button = null;
    }
    
    this.isVisible = false;
  }

  /**
   * Función de throttle para optimizar scroll
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  /**
   * Tracking de eventos (opcional)
   */
  trackEvent(eventName, data = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'WhatsApp',
        ...data
      });
    }
    
    console.log(`WhatsApp Event: ${eventName}`, data);
  }
}

// ===== API GLOBAL =====
window.WhatsAppFloating = WhatsAppFloating;

// ===== FUNCIONES GLOBALES =====
window.whatsappFloating = {
  setMessage: (messageType) => {
    if (window.whatsappFloatingInstance) {
      window.whatsappFloatingInstance.setMessage(messageType);
    }
  },
  
  show: () => {
    if (window.whatsappFloatingInstance) {
      window.whatsappFloatingInstance.show();
    }
  },
  
  hide: () => {
    if (window.whatsappFloatingInstance) {
      window.whatsappFloatingInstance.hide();
    }
  }
};

// ===== INICIALIZACIÓN AUTOMÁTICA =====
document.addEventListener('DOMContentLoaded', () => {
  window.whatsappFloatingInstance = new WhatsAppFloating();
});

console.log('📱 WhatsApp Floating Button loaded');
