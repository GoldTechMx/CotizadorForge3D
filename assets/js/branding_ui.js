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
        this.createBrandingModal();
        this.setupEventListeners();
        this.loadCurrentConfig();
    }

    /**
     * Crea el modal de branding si no existe
     */
    createBrandingModal() {
        if (document.getElementById('brandingModal')) return;

        const modal = document.createElement('div');
        modal.id = 'brandingModal';
        modal.className = 'modal-overlay branding-modal';
        modal.style.display = 'none';

        modal.innerHTML = `
      <div class="modal-content branding-modal-content">
        <div class="modal-header">
          <h2>🎨 Configuración de Branding</h2>
          <button class="modal-close" onclick="BrandingUI.close()">×</button>
        </div>
        
        <div class="branding-tabs">
          <button class="tab-btn active" onclick="BrandingUI.showTab('company')">🏢 Empresa</button>
          <button class="tab-btn" onclick="BrandingUI.showTab('logos')">🖼️ Logos</button>
          <button class="tab-btn" onclick="BrandingUI.showTab('colors')">🎨 Colores</button>
          <button class="tab-btn" onclick="BrandingUI.showTab('social')">📱 Redes</button>
          <button class="tab-btn" onclick="BrandingUI.showTab('whatsapp')">💬 WhatsApp</button>
          <button class="tab-btn" onclick="BrandingUI.showTab('email')">📧 Email</button>
          <button class="tab-btn" onclick="BrandingUI.showTab('seo')">🔍 SEO</button>
          <button class="tab-btn" onclick="BrandingUI.showTab('advanced')">⚙️ Avanzado</button>
        </div>
        
        <div class="branding-content">
          ${this.buildCompanyTab()}
          ${this.buildLogosTab()}
          ${this.buildColorsTab()}
          ${this.buildSocialTab()}
          ${this.buildWhatsAppTab()}
          ${this.buildEmailTab()}
          ${this.buildSEOTab()}
          ${this.buildAdvancedTab()}
        </div>
        
        <div class="modal-footer">
          <button class="btn-secondary" onclick="BrandingUI.togglePreview()">
            👀 Vista Previa
          </button>
          <button class="btn-secondary" onclick="BrandingUI.resetConfig()">
            🔄 Restaurar
          </button>
          <button class="btn-secondary" onclick="BrandingUI.exportConfig()">
            📤 Exportar
          </button>
          <button class="btn-secondary" onclick="document.getElementById('importBrandingFile').click()">
            📥 Importar
          </button>
          <button class="btn-primary" onclick="BrandingUI.saveConfig()">
            💾 Guardar
          </button>
          <button class="btn-success" onclick="BrandingUI.applyAndClose()">
            ✅ Aplicar y Cerrar
          </button>
        </div>
        
        <input type="file" id="importBrandingFile" accept=".json" style="display: none" onchange="BrandingUI.importConfig(this)">
      </div>
    `;

        document.body.appendChild(modal);
    }

    /**
     * Construye la tab de empresa
     */
    buildCompanyTab() {
        return `
      <div id="tab-company" class="tab-content active">
        <h3>🏢 Información de la Empresa</h3>
        
        <div class="form-group">
          <label for="brand-company-name">Nombre de la empresa:</label>
          <input type="text" id="brand-company-name" placeholder="Mi Empresa 3D">
        </div>
        
        <div class="form-group">
          <label for="brand-company-tagline">Eslogan:</label>
          <input type="text" id="brand-company-tagline" placeholder="Soluciones de Impresión 3D">
        </div>
        
        <div class="form-group">
          <label for="brand-company-description">Descripción:</label>
          <textarea id="brand-company-description" rows="3" placeholder="Descripción de la empresa"></textarea>
        </div>
        
        <div class="form-group">
          <label for="brand-company-website">Sitio web:</label>
          <input type="url" id="brand-company-website" placeholder="https://miempresa.com">
        </div>
        
        <div class="form-group">
          <label for="brand-company-email">Email:</label>
          <input type="email" id="brand-company-email" placeholder="contacto@miempresa.com">
        </div>
        
        <div class="form-group">
          <label for="brand-company-phone">Teléfono:</label>
          <input type="tel" id="brand-company-phone" placeholder="+52 477 123 4567">
        </div>
        
        <div class="form-group">
          <label for="brand-company-address">Dirección:</label>
          <input type="text" id="brand-company-address" placeholder="Ciudad, Estado, País">
        </div>
      </div>
    `;
    }

    /**
     * Construye la tab de logos
     */
    buildLogosTab() {
        return `
      <div id="tab-logos" class="tab-content">
        <h3>🖼️ Logos</h3>
        
        <div class="logos-grid">
          <div class="logo-group">
            <h4>Logo Principal (Forge3D)</h4>
            <div class="logo-inputs">
              <div class="form-group">
                <label for="brand-logo-primary-dark">Logo tema oscuro:</label>
                <input type="url" id="brand-logo-primary-dark" placeholder="URL del logo oscuro">
              </div>
              <div class="form-group">
                <label for="brand-logo-primary-light">Logo tema claro:</label>
                <input type="url" id="brand-logo-primary-light" placeholder="URL del logo claro">
              </div>
            </div>
            <div class="logo-preview">
              <img id="logo-primary-preview" src="" alt="Vista previa" style="display: none; max-width: 200px; height: auto;">
            </div>
          </div>
          
          <div class="logo-group">
            <h4>Logo Secundario (Empresa)</h4>
            <div class="logo-inputs">
              <div class="form-group">
                <label for="brand-logo-secondary-dark">Logo empresa oscuro:</label>
                <input type="url" id="brand-logo-secondary-dark" placeholder="URL del logo empresa oscuro">
              </div>
              <div class="form-group">
                <label for="brand-logo-secondary-light">Logo empresa claro:</label>
                <input type="url" id="brand-logo-secondary-light" placeholder="URL del logo empresa claro">
              </div>
            </div>
            <div class="logo-preview">
              <img id="logo-secondary-preview" src="" alt="Vista previa" style="display: none; max-width: 200px; height: auto;">
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="brand-favicon">Favicon:</label>
          <input type="url" id="brand-favicon" placeholder="URL del favicon">
        </div>
        
        <div class="form-group">
          <label for="brand-apple-touch-icon">Apple Touch Icon:</label>
          <input type="url" id="brand-apple-touch-icon" placeholder="URL del icono Apple">
        </div>
      </div>
    `;
    }

    /**
     * Construye la tab de colores
     */
    buildColorsTab() {
        return `
      <div id="tab-colors" class="tab-content">
        <h3>🎨 Colores de Marca</h3>
        
        <div class="color-presets">
          <h4>Presets rápidos:</h4>
          <div class="preset-buttons">
            <button onclick="BrandingUI.applyColorPreset('goldtech')" class="preset-btn goldtech">GoldTech</button>
            <button onclick="BrandingUI.applyColorPreset('blue')" class="preset-btn blue">Azul</button>
            <button onclick="BrandingUI.applyColorPreset('green')" class="preset-btn green">Verde</button>
            <button onclick="BrandingUI.applyColorPreset('purple')" class="preset-btn purple">Morado</button>
            <button onclick="BrandingUI.applyColorPreset('red')" class="preset-btn red">Rojo</button>
          </div>
        </div>
        
        <div class="color-controls">
          <div class="form-group">
            <label for="brand-color-primary">Color Primario:</label>
            <div class="color-input-group">
              <input type="color" id="brand-color-primary" value="#CD9430">
              <input type="text" id="brand-color-primary-hex" value="#CD9430" pattern="^#[0-9A-Fa-f]{6}$">
            </div>
          </div>
          
          <div class="form-group">
            <label for="brand-color-secondary">Color Secundario:</label>
            <div class="color-input-group">
              <input type="color" id="brand-color-secondary" value="#e1aa4a">
              <input type="text" id="brand-color-secondary-hex" value="#e1aa4a" pattern="^#[0-9A-Fa-f]{6}$">
            </div>
          </div>
          
          <div class="form-group">
            <label for="brand-color-accent">Color de Acento:</label>
            <div class="color-input-group">
              <input type="color" id="brand-color-accent" value="#B8851F">
              <input type="text" id="brand-color-accent-hex" value="#B8851F" pattern="^#[0-9A-Fa-f]{6}$">
            </div>
          </div>
        </div>
        
        <div class="color-preview">
          <h4>Vista previa:</h4>
          <div class="preview-elements">
            <div class="preview-button" style="background: var(--accent-primary);">Botón Principal</div>
            <div class="preview-text" style="color: var(--accent-primary);">Texto de Acento</div>
          </div>
        </div>
      </div>
    `;
    }

    /**
     * Construye la tab de redes sociales
     */
    buildSocialTab() {
        return `
      <div id="tab-social" class="tab-content">
        <h3>📱 Redes Sociales</h3>
        
        <div class="social-platforms">
          ${this.buildSocialPlatform('tiktok', 'TikTok', 'fab fa-tiktok')}
          ${this.buildSocialPlatform('instagram', 'Instagram', 'fab fa-instagram')}
          ${this.buildSocialPlatform('youtube', 'YouTube', 'fab fa-youtube')}
          ${this.buildSocialPlatform('linkedin', 'LinkedIn', 'fab fa-linkedin')}
          ${this.buildSocialPlatform('facebook', 'Facebook', 'fab fa-facebook')}
          ${this.buildSocialPlatform('twitter', 'Twitter', 'fab fa-twitter')}
          ${this.buildSocialPlatform('whatsapp', 'WhatsApp', 'fab fa-whatsapp')}
        </div>
      </div>
    `;
    }

    /**
     * Construye un formulario para una plataforma social
     */
    buildSocialPlatform(platform, name, icon) {
        return `
      <div class="social-platform">
        <h4><i class="${icon}"></i> ${name}</h4>
        <div class="social-controls">
          <div class="form-group">
            <label>
              <input type="checkbox" id="social-${platform}-enabled"> 
              Habilitar ${name}
            </label>
          </div>
          <div class="form-group">
            <label for="social-${platform}-url">URL:</label>
            <input type="url" id="social-${platform}-url" placeholder="https://${platform}.com/usuario">
          </div>
          <div class="form-group">
            <label for="social-${platform}-username">Usuario:</label>
            <input type="text" id="social-${platform}-username" placeholder="@usuario">
          </div>
          ${platform === 'whatsapp' ? `
            <div class="form-group">
              <label for="social-${platform}-number">Número:</label>
              <input type="tel" id="social-${platform}-number" placeholder="524771234567">
            </div>
          ` : ''}
        </div>
      </div>
    `;
    }

    /**
     * Construye la tab de WhatsApp Floating
     */
    buildWhatsAppTab() {
        return `
      <div id="tab-whatsapp" class="tab-content">
        <h3>💬 WhatsApp Flotante</h3>
        
        <div class="form-group">
          <label>
            <input type="checkbox" id="whatsapp-floating-enabled"> 
            Habilitar botón flotante
          </label>
        </div>
        
        <div class="whatsapp-config">
          <div class="form-group">
            <label for="whatsapp-floating-position">Posición:</label>
            <select id="whatsapp-floating-position">
              <option value="bottom-right">Abajo derecha</option>
              <option value="bottom-left">Abajo izquierda</option>
              <option value="top-right">Arriba derecha</option>
              <option value="top-left">Arriba izquierda</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="whatsapp-floating-delay">Mostrar después de (segundos):</label>
            <input type="number" id="whatsapp-floating-delay" min="0" max="60" value="10">
          </div>
          
          <div class="form-group">
            <label for="whatsapp-floating-animation">Animación:</label>
            <select id="whatsapp-floating-animation">
              <option value="bounce">Rebote</option>
              <option value="pulse">Pulso</option>
              <option value="slide">Deslizar</option>
              <option value="fade">Aparecer</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="whatsapp-floating-size">Tamaño del botón:</label>
            <input type="range" id="whatsapp-floating-size" min="40" max="80" value="60">
            <span id="whatsapp-size-value">60px</span>
          </div>
          
          <div class="form-group">
            <label for="whatsapp-floating-bg-color">Color de fondo:</label>
            <input type="color" id="whatsapp-floating-bg-color" value="#25D366">
          </div>
          
          <div class="form-group">
            <label for="whatsapp-floating-hover-color">Color al pasar el mouse:</label>
            <input type="color" id="whatsapp-floating-hover-color" value="#128C7E">
          </div>
          
          <div class="form-group">
            <label>
              <input type="checkbox" id="whatsapp-floating-hide-scroll">
              Ocultar al hacer scroll
            </label>
          </div>
        </div>
        
        <h4>💬 Mensajes Personalizados</h4>
        
        <div class="form-group">
          <label for="whatsapp-floating-message">Mensaje predeterminado:</label>
          <textarea id="whatsapp-floating-message" rows="3" placeholder="Mensaje que se enviará por WhatsApp"></textarea>
        </div>
        
        <div class="form-group">
          <label for="whatsapp-floating-message-quote">Mensaje para cotizaciones:</label>
          <textarea id="whatsapp-floating-message-quote" rows="2" placeholder="Mensaje cuando se envía una cotización"></textarea>
        </div>
        
        <div class="form-group">
          <label for="whatsapp-floating-message-support">Mensaje para soporte:</label>
          <textarea id="whatsapp-floating-message-support" rows="2" placeholder="Mensaje para solicitar soporte"></textarea>
        </div>
        
        <div class="form-group">
          <label for="whatsapp-floating-message-general">Mensaje general:</label>
          <textarea id="whatsapp-floating-message-general" rows="2" placeholder="Mensaje general de contacto"></textarea>
        </div>
      </div>
    `;
    }

    /**
     * Construye la tab de Email
     */
    buildEmailTab() {
        return `
      <div id="tab-email" class="tab-content">
        <h3>📧 Templates de Email</h3>
        
        <div class="form-group">
          <label>
            <input type="checkbox" id="email-templates-enabled"> 
            Habilitar templates de email
          </label>
        </div>
        
        <div class="email-config">
          <h4>⚙️ Configuración General</h4>
          
          <div class="form-group">
            <label for="email-provider">Proveedor:</label>
            <select id="email-provider">
              <option value="mailto">Cliente de email local</option>
              <option value="formspree">Formspree</option>
              <option value="emailjs">EmailJS</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="email-sender-name">Nombre del remitente:</label>
            <input type="text" id="email-sender-name" placeholder="Mi Empresa - Forge3D">
          </div>
          
          <div class="form-group">
            <label for="email-sender-email">Email del remitente:</label>
            <input type="email" id="email-sender-email" placeholder="noreply@miempresa.com">
          </div>
          
          <h4>📄 Templates</h4>
          
          <div class="template-group">
            <h5>Cotizaciones</h5>
            <div class="form-group">
              <label for="email-quote-subject">Asunto:</label>
              <input type="text" id="email-quote-subject" placeholder="Cotización Forge3D #{quoteNumber}">
            </div>
            <div class="form-group">
              <label for="email-quote-priority">Prioridad:</label>
              <select id="email-quote-priority">
                <option value="normal">Normal</option>
                <option value="high">Alta</option>
                <option value="low">Baja</option>
              </select>
            </div>
          </div>
          
          <div class="template-group">
            <h5>Soporte</h5>
            <div class="form-group">
              <label for="email-support-subject">Asunto:</label>
              <input type="text" id="email-support-subject" placeholder="Soporte Técnico - Forge3D">
            </div>
            <div class="form-group">
              <label for="email-support-priority">Prioridad:</label>
              <select id="email-support-priority">
                <option value="high">Alta</option>
                <option value="normal">Normal</option>
                <option value="low">Baja</option>
              </select>
            </div>
          </div>
          
          <h4>✍️ Firma</h4>
          
          <div class="form-group">
            <label>
              <input type="checkbox" id="email-signature-company" checked> 
              Incluir información de empresa
            </label>
          </div>
          
          <div class="form-group">
            <label>
              <input type="checkbox" id="email-signature-social" checked> 
              Incluir enlaces de redes sociales
            </label>
          </div>
          
          <div class="form-group">
            <label>
              <input type="checkbox" id="email-signature-whatsapp" checked> 
              Incluir WhatsApp
            </label>
          </div>
        </div>
      </div>
    `;
    }

    /**
     * Construye la tab de SEO
     */
    buildSEOTab() {
        return `
      <div id="tab-seo" class="tab-content">
        <h3>🔍 SEO</h3>
        
        <div class="form-group">
          <label for="brand-seo-title">Título de la página:</label>
          <input type="text" id="brand-seo-title" placeholder="Cotizador Forge3D - Calculadora Profesional">
        </div>
        
        <div class="form-group">
          <label for="brand-seo-description">Descripción meta:</label>
          <textarea id="brand-seo-description" rows="3" placeholder="Descripción para motores de búsqueda"></textarea>
        </div>
        
        <div class="form-group">
          <label for="brand-seo-keywords">Palabras clave:</label>
          <input type="text" id="brand-seo-keywords" placeholder="cotizador 3d, impresion 3d, precios">
        </div>
        
        <div class="form-group">
          <label for="brand-seo-canonical">URL canónica:</label>
          <input type="url" id="brand-seo-canonical" placeholder="https://miempresa.com/cotizador">
        </div>
        
        <div class="form-group">
          <label for="brand-seo-og-image">Imagen Open Graph:</label>
          <input type="url" id="brand-seo-og-image" placeholder="URL de la imagen para redes sociales">
        </div>
      </div>
    `;
    }

    /**
     * Construye la tab avanzada
     */
    buildAdvancedTab() {
        return `
      <div id="tab-advanced" class="tab-content">
        <h3>⚙️ Configuración Avanzada</h3>
        
        <h4>📱 PWA</h4>
        <div class="form-group">
          <label for="brand-pwa-name">Nombre de la app:</label>
          <input type="text" id="brand-pwa-name" placeholder="Cotizador Forge3D">
        </div>
        
        <div class="form-group">
          <label for="brand-pwa-short-name">Nombre corto:</label>
          <input type="text" id="brand-pwa-short-name" placeholder="Forge3D">
        </div>
        
        <h4>📝 Textos Personalizados</h4>
        <div class="form-group">
          <label for="brand-text-app-name">Nombre de la aplicación:</label>
          <input type="text" id="brand-text-app-name" placeholder="Cotizador Forge3D">
        </div>
        
        <div class="form-group">
          <label for="brand-text-app-subtitle">Subtítulo:</label>
          <input type="text" id="brand-text-app-subtitle" placeholder="Calculadora Profesional">
        </div>
        
        <div class="form-group">
          <label for="brand-text-welcome">Mensaje de bienvenida:</label>
          <input type="text" id="brand-text-welcome" placeholder="Bienvenido al cotizador más preciso">
        </div>
        
        <div class="form-group">
          <label for="brand-text-footer">Texto del footer:</label>
          <input type="text" id="brand-text-footer" placeholder="Desarrollado con ❤️ por Mi Empresa">
        </div>
        
        <h4>🔧 Opciones de Personalización</h4>
        <div class="customization-options">
          <label><input type="checkbox" id="custom-show-company"> Mostrar información de empresa</label>
          <label><input type="checkbox" id="custom-show-social"> Mostrar enlaces sociales</label>
          <label><input type="checkbox" id="custom-show-footer"> Mostrar footer de branding</label>
          <label><input type="checkbox" id="custom-show-forge-logo"> Mostrar logo Forge3D</label>
          <label><input type="checkbox" id="custom-allow-theme-toggle"> Permitir cambio de tema</label>
        </div>
      </div>
    `;
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

        // Event listeners para WhatsApp Floating
        const whatsappFloatingInputs = [
            'whatsapp-floating-enabled',
            'whatsapp-floating-position',
            'whatsapp-floating-delay',
            'whatsapp-floating-animation',
            'whatsapp-floating-message'
        ];

        whatsappFloatingInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('change', () => this.updateWhatsAppFloatingPreview());
            }
        });

        // Event listener especial para el slider de tamaño
        const sizeSlider = document.getElementById('whatsapp-floating-size');
        if (sizeSlider) {
            sizeSlider.addEventListener('input', (e) => {
                const sizeValue = document.getElementById('whatsapp-size-value');
                if (sizeValue) {
                    sizeValue.textContent = e.target.value + 'px';
                }
                this.updateWhatsAppFloatingPreview();
            });
        }

        // Event listeners para otros campos
        document.addEventListener('input', (e) => {
            if (e.target.closest('.branding-modal-content')) {
                this.updatePreviewThrottled();
            }
        });

        // Throttle para preview
        this.updatePreviewThrottled = this.throttle(() => {
            if (this.previewMode) {
                this.applyPreview();
            }
        }, 300);
    }

    /**
     * Abre el modal de branding
     */
    open() {
        this.loadCurrentConfig();
        document.getElementById('brandingModal').style.display = 'flex';
        this.isOpen = true;
    }

    /**
     * Cierra el modal de branding
     */
    close() {
        document.getElementById('brandingModal').style.display = 'none';
        this.isOpen = false;

        // Restaurar configuración original si estaba en preview
        if (this.previewMode) {
            brandingManager.saveBranding(this.originalBranding);
            this.previewMode = false;
            this.updatePreviewButton();
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
            if (platform === 'whatsapp') {
                this.setInputValue(`social-${platform}-number`, config.number);
            }
        });

        // WhatsApp Floating
        if (branding.whatsappFloating) {
            this.setCheckboxValue('whatsapp-floating-enabled', branding.whatsappFloating.enabled);
            this.setInputValue('whatsapp-floating-position', branding.whatsappFloating.position);
            this.setInputValue('whatsapp-floating-delay', branding.whatsappFloating.showAfterSeconds);
            this.setCheckboxValue('whatsapp-floating-hide-scroll', branding.whatsappFloating.hideOnScroll);
            this.setInputValue('whatsapp-floating-animation', branding.whatsappFloating.animation);
            this.setInputValue('whatsapp-floating-message', branding.whatsappFloating.message);

            // Mensajes personalizados
            if (branding.whatsappFloating.customMessages) {
                this.setInputValue('whatsapp-floating-message-quote', branding.whatsappFloating.customMessages.quote);
                this.setInputValue('whatsapp-floating-message-support', branding.whatsappFloating.customMessages.support);
                this.setInputValue('whatsapp-floating-message-general', branding.whatsappFloating.customMessages.general);
            }

            // Estilos
            if (branding.whatsappFloating.styles) {
                const size = branding.whatsappFloating.styles.size?.replace('px', '') || '60';
                this.setInputValue('whatsapp-floating-size', size);
                this.setInputValue('whatsapp-floating-bg-color', branding.whatsappFloating.styles.backgroundColor);
                this.setInputValue('whatsapp-floating-hover-color', branding.whatsappFloating.styles.hoverColor);

                // Actualizar el valor mostrado del range
                const sizeValue = document.getElementById('whatsapp-size-value');
                if (sizeValue) {
                    sizeValue.textContent = size + 'px';
                }
            }
        }

        // Email Templates
        if (branding.emailConfig) {
            this.setCheckboxValue('email-templates-enabled', branding.emailConfig.enabled);
            this.setInputValue('email-provider', branding.emailConfig.provider);
            this.setInputValue('email-sender-name', branding.emailConfig.defaultSender?.name);
            this.setInputValue('email-sender-email', branding.emailConfig.defaultSender?.email);

            // Templates
            if (branding.emailConfig.templates) {
                this.setInputValue('email-quote-subject', branding.emailConfig.templates.quote?.subject);
                this.setInputValue('email-quote-priority', branding.emailConfig.templates.quote?.priority);
                this.setInputValue('email-support-subject', branding.emailConfig.templates.support?.subject);
                this.setInputValue('email-support-priority', branding.emailConfig.templates.support?.priority);
            }

            // Firma
            if (branding.emailConfig.signature) {
                this.setCheckboxValue('email-signature-company', branding.emailConfig.signature.includeCompanyInfo);
                this.setCheckboxValue('email-signature-social', branding.emailConfig.signature.includeSocialLinks);
                this.setCheckboxValue('email-signature-whatsapp', branding.emailConfig.signature.includeWhatsApp);
            }
        }

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

        // Customization
        this.setCheckboxValue('custom-show-company', branding.customization.showCompanyInfo);
        this.setCheckboxValue('custom-show-social', branding.customization.showSocialLinks);
        this.setCheckboxValue('custom-show-footer', branding.customization.showBrandingFooter);
        this.setCheckboxValue('custom-show-forge-logo', branding.customization.showForge3DLogo);
        this.setCheckboxValue('custom-allow-theme-toggle', branding.customization.allowThemeToggle);

        // Actualizar previews
        this.updateAllPreviews();
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
            // WhatsApp Floating
            whatsappFloating: {
                enabled: this.getCheckboxValue('whatsapp-floating-enabled'),
                position: this.getInputValue('whatsapp-floating-position'),
                showAfterSeconds: parseInt(this.getInputValue('whatsapp-floating-delay')) || 10,
                hideOnScroll: this.getCheckboxValue('whatsapp-floating-hide-scroll'),
                animation: this.getInputValue('whatsapp-floating-animation'),
                message: this.getInputValue('whatsapp-floating-message'),
                customMessages: {
                    quote: this.getInputValue('whatsapp-floating-message-quote'),
                    support: this.getInputValue('whatsapp-floating-message-support'),
                    general: this.getInputValue('whatsapp-floating-message-general')
                },
                styles: {
                    size: this.getInputValue('whatsapp-floating-size') + 'px',
                    backgroundColor: this.getInputValue('whatsapp-floating-bg-color') || '#25D366',
                    hoverColor: this.getInputValue('whatsapp-floating-hover-color') || '#128C7E',
                    iconColor: '#FFFFFF',
                    shadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 9999
                },
                responsive: {
                    mobile: {
                        size: (parseInt(this.getInputValue('whatsapp-floating-size')) - 10) + 'px' || '50px',
                        position: this.getInputValue('whatsapp-floating-position'),
                        margin: '15px'
                    },
                    desktop: {
                        size: this.getInputValue('whatsapp-floating-size') + 'px' || '60px',
                        position: this.getInputValue('whatsapp-floating-position'),
                        margin: '25px'
                    }
                }
            },
            // Email Config
            emailConfig: {
                enabled: this.getCheckboxValue('email-templates-enabled'),
                provider: this.getInputValue('email-provider'),
                defaultSender: {
                    name: this.getInputValue('email-sender-name'),
                    email: this.getInputValue('email-sender-email'),
                    replyTo: this.getInputValue('email-sender-email')
                },
                templates: {
                    quote: {
                        subject: this.getInputValue('email-quote-subject'),
                        priority: this.getInputValue('email-quote-priority'),
                        includeAttachment: true
                    },
                    support: {
                        subject: this.getInputValue('email-support-subject'),
                        priority: this.getInputValue('email-support-priority'),
                        autoReply: true
                    }
                },
                signature: {
                    includeCompanyInfo: this.getCheckboxValue('email-signature-company'),
                    includeSocialLinks: this.getCheckboxValue('email-signature-social'),
                    includeWhatsApp: this.getCheckboxValue('email-signature-whatsapp'),
                    includeWebsite: true
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
            },
            customization: {
                showCompanyInfo: this.getCheckboxValue('custom-show-company'),
                showSocialLinks: this.getCheckboxValue('custom-show-social'),
                showBrandingFooter: this.getCheckboxValue('custom-show-footer'),
                showForge3DLogo: this.getCheckboxValue('custom-show-forge-logo'),
                allowThemeToggle: this.getCheckboxValue('custom-allow-theme-toggle'),
                enableWhatsAppFloating: this.getCheckboxValue('whatsapp-floating-enabled'),
                enableEmailTemplates: this.getCheckboxValue('email-templates-enabled')
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
     * Toggle vista previa
     */
    togglePreview() {
        if (!this.previewMode) {
            this.originalBranding = JSON.parse(JSON.stringify(brandingManager.getCurrentBranding()));
            this.previewMode = true;
            this.applyPreview();
        } else {
            brandingManager.saveBranding(this.originalBranding);
            this.previewMode = false;
        }

        this.updatePreviewButton();
    }

    /**
     * Actualiza el botón de preview
     */
    updatePreviewButton() {
        const button = document.querySelector('[onclick="BrandingUI.togglePreview()"]');
        if (button) {
            button.textContent = this.previewMode ? '🔄 Cancelar Preview' : '👀 Vista Previa';
            button.className = this.previewMode ? 'btn-warning' : 'btn-secondary';
        }
    }

    /**
     * Aplica preset de color
     */
    applyColorPreset(presetName) {
        const preset = this.colorPresets[presetName];
        if (!preset) return;

        this.setInputValue('brand-color-primary', preset.primary);
        this.setInputValue('brand-color-primary-hex', preset.primary);
        this.setInputValue('brand-color-secondary', preset.secondary);
        this.setInputValue('brand-color-secondary-hex', preset.secondary);
        this.setInputValue('brand-color-accent', preset.accent);
        this.setInputValue('brand-color-accent-hex', preset.accent);

        this.updateColorPreview();
    }

    /**
     * Actualiza la vista previa de colores
     */
    updateColorPreview() {
        const root = document.documentElement;
        root.style.setProperty('--accent-primary', this.getInputValue('brand-color-primary'));
        root.style.setProperty('--accent-secondary', this.getInputValue('brand-color-secondary'));
        root.style.setProperty('--brand-accent', this.getInputValue('brand-color-accent'));
    }

    /**
     * Actualiza la vista previa del logo
     */
    updateLogoPreview(inputId) {
        const input = document.getElementById(inputId);
        const url = input.value;

        if (!url || !this.isValidUrl(url)) return;

        let previewId = '';
        if (inputId.includes('primary')) {
            previewId = 'logo-primary-preview';
        } else if (inputId.includes('secondary')) {
            previewId = 'logo-secondary-preview';
        }

        const preview = document.getElementById(previewId);
        if (preview) {
            preview.src = url;
            preview.style.display = 'block';
        }
    }

    /**
     * Actualiza todas las vistas previas
     */
    updateAllPreviews() {
        this.updateColorPreview();
        this.updateLogoPreview('brand-logo-primary-dark');
        this.updateLogoPreview('brand-logo-primary-light');
        this.updateLogoPreview('brand-logo-secondary-dark');
        this.updateLogoPreview('brand-logo-secondary-light');
    }

    /**
     * Actualiza la vista previa del WhatsApp Floating
     */
    updateWhatsAppFloatingPreview() {
        // Si existe una instancia del botón flotante, actualizarla
        if (window.whatsappFloatingInstance) {
            const config = {
                enabled: this.getCheckboxValue('whatsapp-floating-enabled'),
                position: this.getInputValue('whatsapp-floating-position'),
                showAfterSeconds: parseInt(this.getInputValue('whatsapp-floating-delay')) || 10,
                animation: this.getInputValue('whatsapp-floating-animation'),
                message: this.getInputValue('whatsapp-floating-message'),
                styles: {
                    size: this.getInputValue('whatsapp-floating-size') + 'px',
                    backgroundColor: this.getInputValue('whatsapp-floating-bg-color') || '#25D366',
                    hoverColor: this.getInputValue('whatsapp-floating-hover-color') || '#128C7E'
                }
            };

            window.whatsappFloatingInstance.updateConfig(config);

            // Mostrar/ocultar según configuración
            if (config.enabled) {
                window.whatsappFloatingInstance.show();
            } else {
                window.whatsappFloatingInstance.hide();
            }
        }
    }

    /**
     * Helpers
     */
    setInputValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.value = value || '';
        }
    }

    setCheckboxValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.checked = Boolean(value);
        }
    }

    getInputValue(id) {
        const element = document.getElementById(id);
        return element ? element.value : '';
    }

    getCheckboxValue(id) {
        const element = document.getElementById(id);
        return element ? element.checked : false;
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    isValidHex(hex) {
        return /^#[0-9A-F]{6}$/i.test(hex);
    }

    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
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
    applyColorPreset: (preset) => brandingUI.applyColorPreset(preset)
};

// ===== EXPORTAR PARA MÓDULOS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BrandingUI,
        brandingUI
    };
}

console.log('🎨 Branding UI initialized successfully');