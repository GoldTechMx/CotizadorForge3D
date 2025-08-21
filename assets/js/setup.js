/**
 * Forge3D Cotizador - Setup Wizard
 * Script de configuración automática para nuevos usuarios
 * Version: 2.2
 */

'use strict';

// ===== CONFIGURACIÓN DE SETUP =====
class SetupWizard {
  constructor() {
    this.currentStep = 0;
    this.setupData = {};
    this.templates = null;
    this.steps = [
      'welcome',
      'business-type', 
      'company-info',
      'branding',
      'deployment',
      'finish'
    ];
    this.init();
  }

  /**
   * Inicializa el wizard de setup
   */
  async init() {
    try {
      // Cargar configuración de setup
      await this.loadSetupConfig();
      
      // Verificar si es primera vez
      if (this.isFirstTime()) {
        this.showWelcomeModal();
      }
    } catch (error) {
      console.error('Error initializing setup wizard:', error);
    }
  }

  /**
   * Carga la configuración de setup
   */
  async loadSetupConfig() {
    try {
      const response = await fetch('./setup-config.json');
      this.setupConfig = await response.json();
      console.log('Setup config loaded successfully');
    } catch (error) {
      console.warn('Could not load setup config, using defaults');
      this.setupConfig = this.getDefaultConfig();
    }
  }

  /**
   * Verifica si es la primera vez que se ejecuta
   */
  isFirstTime() {
    return !localStorage.getItem('forge3d_setup_completed');
  }

  /**
   * Muestra el modal de bienvenida
   */
  showWelcomeModal() {
    const modal = this.createModal('setup-wizard', 'Configuración Inicial - Forge3D');
    
    modal.innerHTML = `
      <div class="setup-wizard">
        <div class="setup-header">
          <div class="setup-logo">
            <i class="fas fa-magic" style="font-size: 3rem; color: var(--accent-primary);"></i>
          </div>
          <h2>¡Bienvenido a Forge3D!</h2>
          <p>Te ayudaremos a configurar tu cotizador en pocos minutos</p>
        </div>
        
        <div class="setup-content">
          <div class="setup-features">
            <div class="feature-item">
              <i class="fas fa-palette"></i>
              <h4>Personalización Completa</h4>
              <p>Configura tu marca, colores y logos</p>
            </div>
            <div class="feature-item">
              <i class="fas fa-rocket"></i>
              <h4>Deploy Automático</h4>
              <p>Despliega en GitHub Pages en minutos</p>
            </div>
            <div class="feature-item">
              <i class="fas fa-cogs"></i>
              <h4>Configuración Inteligente</h4>
              <p>Presets optimizados para tu tipo de negocio</p>
            </div>
          </div>
          
          <div class="setup-options">
            <button class="setup-btn primary" onclick="setupWizard.startWizard()">
              <i class="fas fa-play"></i> Comenzar Configuración
            </button>
            <button class="setup-btn secondary" onclick="setupWizard.skipSetup()">
              <i class="fas fa-forward"></i> Usar Después
            </button>
            <button class="setup-btn tertiary" onclick="setupWizard.useExisting()">
              <i class="fas fa-upload"></i> Importar Configuración
            </button>
          </div>
        </div>
      </div>
    `;

    this.showModal(modal);
  }

  /**
   * Inicia el wizard paso a paso
   */
  startWizard() {
    this.currentStep = 1;
    this.showBusinessTypeStep();
  }

  /**
   * Paso 1: Selección de tipo de negocio
   */
  showBusinessTypeStep() {
    const modal = this.getModal();
    
    modal.innerHTML = `
      <div class="setup-wizard">
        <div class="setup-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 16.6%"></div>
          </div>
          <span>Paso 1 de 6</span>
        </div>
        
        <div class="setup-header">
          <h2><i class="fas fa-briefcase"></i> Tipo de Negocio</h2>
          <p>Selecciona el tipo que mejor describa tu negocio</p>
        </div>
        
        <div class="business-types">
          ${this.renderBusinessTypes()}
        </div>
        
        <div class="setup-navigation">
          <button class="setup-btn secondary" onclick="setupWizard.previousStep()">
            <i class="fas fa-arrow-left"></i> Anterior
          </button>
          <button class="setup-btn primary" onclick="setupWizard.nextStep()" disabled id="nextBtn">
            Siguiente <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza los tipos de negocio
   */
  renderBusinessTypes() {
    const types = this.setupConfig?.setup?.templates?.business_types || [];
    
    return types.map(type => `
      <div class="business-type-card" onclick="setupWizard.selectBusinessType('${type.id}')">
        <div class="type-icon">
          <i class="fas fa-${this.getBusinessIcon(type.id)}"></i>
        </div>
        <h4>${type.name}</h4>
        <p>${type.description}</p>
        <div class="type-features">
          <span>Utilidad: ${type.config.utility_margin}%</span>
          <span>Tarifa: $${type.config.labor_rate}/h</span>
        </div>
      </div>
    `).join('');
  }

  /**
   * Obtiene el icono para cada tipo de negocio
   */
  getBusinessIcon(typeId) {
    const icons = {
      'service_bureau': 'industry',
      'maker_space': 'users',
      'educational': 'graduation-cap',
      'freelance': 'user',
      'startup': 'rocket'
    };
    return icons[typeId] || 'building';
  }

  /**
   * Selecciona un tipo de negocio
   */
  selectBusinessType(typeId) {
    // Limpiar selección anterior
    document.querySelectorAll('.business-type-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    // Seleccionar nueva opción
    event.target.closest('.business-type-card').classList.add('selected');
    
    // Guardar selección
    this.setupData.businessType = typeId;
    
    // Habilitar botón siguiente
    document.getElementById('nextBtn').disabled = false;
  }

  /**
   * Paso 2: Información de la empresa
   */
  showCompanyInfoStep() {
    const modal = this.getModal();
    
    modal.innerHTML = `
      <div class="setup-wizard">
        <div class="setup-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 33.3%"></div>
          </div>
          <span>Paso 2 de 6</span>
        </div>
        
        <div class="setup-header">
          <h2><i class="fas fa-building"></i> Información de tu Empresa</h2>
          <p>Esta información aparecerá en tu cotizador</p>
        </div>
        
        <div class="company-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="setup-company-name">
                <i class="fas fa-tag"></i> Nombre de la Empresa
              </label>
              <input type="text" id="setup-company-name" placeholder="Mi Empresa 3D" required />
            </div>
            
            <div class="form-group">
              <label for="setup-company-tagline">
                <i class="fas fa-quote-left"></i> Eslogan
              </label>
              <input type="text" id="setup-company-tagline" placeholder="Impresión 3D profesional" />
            </div>
            
            <div class="form-group full-width">
              <label for="setup-company-website">
                <i class="fas fa-globe"></i> Sitio Web
              </label>
              <input type="url" id="setup-company-website" placeholder="https://miempresa.com" />
            </div>
            
            <div class="form-group">
              <label for="setup-company-email">
                <i class="fas fa-envelope"></i> Email
              </label>
              <input type="email" id="setup-company-email" placeholder="contacto@miempresa.com" />
            </div>
            
            <div class="form-group">
              <label for="setup-company-phone">
                <i class="fas fa-phone"></i> Teléfono
              </label>
              <input type="tel" id="setup-company-phone" placeholder="+52 123 456 7890" />
            </div>
          </div>
        </div>
        
        <div class="setup-navigation">
          <button class="setup-btn secondary" onclick="setupWizard.previousStep()">
            <i class="fas fa-arrow-left"></i> Anterior
          </button>
          <button class="setup-btn primary" onclick="setupWizard.nextStep()">
            Siguiente <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Paso 3: Configuración de branding
   */
  showBrandingStep() {
    const modal = this.getModal();
    
    modal.innerHTML = `
      <div class="setup-wizard">
        <div class="setup-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 50%"></div>
          </div>
          <span>Paso 3 de 6</span>
        </div>
        
        <div class="setup-header">
          <h2><i class="fas fa-palette"></i> Personalización Visual</h2>
          <p>Elige los colores que representen tu marca</p>
        </div>
        
        <div class="branding-options">
          <h4>Presets de Colores</h4>
          <div class="color-presets">
            ${this.renderColorPresets()}
          </div>
          
          <div class="logo-section">
            <h4>Logos (Opcional)</h4>
            <div class="logo-upload">
              <div class="upload-item">
                <label for="setup-logo-primary">
                  <i class="fas fa-upload"></i>
                  <span>Logo Principal</span>
                  <small>Recomendado: 400x200px, PNG</small>
                </label>
                <input type="url" id="setup-logo-primary" placeholder="https://ejemplo.com/logo.png" />
              </div>
              
              <div class="upload-item">
                <label for="setup-logo-secondary">
                  <i class="fas fa-upload"></i>
                  <span>Logo Empresa</span>
                  <small>Para el footer</small>
                </label>
                <input type="url" id="setup-logo-secondary" placeholder="https://ejemplo.com/empresa.png" />
              </div>
            </div>
          </div>
        </div>
        
        <div class="setup-navigation">
          <button class="setup-btn secondary" onclick="setupWizard.previousStep()">
            <i class="fas fa-arrow-left"></i> Anterior
          </button>
          <button class="setup-btn primary" onclick="setupWizard.nextStep()">
            Siguiente <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza los presets de colores
   */
  renderColorPresets() {
    const presets = this.setupConfig?.setup?.branding_presets || [];
    
    return presets.map(preset => `
      <div class="color-preset-card" onclick="setupWizard.selectColorPreset('${preset.id}')">
        <div class="preset-colors">
          <div class="color-sample" style="background: ${preset.colors.primary}"></div>
          <div class="color-sample" style="background: ${preset.colors.secondary}"></div>
          <div class="color-sample" style="background: ${preset.colors.accent}"></div>
        </div>
        <h5>${preset.name}</h5>
        <p>${preset.description}</p>
      </div>
    `).join('');
  }

  /**
   * Selecciona un preset de colores
   */
  selectColorPreset(presetId) {
    // Limpiar selección anterior
    document.querySelectorAll('.color-preset-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    // Seleccionar nueva opción
    event.target.closest('.color-preset-card').classList.add('selected');
    
    // Guardar selección
    this.setupData.colorPreset = presetId;
  }

  /**
   * Paso 4: Opciones de deployment
   */
  showDeploymentStep() {
    const modal = this.getModal();
    
    modal.innerHTML = `
      <div class="setup-wizard">
        <div class="setup-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 66.6%"></div>
          </div>
          <span>Paso 4 de 6</span>
        </div>
        
        <div class="setup-header">
          <h2><i class="fas fa-cloud-upload-alt"></i> Opciones de Deployment</h2>
          <p>¿Dónde quieres publicar tu cotizador?</p>
        </div>
        
        <div class="deployment-options">
          ${this.renderDeploymentOptions()}
        </div>
        
        <div class="setup-navigation">
          <button class="setup-btn secondary" onclick="setupWizard.previousStep()">
            <i class="fas fa-arrow-left"></i> Anterior
          </button>
          <button class="setup-btn primary" onclick="setupWizard.nextStep()">
            Siguiente <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza las opciones de deployment
   */
  renderDeploymentOptions() {
    const options = this.setupConfig?.setup?.deployment_options || [];
    
    return options.map(option => `
      <div class="deployment-card" onclick="setupWizard.selectDeployment('${option.id}')">
        <div class="deployment-header">
          <i class="fab fa-${option.id.replace('_', '-')}"></i>
          <h4>${option.name}</h4>
          <span class="cost-badge">${option.cost}</span>
        </div>
        <p>${option.description}</p>
        <div class="deployment-features">
          ${option.ssl ? '<span class="feature-badge">SSL</span>' : ''}
          ${option.custom_domain ? '<span class="feature-badge">Dominio Personalizado</span>' : ''}
        </div>
        <div class="deployment-steps">
          <h5>Pasos:</h5>
          <ol>
            ${option.instructions.map(step => `<li>${step}</li>`).join('')}
          </ol>
        </div>
      </div>
    `).join('');
  }

  /**
   * Selecciona opción de deployment
   */
  selectDeployment(deploymentId) {
    // Limpiar selección anterior
    document.querySelectorAll('.deployment-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    // Seleccionar nueva opción
    event.target.closest('.deployment-card').classList.add('selected');
    
    // Guardar selección
    this.setupData.deployment = deploymentId;
  }

  /**
   * Paso final: Resumen y aplicación
   */
  showFinishStep() {
    const modal = this.getModal();
    
    modal.innerHTML = `
      <div class="setup-wizard">
        <div class="setup-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 100%"></div>
          </div>
          <span>Configuración Completa</span>
        </div>
        
        <div class="setup-header">
          <h2><i class="fas fa-check-circle"></i> ¡Todo Listo!</h2>
          <p>Tu cotizador está configurado y listo para usar</p>
        </div>
        
        <div class="setup-summary">
          ${this.renderSetupSummary()}
        </div>
        
        <div class="finish-actions">
          <button class="setup-btn success large" onclick="setupWizard.applyConfiguration()">
            <i class="fas fa-magic"></i> Aplicar Configuración
          </button>
          
          <div class="additional-actions">
            <button class="setup-btn tertiary" onclick="setupWizard.downloadConfig()">
              <i class="fas fa-download"></i> Descargar Configuración
            </button>
            <button class="setup-btn tertiary" onclick="setupWizard.viewInstructions()">
              <i class="fas fa-book"></i> Ver Instrucciones
            </button>
          </div>
        </div>
        
        <div class="setup-navigation">
          <button class="setup-btn secondary" onclick="setupWizard.previousStep()">
            <i class="fas fa-arrow-left"></i> Anterior
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza el resumen de configuración
   */
  renderSetupSummary() {
    const businessType = this.setupConfig?.setup?.templates?.business_types?.find(
      t => t.id === this.setupData.businessType
    );
    
    const colorPreset = this.setupConfig?.setup?.branding_presets?.find(
      p => p.id === this.setupData.colorPreset
    );
    
    const deployment = this.setupConfig?.setup?.deployment_options?.find(
      d => d.id === this.setupData.deployment
    );

    return `
      <div class="summary-grid">
        <div class="summary-item">
          <h4><i class="fas fa-briefcase"></i> Tipo de Negocio</h4>
          <p>${businessType?.name || 'No seleccionado'}</p>
        </div>
        
        <div class="summary-item">
          <h4><i class="fas fa-building"></i> Empresa</h4>
          <p>${this.getFormValue('setup-company-name') || 'Sin configurar'}</p>
        </div>
        
        <div class="summary-item">
          <h4><i class="fas fa-palette"></i> Colores</h4>
          <p>${colorPreset?.name || 'Predeterminado'}</p>
        </div>
        
        <div class="summary-item">
          <h4><i class="fas fa-cloud"></i> Deployment</h4>
          <p>${deployment?.name || 'Manual'}</p>
        </div>
      </div>
    `;
  }

  /**
   * Aplica toda la configuración
   */
  async applyConfiguration() {
    try {
      this.showLoadingState();
      
      // Recopilar toda la configuración
      const config = this.gatherAllConfiguration();
      
      // Aplicar configuración de branding
      if (window.brandingManager) {
        await this.applyBrandingConfig(config);
      }
      
      // Aplicar configuración de negocio
      await this.applyBusinessConfig(config);
      
      // Marcar setup como completado
      localStorage.setItem('forge3d_setup_completed', 'true');
      localStorage.setItem('forge3d_setup_date', new Date().toISOString());
      
      // Mostrar confirmación
      this.showSuccessMessage();
      
    } catch (error) {
      console.error('Error applying configuration:', error);
      this.showErrorMessage(error.message);
    }
  }

  /**
   * Recopila toda la configuración
   */
  gatherAllConfiguration() {
    const businessType = this.setupConfig?.setup?.templates?.business_types?.find(
      t => t.id === this.setupData.businessType
    );
    
    const colorPreset = this.setupConfig?.setup?.branding_presets?.find(
      p => p.id === this.setupData.colorPreset
    );

    return {
      business: businessType,
      company: {
        name: this.getFormValue('setup-company-name'),
        tagline: this.getFormValue('setup-company-tagline'),
        website: this.getFormValue('setup-company-website'),
        email: this.getFormValue('setup-company-email'),
        phone: this.getFormValue('setup-company-phone')
      },
      branding: {
        colors: colorPreset?.colors,
        logos: {
          primary: this.getFormValue('setup-logo-primary'),
          secondary: this.getFormValue('setup-logo-secondary')
        }
      },
      deployment: this.setupData.deployment
    };
  }

  /**
   * Aplica la configuración de branding
   */
  async applyBrandingConfig(config) {
    if (!window.brandingManager) return;

    const brandingConfig = {
      company: {
        name: config.company.name || 'Mi Empresa 3D',
        tagline: config.company.tagline || 'Impresión 3D profesional',
        website: config.company.website || '',
        email: config.company.email || '',
        phone: config.company.phone || ''
      },
      colors: config.branding.colors || {
        primary: '#CD9430',
        secondary: '#e1aa4a',
        accent: '#B8851F'
      },
      logos: {
        primary: {
          dark: config.branding.logos.primary || '',
          light: config.branding.logos.primary || ''
        },
        secondary: {
          dark: config.branding.logos.secondary || '',
          light: config.branding.logos.secondary || ''
        }
      }
    };

    window.brandingManager.saveBranding(brandingConfig);
  }

  /**
   * Aplica la configuración de negocio
   */
  async applyBusinessConfig(config) {
    if (!config.business) return;

    const businessConfig = config.business.config;
    
    // Aplicar configuración de tarifas
    if (businessConfig.utility_margin) {
      const utilityInput = document.getElementById('porcentajeUtilidad');
      if (utilityInput) {
        utilityInput.value = businessConfig.utility_margin;
      }
    }
    
    if (businessConfig.labor_rate) {
      const laborInput = document.getElementById('tarifaHora');
      if (laborInput) {
        laborInput.value = businessConfig.labor_rate;
      }
    }
    
    // Guardar configuración
    if (window.ConfigManager) {
      window.ConfigManager.save();
    }
  }

  /**
   * Navegación entre pasos
   */
  nextStep() {
    // Validar paso actual antes de continuar
    if (!this.validateCurrentStep()) {
      return;
    }
    
    // Guardar datos del paso actual
    this.saveCurrentStepData();
    
    // Avanzar al siguiente paso
    this.currentStep++;
    
    switch (this.currentStep) {
      case 2:
        this.showCompanyInfoStep();
        break;
      case 3:
        this.showBrandingStep();
        break;
      case 4:
        this.showDeploymentStep();
        break;
      case 5:
        this.showFinishStep();
        break;
    }
  }

  previousStep() {
    this.currentStep--;
    
    switch (this.currentStep) {
      case 1:
        this.showBusinessTypeStep();
        break;
      case 2:
        this.showCompanyInfoStep();
        break;
      case 3:
        this.showBrandingStep();
        break;
      case 4:
        this.showDeploymentStep();
        break;
    }
  }

  /**
   * Valida el paso actual
   */
  validateCurrentStep() {
    switch (this.currentStep) {
      case 1:
        return this.setupData.businessType != null;
      case 2:
        return this.getFormValue('setup-company-name')?.length > 0;
      default:
        return true;
    }
  }

  /**
   * Guarda los datos del paso actual
   */
  saveCurrentStepData() {
    switch (this.currentStep) {
      case 2:
        this.setupData.company = {
          name: this.getFormValue('setup-company-name'),
          tagline: this.getFormValue('setup-company-tagline'),
          website: this.getFormValue('setup-company-website'),
          email: this.getFormValue('setup-company-email'),
          phone: this.getFormValue('setup-company-phone')
        };
        break;
      case 3:
        this.setupData.branding = {
          colorPreset: this.setupData.colorPreset,
          logos: {
            primary: this.getFormValue('setup-logo-primary'),
            secondary: this.getFormValue('setup-logo-secondary')
          }
        };
        break;
    }
  }

  /**
   * Salta el setup
   */
  skipSetup() {
    localStorage.setItem('forge3d_setup_skipped', 'true');
    this.closeModal();
  }

  /**
   * Usa configuración existente
   */
  useExisting() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file && window.brandingManager) {
        window.brandingManager.importBranding(file)
          .then(() => {
            this.closeModal();
            if (window.NotificationManager) {
              window.NotificationManager.showSuccess('✅ Configuración importada correctamente');
            }
          })
          .catch((error) => {
            console.error('Error importing config:', error);
            if (window.NotificationManager) {
              window.NotificationManager.showError('❌ Error al importar configuración');
            }
          });
      }
    };
    input.click();
  }

  /**
   * Utilidades para modales
   */
  createModal(id, title) {
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'setup-modal-overlay';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      backdrop-filter: blur(10px);
    `;
    
    return modal;
  }

  showModal(modal) {
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Animar entrada
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
  }

  getModal() {
    return document.getElementById('setup-wizard') || this.createModal('setup-wizard');
  }

  closeModal() {
    const modal = document.getElementById('setup-wizard');
    if (modal) {
      modal.remove();
      document.body.style.overflow = '';
    }
  }

  getFormValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
  }

  showLoadingState() {
    const modal = this.getModal();
    modal.innerHTML = `
      <div class="setup-loading">
        <div class="loading-spinner"></div>
        <h3>Aplicando configuración...</h3>
        <p>Esto tomará unos segundos</p>
      </div>
    `;
  }

  showSuccessMessage() {
    const modal = this.getModal();
    modal.innerHTML = `
      <div class="setup-success">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>¡Configuración Aplicada!</h2>
        <p>Tu cotizador está listo para usar</p>
        <button class="setup-btn success" onclick="setupWizard.closeModal()">
          <i class="fas fa-rocket"></i> Empezar a Usar
        </button>
      </div>
    `;
    
    setTimeout(() => {
      this.closeModal();
      if (window.NotificationManager) {
        window.NotificationManager.showSuccess('🎉 ¡Setup completado exitosamente!');
      }
    }, 3000);
  }

  showErrorMessage(message) {
    if (window.NotificationManager) {
      window.NotificationManager.showError(`❌ Error: ${message}`);
    }
  }

  getDefaultConfig() {
    return {
      setup: {
        templates: {
          business_types: [
            {
              id: 'general',
              name: 'General',
              description: 'Configuración básica',
              config: {
                utility_margin: 18,
                labor_rate: 28,
                marketplace_default: '17.4'
              }
            }
          ]
        },
        branding_presets: [
          {
            id: 'default',
            name: 'Predeterminado',
            colors: {
              primary: '#CD9430',
              secondary: '#e1aa4a',
              accent: '#B8851F'
            }
          }
        ],
        deployment_options: [
          {
            id: 'github_pages',
            name: 'GitHub Pages',
            description: 'Hosting gratuito',
            cost: 'Gratuito',
            ssl: true,
            custom_domain: true,
            instructions: ['Configurar en GitHub']
          }
        ]
      }
    };
  }
}

// ===== ESTILOS PARA EL WIZARD =====
const setupStyles = `
<style>
.setup-modal-overlay {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.setup-wizard {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 20px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  border: 2px solid var(--accent-primary);
}

.setup-progress {
  margin-bottom: 2rem;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: var(--accent-primary);
  transition: width 0.3s ease;
}

.setup-header {
  text-align: center;
  margin-bottom: 2rem;
}

.setup-header h2 {
  color: var(--accent-primary);
  margin-bottom: 0.5rem;
}

.setup-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.feature-item {
  text-align: center;
  padding: 1rem;
  border-radius: 10px;
  background: rgba(205, 148, 48, 0.1);
}

.feature-item i {
  font-size: 2rem;
  color: var(--accent-primary);
  margin-bottom: 0.5rem;
}

.setup-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.setup-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.setup-btn.primary {
  background: var(--accent-primary);
  color: #000;
}

.setup-btn.secondary {
  background: #6b7280;
  color: white;
}

.setup-btn.tertiary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border-secondary);
}

.setup-btn.success {
  background: #10b981;
  color: white;
}

.setup-btn.large {
  padding: 1.5rem 3rem;
  font-size: 1.1rem;
}

.setup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.setup-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.business-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.business-type-card {
  padding: 1.5rem;
  border: 2px solid var(--border-secondary);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.business-type-card:hover,
.business-type-card.selected {
  border-color: var(--accent-primary);
  background: rgba(205, 148, 48, 0.1);
}

.type-icon i {
  font-size: 2rem;
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.type-features {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  background: var(--input-bg);
  border: 2px solid var(--input-border);
  border-radius: 8px;
  color: var(--text-primary);
}

.color-presets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.color-preset-card {
  padding: 1rem;
  border: 2px solid var(--border-secondary);
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
}

.color-preset-card:hover,
.color-preset-card.selected {
  border-color: var(--accent-primary);
}

.preset-colors {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.color-sample {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.2);
}

.deployment-options {
  display: grid;
  gap: 1rem;
}

.deployment-card {
  padding: 1.5rem;
  border: 2px solid var(--border-secondary);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.deployment-card:hover,
.deployment-card.selected {
  border-color: var(--accent-primary);
  background: rgba(205, 148, 48, 0.05);
}

.deployment-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.cost-badge {
  margin-left: auto;
  padding: 0.3rem 0.8rem;
  background: var(--accent-primary);
  color: #000;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.setup-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
}

.setup-summary {
  margin: 2rem 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-item {
  padding: 1rem;
  background: rgba(205, 148, 48, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(205, 148, 48, 0.2);
}

.summary-item h4 {
  margin-top: 0;
  color: var(--accent-primary);
}

.finish-actions {
  text-align: center;
}

.additional-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.setup-loading,
.setup-success {
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(205, 148, 48, 0.2);
  border-top: 4px solid var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

.success-icon i {
  font-size: 4rem;
  color: #10b981;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .setup-navigation {
    flex-direction: column;
  }
  
  .additional-actions {
    flex-direction: column;
  }
}
</style>
`;

// ===== INICIALIZACIÓN =====
let setupWizard;

// Agregar estilos
document.head.insertAdjacentHTML('beforeend', setupStyles);

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  setupWizard = new SetupWizard();
});

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.SetupWizard = SetupWizard;
  window.setupWizard = setupWizard;
}

console.log('🧙‍♂️ Setup Wizard loaded successfully');