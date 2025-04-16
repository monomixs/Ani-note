/**
 * animations.js
 * Handles all custom animations for the note-taking app
 */

const Animations = {
    /**
     * Initialize animation-related event listeners
     */
    init() {
        // Add the animate-in class to the new note button with slight delay
        setTimeout(() => {
            const newNoteBtn = document.getElementById('new-note-btn');
            if (newNoteBtn) {
                newNoteBtn.classList.add('animate-in');
            }
        }, 300);

        // Set up button click animations
        this.setupButtonAnimations();
    },

    /**
     * Set up button click animations for all interactive buttons
     */
    setupButtonAnimations() {
        // Get all buttons that should have click animations
        const buttons = document.querySelectorAll('.new-note-btn, .settings-btn, .private-mode-btn, .save-btn, .cancel-btn, .delete-btn, .note-action-btn');
        
        buttons.forEach(button => {
            button.addEventListener('mousedown', () => {
                button.classList.add('clicked');
                
                // Special case for settings button
                if (button.classList.contains('settings-btn')) {
                    button.classList.add('spin');
                }
            });
            
            button.addEventListener('mouseup', () => {
                button.classList.remove('clicked');
                
                // Remove spin after animation completes
                setTimeout(() => {
                    if (button.classList.contains('settings-btn')) {
                        button.classList.remove('spin');
                    }
                }, 500);
            });
            
            button.addEventListener('mouseleave', () => {
                button.classList.remove('clicked');
            });
        });
    },

    /**
     * Animate a new note card appearing
     * @param {HTMLElement} noteCard - The note card element to animate
     * @param {number} index - Index of the note for staggered animations
     */
    animateNoteIn(noteCard, index) {
        noteCard.style.opacity = '0';
        noteCard.style.transform = 'translateY(20px)';
        
        // Add a staggered delay based on the note index
        setTimeout(() => {
            noteCard.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            noteCard.style.opacity = '1';
            noteCard.style.transform = 'translateY(0)';
        }, 50 * (index % 5)); // Stagger effect, but reset after 5 items
    },

    /**
     * Animate a note card being removed
     * @param {HTMLElement} noteCard - The note card element to animate
     * @param {Function} onComplete - Callback function to run after animation completes
     */
    animateNoteOut(noteCard, onComplete) {
        noteCard.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        noteCard.style.opacity = '0';
        noteCard.style.transform = 'translateY(20px) scale(0.9)';
        
        setTimeout(() => {
            if (typeof onComplete === 'function') {
                onComplete();
            }
        }, 300);
    },

    /**
     * Animate the transformation from button to popup
     * @param {HTMLElement} button - The button element
     * @param {HTMLElement} popup - The popup element
     */
    animateButtonToPopup(button, popup) {
        // Get button position and size
        const buttonRect = button.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;
        
        // Set the popup's transform origin to match the button's center
        popup.style.transformOrigin = `${buttonCenterX}px ${buttonCenterY}px`;
        
        // Add animation class
        popup.classList.add('button-to-popup');
        
        // Remove animation class after completion
        setTimeout(() => {
            popup.style.transformOrigin = '';
            popup.classList.remove('button-to-popup');
        }, 500);
    },

    /**
     * Animate entering private mode
     * @param {HTMLElement} privateContainer - Private mode container element
     */
    animateEnterPrivateMode(privateContainer) {
        document.body.classList.add('private-mode');
        privateContainer.classList.add('active');
        
        // Animate all elements inside private container
        const elements = privateContainer.querySelectorAll('.private-header, .note-card, .new-note-btn');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(30px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateX(0)';
            }, 100 + (index * 50));
        });
    },

    /**
     * Animate exiting private mode
     * @param {HTMLElement} privateContainer - Private mode container element
     */
    animateExitPrivateMode(privateContainer) {
        // Animate elements out first
        const elements = privateContainer.querySelectorAll('.private-header, .note-card, .new-note-btn');
        elements.forEach((el, index) => {
            el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            el.style.opacity = '0';
            el.style.transform = 'translateX(30px)';
        });
        
        // Then slide the container out
        setTimeout(() => {
            privateContainer.classList.remove('active');
            
            // Wait for transition to complete before removing private-mode class
            setTimeout(() => {
                document.body.classList.remove('private-mode');
                
                // Reset element styles after animation
                elements.forEach(el => {
                    el.style.opacity = '';
                    el.style.transform = '';
                });
            }, 500);
        }, 200);
    },

    /**
     * Animate a PIN dot filling in
     * @param {HTMLElement} dot - The PIN dot element
     */
    animatePinDot(dot) {
        dot.classList.add('filled');
        dot.style.transform = 'scale(1.3)';
        
        setTimeout(() => {
            dot.style.transform = 'scale(1.1)';
        }, 150);
    },

    /**
     * Animate PIN error shake
     * @param {HTMLElement} pinDisplay - The PIN display element
     */
    animatePinError(pinDisplay) {
        pinDisplay.style.animation = 'none';
        
        // Trigger reflow to restart animation
        void pinDisplay.offsetWidth;
        
        pinDisplay.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        
        // Add shake animation if not already defined
        if (!document.querySelector('style#shake-animation')) {
            const style = document.createElement('style');
            style.id = 'shake-animation';
            style.textContent = `
                @keyframes shake {
                    10%, 90% { transform: translateX(-1px); }
                    20%, 80% { transform: translateX(2px); }
                    30%, 50%, 70% { transform: translateX(-4px); }
                    40%, 60% { transform: translateX(4px); }
                }
            `;
            document.head.appendChild(style);
        }
    },

    /**
     * Animate PIN success pulse
     * @param {HTMLElement} pinDisplay - The PIN display element
     */
    animatePinSuccess(pinDisplay) {
        pinDisplay.style.animation = 'none';
        
        // Trigger reflow to restart animation
        void pinDisplay.offsetWidth;
        
        pinDisplay.style.animation = 'pulse 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both';
        
        // Add pulse animation if not already defined
        if (!document.querySelector('style#pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.textContent = `
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    /**
     * Create a ripple effect on button click
     * @param {Event} event - The click event
     */
    createRipple(event) {
        const button = event.currentTarget;
        
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        // Position ripple based on click location
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Add ripple to button
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    },

    /**
     * Apply ripple effect to buttons
     */
    applyRippleEffect() {
        // Add ripple style if not already added
        if (!document.querySelector('style#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                .ripple-effect {
                    position: absolute;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.7);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                }
                
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                
                .save-btn, .cancel-btn, .delete-btn, .pin-key {
                    position: relative;
                    overflow: hidden;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('.save-btn, .cancel-btn, .delete-btn, .pin-key');
        buttons.forEach(button => {
            button.addEventListener('click', this.createRipple);
        });
    }
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Animations.init();
    Animations.applyRippleEffect();
});
