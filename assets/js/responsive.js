/* ========================================
   LISTENUP - RESPONSIVE DESIGN UTILITIES
   ======================================== */

class ResponsiveManager {
  constructor() {
    this.BREAKPOINTS = {
      xs: 0,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    };

    this.currentBreakpoint = this.detectBreakpoint();
    this.init();
  }

  /**
   * Initialize responsive manager
   */
  init() {
    this.setupMobileMenu();
    this.setupResizeListener();
    this.setupMediaQueries();
  }

  /**
   * Detect current breakpoint
   * @returns {string} Current breakpoint name
   */
  detectBreakpoint() {
    const width = window.innerWidth;
    
    if (width < this.BREAKPOINTS.sm) return 'xs';
    if (width < this.BREAKPOINTS.md) return 'sm';
    if (width < this.BREAKPOINTS.lg) return 'md';
    if (width < this.BREAKPOINTS.xl) return 'lg';
    if (width < this.BREAKPOINTS.xxl) return 'xl';
    return 'xxl';
  }

  /**
   * Check if current width matches a breakpoint
   * @param {string} breakpoint - Breakpoint name
   * @returns {boolean} True if matches
   */
  isBreakpoint(breakpoint) {
    return this.currentBreakpoint === breakpoint;
  }

  /**
   * Check if current width is at or above breakpoint
   * @param {string} breakpoint - Breakpoint name
   * @returns {boolean} True if matches
   */
  isAbove(breakpoint) {
    const breakpoints = Object.keys(this.BREAKPOINTS);
    const currentIndex = breakpoints.indexOf(this.currentBreakpoint);
    const targetIndex = breakpoints.indexOf(breakpoint);
    return currentIndex >= targetIndex;
  }

  /**
   * Check if current width is below breakpoint
   * @param {string} breakpoint - Breakpoint name
   * @returns {boolean} True if matches
   */
  isBelow(breakpoint) {
    const breakpoints = Object.keys(this.BREAKPOINTS);
    const currentIndex = breakpoints.indexOf(this.currentBreakpoint);
    const targetIndex = breakpoints.indexOf(breakpoint);
    return currentIndex < targetIndex;
  }

  /**
   * Get viewport size
   * @returns {Object} Width and height
   */
  getViewportSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  /**
   * Setup mobile hamburger menu
   */
  setupMobileMenu() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navLinks = document.querySelector('.nav-links');
    const sidebar = document.querySelector('.sidebar');

    if (!hamburgerBtn) return;

    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navLinks?.classList.toggle('mobile-active');
      sidebar?.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navLinks.classList.remove('mobile-active');
        sidebar?.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.hamburger-btn') && 
          !e.target.closest('.nav-links') &&
          !e.target.closest('.sidebar')) {
        hamburgerBtn.classList.remove('active');
        navLinks?.classList.remove('mobile-active');
        sidebar?.classList.remove('active');
      }
    });
  }

  /**
   * Handle window resize
   */
  setupResizeListener() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const oldBreakpoint = this.currentBreakpoint;
        this.currentBreakpoint = this.detectBreakpoint();

        if (oldBreakpoint !== this.currentBreakpoint) {
          window.dispatchEvent(new CustomEvent('breakpointchange', {
            detail: { 
              from: oldBreakpoint, 
              to: this.currentBreakpoint 
            }
          }));
        }
      }, 150);
    });
  }

  /**
   * Setup media queries
   */
  setupMediaQueries() {
    // Hide sidebar on mobile devices
    const mobileQuery = window.matchMedia(`(max-width: ${this.BREAKPOINTS.md - 1}px)`);
    mobileQuery.addListener((e) => {
      const sidebar = document.querySelector('.sidebar');
      const hamburger = document.querySelector('.hamburger-btn');
      
      if (e.matches) {
        sidebar?.classList.remove('active');
        hamburger?.classList.remove('active');
      }
    });

    // Touch device detection
    if (this.isTouchDevice()) {
      document.documentElement.classList.add('touch-device');
    }
  }

  /**
   * Detect if device supports touch
   * @returns {boolean} True if touch device
   */
  isTouchDevice() {
    return (
      !!(typeof window !== 'undefined' &&
        (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)) ||
      false
    );
  }

  /**
   * Get device info
   * @returns {Object} Device information
   */
  getDeviceInfo() {
    const ua = navigator.userAgent;
    return {
      isMobile: /Mobile|Android|iPhone/.test(ua),
      isTablet: /iPad|Android/.test(ua) && !/Mobile/.test(ua),
      isDesktop: !/Mobile|Android|iPhone|iPad/.test(ua),
      isTouchDevice: this.isTouchDevice(),
      breakpoint: this.currentBreakpoint
    };
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.responsiveManager = new ResponsiveManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResponsiveManager;
}
