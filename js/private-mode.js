/**
 * private-mode.js
 * Handles private mode functionality with PIN protection
 */

const PrivateMode = {
    isPrivateMode: false,
    PIN: '0000', // Default PIN
    
    /**
     * Initialize private mode functionality
     */
    init() {
        // Set up private mode button
        const privateModeBtn = document.getElementById('private-mode-btn');
        privateModeBtn.addEventListener('click', () => {
            this.enterPrivateMode();
        });
        
        // Set up exit private mode button
        const exitPrivateModeBtn = document.getElementById('exit-private-mode-btn');
        exitPrivateModeBtn.addEventListener('click', () => {
            this.exitPrivateMode();
        });
    },
    
    /**
     * Enter private mode with PIN verification
     */
    enterPrivateMode() {
        if (this.isPrivateMode) return;
        
        Popup.open('pin-entry-overlay', {
            title: 'Enter PIN to Access Private Notes',
            privateMode: true,
            onConfirm: (pin) => {
                // Activate private mode
                this.activatePrivateMode();
            }
        });
    },
    
    /**
     * Activate private mode after successful PIN entry
     */
    activatePrivateMode() {
        this.isPrivateMode = true;
        
        // Switch to private theme (red)
        Theme.togglePrivateMode(true);
        
        // Show private mode container
        const privateContainer = document.getElementById('private-mode-container');
        Animations.animateEnterPrivateMode(privateContainer);
    },
    
    /**
     * Exit private mode
     */
    exitPrivateMode() {
        if (!this.isPrivateMode) return;
        
        this.isPrivateMode = false;
        
        // Restore normal theme
        Theme.togglePrivateMode(false);
        
        // Hide private mode container
        const privateContainer = document.getElementById('private-mode-container');
        Animations.animateExitPrivateMode(privateContainer);
    },
    
    /**
     * Change PIN for private mode
     */
    changePIN() {
        // Store the steps of the PIN change process
        let newPIN = '';
        
        // Step 1: First verify current PIN
        Popup.open('pin-entry-overlay', {
            title: 'Enter Current PIN',
            verifyMode: true,
            correctPin: this.PIN,
            onConfirm: (currentPin) => {
                console.log('Current PIN verified');
                
                // Step 2: Prompt for new PIN
                setTimeout(() => {
                    Popup.open('pin-entry-overlay', {
                        title: 'Enter New PIN',
                        onConfirm: (enteredNewPin) => {
                            console.log('New PIN entered:', enteredNewPin);
                            // Save the new PIN temporarily
                            newPIN = enteredNewPin;
                            
                            // Step 3: Confirm new PIN
                            setTimeout(() => {
                                Popup.open('pin-entry-overlay', {
                                    title: 'Confirm New PIN',
                                    onConfirm: (confirmPin) => {
                                        console.log('Confirm PIN entered:', confirmPin);
                                        
                                        // Check if confirmation matches
                                        if (confirmPin === newPIN) {
                                            // Update PIN
                                            this.PIN = newPIN;
                                            
                                            // Save PIN to local storage
                                            try {
                                                localStorage.setItem('app_private_pin', newPIN);
                                                console.log('New PIN saved successfully:', newPIN);
                                            } catch (error) {
                                                console.error('Error saving PIN:', error);
                                            }
                                            
                                            // Show success message
                                            Popup.alert('PIN changed successfully', 'Success');
                                        } else {
                                            // Show error message if PINs don't match
                                            Popup.alert('PINs do not match. Please try again.', 'Error');
                                        }
                                    }
                                });
                            }, 300);
                        }
                    });
                }, 300);
            }
        });
    },
    
    /**
     * Load PIN from local storage
     */
    loadSavedPIN() {
        try {
            const savedPIN = localStorage.getItem('app_private_pin');
            if (savedPIN) {
                this.PIN = savedPIN;
            }
        } catch (error) {
            console.error('Error loading PIN:', error);
        }
    }
};

// Initialize private mode when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    PrivateMode.init();
    PrivateMode.loadSavedPIN();
});
