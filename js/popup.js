/**
 * popup.js
 * Handles all custom popup functionality
 */

const Popup = {
    activePopup: null,
    callbacks: {},
    
    /**
     * Initialize popup system
     */
    init() {
        // Set up close buttons for all popups
        const closeButtons = document.querySelectorAll('.close-popup-btn');
        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const popup = e.target.closest('.popup-overlay');
                this.close(popup.id);
            });
        });
        
        // Close popups when clicking on overlay
        const overlays = document.querySelectorAll('.popup-overlay');
        overlays.forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close(overlay.id);
                }
            });
        });
        
        // Set up change PIN button
        const changePinBtn = document.getElementById('change-pin-btn');
        if (changePinBtn) {
            changePinBtn.addEventListener('click', () => {
                this.close('settings-overlay');
                setTimeout(() => {
                    PrivateMode.changePIN();
                }, 300);
            });
        }
        
        // Close popups with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activePopup) {
                this.close(this.activePopup);
            }
        });
    },
    
    /**
     * Open a popup
     * @param {string} popupId - ID of the popup to open
     * @param {Object} options - Optional configuration for the popup
     */
    open(popupId, options = {}) {
        // Close any active popup first
        if (this.activePopup) {
            this.close(this.activePopup);
        }
        
        const popupOverlay = document.getElementById(popupId);
        if (!popupOverlay) return;
        
        // Store active popup
        this.activePopup = popupId;
        
        // Prevent body scrolling
        document.body.classList.add('no-scroll');
        
        // Set callback if provided
        if (options.onConfirm) {
            this.callbacks[popupId] = { 
                onConfirm: options.onConfirm,
                onCancel: options.onCancel
            };
        }
        
        // Configure popup based on options
        if (options.title) {
            const titleEl = popupOverlay.querySelector('.popup-header h2');
            if (titleEl) titleEl.textContent = options.title;
        }
        
        if (options.message) {
            const messageEl = popupOverlay.querySelector('#alert-message, #confirm-message');
            if (messageEl) messageEl.textContent = options.message;
        }
        
        // Show popup with animation
        popupOverlay.classList.add('active');
        
        // Handle different popup types
        if (popupId === 'note-editor-overlay') {
            this.setupNoteEditor(options);
        } else if (popupId === 'pin-entry-overlay') {
            this.setupPinEntry(options);
        } else if (popupId === 'change-pin-overlay') {
            this.setupChangePIN(options);
        } else if (popupId === 'confirm-overlay') {
            this.setupConfirmation(options);
        } else if (popupId === 'alert-overlay') {
            this.setupAlert(options);
        } else if (popupId === 'settings-overlay') {
            this.setupSettings();
        }
    },
    
    /**
     * Close a popup
     * @param {string} popupId - ID of the popup to close
     */
    close(popupId) {
        const popupOverlay = document.getElementById(popupId);
        if (!popupOverlay) return;
        
        // Hide popup with animation
        popupOverlay.classList.remove('active');
        
        // Allow body scrolling
        document.body.classList.remove('no-scroll');
        
        // Clear active popup reference
        this.activePopup = null;
        
        // Clear any temporary data
        delete this.callbacks[popupId];
    },
    
    /**
     * Setup note editor popup
     * @param {Object} options - Configuration for the note editor
     */
    setupNoteEditor(options) {
        const titleInput = document.getElementById('note-title');
        const contentInput = document.getElementById('note-content');
        const saveBtn = document.getElementById('save-note-btn');
        const cancelBtn = document.getElementById('cancel-note-btn');
        const editorTitle = document.getElementById('note-editor-title');
        
        // Set editor title based on mode (new or edit)
        editorTitle.textContent = options.editMode ? 'Edit Note' : 'New Note';
        
        // Set input values if editing an existing note
        if (options.editMode && options.note) {
            titleInput.value = options.note.title || '';
            contentInput.value = options.note.content || '';
        } else {
            titleInput.value = '';
            contentInput.value = '';
        }
        
        // Focus on title input
        setTimeout(() => {
            titleInput.focus();
        }, 300);
        
        // Remove old event listeners and add new ones
        const newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
        
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        
        newSaveBtn.addEventListener('click', () => {
            // Store callback reference locally
            const callback = this.callbacks['note-editor-overlay'] ? this.callbacks['note-editor-overlay'].onConfirm : null;
            
            const noteData = {
                title: titleInput.value.trim(),
                content: contentInput.value.trim(),
                id: options.note ? options.note.id : Date.now().toString(),
                isPrivate: options.isPrivate || false
            };
            
            console.log('Saving note data:', noteData);
            
            // Close modal first so it doesn't interfere with DOM updates
            this.close('note-editor-overlay');
            
            // Then execute callback
            if (callback) {
                console.log('Executing save callback');
                setTimeout(() => callback(noteData), 10);
            }
        });
        
        newCancelBtn.addEventListener('click', () => {
            // Store callback reference locally
            const callback = this.callbacks['note-editor-overlay'] ? this.callbacks['note-editor-overlay'].onCancel : null;
            
            // Close modal first
            this.close('note-editor-overlay');
            
            // Then execute callback
            if (callback) {
                setTimeout(() => callback(), 10);
            }
        });
    },
    
    /**
     * Setup PIN entry popup
     * @param {Object} options - Configuration for PIN entry
     */
    setupPinEntry(options) {
        const pinDots = document.querySelectorAll('.pin-dot');
        const pinKeys = document.querySelectorAll('.pin-key');
        const pinMessage = document.getElementById('pin-message');
        
        // Clear PIN dots
        pinDots.forEach(dot => {
            dot.classList.remove('filled');
        });
        
        // Clear PIN message
        pinMessage.textContent = '';
        
        // Set PIN entry mode class
        const popupOverlay = document.getElementById('pin-entry-overlay');
        popupOverlay.classList.toggle('private-mode', options.privateMode);
        
        // Current PIN input
        let currentPin = '';
        
        // Remove old event listeners from PIN keys
        pinKeys.forEach(key => {
            const newKey = key.cloneNode(true);
            key.parentNode.replaceChild(newKey, key);
        });
        
        // Add new event listeners to PIN keys
        document.querySelectorAll('.pin-key').forEach(key => {
            key.addEventListener('click', (e) => {
                const keyValue = key.getAttribute('data-key');
                
                if (keyValue === 'clear') {
                    // Clear all PIN dots
                    currentPin = '';
                    pinDots.forEach(dot => {
                        dot.classList.remove('filled');
                    });
                } else if (keyValue === 'delete') {
                    // Delete last PIN digit
                    if (currentPin.length > 0) {
                        currentPin = currentPin.slice(0, -1);
                        pinDots[currentPin.length].classList.remove('filled');
                    }
                } else if (currentPin.length < 4) {
                    // Add new PIN digit
                    currentPin += keyValue;
                    
                    // Animate the dot filling
                    Animations.animatePinDot(pinDots[currentPin.length - 1]);
                    
                    // Check if PIN is complete
                    if (currentPin.length === 4) {
                        // Verify PIN
                        setTimeout(() => {
                            const pinDisplay = document.querySelector('.pin-display');
                            
                            // Handle different PIN verification scenarios
                            if (options.verifyMode && options.correctPin) {
                                // Verify PIN matches the correct PIN
                                if (currentPin === options.correctPin) {
                                    // PIN verification success
                                    Animations.animatePinSuccess(pinDisplay);
                                    
                                    pinMessage.textContent = 'PIN Correct';
                                    pinMessage.style.color = 'var(--teal)';
                                    
                                    setTimeout(() => {
                                        if (this.callbacks['pin-entry-overlay'] && this.callbacks['pin-entry-overlay'].onConfirm) {
                                            this.callbacks['pin-entry-overlay'].onConfirm(currentPin);
                                        }
                                        
                                        this.close('pin-entry-overlay');
                                    }, 500);
                                } else {
                                    // PIN verification failed
                                    Animations.animatePinError(pinDisplay);
                                    
                                    pinMessage.textContent = 'Incorrect PIN. Try again.';
                                    pinMessage.style.color = 'var(--red)';
                                    
                                    // Clear PIN after showing error
                                    setTimeout(() => {
                                        currentPin = '';
                                        pinDots.forEach(dot => {
                                            dot.classList.remove('filled');
                                        });
                                    }, 500);
                                }
                            } else if (!options.verifyMode && PrivateMode.isPrivateMode && !options.correctPin) {
                                // Just collect the PIN for new PIN entry/confirmation
                                Animations.animatePinSuccess(pinDisplay);
                                
                                setTimeout(() => {
                                    if (this.callbacks['pin-entry-overlay'] && this.callbacks['pin-entry-overlay'].onConfirm) {
                                        this.callbacks['pin-entry-overlay'].onConfirm(currentPin);
                                    }
                                    
                                    this.close('pin-entry-overlay');
                                }, 500);
                            } else {
                                // Default case - check against default PIN or stored PIN
                                const storedPIN = PrivateMode.PIN || '0000';
                                
                                if (currentPin === storedPIN) {
                                    // PIN verification success
                                    Animations.animatePinSuccess(pinDisplay);
                                    
                                    pinMessage.textContent = 'PIN Correct';
                                    pinMessage.style.color = 'var(--teal)';
                                    
                                    setTimeout(() => {
                                        if (this.callbacks['pin-entry-overlay'] && this.callbacks['pin-entry-overlay'].onConfirm) {
                                            this.callbacks['pin-entry-overlay'].onConfirm(currentPin);
                                        }
                                        
                                        this.close('pin-entry-overlay');
                                    }, 500);
                                } else {
                                    // PIN verification failed
                                    Animations.animatePinError(pinDisplay);
                                    
                                    pinMessage.textContent = 'Incorrect PIN. Try again.';
                                    pinMessage.style.color = 'var(--red)';
                                    
                                    // Clear PIN after showing error
                                    setTimeout(() => {
                                        currentPin = '';
                                        pinDots.forEach(dot => {
                                            dot.classList.remove('filled');
                                        });
                                    }, 500);
                                }
                            }
                        }, 300);
                    }
                }
            });
        });
    },
    
    /**
     * Setup confirmation popup
     * @param {Object} options - Configuration for confirmation dialog
     */
    setupConfirmation(options) {
        const yesBtn = document.getElementById('confirm-yes-btn');
        const noBtn = document.getElementById('confirm-no-btn');
        
        // Remove old event listeners
        const newYesBtn = yesBtn.cloneNode(true);
        yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
        
        const newNoBtn = noBtn.cloneNode(true);
        noBtn.parentNode.replaceChild(newNoBtn, noBtn);
        
        // Add new event listeners
        newYesBtn.addEventListener('click', () => {
            // Store callback reference locally
            const callback = this.callbacks['confirm-overlay'] ? this.callbacks['confirm-overlay'].onConfirm : null;
            
            // Close modal first
            this.close('confirm-overlay');
            
            // Then execute callback
            if (callback) {
                setTimeout(() => callback(), 10);
            }
        });
        
        newNoBtn.addEventListener('click', () => {
            // Store callback reference locally
            const callback = this.callbacks['confirm-overlay'] ? this.callbacks['confirm-overlay'].onCancel : null;
            
            // Close modal first
            this.close('confirm-overlay');
            
            // Then execute callback
            if (callback) {
                setTimeout(() => callback(), 10);
            }
        });
    },
    
    /**
     * Setup alert popup
     * @param {Object} options - Configuration for alert popup
     */
    setupAlert(options) {
        const okBtn = document.getElementById('alert-ok-btn');
        
        // Remove old event listener
        const newOkBtn = okBtn.cloneNode(true);
        okBtn.parentNode.replaceChild(newOkBtn, okBtn);
        
        // Add new event listener
        newOkBtn.addEventListener('click', () => {
            // Store callback reference locally
            const callback = this.callbacks['alert-overlay'] ? this.callbacks['alert-overlay'].onConfirm : null;
            
            // Close modal first
            this.close('alert-overlay');
            
            // Then execute callback
            if (callback) {
                setTimeout(() => callback(), 10);
            }
        });
    },
    
    /**
     * Setup PIN change popup
     * @param {Object} options - Configuration for PIN change
     */
    setupChangePIN(options) {
        const pinDots = document.querySelectorAll('#change-pin-overlay .pin-dot');
        const pinKeys = document.querySelectorAll('#change-pin-overlay .pin-key');
        const pinMessage = document.getElementById('change-pin-message');
        const pinSteps = document.querySelectorAll('.pin-step');
        
        // Set current step indicator
        const currentStep = options.step || 1;
        pinSteps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            step.classList.toggle('active', stepNum === currentStep);
        });
        
        // Clear PIN dots
        pinDots.forEach(dot => {
            dot.classList.remove('filled');
        });
        
        // Clear PIN message
        if (pinMessage) pinMessage.textContent = '';
        
        // Set PIN entry mode class (always private for PIN change)
        const popupOverlay = document.getElementById('change-pin-overlay');
        popupOverlay.classList.add('private-mode');
        
        // Current PIN input
        let currentPin = '';
        
        // Remove old event listeners from PIN keys
        pinKeys.forEach(key => {
            const newKey = key.cloneNode(true);
            key.parentNode.replaceChild(newKey, key);
        });
        
        // Add new event listeners to PIN keys
        document.querySelectorAll('#change-pin-overlay .pin-key').forEach(key => {
            key.addEventListener('click', (e) => {
                const keyValue = key.getAttribute('data-key');
                
                if (keyValue === 'clear') {
                    // Clear all PIN dots
                    currentPin = '';
                    pinDots.forEach(dot => {
                        dot.classList.remove('filled');
                    });
                } else if (keyValue === 'delete') {
                    // Delete last PIN digit
                    if (currentPin.length > 0) {
                        currentPin = currentPin.slice(0, -1);
                        pinDots[currentPin.length].classList.remove('filled');
                    }
                } else if (currentPin.length < 4) {
                    // Add new PIN digit
                    currentPin += keyValue;
                    
                    // Animate the dot filling
                    Animations.animatePinDot(pinDots[currentPin.length - 1]);
                    
                    // Check if PIN is complete
                    if (currentPin.length === 4) {
                        // Process PIN based on step
                        setTimeout(() => {
                            if (this.callbacks['change-pin-overlay'] && this.callbacks['change-pin-overlay'].onConfirm) {
                                this.callbacks['change-pin-overlay'].onConfirm(currentPin);
                            }
                            
                            this.close('change-pin-overlay');
                        }, 500);
                    }
                }
            });
        });
    },
    
    /**
     * Setup settings popup
     */
    setupSettings() {
        // Settings now auto-save and close on selection
        
        // Show/hide PIN change button based on private mode
        const privateSettings = document.getElementById('private-settings');
        if (privateSettings) {
            privateSettings.style.display = PrivateMode.isPrivateMode ? 'block' : 'none';
        }
    },
    
    /**
     * Show a custom alert dialog
     * @param {string} message - Message to display
     * @param {string} title - Alert title
     * @param {Function} callback - Optional callback function
     */
    alert(message, title = 'Alert', callback) {
        this.open('alert-overlay', {
            title: title,
            message: message,
            onConfirm: callback
        });
    },
    
    /**
     * Show a custom confirmation dialog
     * @param {string} message - Message to display
     * @param {string} title - Confirmation title
     * @param {Function} onConfirm - Function to call when confirmed
     * @param {Function} onCancel - Function to call when cancelled
     */
    confirm(message, title = 'Confirm', onConfirm, onCancel) {
        this.open('confirm-overlay', {
            title: title,
            message: message,
            onConfirm: onConfirm,
            onCancel: onCancel
        });
    }
};

// Initialize popup system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Popup.init();
});
