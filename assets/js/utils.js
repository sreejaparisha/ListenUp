/* ========================================
  LISTENUP - UTILITY FUNCTIONS & HELPERS
   ======================================== */

const ListenUpUtils = {
  /**
   * Debounce function - delay execution
   * @param {Function} fn - Function to debounce
   * @param {number} ms - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(fn, ms = 300) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), ms);
    };
  },

  /**
   * Throttle function - limit execution frequency
   * @param {Function} fn - Function to throttle
   * @param {number} ms - Minimum delay between calls
   * @returns {Function} Throttled function
   */
  throttle(fn, ms = 300) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= ms) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  },

  /**
   * Get query parameter from URL
   * @param {string} param - Parameter name
   * @returns {string|null} Parameter value
   */
  getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  },

  /**
   * Check if element is in viewport
   * @param {Element} element - DOM element
   * @returns {boolean} True if in viewport
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Smooth scroll to element
   * @param {Element|string} target - Element or selector
   * @param {number} offset - Scroll offset
   */
  smoothScroll(target, offset = 0) {
    const element = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;

    if (!element) return;

    const targetPosition = element.getBoundingClientRect().top + window.scrollY - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  },

  /**
   * Format time to MM:SS
   * @param {number} seconds - Seconds
   * @returns {string} Formatted time
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  /**
   * Format large numbers (1k, 1m, etc.)
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  formatNumber(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  },

  /**
   * Truncate text
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
   */
  truncate(text, maxLength = 50) {
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  },

  /**
   * Get random element from array
   * @param {Array} array - Array
   * @returns {*} Random element
   */
  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  /**
   * Shuffle array
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  /**
   * Check if element has class
   * @param {Element} element - DOM element
   * @param {string} className - Class name
   * @returns {boolean} True if has class
   */
  hasClass(element, className) {
    return element.classList.contains(className);
  },

  /**
   * Add class to element
   * @param {Element} element - DOM element
   * @param {string} className - Class name
   */
  addClass(element, className) {
    element.classList.add(className);
  },

  /**
   * Remove class from element
   * @param {Element} element - DOM element
   * @param {string} className - Class name
   */
  removeClass(element, className) {
    element.classList.remove(className);
  },

  /**
   * Toggle class on element
   * @param {Element} element - DOM element
   * @param {string} className - Class name
   */
  toggleClass(element, className) {
    element.classList.toggle(className);
  },

  /**
   * Show element
   * @param {Element} element - DOM element
   */
  show(element) {
    element.style.display = '';
  },

  /**
   * Hide element
   * @param {Element} element - DOM element
   */
  hide(element) {
    element.style.display = 'none';
  },

  /**
   * Store data in localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   */
  setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },

  /**
   * Get data from localStorage
   * @param {string} key - Storage key
   * @returns {*} Stored value
   */
  getStorage(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error('Storage error:', e);
      return null;
    }
  },

  /**
   * Remove data from localStorage
   * @param {string} key - Storage key
   */
  removeStorage(key) {
    localStorage.removeItem(key);
  },

  /**
   * Clear all localStorage
   */
  clearStorage() {
    localStorage.clear();
  },

  /**
   * Make API request
   * @param {string} url - URL
   * @param {Object} options - Fetch options
   * @returns {Promise} Response promise
   */
  async fetch(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  /**
   * Create notification
   * @param {string} message - Message text
   * @param {string} type - Type (success, error, info, warning)
   * @param {number} duration - Display duration in ms
   */
  notify(message, type = 'info', duration = 3000) {
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.textContent = message;
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: ${this.getNotificationColor(type)};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notif);

    setTimeout(() => {
      notif.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notif.remove(), 300);
    }, duration);
  },

  /**
   * Get notification color
   * @param {string} type - Type
   * @returns {string} Color
   */
  getNotificationColor(type) {
    const colors = {
      success: '#1db954',
      error: '#ff6b6b',
      info: '#007bff',
      warning: '#ffc107'
    };
    return colors[type] || colors.info;
  },

  /**
   * Parse JSON safely
   * @param {string} json - JSON string
   * @param {*} fallback - Fallback value
   * @returns {*} Parsed value
   */
  parseJSON(json, fallback = null) {
    try {
      return JSON.parse(json);
    } catch (e) {
      return fallback;
    }
  },

  /**
   * Deep clone object
   * @param {Object} obj - Object to clone
   * @returns {Object} Cloned object
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Merge objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   */
  merge(target, source) {
    return { ...target, ...source };
  }
};

// Make globally available
window.ListenUpUtils = ListenUpUtils;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ListenUpUtils;
}
