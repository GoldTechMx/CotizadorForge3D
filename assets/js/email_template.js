/**
 * Email Templates System
 * Forge3D Cotizador v2.1
 */

'use strict';

class EmailTemplateManager {
    constructor() {
        this.config = null;
        this.branding = null;
        this.init();
    }

    /**
     * Inicializar el sistema
     */
    init() {
        if (typeof brandingManager !== 'undefined' && brandingManager.currentBranding) {
            this.branding = brandingManager.currentBranding;
            this.config = this.branding.emailConfig || {};
            console.log('📧 Email Templates initialized');
        } else {
            setTimeout(() => this.init(), 500);
        }
    }

    /**
     * Generar email de cotización
     */
    generateQuoteEmail(quoteData) {
        const template = this.config.templates?.quote || {};

        const emailData = {
            type: 'quote',
            subject: this.processTemplate(template.subject || 'Cotización Forge3D #{quoteNumber}', quoteData),
            title: 'Su Cotización de Impresión 3D',
            content: this.buildQuoteContent(quoteData),
            attachments: template.includeAttachment ? [quoteData.pdfBlob] : [],
            priority: template.priority || 'normal'
        };

        return this.buildEmail(emailData);
    }

    /**
     * Generar email de soporte
     */
    generateSupportEmail(supportData) {
        const template = this.config.templates?.support || {};

        const emailData = {
            type: 'support',
            subject: template.subject || 'Soporte Técnico - Forge3D',
            title: 'Solicitud de Soporte Técnico',
            content: this.buildSupportContent(supportData),
            priority: template.priority || 'high'
        };

        return this.buildEmail(emailData);
    }

    /**
     * Generar email de contacto general
     */
    generateContactEmail(contactData) {
        const template = this.config.templates?.contact || {};

        const emailData = {
            type: 'contact',
            subject: template.subject || 'Nuevo Contacto desde Forge3D',
            title: 'Nuevo Mensaje de Contacto',
            content: this.buildContactContent(contactData),
            priority: template.priority || 'normal'
        };

        return this.buildEmail(emailData);
    }

    /**
     * Construir contenido de cotización
     */
    buildQuoteContent(quoteData) {
        const pieces = quoteData.pieces || [];
        const totals = quoteData.totals || {};

        let piecesHtml = '';
        pieces.forEach((piece, index) => {
            piecesHtml += `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px;">${piece.name || `Pieza ${index + 1}`}</td>
          <td style="padding: 10px; text-align: center;">${piece.quantity || 1}</td>
          <td style="padding: 10px; text-align: center;">${piece.material || 'PLA'}</td>
          <td style="padding: 10px; text-align: right;">$${piece.price?.toFixed(2) || '0.00'}</td>
        </tr>
      `;
        });

        return `
      <p>Estimado/a cliente,</p>
      
      <p>Adjunto encontrará la cotización detallada para su proyecto de impresión 3D. Hemos calculado cuidadosamente cada aspecto para ofrecerle la mejor propuesta.</p>
      
      <div class="highlight">
        <h3 style="color: ${this.config.styling?.primaryColor || '#CD9430'}; margin-top: 0;">
          📊 Resumen de Cotización #${quoteData.number || 'FORGE-' + Date.now()}
        </h3>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: ${this.config.styling?.primaryColor || '#CD9430'}; color: white;">
              <th style="padding: 12px; text-align: left;">Pieza</th>
              <th style="padding: 12px; text-align: center;">Cantidad</th>
              <th style="padding: 12px; text-align: center;">Material</th>
              <th style="padding: 12px; text-align: right;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${piecesHtml}
          </tbody>
          <tfoot>
            <tr style="background-color: #f8f9fa; font-weight: bold;">
              <td colspan="3" style="padding: 15px; text-align: right;">Total:</td>
              <td style="padding: 15px; text-align: right; color: ${this.config.styling?.primaryColor || '#CD9430'}; font-size: 18px;">
                $${totals.total?.toFixed(2) || '0.00'} MXN
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <h4>✅ Qué incluye esta cotización:</h4>
      <ul>
        <li>🖨️ Impresión 3D con material de alta calidad</li>
        <li>⚙️ Post-procesamiento y acabado profesional</li>
        <li>📦 Embalaje seguro para envío</li>
        <li>🔧 Revisión de calidad garantizada</li>
      </ul>
      
      <h4>⏰ Próximos pasos:</h4>
      <ol>
        <li><strong>Confirmación:</strong> Responda este email confirmando su interés</li>
        <li><strong>Pago:</strong> Recibirá instrucciones de pago para proceder</li>
        <li><strong>Producción:</strong> Iniciaremos la impresión inmediatamente</li>
        <li><strong>Entrega:</strong> Tiempo estimado: 3-5 días hábiles</li>
      </ol>
      
      <p>¿Tiene alguna pregunta o modificación? No dude en contactarnos por cualquier medio. Estamos aquí para ayudarle a materializar su proyecto.</p>
      
      <p>¡Esperamos trabajar con usted pronto!</p>
    `;
    }

    /**
     * Construir contenido de soporte
     */
    buildSupportContent(supportData) {
        return `
      <p>Hemos recibido su solicitud de soporte técnico.</p>
      
      <div class="highlight">
        <h3 style="color: ${this.config.styling?.primaryColor || '#CD9430'}; margin-top: 0;">
          🛠️ Detalles de la Consulta
        </h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 150px;">Tipo de consulta:</td>
            <td style="padding: 8px;">${supportData.type || 'General'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Navegador:</td>
            <td style="padding: 8px;">${supportData.browser || 'No especificado'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Descripción:</td>
            <td style="padding: 8px;">${supportData.description || 'No proporcionada'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Fecha:</td>
            <td style="padding: 8px;">${new Date().toLocaleDateString('es-MX')}</td>
          </tr>
        </table>
      </div>
      
      <p>Nuestro equipo técnico revisará su consulta y le responderemos en un plazo máximo de 24 horas.</p>
      
      <p>Mientras tanto, puede consultar nuestra documentación o intentar estas soluciones comunes:</p>
      
      <ul>
        <li>🔄 Actualizar la página (Ctrl+F5)</li>
        <li>🗑️ Limpiar cache del navegador</li>
        <li>📱 Probar en otro dispositivo o navegador</li>
        <li>📞 Contactarnos por WhatsApp para soporte inmediato</li>
      </ul>
      
      <p>Gracias por usar Forge3D Cotizador.</p>
    `;
    }

    /**
     * Construir contenido de contacto
     */
    buildContactContent(contactData) {
        return `
      <p>Gracias por contactarnos a través del cotizador Forge3D.</p>
      
      <div class="highlight">
        <h3 style="color: ${this.config.styling?.primaryColor || '#CD9430'}; margin-top: 0;">
          💬 Su Mensaje
        </h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 120px;">Nombre:</td>
            <td style="padding: 8px;">${contactData.name || 'No proporcionado'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Email:</td>
            <td style="padding: 8px;">${contactData.email || 'No proporcionado'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Teléfono:</td>
            <td style="padding: 8px;">${contactData.phone || 'No proporcionado'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Mensaje:</td>
            <td style="padding: 8px;">${contactData.message || 'No proporcionado'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Fecha:</td>
            <td style="padding: 8px;">${new Date().toLocaleDateString('es-MX')}</td>
          </tr>
        </table>
      </div>
      
      <p>Le responderemos en un plazo máximo de 48 horas. Para consultas urgentes, no dude en contactarnos por WhatsApp.</p>
      
      <p>¡Gracias por su interés en nuestros servicios de impresión 3D!</p>
    `;
    }

    /**
     * Construir email completo
     */
    buildEmail(emailData) {
        const signature = this.buildSignature();
        const template = this.config.styling?.htmlTemplate || this.getDefaultTemplate();

        // Variables para reemplazar
        const variables = {
            subject: emailData.subject,
            emailTitle: emailData.title,
            emailContent: emailData.content,
            signature: signature,
            companyName: this.branding.company?.name || 'GoldTech MX',
            companyLogo: this.getCompanyLogo(),
            primaryColor: this.config.styling?.primaryColor || '#CD9430',
            secondaryColor: this.config.styling?.secondaryColor || '#e1aa4a',
            backgroundColor: this.config.styling?.backgroundColor || '#FFFFFF',
            textColor: this.config.styling?.textColor || '#333333',
            linkColor: this.config.styling?.linkColor || '#CD9430',
            fontFamily: this.config.styling?.fontFamily || "'Segoe UI', sans-serif"
        };

        // Procesar plantilla
        let html = this.processTemplate(template, variables);

        return {
            type: emailData.type,
            subject: emailData.subject,
            html: html,
            text: this.htmlToText(emailData.content),
            attachments: emailData.attachments || [],
            priority: emailData.priority || 'normal',
            mailto: this.generateMailtoLink(emailData),
            formData: this.generateFormData(emailData)
        };
    }

    /**
     * Construir firma de email
     */
    buildSignature() {
        const signatureConfig = this.config.signature || {};
        const company = this.branding.company || {};
        const social = this.branding.social || {};

        if (!signatureConfig.includeCompanyInfo) {
            return '';
        }

        let socialLinks = '';
        if (signatureConfig.includeSocialLinks) {
            Object.entries(social).forEach(([platform, config]) => {
                if (config.enabled && config.url && platform !== 'whatsapp') {
                    socialLinks += `
            <a href="${config.url}" target="_blank" style="text-decoration: none; margin-right: 10px;">
              <img src="https://img.shields.io/badge/${platform}-Follow-${this.config.styling?.primaryColor?.replace('#', '') || 'CD9430'}?style=flat&logo=${platform}" alt="${platform}" style="height: 20px;">
            </a>
          `;
                }
            });
        }

        const variables = {
            companyName: company.name || 'GoldTech MX',
            companyTagline: company.tagline || 'Soluciones de Impresión 3D',
            companyLogo: this.getCompanyLogo(),
            email: company.email || 'github@goldtech.mx',
            whatsappNumber: social.whatsapp?.number || '',
            website: company.website || 'https://goldtech.mx',
            socialLinks: socialLinks,
            primaryColor: this.config.styling?.primaryColor || '#CD9430'
        };

        return this.processTemplate(signatureConfig.template || this.getDefaultSignature(), variables);
    }

    /**
     * Generar enlace mailto
     */
    generateMailtoLink(emailData) {
        const email = this.branding.company?.email || 'github@goldtech.mx';
        const subject = encodeURIComponent(emailData.subject);
        const body = encodeURIComponent(this.htmlToText(emailData.content));

        return `mailto:${email}?subject=${subject}&body=${body}`;
    }

    /**
     * Generar datos para formulario
     */
    generateFormData(emailData) {
        return {
            to: this.branding.company?.email || 'github@goldtech.mx',
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text,
            priority: emailData.priority
        };
    }

    /**
     * Procesar plantilla con variables
     */
    processTemplate(template, variables) {
        let processed = template;

        Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`{${key}}`, 'g');
            processed = processed.replace(regex, value || '');
        });

        return processed;
    }

    /**
     * Convertir HTML a texto plano
     */
    htmlToText(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    }

    /**
     * Obtener logo de la empresa
     */
    getCompanyLogo() {
        const isDark = document.body.classList.contains('dark-theme');
        const logos = this.branding.logos || {};

        if (logos.secondary) {
            return isDark ? logos.secondary.dark : logos.secondary.light;
        }

        return logos.primary?.light || 'https://bio.goldtech.mx/logogoldtech';
    }

    /**
     * Plantilla HTML por defecto
     */
    getDefaultTemplate() {
        return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{subject}</title>
        <style>
          body { font-family: {fontFamily}; color: {textColor}; line-height: 1.6; margin: 0; padding: 20px; background-color: {backgroundColor}; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 3px solid {primaryColor}; padding-bottom: 20px; margin-bottom: 30px; }
          .content { margin-bottom: 30px; }
          a { color: {linkColor}; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .highlight { background: linear-gradient(135deg, {primaryColor}22, {secondaryColor}22); padding: 15px; border-radius: 8px; border-left: 4px solid {primaryColor}; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="{companyLogo}" alt="{companyName}" style="max-width: 200px; height: auto;">
            <h1 style="color: {primaryColor}; margin-top: 15px;">{emailTitle}</h1>
          </div>
          <div class="content">
            {emailContent}
          </div>
          {signature}
        </div>
      </body>
      </html>
    `;
    }

    /**
     * Firma por defecto
     */
    getDefaultSignature() {
        return `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid {primaryColor};">
        <table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif;">
          <tr>
            <td style="padding-right: 20px;">
              <img src="{companyLogo}" alt="{companyName}" style="max-width: 120px; height: auto;">
            </td>
            <td>
              <div style="color: #333;">
                <strong style="color: {primaryColor}; font-size: 16px;">{companyName}</strong><br>
                <span style="color: #666; font-size: 14px;">{companyTagline}</span><br><br>
                
                <div style="font-size: 13px; line-height: 1.4;">
                  📧 <a href="mailto:{email}" style="color: {primaryColor}; text-decoration: none;">{email}</a><br>
                  📱 <a href="https://wa.me/{whatsappNumber}" style="color: {primaryColor}; text-decoration: none;">WhatsApp: {whatsappNumber}</a><br>
                  🌐 <a href="{website}" target="_blank" style="color: {primaryColor}; text-decoration: none;">{website}</a>
                </div>
                
                <div style="margin-top: 15px;">
                  {socialLinks}
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    `;
    }
}

// ===== FUNCIONES DE UTILIDAD PARA EMAIL =====

/**
 * Mostrar modal de opciones de email
 */
function showEmailModal(emailData) {
    const modal = document.createElement('div');
    modal.className = 'email-modal';
    modal.innerHTML = `
    <div class="email-modal-content">
      <h3>📧 Enviar por Email</h3>
      
      <div class="email-preview">
        <h4>Vista previa:</h4>
        <div class="email-preview-content">
          ${emailData.html}
        </div>
      </div>
      
      <div class="email-actions">
        <button onclick="sendEmailViaMailto('${emailData.mailto}')" class="btn-primary">
          📮 Abrir en mi cliente de email
        </button>
        
        <button onclick="copyEmailToClipboard(\`${emailData.html.replace(/`/g, '\\`')}\`)" class="btn-secondary">
          📋 Copiar contenido
        </button>
        
        <button onclick="downloadEmailHTML(\`${emailData.html.replace(/`/g, '\\`')}\`, '${emailData.subject}')" class="btn-secondary">
          💾 Descargar como HTML
        </button>
        
        <button onclick="closeEmailModal()" class="btn-cancel">
          ❌ Cerrar
        </button>
      </div>
    </div>
  `;

    document.body.appendChild(modal);
}

/**
 * Enviar email via mailto
 */
function sendEmailViaMailto(mailtoLink) {
    window.location.href = mailtoLink;
    closeEmailModal();
}

/**
 * Copiar email al portapapeles
 */
function copyEmailToClipboard(htmlContent) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    navigator.clipboard.writeText(textContent).then(() => {
        if (typeof showNotification !== 'undefined') {
            showNotification('📋 Contenido copiado al portapapeles', 'success');
        } else {
            alert('Contenido copiado al portapapeles');
        }
    }).catch(err => {
        console.error('Error copying to clipboard:', err);
        if (typeof showNotification !== 'undefined') {
            showNotification('❌ Error al copiar', 'error');
        } else {
            alert('Error al copiar al portapapeles');
        }
    });
}

/**
 * Descargar email como HTML
 */
function downloadEmailHTML(htmlContent, subject) {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${subject.replace(/[^a-z0-9]/gi, '_')}.html`;
    link.click();

    URL.revokeObjectURL(url);
    closeEmailModal();

    if (typeof showNotification !== 'undefined') {
        showNotification('💾 Email descargado como HTML', 'success');
    }
}

/**
 * Cerrar modal de email
 */
function closeEmailModal() {
    const modal = document.querySelector('.email-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Crear email de soporte
 */
function createSupportEmail() {
    const supportData = {
        type: 'Technical Support',
        browser: navigator.userAgent,
        description: prompt('Describe el problema que está experimentando:'),
        timestamp: new Date().toISOString()
    };

    if (!supportData.description) return;

    const emailData = window.emailTemplates.generateSupport(supportData);
    showEmailModal(emailData);
}

/**
 * Crear email de contacto
 */
function createContactEmail() {
    const contactData = {
        name: prompt('Su nombre:') || '',
        email: prompt('Su email:') || '',
        phone: prompt('Su teléfono (opcional):') || '',
        message: prompt('Su mensaje:') || ''
    };

    if (!contactData.message) return;

    const emailData = window.emailTemplates.generateContact(contactData);
    showEmailModal(emailData);
}

// ===== ESTILOS CSS PARA EMAIL MODAL =====
function injectEmailModalStyles() {
    const styleId = 'email-modal-styles';

    if (document.getElementById(styleId)) return;

    const styles = `
    /* Email Modal Styles */
    .email-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      animation: fadeIn 0.3s ease forwards;
    }

    .email-modal-content {
      background: var(--bg-color, white);
      border-radius: 12px;
      padding: 30px;
      max-width: 90vw;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      transform: scale(0.9);
      animation: scaleIn 0.3s ease forwards;
    }

    .email-modal-content h3 {
      color: var(--accent-primary, #CD9430);
      margin-bottom: 20px;
      text-align: center;
    }

    .email-preview {
      margin: 20px 0;
      border: 1px solid var(--border-color, #ddd);
      border-radius: 8px;
      overflow: hidden;
    }

    .email-preview h4 {
      background: var(--accent-primary, #CD9430);
      color: white;
      margin: 0;
      padding: 12px 20px;
      font-size: 14px;
    }

    .email-preview-content {
      max-height: 400px;
      overflow-y: auto;
      padding: 20px;
      background: white;
      color: #333;
      font-size: 14px;
      line-height: 1.6;
    }

    .email-actions {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 25px;
    }

    .email-actions button {
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      min-width: 160px;
    }

    .btn-primary {
      background: var(--accent-primary, #CD9430);
      color: white;
    }

    .btn-primary:hover {
      background: var(--accent-secondary, #e1aa4a);
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: var(--secondary-color, #f8f9fa);
      color: var(--text-color, #333);
      border: 1px solid var(--border-color, #ddd);
    }

    .btn-secondary:hover {
      background: var(--accent-primary, #CD9430);
      color: white;
    }

    .btn-cancel {
      background: #dc3545;
      color: white;
    }

    .btn-cancel:hover {
      background: #c82333;
    }

    @keyframes fadeIn {
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      to { transform: scale(1); }
    }

    @media (max-width: 768px) {
      .email-modal-content {
        margin: 20px;
        padding: 20px;
      }
      
      .email-actions {
        flex-direction: column;
      }
      
      .email-actions button {
        min-width: 100%;
      }
    }
  `;

    const styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// ===== API GLOBAL =====
window.EmailTemplateManager = EmailTemplateManager;

// ===== FUNCIONES GLOBALES =====
window.emailTemplates = {
    generateQuote: (quoteData) => {
        if (window.emailTemplateInstance) {
            return window.emailTemplateInstance.generateQuoteEmail(quoteData);
        }
    },

    generateSupport: (supportData) => {
        if (window.emailTemplateInstance) {
            return window.emailTemplateInstance.generateSupportEmail(supportData);
        }
    },

    generateContact: (contactData) => {
        if (window.emailTemplateInstance) {
            return window.emailTemplateInstance.generateContactEmail(contactData);
        }
    }
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    injectEmailModalStyles();
    window.emailTemplateInstance = new EmailTemplateManager();
});

// ===== EXPORTAR PARA MÓDULOS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EmailTemplateManager
    };
}

console.log('📧 Email Templates System loaded');