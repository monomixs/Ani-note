/**
 * theme.js
 * Handles theme and color customization for the note-taking app
 */

const Theme = {
    // Default theme settings
    currentTheme: 'light',
    currentColor: 'sky-blue',
    
    /**
     * Initialize theme functionality
     */
    init() {
        // Load saved theme preferences
        this.loadSavedTheme();
        
        // Set up theme toggle buttons
        this.setupThemeButtons();
        
        // Set up color option buttons
        this.setupColorOptions();
        
        // Set up settings button
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.openSettings();
        });
    },
    
    /**
     * Load saved theme from local storage
     */
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('app_theme');
        const savedColor = localStorage.getItem('app_primary_color');
        
        if (savedTheme) {
            this.setTheme(savedTheme);
        }
        
        if (savedColor) {
            this.setPrimaryColor(savedColor);
        }
    },
    
    /**
     * Set up theme toggle buttons
     */
    setupThemeButtons() {
        const lightBtn = document.getElementById('light-theme-btn');
        const darkBtn = document.getElementById('dark-theme-btn');
        
        lightBtn.addEventListener('click', () => {
            this.setTheme('light');
            this.updateThemeButtons();
            // No longer auto-close settings
        });
        
        darkBtn.addEventListener('click', () => {
            this.setTheme('dark');
            this.updateThemeButtons();
            // No longer auto-close settings
        });
    },
    
    /**
     * Set up color option buttons
     */
    setupColorOptions() {
        const colorOptions = document.querySelectorAll('.color-option');
        
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                const color = option.getAttribute('data-color');
                this.setPrimaryColor(color);
                this.updateColorButtons();
                // No longer auto-close settings
            });
        });
    },
    
    /**
     * Set theme (light or dark)
     * @param {string} theme - Theme name ('light' or 'dark')
     */
    setTheme(theme) {
        // Validate theme
        if (theme !== 'light' && theme !== 'dark') {
            theme = 'light';
        }
        
        // Update body class
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${theme}-theme`);
        
        // Store current theme
        this.currentTheme = theme;
        
        // Save to local storage
        localStorage.setItem('app_theme', theme);
    },
    
    /**
     * Set primary color
     * @param {string} color - Color name (e.g., 'sky-blue', 'purple')
     */
    setPrimaryColor(color) {
        // Validate color
        const validColors = ['sky-blue', 'purple', 'teal', 'orange', 'pink', 'lime', 'indigo', 'amber', 'emerald', 'ruby', 'slate'];
        if (!validColors.includes(color)) {
            color = 'sky-blue';
        }
        
        // Update data attribute on body
        document.body.setAttribute('data-primary-color', color);
        
        // Store current color
        this.currentColor = color;
        
        // Update CSS variables
        this.updateColorVariables(color);
        
        // Save to local storage
        localStorage.setItem('app_primary_color', color);
    },
    
    /**
     * Update CSS color variables based on selected color
     * @param {string} color - Selected color name
     */
    updateColorVariables(color) {
        const root = document.documentElement;
        
        switch (color) {
            case 'sky-blue':
                root.style.setProperty('--primary-color', 'var(--sky-blue)');
                root.style.setProperty('--primary-color-hover', 'var(--sky-blue-hover)');
                break;
            case 'purple':
                root.style.setProperty('--primary-color', 'var(--purple)');
                root.style.setProperty('--primary-color-hover', 'var(--purple-hover)');
                break;
            case 'teal':
                root.style.setProperty('--primary-color', 'var(--teal)');
                root.style.setProperty('--primary-color-hover', 'var(--teal-hover)');
                break;
            case 'orange':
                root.style.setProperty('--primary-color', 'var(--orange)');
                root.style.setProperty('--primary-color-hover', 'var(--orange-hover)');
                break;
            case 'pink':
                root.style.setProperty('--primary-color', 'var(--pink)');
                root.style.setProperty('--primary-color-hover', 'var(--pink-hover)');
                break;
            case 'lime':
                root.style.setProperty('--primary-color', 'var(--lime)');
                root.style.setProperty('--primary-color-hover', 'var(--lime-hover)');
                break;
            case 'indigo':
                root.style.setProperty('--primary-color', 'var(--indigo)');
                root.style.setProperty('--primary-color-hover', 'var(--indigo-hover)');
                break;
            case 'amber':
                root.style.setProperty('--primary-color', 'var(--amber)');
                root.style.setProperty('--primary-color-hover', 'var(--amber-hover)');
                break;
            case 'emerald':
                root.style.setProperty('--primary-color', 'var(--emerald)');
                root.style.setProperty('--primary-color-hover', 'var(--emerald-hover)');
                break;
            case 'ruby':
                root.style.setProperty('--primary-color', 'var(--ruby)');
                root.style.setProperty('--primary-color-hover', 'var(--ruby-hover)');
                break;
            case 'slate':
                root.style.setProperty('--primary-color', 'var(--slate)');
                root.style.setProperty('--primary-color-hover', 'var(--slate-hover)');
                break;
        }
    },
    
    /**
     * Update theme button active states
     */
    updateThemeButtons() {
        const lightBtn = document.getElementById('light-theme-btn');
        const darkBtn = document.getElementById('dark-theme-btn');
        
        lightBtn.classList.toggle('active', this.currentTheme === 'light');
        darkBtn.classList.toggle('active', this.currentTheme === 'dark');
    },
    
    /**
     * Update color button active states
     */
    updateColorButtons() {
        const colorOptions = document.querySelectorAll('.color-option');
        
        colorOptions.forEach(option => {
            const color = option.getAttribute('data-color');
            option.classList.toggle('active', color === this.currentColor);
        });
    },
    
    /**
     * Open settings popup
     */
    openSettings() {
        // Update active states before opening
        this.updateThemeButtons();
        this.updateColorButtons();
        
        // Open settings popup
        Popup.open('settings-overlay');
    },
    
    /**
     * Toggle between private mode theme (red) and normal theme
     * @param {boolean} isPrivate - Whether private mode is active
     */
    togglePrivateMode(isPrivate) {
        if (isPrivate) {
            // Store current color before switching to private mode
            localStorage.setItem('app_previous_color', this.currentColor);
            
            // Switch to red for private mode
            this.setPrimaryColor('red');
            document.body.classList.add('private-mode');
        } else {
            // Restore previous color when exiting private mode
            const previousColor = localStorage.getItem('app_previous_color') || this.currentColor;
            this.setPrimaryColor(previousColor);
            document.body.classList.remove('private-mode');
        }
    },
    
    /**
     * Apply pulse animation to an element
     * @param {HTMLElement} element - Element to animate
     */
    pulseElement(element) {
        element.classList.add('pulse-animation');
        
        setTimeout(() => {
            element.classList.remove('pulse-animation');
        }, 500);
        
        // Add pulse animation if not already defined
        if (!document.querySelector('style#theme-animations')) {
            const style = document.createElement('style');
            style.id = 'theme-animations';
            style.textContent = `
                .pulse-animation {
                    animation: theme-pulse 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                
                @keyframes theme-pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }
};

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Theme.init();
});
