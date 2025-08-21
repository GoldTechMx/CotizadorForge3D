/**
 * Google Analytics 4 Setup para Forge3D
 */

// Configuración GA4
const GA4_CONFIG = {
  measurementId: 'G-XXXXXXXXXX', // Reemplazar con ID real
  
  // Eventos personalizados
  events: {
    piece_added: 'piece_added',
    pdf_generated: 'pdf_generated',
    config_changed: 'config_changed',
    preset_used: 'preset_used',
    share_quote: 'share_quote',
    help_viewed: 'help_viewed'
  },

  // Parámetros personalizados
  customParameters: {
    user_type: 'free_user',
    app_version: '2.1.0',
    platform: 'web'
  }
};

// Inicializar GA4
function initializeGA4() {
  // Cargar script GA4
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_CONFIG.measurementId}`;
  document.head.appendChild(script);

  // Inicializar gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  // Configurar GA4
  gtag('config', GA4_CONFIG.measurementId, {
    page_title: document.title,
    page_location: window.location.href,
    custom_map: {
      'custom_parameter_1': 'user_type',
      'custom_parameter_2': 'app_version'
    }
  });

  window.gtag = gtag;
  
  // Configurar eventos automáticos
  setupAutomaticTracking();
}

// Configurar tracking automático
function setupAutomaticTracking() {
  // Track file downloads (PDFs)
  document.addEventListener('click', (e) => {
    if (e.target.textContent.includes('PDF')) {
      trackEvent('file_download', {
        file_name: 'cotizacion_forge3d.pdf',
        file_extension: 'pdf'
      });
    }
  });

  // Track external links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.hostname !== window.location.hostname) {
      trackEvent('click', {
        link_url: link.href,
        link_text: link.textContent.trim()
      });
    }
  });

  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener('scroll', debounce(() => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
      maxScroll = scrollPercent;
      trackEvent('scroll', { percent_scrolled: maxScroll });
    }
  }, 1000));
}

// Función para tracking de eventos
function trackEvent(eventName, parameters = {}) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      ...GA4_CONFIG.customParameters,
      ...parameters
    });
  }
  
  if (ENV_CONFIG.debugMode) {
    console.log('📊 Analytics Event:', eventName, parameters);
  }
}

// Función de debounce
function debounce(func, wait) {
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

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGA4);
} else {
  initializeGA4();
}

// Exportar para uso en otros módulos
window.ForgeAnalytics = {
  trackEvent,
  GA4_CONFIG
};
