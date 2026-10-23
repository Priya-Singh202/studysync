/**
 * StudySync Application Engine
 * Handles navigation, theme toggling, live search, multi-facet filtering,
 * note reader modal, AI takeaways generator, Pomodoro timer, comments, and uploads.
 */

// Application State
const AppState = {
    currentTab: 'explore',
    searchQuery: '',
    selectedCategory: 'All',
    selectedResourceType: 'All',
    sortBy: 'popular',
    activeNoteId: null,
    readerFontSize: 16,
    readerTheme: 'default'
};

// Pomodoro Focus Timer
const StudyTimer = {
    totalSeconds: 25 * 60,
    remainingSeconds: 25 * 60,
    interval: null,
    isRunning: false,
    mode: 'work',

    init() {
        this.updateDisplay();
    },
    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    },
    start() {
        this.isRunning = true;
        const btn = document.getElementById('timerToggleBtn');
        if (btn) btn.innerHTML = '<span>⏸️</span> Pause';
        
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            if (this.remainingSeconds > 0) {
                this.remainingSeconds--;
                this.updateDisplay();
            } else {
                this.pause();
                if (this.mode === 'work') {
                    showToast('🎉 Focus sprint completed! Take a 5-minute break.', 'success');
                    this.setMode('break');
                } else {
                    showToast('⏰ Break finished! Ready to learn?', 'info');
                    this.setMode('work');
                }
            }
        }, 1000);
    },
    pause() {
        this.isRunning = false;
        clearInterval(this.interval);
        const btn = document.getElementById('timerToggleBtn');
        if (btn) btn.innerHTML = '<span>▶️</span> Start';
    },
    reset() {
        this.pause();
        this.remainingSeconds = this.mode === 'work' ? 25 * 60 : 5 * 60;
        this.updateDisplay();
    },
    setMode(newMode) {
        this.pause();
        this.mode = newMode;
        this.totalSeconds = newMode === 'work' ? 25 * 60 : 5 * 60;
        this.remainingSeconds = this.totalSeconds;
        
        const workBtn = document.getElementById('timerWorkModeBtn');
        const breakBtn = document.getElementById('timerBreakModeBtn');
        if (workBtn && breakBtn) {
            if (newMode === 'work') {
                workBtn.style.background = 'var(--primary)';
                workBtn.style.color = '#ffffff';
                breakBtn.style.background = 'transparent';
                breakBtn.style.color = 'var(--text-secondary)';
            } else {
                breakBtn.style.background = 'var(--primary)';
                breakBtn.style.color = '#ffffff';
                workBtn.style.background = 'transparent';
                workBtn.style.color = 'var(--text-secondary)';
            }
        }
        this.updateDisplay();
    },
    updateDisplay() {
        const display = document.getElementById('timerDisplay');
        if (!display) return;
        const mins = Math.floor(this.remainingSeconds / 60);
        const secs = this.remainingSeconds % 60;
        display.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
};

// Global Toast System
function showToast(message, type = 'info') {
    const toastShelf = document.getElementById('toastContainer');
    if (!toastShelf) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    if (type === 'success') {
        toast.style.background = '#065f46';
        toast.style.border = '1px solid #10b981';
    } else if (type === 'error') {
        toast.style.background = '#881337';
        toast.style.border = '1px solid #f43f5e';
    }

    let icon = '🔔';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toastShelf.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// Theme Toggle
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    try {
        localStorage.setItem('studysync_theme_v2', isDark ? 'dark' : 'light');
    } catch (e) {}

    updateThemeIcons(isDark);
    showToast(isDark ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated');
}

function updateThemeIcons(isDark) {
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    if (sunIcon && moonIcon) {
        if (isDark) {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }
}

function initTheme() {
    let saved = 'light';
    try {
        saved = localStorage.getItem('studysync_theme_v2') || 'light';
    } catch (e) {}
    
    if (saved === 'dark') {
        document.documentElement.classList.add('dark');
        updateThemeIcons(true);
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeIcons(false);
    }
}

// User Profile Rendering
function initUserProfile() {
    const user = StorageManager.getUserProfile();
    if (!user) return;

    const nameElem = document.getElementById('userProfileName');
    const pointsElem = document.getElementById('userRepPoints');
    const streakElem = document.getElementById('userStreakDays');
    const avatarElem = document.getElementById('userAvatarImg');

    if (nameElem) nameElem.innerText = user.name;
    if (pointsElem) pointsElem.innerText = `${user.reputationPoints} pts`;
    if (streakElem) streakElem.innerText = `${user.streakDays}d`;
    if (avatarElem && user.avatar) avatarElem.src = user.avatar;
}

// Tab Switching
function switchTab(tabId) {
    AppState.currentTab = tabId;

    // Update active nav button
    document.querySelectorAll('.nav-link').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Toggle main sections
    const tabs = ['explore', 'library', 'studyHub', 'community'];
    tabs.forEach(t => {
        const sec = document.getElementById(t + 'Section');
        if (sec) {
            if (t === tabId) {
                sec.classList.remove('hidden');
            } else {
                sec.classList.add('hidden');
            }
        }
    });

    if (tabId === 'library') {
        renderLibrary();
    } else if (tabId === 'studyHub') {
        StudyEngine.loadDeckForNote('all');
        StudyEngine.startQuiz('all');
    } else if (tabId === 'explore') {
        renderNotesGrid();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render Notes Grid (Explore Feed)
function renderNotesGrid() {
    const grid = document.getElementById('notesGrid');
    const emptyState = document.getElementById('notesEmptyState');
    const countBadge = document.getElementById('resultsCountBadge');
    if (!grid) return;

    let notes = StorageManager.getNotes();

    // 1. Search filter
    if (AppState.searchQuery) {
        notes = notes.filter(n =>
            n.title.toLowerCase().includes(AppState.searchQuery) ||
            n.subject.toLowerCase().includes(AppState.searchQuery) ||
            (n.courseCode && n.courseCode.toLowerCase().includes(AppState.searchQuery)) ||
            n.university.toLowerCase().includes(AppState.searchQuery) ||
            n.author.name.toLowerCase().includes(AppState.searchQuery) ||
            (n.tags && n.tags.some(t => t.toLowerCase().includes(AppState.searchQuery))) ||
            (n.content && n.content.toLowerCase().includes(AppState.searchQuery))
        );
    }

    // 2. Category filter
    if (AppState.selectedCategory && AppState.selectedCategory !== 'All') {
        notes = notes.filter(n => n.category === AppState.selectedCategory);
    }

    // 3. Resource type filter
    if (AppState.selectedResourceType && AppState.selectedResourceType !== 'All') {
        notes = notes.filter(n => n.resourceType === AppState.selectedResourceType);
    }

    // 4. Sorting
    notes.sort((a, b) => {
        if (AppState.sortBy === 'popular') return (b.upvotes || 0) - (a.upvotes || 0);
        if (AppState.sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (AppState.sortBy === 'newest') return new Date(b.date) - new Date(a.date);
        if (AppState.sortBy === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
        return 0;
    });

    if (countBadge) {
        countBadge.innerText = `${notes.length} resource${notes.length === 1 ? '' : 's'} available`;
    }

    if (notes.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    grid.innerHTML = notes.map(note => createNoteCardHtml(note)).join('');
}

// Generate Note Card HTML
function createNoteCardHtml(note) {
    const isSaved = StorageManager.isNoteSaved(note.id);
    const isUpvoted = StorageManager.isNoteUpvoted(note.id);

    const tagsHtml = (note.tags || []).slice(0, 3).map(tag => 
        `<span class="tag-pill">#${tag}</span>`
    ).join('');

    return `
        <div class="note-card" data-note-id="${note.id}">
            <div>
                <div class="card-top-badges">
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                        <span class="badge-subject">
                            ${note.courseCode ? `${note.courseCode} • ` : ''}${note.subject}
                        </span>
                        <span class="badge-format">
                            ${note.resourceType || 'Notes'}
                        </span>
                    </div>

                    <button onclick="handleBookmark('${note.id}', this)" title="${isSaved ? 'Remove Bookmark' : 'Save Note'}" 
                        class="btn-bookmark ${isSaved ? 'saved' : ''}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3v18l7-4 7 4V3H5z"/></svg>
                    </button>
                </div>

                <h3 onclick="openNoteReader('${note.id}')" class="note-card-title">
                    ${note.title}
                </h3>

                <p class="note-card-desc">
                    ${note.description}
                </p>

                <div class="card-tags">
                    ${tagsHtml}
                </div>
            </div>

            <div>
                <div class="card-author-row">
                    <div class="author-meta">
                        <img src="${note.author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60'}" class="author-avatar" alt="${note.author.name}" />
                        <div>
                            <div class="author-name">
                                ${note.author.name}
                                ${note.author.verified ? '<span style="color: #3b82f6; font-size: 11px;">✓</span>' : ''}
                            </div>
                            <div class="author-uni">${note.university}</div>
                        </div>
                    </div>

                    <div class="card-stats">
                        <div class="rating-num">★ ${note.rating || '4.9'} <span style="font-weight: 400; color: var(--text-muted);">(${note.reviewsCount || 42})</span></div>
                        <div>${note.pages || 1} pages</div>
                    </div>
                </div>

                <div class="card-actions">
                    <button onclick="handleUpvote('${note.id}', this)" class="btn-upvote ${isUpvoted ? 'upvoted' : ''}">
                        <span>▲</span>
                        <span class="upvote-count">${note.upvotes || 0}</span>
                    </button>

                    <button onclick="openNoteReader('${note.id}')" class="btn-read-note">
                        📖 Open & Read Notes
                    </button>

                    <button onclick="downloadNote('${note.id}')" title="Download Notes" class="btn-icon" style="width: 36px; height: 36px;">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Upvote Handler
function handleUpvote(noteId, buttonElement) {
    const result = StorageManager.toggleUpvoteNote(noteId);
    const countElem = buttonElement.querySelector('.upvote-count');
    if (countElem) {
        countElem.innerText = result.newCount;
    }
    if (result.upvoted) {
        buttonElement.classList.add('upvoted');
        showToast('🔺 Upvoted notes!', 'success');
    } else {
        buttonElement.classList.remove('upvoted');
    }
}

// Bookmark Handler
function handleBookmark(noteId, buttonElement) {
    const isSaved = StorageManager.toggleSaveNote(noteId);
    if (isSaved) {
        buttonElement.classList.add('saved');
        showToast('📌 Note saved to your Library!', 'success');
    } else {
        buttonElement.classList.remove('saved');
        showToast('Removed from saved notes.');
    }

    if (AppState.currentTab === 'library') {
        renderLibrary();
    }
}

// Download Handler
function downloadNote(noteId) {
    const note = StorageManager.getNoteById(noteId);
    if (!note) return;

    StorageManager.incrementDownload(noteId);

    const fileContent = `StudySync Verified Academic Note\n=================================\nTitle: ${note.title}\nCourse: ${note.courseCode || ''} - ${note.subject}\nUniversity: ${note.university}\nAuthor: ${note.author.name}\nDate: ${note.date}\nRating: ${note.rating}/5.0\n\n=================================\nSUMMARY:\n${note.description}\n\n=================================\nCONTENT:\n${note.content || note.description}\n`;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${note.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_StudySync.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`📥 Downloaded "${note.title.substring(0, 24)}..."`, 'success');
}

// ----------------------------------------------------
// NOTE READER MODAL
// ----------------------------------------------------
function openNoteReader(noteId) {
    const note = StorageManager.getNoteById(noteId);
    if (!note) return;

    AppState.activeNoteId = noteId;

    const user = StorageManager.getUserProfile();
    user.notesReadCount = (user.notesReadCount || 0) + 1;
    StorageManager.saveUserProfile(user);

    // Populate Reader Details
    const titleElem = document.getElementById('readerNoteTitle');
    const badgeElem = document.getElementById('readerSubjectBadge');
    const authorElem = document.getElementById('readerAuthorName');
    const uniElem = document.getElementById('readerAuthorUni');
    const avatarElem = document.getElementById('readerAuthorAvatar');
    const dateElem = document.getElementById('readerDate');
    const ratingElem = document.getElementById('readerRating');
    const downloadsElem = document.getElementById('readerDownloads');
    const bodyElem = document.getElementById('readerContentBody');

    if (titleElem) titleElem.innerText = note.title;
    if (badgeElem) badgeElem.innerText = `${note.courseCode ? note.courseCode + ' • ' : ''}${note.subject}`;
    if (authorElem) authorElem.innerText = note.author.name;
    if (uniElem) uniElem.innerText = note.university;
    if (avatarElem) avatarElem.src = note.author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60';
    if (dateElem) dateElem.innerText = `Uploaded: ${note.date}`;
    if (ratingElem) ratingElem.innerText = `★ ${note.rating || '4.9'} (${note.reviewsCount || 42} reviews)`;
    if (downloadsElem) downloadsElem.innerText = `${note.downloads || 120} downloads`;

    if (bodyElem) {
        bodyElem.innerHTML = renderMarkdown(note.content || note.description);
        bodyElem.style.fontSize = `${AppState.readerFontSize}px`;
    }

    // Reset AI Box
    const aiBox = document.getElementById('aiTakeawaysBox');
    if (aiBox) aiBox.innerHTML = '';

    renderReaderComments(noteId);

    // Update study deck button
    const studyLauncher = document.getElementById('readerLaunchStudyBtn');
    if (studyLauncher) {
        studyLauncher.onclick = () => {
            closeNoteReader();
            switchTab('studyHub');
            const deckSelect = document.getElementById('deckSelect');
            if (deckSelect) deckSelect.value = noteId;
            StudyEngine.loadDeckForNote(noteId);
            StudyEngine.startQuiz(noteId);
        };
    }

    // Open Modal cleanly
    const modal = document.getElementById('noteReaderModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeNoteReader() {
    const modal = document.getElementById('noteReaderModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Generate AI Takeaways
function generateAITakeaways() {
    if (!AppState.activeNoteId) return;
    const note = StorageManager.getNoteById(AppState.activeNoteId);
    if (!note) return;

    const box = document.getElementById('aiTakeawaysBox');
    if (!box) return;

    box.innerHTML = `
        <div style="background: var(--primary-light); border: 1px solid var(--primary-border); border-radius: var(--radius-md); padding: 1.25rem; margin: 1.5rem 0;">
            <div style="display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--primary); margin-bottom: 0.75rem;">
                <span style="font-size: 1.25rem;">✨</span> AI Instant Study Takeaways & Exam Strategy
            </div>
            <ul style="margin-left: 1.25rem; font-size: 0.9rem; line-height: 1.7; color: var(--text-main);">
                <li><strong>Core Objective:</strong> Master the critical conceptual foundations of <em>${note.title}</em>.</li>
                <li><strong>High-Yield Focus:</strong> Review the formulas, Big-O metrics, and decision tables detailed in Sections 1 & 2.</li>
                <li><strong>Exam Caveats:</strong> Verify boundary conditions and base cases when solving practice sets.</li>
                <li><strong>Self-Assessment:</strong> Test your recall using the AI flashcards generated for this topic!</li>
            </ul>
        </div>
    `;
    showToast('✨ AI Study Insights generated!', 'success');
}

// Markdown Formatter
function renderMarkdown(raw) {
    if (!raw) return '<p>No content provided.</p>';

    let out = raw
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/```python([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/gim, '<code>$1</code>')
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/\n\n/gim, '</p><p>');

    return `<div class="reader-body">${out}</div>`;
}

function changeReaderFontSize(delta) {
    AppState.readerFontSize = Math.max(12, Math.min(26, AppState.readerFontSize + delta));
    const bodyElem = document.getElementById('readerContentBody');
    if (bodyElem) {
        bodyElem.style.fontSize = `${AppState.readerFontSize}px`;
    }
}

function resetReaderFontSize() {
    AppState.readerFontSize = 16;
    const bodyElem = document.getElementById('readerContentBody');
    if (bodyElem) {
        bodyElem.style.fontSize = '16px';
    }
}

function setReaderTheme(theme) {
    AppState.readerTheme = theme;
    const container = document.getElementById('readerPaperContainer');
    if (!container) return;

    container.className = `reader-paper theme-paper-${theme}`;
}

// Reader Comments
function renderReaderComments(noteId) {
    const list = document.getElementById('readerCommentsList');
    if (!list) return;

    const comments = StorageManager.getComments(noteId);
    if (comments.length === 0) {
        list.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; padding: 1rem 0;">No comments yet. Be the first to start the academic discussion!</p>`;
        return;
    }

    list.innerHTML = comments.map(c => `
        <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <img src="${c.avatar}" style="width: 24px; height: 24px; border-radius: 9999px; object-fit: cover;" />
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-main);">${c.author}</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">• ${c.university || 'Scholar'}</span>
                </div>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${c.date}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">${c.content}</p>
        </div>
    `).join('');
}

function postReaderComment() {
    const input = document.getElementById('readerCommentInput');
    if (!input || !input.value.trim() || !AppState.activeNoteId) return;

    const user = StorageManager.getUserProfile();
    StorageManager.addComment(AppState.activeNoteId, input.value.trim(), user.name, user.university);
    input.value = '';
    renderReaderComments(AppState.activeNoteId);
    showToast('💬 Comment posted!', 'success');
}

// ----------------------------------------------------
// UPLOAD NOTES MODAL
// ----------------------------------------------------
function openUploadModal() {
    const modal = document.getElementById('uploadNoteModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeUploadModal() {
    const modal = document.getElementById('uploadNoteModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function handleUploadFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('uploadTitle').value.trim();
    const courseCode = document.getElementById('uploadCourseCode').value.trim();
    const subject = document.getElementById('uploadSubject').value;
    const resourceType = document.getElementById('uploadResourceType').value;
    const university = document.getElementById('uploadUniversity').value.trim();
    const tagsString = document.getElementById('uploadTags').value.trim();
    const description = document.getElementById('uploadDescription').value.trim();
    const content = document.getElementById('uploadContent').value.trim();

    if (!title || !subject || !description) {
        showToast('Please fill in required fields.', 'error');
        return;
    }

    const tags = tagsString 
        ? tagsString.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean)
        : [subject.toLowerCase().replace(/\s+/g, '-')];

    const user = StorageManager.getUserProfile();

    const newNote = {
        id: 'note-user-' + Date.now(),
        title,
        subject,
        category: subject,
        courseCode: courseCode || subject.substring(0, 4).toUpperCase() + ' 101',
        university: university || user.university || 'General Academic',
        author: {
            name: user.name || 'Alex Rivera',
            avatar: user.avatar,
            verified: true,
            role: 'Author'
        },
        description,
        date: new Date().toISOString().split('T')[0],
        rating: 5.0,
        reviewsCount: 1,
        upvotes: 1,
        downloads: 0,
        pages: Math.max(1, Math.ceil((content.length || description.length) / 800)),
        fileType: 'Document',
        resourceType: resourceType || 'Lecture Notes',
        tags,
        content: content || description,
        flashcards: [
            {
                question: `What is the core premise of ${title}?`,
                answer: description
            }
        ],
        quiz: [
            {
                question: `Which subject covers "${title}"?`,
                options: [subject, "Music Theory", "Modern Literature", "Philosophy"],
                correctIndex: 0,
                explanation: `This document is specifically categorized under ${subject}.`
            }
        ]
    };

    StorageManager.addNote(newNote);
    initUserProfile();
    closeUploadModal();
    document.getElementById('uploadNoteForm').reset();

    showToast('🎉 Note uploaded successfully! +50 Rep Points', 'success');

    AppState.selectedCategory = 'All';
    switchTab('explore');
    renderNotesGrid();
}

// ----------------------------------------------------
// MY LIBRARY
// ----------------------------------------------------
function renderLibrary() {
    const savedList = document.getElementById('savedNotesList');
    const myUploadsList = document.getElementById('myUploadsList');
    const notes = StorageManager.getNotes();
    const savedIds = StorageManager.getSavedNoteIds();
    const user = StorageManager.getUserProfile();

    const savedNotes = notes.filter(n => savedIds.includes(n.id));
    if (savedList) {
        if (savedNotes.length === 0) {
            savedList.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; border: 2px dashed var(--border-subtle); border-radius: var(--radius-lg);">
                    <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">No saved notes yet. Click the bookmark icon on any note in Explore!</p>
                    <button onclick="switchTab('explore')" class="btn-primary" style="margin: 0 auto;">Explore Feed</button>
                </div>
            `;
        } else {
            savedList.innerHTML = savedNotes.map(n => createNoteCardHtml(n)).join('');
        }
    }

    const myUploads = notes.filter(n => n.author.name === user.name || n.id.startsWith('note-user'));
    if (myUploadsList) {
        if (myUploads.length === 0) {
            myUploadsList.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; border: 2px dashed var(--border-subtle); border-radius: var(--radius-lg);">
                    <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">You haven't uploaded any notes yet. Share your knowledge to earn badges!</p>
                    <button onclick="openUploadModal()" class="btn-primary" style="margin: 0 auto;">+ Upload Your First Note</button>
                </div>
            `;
        } else {
            myUploadsList.innerHTML = myUploads.map(n => createNoteCardHtml(n)).join('');
        }
    }

    const stats = StorageManager.getStudyStats();
    const readCounter = document.getElementById('libNotesReadCount');
    const cardsCounter = document.getElementById('libCardsFlippedCount');
    const downloadsCounter = document.getElementById('libDownloadsCount');
    const repCounter = document.getElementById('libRepPoints');

    if (readCounter) readCounter.innerText = user.notesReadCount || 19;
    if (cardsCounter) cardsCounter.innerText = stats.cardsFlipped || 46;
    if (downloadsCounter) downloadsCounter.innerText = stats.downloadsCount || 12;
    if (repCounter) repCounter.innerText = user.reputationPoints || 480;
}

// ----------------------------------------------------
// COMMUNITY Q&A
// ----------------------------------------------------
function renderCommunityThreads() {
    const container = document.getElementById('communityThreadsContainer');
    if (!container) return;

    container.innerHTML = DEFAULT_COMMUNITY_THREADS.map(thread => `
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; display: flex; align-items: start; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; transition: border-color 0.2s;">
            <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                    <span style="font-weight: 700; color: var(--text-main);">${thread.author}</span>
                    <span>•</span>
                    <span>${thread.university}</span>
                    <span>•</span>
                    <span>${thread.timeAgo}</span>
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.6rem; cursor: pointer;">
                    ${thread.title}
                </h4>
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                    ${thread.tags.map(t => `<span class="tag-pill">#${t}</span>`).join('')}
                </div>
            </div>

            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                <button onclick="showToast('Upvoted community question!')" class="btn-upvote">
                    <span>▲</span>
                    <span>${thread.upvotes}</span>
                </button>
                <span style="font-size: 0.75rem; color: var(--text-muted);">💬 ${thread.repliesCount}</span>
            </div>
        </div>
    `).join('');
}

function postCommunityQuestion() {
    const input = document.getElementById('newThreadQuestionInput');
    if (!input || !input.value.trim()) return;

    const user = StorageManager.getUserProfile();
    const newThread = {
        id: 'thread-' + Date.now(),
        title: input.value.trim(),
        author: user.name,
        university: user.university,
        repliesCount: 0,
        tags: ["general", "study-sync"],
        timeAgo: "Just now",
        upvotes: 1
    };

    DEFAULT_COMMUNITY_THREADS.unshift(newThread);
    input.value = '';
    renderCommunityThreads();
    showToast('🚀 Question submitted to community!', 'success');
}

// ----------------------------------------------------
// INITIALIZATION
// ----------------------------------------------------
function initEventListeners() {
    // Global search input
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            AppState.searchQuery = e.target.value.toLowerCase().trim();
            renderNotesGrid();
        });
    }

    // Hero quick search
    const heroSearchInput = document.getElementById('heroSearchInput');
    if (heroSearchInput) {
        heroSearchInput.addEventListener('input', (e) => {
            AppState.searchQuery = e.target.value.toLowerCase().trim();
            if (searchInput) searchInput.value = e.target.value;
            renderNotesGrid();
        });
    }

    // Sort select
    const sortSelect = document.getElementById('sortBySelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            AppState.sortBy = e.target.value;
            renderNotesGrid();
        });
    }

    // Resource Type select
    const resourceTypeSelect = document.getElementById('resourceTypeSelect');
    if (resourceTypeSelect) {
        resourceTypeSelect.addEventListener('change', (e) => {
            AppState.selectedResourceType = e.target.value;
            renderNotesGrid();
        });
    }

    // Category chips
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            AppState.selectedCategory = chip.getAttribute('data-category');
            renderNotesGrid();
        });
    });

    // Deck select change
    const deckSelect = document.getElementById('deckSelect');
    if (deckSelect) {
        deckSelect.addEventListener('change', (e) => {
            StudyEngine.loadDeckForNote(e.target.value);
            StudyEngine.startQuiz(e.target.value);
        });
    }
}

// Boot up
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initUserProfile();
    initEventListeners();
    StudyTimer.init();
    StudyEngine.init();
    renderNotesGrid();
    renderCommunityThreads();
});
