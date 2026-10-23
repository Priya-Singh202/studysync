/**
 * StudySync Storage Manager
 * Self-healing local storage manager with safe in-memory fallback.
 */

const STORAGE_KEYS = {
    NOTES: 'studysync_notes_v2',
    SAVED_NOTES: 'studysync_saved_v2',
    UPVOTES: 'studysync_upvotes_v2',
    USER_PROFILE: 'studysync_user_profile_v2',
    COMMENTS: 'studysync_comments_v2',
    STUDY_STATS: 'studysync_study_stats_v2',
    THEME: 'studysync_theme_v2'
};

// Safe Memory Cache Fallback if LocalStorage is restricted (e.g. file:/// sandbox or private mode)
const MemoryStore = {
    cache: {},
    getItem(key) {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                return window.localStorage.getItem(key);
            }
        } catch (e) {
            // Fallback to in-memory
        }
        return this.cache[key] || null;
    },
    setItem(key, val) {
        this.cache[key] = val;
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(key, val);
            }
        } catch (e) {
            // Ignore restricted storage exceptions
        }
    },
    removeItem(key) {
        delete this.cache[key];
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(key);
            }
        } catch (e) {}
    }
};

const StorageManager = {
    init() {
        if (!MemoryStore.getItem(STORAGE_KEYS.NOTES)) {
            MemoryStore.setItem(STORAGE_KEYS.NOTES, JSON.stringify(DEFAULT_NOTES));
        }
        if (!MemoryStore.getItem(STORAGE_KEYS.SAVED_NOTES)) {
            MemoryStore.setItem(STORAGE_KEYS.SAVED_NOTES, JSON.stringify(["note-cs-201", "note-math-152"]));
        }
        if (!MemoryStore.getItem(STORAGE_KEYS.UPVOTES)) {
            MemoryStore.setItem(STORAGE_KEYS.UPVOTES, JSON.stringify(["note-cs-201"]));
        }
        if (!MemoryStore.getItem(STORAGE_KEYS.COMMENTS)) {
            MemoryStore.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(DEFAULT_COMMENTS));
        }
        if (!MemoryStore.getItem(STORAGE_KEYS.USER_PROFILE)) {
            const defaultUser = {
                name: "Alex Rivera",
                role: "Computer Science & Math Student",
                university: "Stanford University",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
                reputationPoints: 480,
                streakDays: 7,
                uploadsCount: 1,
                notesReadCount: 19,
                flashcardsMastered: 24
            };
            MemoryStore.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(defaultUser));
        }
        if (!MemoryStore.getItem(STORAGE_KEYS.STUDY_STATS)) {
            const defaultStats = {
                quizzesTaken: 8,
                cardsFlipped: 46,
                downloadsCount: 12
            };
            MemoryStore.setItem(STORAGE_KEYS.STUDY_STATS, JSON.stringify(defaultStats));
        }
    },

    resetAll() {
        MemoryStore.removeItem(STORAGE_KEYS.NOTES);
        MemoryStore.removeItem(STORAGE_KEYS.SAVED_NOTES);
        MemoryStore.removeItem(STORAGE_KEYS.UPVOTES);
        MemoryStore.removeItem(STORAGE_KEYS.COMMENTS);
        MemoryStore.removeItem(STORAGE_KEYS.USER_PROFILE);
        MemoryStore.removeItem(STORAGE_KEYS.STUDY_STATS);
        this.init();
    },

    getNotes() {
        try {
            const data = MemoryStore.getItem(STORAGE_KEYS.NOTES);
            return data ? JSON.parse(data) : DEFAULT_NOTES;
        } catch (e) {
            return DEFAULT_NOTES;
        }
    },

    saveNotes(notes) {
        MemoryStore.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    },

    getNoteById(id) {
        const notes = this.getNotes();
        return notes.find(n => n.id === id) || null;
    },

    addNote(newNote) {
        const notes = this.getNotes();
        notes.unshift(newNote);
        this.saveNotes(notes);

        const user = this.getUserProfile();
        user.uploadsCount = (user.uploadsCount || 0) + 1;
        user.reputationPoints = (user.reputationPoints || 0) + 50;
        this.saveUserProfile(user);

        return newNote;
    },

    getSavedNoteIds() {
        try {
            const data = MemoryStore.getItem(STORAGE_KEYS.SAVED_NOTES);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    isNoteSaved(id) {
        return this.getSavedNoteIds().includes(id);
    },

    toggleSaveNote(id) {
        const saved = this.getSavedNoteIds();
        const index = saved.indexOf(id);
        let isSaved = false;
        if (index > -1) {
            saved.splice(index, 1);
            isSaved = false;
        } else {
            saved.push(id);
            isSaved = true;
        }
        MemoryStore.setItem(STORAGE_KEYS.SAVED_NOTES, JSON.stringify(saved));
        return isSaved;
    },

    getUpvotedIds() {
        try {
            const data = MemoryStore.getItem(STORAGE_KEYS.UPVOTES);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    isNoteUpvoted(id) {
        return this.getUpvotedIds().includes(id);
    },

    toggleUpvoteNote(id) {
        const upvotes = this.getUpvotedIds();
        const index = upvotes.indexOf(id);
        const notes = this.getNotes();
        const note = notes.find(n => n.id === id);
        let upvoted = false;

        if (index > -1) {
            upvotes.splice(index, 1);
            if (note) note.upvotes = Math.max(0, (note.upvotes || 1) - 1);
            upvoted = false;
        } else {
            upvotes.push(id);
            if (note) note.upvotes = (note.upvotes || 0) + 1;
            upvoted = true;
        }

        MemoryStore.setItem(STORAGE_KEYS.UPVOTES, JSON.stringify(upvotes));
        this.saveNotes(notes);
        return { upvoted, newCount: note ? note.upvotes : 0 };
    },

    incrementDownload(id) {
        const notes = this.getNotes();
        const note = notes.find(n => n.id === id);
        if (note) {
            note.downloads = (note.downloads || 0) + 1;
            this.saveNotes(notes);
        }
        const stats = this.getStudyStats();
        stats.downloadsCount = (stats.downloadsCount || 0) + 1;
        MemoryStore.setItem(STORAGE_KEYS.STUDY_STATS, JSON.stringify(stats));
    },

    getComments(noteId) {
        try {
            const allComments = JSON.parse(MemoryStore.getItem(STORAGE_KEYS.COMMENTS) || '{}');
            return allComments[noteId] || (DEFAULT_COMMENTS[noteId] || []);
        } catch (e) {
            return DEFAULT_COMMENTS[noteId] || [];
        }
    },

    addComment(noteId, commentText, authorName, authorUni) {
        const allComments = JSON.parse(MemoryStore.getItem(STORAGE_KEYS.COMMENTS) || '{}');
        if (!allComments[noteId]) {
            allComments[noteId] = DEFAULT_COMMENTS[noteId] ? [...DEFAULT_COMMENTS[noteId]] : [];
        }
        const newComment = {
            id: 'c-' + Date.now(),
            author: authorName || 'Alex Rivera',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
            university: authorUni || 'Stanford University',
            date: 'Just now',
            content: commentText,
            likes: 0
        };
        allComments[noteId].unshift(newComment);
        MemoryStore.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(allComments));
        return newComment;
    },

    getUserProfile() {
        try {
            return JSON.parse(MemoryStore.getItem(STORAGE_KEYS.USER_PROFILE));
        } catch (e) {
            return null;
        }
    },

    saveUserProfile(profile) {
        MemoryStore.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    },

    getStudyStats() {
        try {
            return JSON.parse(MemoryStore.getItem(STORAGE_KEYS.STUDY_STATS) || '{}');
        } catch (e) {
            return { quizzesTaken: 0, cardsFlipped: 0, downloadsCount: 0 };
        }
    },

    recordStat(statKey, increment = 1) {
        const stats = this.getStudyStats();
        stats[statKey] = (stats[statKey] || 0) + increment;
        MemoryStore.setItem(STORAGE_KEYS.STUDY_STATS, JSON.stringify(stats));
    }
};

// Safe initialization
try {
    StorageManager.init();
} catch (err) {
    console.warn("StorageManager initialized with fallback", err);
}
