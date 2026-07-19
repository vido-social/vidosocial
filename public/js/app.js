/**
 * VIDO Social — Main Application
 * Core app initialization, modal management, and utilities
 */

// ============================================================================
// MODAL MANAGEMENT
// ============================================================================

const calendarModal = document.getElementById('calendar-modal');
const modalCloseBtn = document.querySelector('.modal-close');

/**
 * Opens the calendar/booking modal
 */
function openCalendarModal() {
  if (!calendarModal) return;
  calendarModal.classList.add('open');
  calendarModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

/**
 * Closes the calendar/booking modal
 */
function closeCalendarModal() {
  if (!calendarModal) return;
  calendarModal.classList.remove('open');
  calendarModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // Restore scroll
}

/**
 * Setup modal triggers (all elements with data-calendly attribute)
 */
function setupModalTriggers() {
  document.querySelectorAll('[data-calendly]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openCalendarModal();
    });
  });

  // Close button
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeCalendarModal);
  }

  // Click outside modal to close
  if (calendarModal) {
    calendarModal.addEventListener('click', (e) => {
      if (e.target === calendarModal) {
        closeCalendarModal();
      }
    });
  }

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && calendarModal?.classList.contains('open')) {
      closeCalendarModal();
    }
  });
}

// ============================================================================
// INTERSECTION OBSERVER - Reveal animations on scroll
// ============================================================================

function setupScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Set current year in footer
 */
function setCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Get environment variable (fallback to window object)
 */
function getEnvVar(key, defaultValue = null) {
  return window[`VITE_${key}`] || localStorage.getItem(key) || defaultValue;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
  // Set year
  setCurrentYear();

  // Setup modals
  setupModalTriggers();

  // Setup scroll reveal animations
  setupScrollReveal();

  // Log app initialized (development)
  if (process.env.NODE_ENV !== 'production') {
    console.log('✓ VIDO app initialized');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for testing or external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    openCalendarModal,
    closeCalendarModal,
    setupModalTriggers,
    setupScrollReveal,
    setCurrentYear,
    getEnvVar,
  };
}
