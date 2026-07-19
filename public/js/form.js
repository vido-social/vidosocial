/**
 * VIDO Social — Form Handler
 * Contact form submission, validation, and error handling
 */

// ============================================================================
// FORM CONFIGURATION
// ============================================================================

const FORM_CONFIG = {
  formId: 'lead-form',
  statusId: 'form-status',
  startTimeInputId: 'started-at',
  submitButtonSelector: 'button[type="submit"]',
  apiEndpoint: '/api/contact',
  emailFallback: 'ville@vidosocial.com',
};

// ============================================================================
// FORM HANDLER
// ============================================================================

class ContactForm {
  constructor(config = FORM_CONFIG) {
    this.config = config;
    this.form = document.getElementById(config.formId);
    this.statusEl = document.getElementById(config.statusId);
    this.submitBtn = this.form?.querySelector(config.submitButtonSelector);

    if (this.form) {
      this.init();
    }
  }

  init() {
    // Set form start time
    this.setStartTime();

    // Listen for form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Listen for field changes to clear previous error messages
    this.form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('change', () => this.clearStatus());
    });
  }

  /**
   * Set form start timestamp
   */
  setStartTime() {
    const startInput = this.form?.querySelector(`#${this.config.startTimeInputId}`);
    if (startInput) {
      startInput.value = String(Date.now());
    }
  }

  /**
   * Clear status message
   */
  clearStatus() {
    if (this.statusEl) {
      this.statusEl.className = this.config.statusId;
      this.statusEl.textContent = '';
    }
  }

  /**
   * Show status message (success or error)
   */
  setStatus(message, type = 'info') {
    if (!this.statusEl) return;

    this.statusEl.className = `${this.config.statusId} ${type}`;
    this.statusEl.textContent = message;
  }

  /**
   * Validate form fields
   */
  validate() {
    if (!this.form.checkValidity()) {
      this.form.reportValidity();
      this.setStatus('Tarkista pakolliset kentät.', 'error');
      return false;
    }
    return true;
  }

  /**
   * Open email fallback (mailto)
   */
  openEmailFallback(data) {
    const subject = encodeURIComponent(`VIDO kartoituspyyntö — ${data.company || 'Uusi pyyntö'}`);
    const body = encodeURIComponent(
      `Nimi: ${data.name || ''}
Yritys: ${data.company || ''}
Sähköposti: ${data.email || ''}
Puhelin: ${data.phone || ''}
Tarve: ${data.need || ''}

Tilanne:
${data.message || '-'}`
    );
    window.location.href = `mailto:${this.config.emailFallback}?subject=${subject}&body=${body}`;
  }

  /**
   * Reset form to initial state
   */
  reset() {
    this.form.reset();
    this.setStartTime();
  }

  /**
   * Handle form submission
   */
  async handleSubmit(event) {
    event.preventDefault();
    this.clearStatus();

    // Validate form
    if (!this.validate()) {
      return;
    }

    // Get form data
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());

    // Disable submit button
    this.submitBtn.disabled = true;
    this.setStatus('Lähetetään…', 'info');

    try {
      // Attempt to submit to API
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({}));

      // Handle API errors
      if (!response.ok) {
        // If email not configured, fall back to mailto
        if (result.code === 'EMAIL_NOT_CONFIGURED') {
          this.setStatus('Avataan sähköpostisovellus viestin lähettämistä varten.', 'info');
          this.openEmailFallback(data);
          return;
        }

        throw new Error(result.message || 'Lähetys epäonnistui');
      }

      // Success
      this.reset();
      this.setStatus('Kiitos. Kartoituspyyntö on lähetetty.', 'success');
    } catch (error) {
      console.error('Form submission error:', error);

      // Fallback to email
      this.setStatus('Lomaketta ei voitu lähettää. Avataan sähköpostisovellus.', 'error');
      this.openEmailFallback(data);
    } finally {
      // Re-enable submit button
      this.submitBtn.disabled = false;
    }
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function initContactForm() {
  try {
    const form = new ContactForm();
    if (form.form) {
      console.log('✓ Contact form initialized');
    }
  } catch (error) {
    console.error('Failed to initialize contact form:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ContactForm, initContactForm };
}
