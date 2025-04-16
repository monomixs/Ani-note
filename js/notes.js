/**
 * notes.js
 * Handles note creation, management, and storage functionality
 */

const Notes = {
    notes: [],
    privateNotes: [],
    
    /**
     * Initialize notes functionality
     */
    init() {
        // Load saved notes from local storage
        this.loadNotes();
        
        // Set up new note button
        const newNoteBtn = document.getElementById('new-note-btn');
        newNoteBtn.addEventListener('click', () => {
            this.createNewNote(false);
        });
        
        // Set up new private note button
        const newPrivateNoteBtn = document.getElementById('new-private-note-btn');
        newPrivateNoteBtn.addEventListener('click', () => {
            this.createNewNote(true);
        });
        
        // Initial render
        this.renderNotes();
        this.renderPrivateNotes();
    },
    
    /**
     * Load notes from local storage
     */
    loadNotes() {
        try {
            // Load regular notes
            const savedNotes = localStorage.getItem('app_notes');
            if (savedNotes) {
                this.notes = JSON.parse(savedNotes);
            }
            
            // Load private notes
            const savedPrivateNotes = localStorage.getItem('app_private_notes');
            if (savedPrivateNotes) {
                this.privateNotes = JSON.parse(savedPrivateNotes);
            }
        } catch (error) {
            console.error('Error loading notes:', error);
            // Reset to empty arrays if there's an error
            this.notes = [];
            this.privateNotes = [];
        }
    },
    
    /**
     * Save notes to local storage
     */
    saveNotes() {
        try {
            console.log('Saving notes:', this.notes);
            
            // Save regular notes
            localStorage.setItem('app_notes', JSON.stringify(this.notes));
            
            // Save private notes
            localStorage.setItem('app_private_notes', JSON.stringify(this.privateNotes));
            
            console.log('Notes saved successfully');
        } catch (error) {
            console.error('Error saving notes:', error);
            Popup.alert('Failed to save notes. Please try again.', 'Error');
        }
    },
    
    /**
     * Create a new note
     * @param {boolean} isPrivate - Whether the note is private
     */
    createNewNote(isPrivate) {
        Popup.open('note-editor-overlay', {
            editMode: false,
            isPrivate: isPrivate,
            onConfirm: (noteData) => {
                // Validate note data
                if (!noteData.title && !noteData.content) {
                    Popup.alert('Note cannot be empty', 'Error');
                    return;
                }
                
                // If title is empty but content exists, use first line as title
                if (!noteData.title && noteData.content) {
                    const firstLine = noteData.content.split('\n')[0];
                    noteData.title = firstLine.length > 30 ? 
                        firstLine.substring(0, 30) + '...' : firstLine;
                }
                
                if (isPrivate) {
                    this.privateNotes.unshift(noteData);
                    this.renderPrivateNotes();
                } else {
                    this.notes.unshift(noteData);
                    this.renderNotes();
                }
                
                this.saveNotes();
            }
        });
    },
    
    /**
     * Edit an existing note
     * @param {string} noteId - ID of the note to edit
     * @param {boolean} isPrivate - Whether the note is private
     */
    editNote(noteId, isPrivate) {
        const noteArray = isPrivate ? this.privateNotes : this.notes;
        const noteIndex = noteArray.findIndex(note => note.id === noteId);
        
        if (noteIndex === -1) {
            Popup.alert('Note not found', 'Error');
            return;
        }
        
        const note = noteArray[noteIndex];
        
        Popup.open('note-editor-overlay', {
            editMode: true,
            note: note,
            isPrivate: isPrivate,
            onConfirm: (noteData) => {
                // Validate note data
                if (!noteData.title && !noteData.content) {
                    Popup.alert('Note cannot be empty', 'Error');
                    return;
                }
                
                // If title is empty but content exists, use first line as title
                if (!noteData.title && noteData.content) {
                    const firstLine = noteData.content.split('\n')[0];
                    noteData.title = firstLine.length > 30 ? 
                        firstLine.substring(0, 30) + '...' : firstLine;
                }
                
                // Update note in array
                noteArray[noteIndex] = {
                    ...note,
                    title: noteData.title,
                    content: noteData.content,
                    updated: Date.now()
                };
                
                // Re-render and save
                if (isPrivate) {
                    this.renderPrivateNotes();
                } else {
                    this.renderNotes();
                }
                
                this.saveNotes();
            }
        });
    },
    
    /**
     * Delete a note
     * @param {string} noteId - ID of the note to delete
     * @param {boolean} isPrivate - Whether the note is private
     */
    deleteNote(noteId, isPrivate) {
        Popup.confirm(
            'Are you sure you want to delete this note?', 
            'Confirm Delete',
            () => {
                if (isPrivate) {
                    this.privateNotes = this.privateNotes.filter(note => note.id !== noteId);
                    this.renderPrivateNotes();
                } else {
                    this.notes = this.notes.filter(note => note.id !== noteId);
                    this.renderNotes();
                }
                
                this.saveNotes();
            }
        );
    },
    
    /**
     * Render regular notes
     */
    renderNotes() {
        const notesContainer = document.getElementById('notes-container');
        const emptyState = document.getElementById('empty-state');
        
        // Preserve the empty state element before clearing
        const emptyStateClone = emptyState.cloneNode(true);
        
        // Clear container
        notesContainer.innerHTML = '';
        
        // Show empty state if no notes
        if (this.notes.length === 0) {
            emptyStateClone.style.display = 'flex';
            notesContainer.appendChild(emptyStateClone);
            return;
        }
        
        // Hide empty state
        emptyStateClone.style.display = 'none';
        notesContainer.appendChild(emptyStateClone);
        
        // Render each note
        this.notes.forEach((note, index) => {
            const noteCard = this.createNoteElement(note, false, index);
            notesContainer.appendChild(noteCard);
        });
    },
    
    /**
     * Render private notes
     */
    renderPrivateNotes() {
        const privateNotesContainer = document.getElementById('private-notes-container');
        const emptyState = document.getElementById('private-empty-state');
        
        // Preserve empty state element before clearing
        const emptyStateClone = emptyState.cloneNode(true);
        
        // Clear container
        privateNotesContainer.innerHTML = '';
        
        // Show empty state if no notes
        if (this.privateNotes.length === 0) {
            emptyStateClone.style.display = 'flex';
            privateNotesContainer.appendChild(emptyStateClone);
            return;
        }
        
        // Hide empty state
        emptyStateClone.style.display = 'none';
        privateNotesContainer.appendChild(emptyStateClone);
        
        // Render each note
        this.privateNotes.forEach((note, index) => {
            const noteCard = this.createNoteElement(note, true, index);
            privateNotesContainer.appendChild(noteCard);
        });
    },
    
    /**
     * Create note HTML element
     * @param {Object} note - Note data object
     * @param {boolean} isPrivate - Whether the note is private
     * @param {number} index - Index of the note in the array
     * @returns {HTMLElement} The created note element
     */
    createNoteElement(note, isPrivate, index) {
        const noteCard = document.createElement('div');
        noteCard.className = `note-card ${isPrivate ? 'private' : ''}`;
        noteCard.setAttribute('data-id', note.id);
        
        // Title
        const titleElement = document.createElement('h3');
        titleElement.className = 'note-title';
        titleElement.textContent = note.title || 'Untitled';
        
        // Content
        const contentElement = document.createElement('div');
        contentElement.className = 'note-content';
        contentElement.textContent = note.content || '';
        
        // Actions
        const actionsElement = document.createElement('div');
        actionsElement.className = 'note-actions';
        
        // View button
        const viewButton = document.createElement('button');
        viewButton.className = 'note-action-btn view';
        viewButton.innerHTML = '<i class="fas fa-eye"></i>';
        viewButton.setAttribute('aria-label', 'View note');
        viewButton.addEventListener('click', () => {
            Popup.alert(note.content, note.title, null);
        });
        
        // Edit button
        const editButton = document.createElement('button');
        editButton.className = 'note-action-btn edit';
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.setAttribute('aria-label', 'Edit note');
        editButton.addEventListener('click', () => {
            this.editNote(note.id, isPrivate);
        });
        
        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'note-action-btn delete';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.setAttribute('aria-label', 'Delete note');
        deleteButton.addEventListener('click', () => {
            this.deleteNote(note.id, isPrivate);
        });
        
        // Append action buttons
        actionsElement.appendChild(viewButton);
        actionsElement.appendChild(editButton);
        actionsElement.appendChild(deleteButton);
        
        // Append elements to card
        noteCard.appendChild(titleElement);
        noteCard.appendChild(contentElement);
        noteCard.appendChild(actionsElement);
        
        // Apply animation with staggered delay
        Animations.animateNoteIn(noteCard, index);
        
        return noteCard;
    }
};

// Initialize notes when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Notes.init();
});
