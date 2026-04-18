/* ========================================
   LISTENUP - THEME MANAGEMENT
   ======================================== */

class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'listenup_theme';
    this.THEMES = {
      DARK: 'dark',
      LIGHT: 'light',
      HIGH_CONTRAST: 'high-contrast',
      AUTO: 'auto'
    };
    
    this.init();
  }

  /**
   * Initialize theme system
   */
  init() {
    this.loadTheme();
    this.setupThemeToggle();
    this.watchSystemPreference();
  }

  /**
   * Load saved theme or detect system preference
   */
  loadTheme() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) || this.THEMES.AUTO;
    this.setTheme(savedTheme);
  }

  /**
   * Set theme and save to localStorage
   * @param {string} theme - Theme name
   */
  setTheme(theme) {
    if (!Object.values(this.THEMES).includes(theme)) {
      theme = this.THEMES.AUTO;
    }

    const themeToApply = theme === this.THEMES.AUTO 
      ? this.getSystemPreference() 
      : theme;

    document.documentElement.setAttribute('data-theme', themeToApply);
    localStorage.setItem(this.STORAGE_KEY, theme);
    
    // Update theme color meta tag
    this.updateMetaThemeColor(themeToApply);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme: themeToApply } 
    }));
  }

  /**
   * Get current theme
   * @returns {string} Current theme
   */
  getTheme() {
    return localStorage.getItem(this.STORAGE_KEY) || this.THEMES.AUTO;
  }

  /**
   * Get actual applied theme
   * @returns {string} Applied theme
   */
  getAppliedTheme() {
    return document.documentElement.getAttribute('data-theme') || this.THEMES.DARK;
  }

  /**
   * Detect system preference
   * @returns {string} System theme preference
   */
  getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return this.THEMES.LIGHT;
    }
    return this.THEMES.DARK;
  }

  /**
   * Watch for system theme changes
   */
  watchSystemPreference() {
    if (!window.matchMedia) return;

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addListener(() => {
      if (this.getTheme() === this.THEMES.AUTO) {
        this.setTheme(this.THEMES.AUTO);
      }
    });
  }

  /**
   * Update meta theme color for mobile browsers
   * @param {string} theme - Theme name
   */
  updateMetaThemeColor(theme) {
    const colors = {
      [this.THEMES.DARK]: '#121212',
      [this.THEMES.LIGHT]: '#ffffff',
      [this.THEMES.HIGH_CONTRAST]: '#000000'
    };

    const color = colors[theme] || colors[this.THEMES.DARK];
    let metaTag = document.querySelector('meta[name="theme-color"]');
    
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'theme-color';
      document.head.appendChild(metaTag);
    }
    
    metaTag.content = color;
  }

  /**
   * Toggle between themes
   */
  toggleTheme() {
    const current = this.getTheme();
    const themes = Object.values(this.THEMES);
    const index = themes.indexOf(current);
    const nextIndex = (index + 1) % (themes.length - 1); // Skip AUTO in toggle
    this.setTheme(themes[nextIndex]);
  }

  /**
   * Setup theme toggle buttons
   */
  setupThemeToggle() {
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleTheme();
      });
    });

    // Setup theme switcher
    const themeSwitcher = document.querySelector('[data-theme-switcher]');
    if (themeSwitcher) {
      Object.values(this.THEMES).forEach(theme => {
        const option = document.createElement('option');
        option.value = theme;
        option.textContent = this.formatThemeName(theme);
        themeSwitcher.appendChild(option);
      });

      themeSwitcher.value = this.getTheme();
      themeSwitcher.addEventListener('change', (e) => {
        this.setTheme(e.target.value);
      });
    }
  }

  /**
   * Format theme name for display
   * @param {string} theme - Theme name
   * @returns {string} Formatted name
   */
  formatThemeName(theme) {
    const names = {
      [this.THEMES.DARK]: '🌙 Dark',
      [this.THEMES.LIGHT]: '☀️ Light',
      [this.THEMES.HIGH_CONTRAST]: '⚡ High Contrast',
      [this.THEMES.AUTO]: 'Auto'
    };
    return names[theme] || theme;
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
