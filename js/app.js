/**
 * app.js
 * Main application initialization and coordination
 */

/**
 * Main application object
 */
const App = {
    // Search state variables
    searchActive: false,
    searchResults: [],
    
    /**
     * Initialize the application
     */
    init() {
        // Log initialization
        console.log('ani-note app initializing...');
        
        // Check for browser compatibility
        this.checkCompatibility();
        
        // Initialize components (already done via individual scripts)
        // But we can add any additional initialization here
        
        // Initialize search functionality
        this.initSearchFeature();
        
        // Add smooth transition when the page loads
        this.addInitialTransition();
        
        // Add event listeners for keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Log successful initialization
        console.log('ani-note app initialized successfully');
    },
    
    /**
     * Initialize search functionality
     */
    initSearchFeature() {
        const searchBtn = document.getElementById('search-btn');
        const closeSearchBtn = document.getElementById('close-search-btn');
        const searchContainer = document.getElementById('search-container');
        const searchInput = document.getElementById('search-input');
        
        // Toggle search box when search button is clicked
        searchBtn.addEventListener('click', () => {
            searchContainer.classList.add('active');
            setTimeout(() => {
                searchInput.focus();
            }, 300);
            this.searchActive = true;
        });
        
        // Close search when close button is clicked
        closeSearchBtn.addEventListener('click', () => {
            searchContainer.classList.remove('active');
            searchInput.value = '';
            this.clearSearchResults();
            this.searchActive = false;
        });
        
        // Handle search input
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            if (query.length > 1) {
                this.performSearch(query);
            } else {
                this.clearSearchResults();
            }
        });
        
        // Close search on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.searchActive) {
                searchContainer.classList.remove('active');
                searchInput.value = '';
                this.clearSearchResults();
                this.searchActive = false;
            }
        });
    },
    
    /**
     * Perform search on notes
     * @param {string} query - Search query
     */
    performSearch(query) {
        // Get current active note collection
        const notes = PrivateMode.isPrivateMode ? Notes.privateNotes : Notes.notes;
        
        // Filter notes based on query
        this.searchResults = notes.filter(note => {
            return note.title.toLowerCase().includes(query) || 
                   note.content.toLowerCase().includes(query);
        });
        
        // Display search results
        this.displaySearchResults(this.searchResults);
    },
    
    /**
     * Display search results
     * @param {Array} results - Search results
     */
    displaySearchResults(results) {
        // Get container
        const container = PrivateMode.isPrivateMode ? 
            document.getElementById('private-notes-container') : 
            document.getElementById('notes-container');
        
        // Get empty state
        const emptyState = PrivateMode.isPrivateMode ? 
            document.getElementById('private-empty-state') : 
            document.getElementById('empty-state');
        
        // Clear container
        container.innerHTML = '';
        
        // Hide empty state
        emptyState.style.display = 'none';
        container.appendChild(emptyState);
        
        // Show message if no results
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'search-no-results';
            noResults.innerHTML = `
                <i class="fas fa-search empty-icon"></i>
                <p>No notes match your search</p>
            `;
            container.appendChild(noResults);
            return;
        }
        
        // Add search result indicator
        const searchIndicator = document.createElement('div');
        searchIndicator.className = 'search-indicator';
        searchIndicator.innerHTML = `
            <span>Showing ${results.length} search result${results.length > 1 ? 's' : ''}</span>
            <button id="clear-search-btn" class="clear-search-btn">
                <i class="fas fa-times"></i> Clear Search
            </button>
        `;
        container.appendChild(searchIndicator);
        
        // Add event listener to clear search button
        setTimeout(() => {
            const clearSearchBtn = document.getElementById('clear-search-btn');
            if (clearSearchBtn) {
                clearSearchBtn.addEventListener('click', () => {
                    this.clearSearchResults();
                    document.getElementById('search-input').value = '';
                });
            }
        }, 0);
        
        // Render each result
        results.forEach((note, index) => {
            const noteCard = Notes.createNoteElement(note, PrivateMode.isPrivateMode, index);
            noteCard.classList.add('search-result');
            container.appendChild(noteCard);
        });
    },
    
    /**
     * Clear search results and display original notes
     */
    clearSearchResults() {
        this.searchResults = [];
        
        // Re-render appropriate notes
        if (PrivateMode.isPrivateMode) {
            Notes.renderPrivateNotes();
        } else {
            Notes.renderNotes();
        }
    },
    
    /**
     * Check browser compatibility for required features
     */
    checkCompatibility() {
        // Check for Local Storage
        if (!window.localStorage) {
            this.showCompatibilityError('Local Storage is not supported in your browser. Some features may not work properly.');
        }
        
        // Check for CSS Variables
        const isStyleSupported = window.CSS && window.CSS.supports;
        if (!(isStyleSupported && CSS.supports('--a', '0'))) {
            this.showCompatibilityError('CSS Variables are not supported in your browser. The application may not display correctly.');
        }
        
        // Check for Backdrop Filter
        if (!(isStyleSupported && (CSS.supports('backdrop-filter', 'blur(10px)') || 
                                  CSS.supports('-webkit-backdrop-filter', 'blur(10px)')))) {
            console.warn('Backdrop filter is not supported in your browser. Some visual effects will be limited.');
        }
    },
    
    /**
     * Show compatibility error message
     * @param {string} message - Error message to display
     */
    showCompatibilityError(message) {
        // Create error banner
        const banner = document.createElement('div');
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '0';
        banner.style.right = '0';
        banner.style.backgroundColor = '#ff4d4d';
        banner.style.color = 'white';
        banner.style.padding = '10px';
        banner.style.textAlign = 'center';
        banner.style.zIndex = '9999';
        banner.style.fontWeight = 'bold';
        banner.textContent = message;
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.marginLeft = '10px';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'white';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.addEventListener('click', () => banner.remove());
        
        banner.appendChild(closeBtn);
        document.body.appendChild(banner);
    },
    
    /**
     * Add initial transition effects when the page loads
     */
    addInitialTransition() {
        // Add fade-in effect to the body
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        // Show the body after a small delay
        setTimeout(() => {
            document.body.style.opacity = '1';
            
            // Animate in the navbar and new note button
            const navbar = document.querySelector('.nav-bar');
            if (navbar) {
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.opacity = '0';
                navbar.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                
                setTimeout(() => {
                    navbar.style.transform = 'translateY(0)';
                    navbar.style.opacity = '1';
                }, 200);
            }
        }, 100);
    },
    
    /**
     * Set up keyboard shortcuts for common actions
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only process shortcuts when not typing in an input or textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            // Ctrl/Cmd + N: New note
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                if (!PrivateMode.isPrivateMode) {
                    Notes.createNewNote(false);
                } else {
                    Notes.createNewNote(true);
                }
            }
            
            // Ctrl/Cmd + ,: Open settings
            if ((e.ctrlKey || e.metaKey) && e.key === ',') {
                e.preventDefault();
                Theme.openSettings();
            }
            
            // Ctrl/Cmd + P: Toggle private mode
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                if (!PrivateMode.isPrivateMode) {
                    PrivateMode.enterPrivateMode();
                } else {
                    PrivateMode.exitPrivateMode();
                }
            }
        });
    },
    
    /**
     * Show a welcome message for first-time users
     */
    showWelcomeMessage() {
        const hasVisitedBefore = localStorage.getItem('app_visited');
        
        if (!hasVisitedBefore) {
            // Create welcome note
            const welcomeNote = {
                id: Date.now().toString(),
                title: '👋 Welcome to Animated Notes!',
                content: 'Welcome to your new note-taking app! Here are some things you can do:\n\n' +
                         '✨ Create and manage notes\n' +
                         '🔒 Use private mode for sensitive notes (PIN: 0000)\n' +
                         '🎨 Customize theme and colors in settings\n' +
                         '⌨️ Use keyboard shortcuts (Ctrl+N for new note, Ctrl+P for private mode, Ctrl+, for settings)\n\n' +
                         'Enjoy taking notes in style!',
                created: Date.now()
            };
            
            // Add welcome note to notes array
            Notes.notes.unshift(welcomeNote);
            Notes.saveNotes();
            Notes.renderNotes();
            
            // Mark as visited
            localStorage.setItem('app_visited', 'true');
        }
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    
    // Show welcome note after a short delay to allow animations to complete
    setTimeout(() => {
        App.showWelcomeMessage();
    }, 1000);
});
