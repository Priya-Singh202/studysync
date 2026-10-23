/**
 * StudySync Flashcards & Quiz Engine
 * Interactive study tools supporting 3D card flipping, mastery tracking, and instant quiz feedback.
 */

const StudyEngine = {
    currentDeck: [],
    currentCardIndex: 0,
    masteredCards: new Set(),
    activeNoteId: null,

    // Quiz state
    quizQuestions: [],
    currentQuizIndex: 0,
    quizScore: 0,
    answeredQuestions: {},

    init() {
        this.bindEvents();
    },

    bindEvents() {
        const flashcardElement = document.getElementById('activeFlashcard');
        if (flashcardElement) {
            flashcardElement.addEventListener('click', () => {
                flashcardElement.classList.toggle('flipped');
                StorageManager.recordStat('cardsFlipped', 1);
            });
        }
    },

    loadDeckForNote(noteId) {
        const notes = StorageManager.getNotes();
        let targetNotes = [];
        
        if (noteId && noteId !== 'all') {
            const single = notes.find(n => n.id === noteId);
            if (single && single.flashcards && single.flashcards.length > 0) {
                targetNotes = [single];
                this.activeNoteId = noteId;
            }
        }

        if (targetNotes.length === 0) {
            targetNotes = notes.filter(n => n.flashcards && n.flashcards.length > 0);
            this.activeNoteId = 'all';
        }

        let deck = [];
        targetNotes.forEach(note => {
            (note.flashcards || []).forEach(fc => {
                deck.push({
                    question: fc.question,
                    answer: fc.answer,
                    subject: note.subject,
                    noteTitle: note.title
                });
            });
        });

        this.currentDeck = deck;
        this.currentCardIndex = 0;
        this.masteredCards.clear();
        this.renderCard();
        this.updateDeckSelector(notes);
    },

    updateDeckSelector(notes) {
        const select = document.getElementById('deckSelect');
        if (!select) return;
        
        let html = `<option value="all">All Subjects (${this.getTotalCardsAcrossAll(notes)} Cards)</option>`;
        notes.forEach(note => {
            if (note.flashcards && note.flashcards.length > 0) {
                const selected = this.activeNoteId === note.id ? 'selected' : '';
                html += `<option value="${note.id}" ${selected}>${note.courseCode || note.subject}: ${note.title.substring(0, 32)}... (${note.flashcards.length})</option>`;
            }
        });
        select.innerHTML = html;
    },

    getTotalCardsAcrossAll(notes) {
        return notes.reduce((sum, n) => sum + (n.flashcards ? n.flashcards.length : 0), 0);
    },

    renderCard() {
        const cardElem = document.getElementById('activeFlashcard');
        const questionElem = document.getElementById('flashcardQuestion');
        const answerElem = document.getElementById('flashcardAnswer');
        const badgeElem = document.getElementById('flashcardSubjectBadge');
        const counterElem = document.getElementById('flashcardCounter');
        const progressElem = document.getElementById('flashcardProgress');

        if (!cardElem || this.currentDeck.length === 0) {
            if (questionElem) questionElem.innerText = "No flashcards found for this selection.";
            if (answerElem) answerElem.innerText = "Upload notes with flashcards or select another deck!";
            return;
        }

        cardElem.classList.remove('flipped');

        const card = this.currentDeck[this.currentCardIndex];
        if (questionElem) questionElem.innerText = card.question;
        if (answerElem) answerElem.innerText = card.answer;
        if (badgeElem) badgeElem.innerText = card.subject || "StudySync Deck";
        if (counterElem) counterElem.innerText = `Card ${this.currentCardIndex + 1} of ${this.currentDeck.length}`;

        if (progressElem) {
            const percent = ((this.masteredCards.size) / this.currentDeck.length) * 100;
            progressElem.style.width = `${Math.min(100, Math.max(5, percent))}%`;
        }

        const masteredCounter = document.getElementById('masteredCounter');
        if (masteredCounter) {
            masteredCounter.innerText = `${this.masteredCards.size} Mastered`;
        }
    },

    nextCard() {
        if (this.currentDeck.length === 0) return;
        this.currentCardIndex = (this.currentCardIndex + 1) % this.currentDeck.length;
        this.renderCard();
    },

    prevCard() {
        if (this.currentDeck.length === 0) return;
        this.currentCardIndex = (this.currentCardIndex - 1 + this.currentDeck.length) % this.currentDeck.length;
        this.renderCard();
    },

    shuffleDeck() {
        for (let i = this.currentDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentDeck[i], this.currentDeck[j]] = [this.currentDeck[j], this.currentDeck[i]];
        }
        this.currentCardIndex = 0;
        this.renderCard();
        showToast('🔀 Flashcards shuffled!');
    },

    markMastered() {
        if (this.currentDeck.length === 0) return;
        this.masteredCards.add(this.currentCardIndex);
        
        const user = StorageManager.getUserProfile();
        user.flashcardsMastered = (user.flashcardsMastered || 0) + 1;
        user.reputationPoints = (user.reputationPoints || 0) + 5;
        StorageManager.saveUserProfile(user);

        showToast('✨ Mastered! +5 Rep Points', 'success');
        this.nextCard();
    },

    markReview() {
        if (this.currentDeck.length === 0) return;
        this.masteredCards.delete(this.currentCardIndex);
        this.nextCard();
    },

    // ----------------------------------------------------
    // QUIZ ENGINE
    // ----------------------------------------------------
    startQuiz(noteId) {
        const notes = StorageManager.getNotes();
        let questions = [];

        if (noteId && noteId !== 'all') {
            const note = notes.find(n => n.id === noteId);
            if (note && note.quiz) {
                questions = note.quiz.map(q => ({ ...q, subject: note.subject }));
            }
        }

        if (questions.length === 0) {
            notes.forEach(n => {
                if (n.quiz) {
                    n.quiz.forEach(q => questions.push({ ...q, subject: n.subject }));
                }
            });
        }

        this.quizQuestions = questions;
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.answeredQuestions = {};
        this.renderQuizQuestion();
    },

    renderQuizQuestion() {
        const container = document.getElementById('quizContainer');
        if (!container) return;

        if (this.quizQuestions.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem 1rem;">
                    <p style="color: var(--text-muted);">No quiz questions available for this topic yet.</p>
                </div>
            `;
            return;
        }

        if (this.currentQuizIndex >= this.quizQuestions.length) {
            this.renderQuizResults(container);
            return;
        }

        const q = this.quizQuestions[this.currentQuizIndex];
        const isAnswered = this.answeredQuestions.hasOwnProperty(this.currentQuizIndex);
        const selectedOption = this.answeredQuestions[this.currentQuizIndex];

        let optionsHtml = q.options.map((opt, idx) => {
            let border = "1px solid var(--border-subtle)";
            let bg = "var(--bg-surface)";
            let color = "var(--text-main)";
            let badgeBg = "var(--bg-surface-subtle)";
            let badgeColor = "var(--text-secondary)";

            if (isAnswered) {
                if (idx === q.correctIndex) {
                    border = "2px solid #10b981";
                    bg = "rgba(16, 185, 129, 0.12)";
                    color = "#059669";
                    badgeBg = "#10b981";
                    badgeColor = "#ffffff";
                } else if (idx === selectedOption) {
                    border = "2px solid #ef4444";
                    bg = "rgba(239, 68, 68, 0.12)";
                    color = "#dc2626";
                    badgeBg = "#ef4444";
                    badgeColor = "#ffffff";
                } else {
                    bg = "var(--bg-surface-subtle)";
                    color = "var(--text-muted)";
                }
            }

            return `
                <button 
                    onclick="StudyEngine.selectQuizAnswer(${idx})" 
                    ${isAnswered ? 'disabled' : ''}
                    style="width: 100%; text-align: left; padding: 1rem 1.25rem; border-radius: var(--radius-md); border: ${border}; background: ${bg}; color: ${color}; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.75rem; font-size: 0.95rem; font-weight: 500; transition: all 0.2s;">
                    <span style="width: 28px; height: 28px; border-radius: 9999px; background: ${badgeBg}; color: ${badgeColor}; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">
                        ${isAnswered && idx === q.correctIndex ? '✓' : (isAnswered && idx === selectedOption ? '✕' : String.fromCharCode(65 + idx))}
                    </span>
                    <span>${opt}</span>
                </button>
            `;
        }).join('');

        let feedbackHtml = '';
        if (isAnswered) {
            const isCorrect = selectedOption === q.correctIndex;
            feedbackHtml = `
                <div style="margin-top: 1.25rem; padding: 1rem 1.25rem; border-radius: var(--radius-md); background: ${isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)'}; border: 1px solid ${isCorrect ? '#10b981' : '#ef4444'};">
                    <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 0.25rem; color: ${isCorrect ? '#059669' : '#dc2626'};">
                        ${isCorrect ? '🎉 Correct!' : '💡 Explanation:'}
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5;">${q.explanation || 'Review the notes for deeper conceptual mastery.'}</p>
                </div>
            `;
        }

        container.innerHTML = `
            <div>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem;">
                    <span class="badge-subject">${q.subject || 'General Knowledge'}</span>
                    <span>Question ${this.currentQuizIndex + 1} of ${this.quizQuestions.length}</span>
                </div>

                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); line-height: 1.4; margin-bottom: 1.25rem;">
                    ${q.question}
                </h3>

                <div>
                    ${optionsHtml}
                </div>

                ${feedbackHtml}

                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
                    <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Score: ${this.quizScore} / ${this.quizQuestions.length}</span>
                    ${isAnswered ? `
                        <button onclick="StudyEngine.nextQuizQuestion()" class="btn-primary" style="padding: 0.5rem 1.25rem;">
                            <span>${this.currentQuizIndex + 1 === this.quizQuestions.length ? 'View Results' : 'Next Question'}</span>
                            <span>→</span>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    },

    selectQuizAnswer(index) {
        if (this.answeredQuestions.hasOwnProperty(this.currentQuizIndex)) return;

        this.answeredQuestions[this.currentQuizIndex] = index;
        const currentQ = this.quizQuestions[this.currentQuizIndex];
        if (index === currentQ.correctIndex) {
            this.quizScore++;
            const user = StorageManager.getUserProfile();
            user.reputationPoints = (user.reputationPoints || 0) + 10;
            StorageManager.saveUserProfile(user);
        }

        this.renderQuizQuestion();
    },

    nextQuizQuestion() {
        this.currentQuizIndex++;
        this.renderQuizQuestion();
    },

    renderQuizResults(container) {
        const percent = Math.round((this.quizScore / this.quizQuestions.length) * 100);
        let title = "Outstanding Mastery! 🏆";
        let message = "You've demonstrated a sharp grasp of these core concepts!";
        if (percent < 60) {
            title = "Keep Practicing! 📚";
            message = "Review the corresponding notes to reinforce these concepts and try again.";
        }

        StorageManager.recordStat('quizzesTaken', 1);

        container.innerHTML = `
            <div style="text-align: center; padding: 2rem 1rem;">
                <div style="width: 70px; height: 70px; margin: 0 auto 1rem auto; border-radius: 9999px; background: var(--primary-light); display: flex; align-items: center; justify-content: center; font-size: 2.2rem;">
                    ${percent >= 80 ? '🌟' : (percent >= 60 ? '🎯' : '💡')}
                </div>
                <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">${title}</h3>
                <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 400px; margin: 0 auto 1.5rem auto;">${message}</p>

                <div style="display: inline-block; padding: 1rem 2rem; border-radius: var(--radius-lg); background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); margin-bottom: 1.5rem;">
                    <div style="font-size: 2.2rem; font-weight: 800; color: var(--primary);">${this.quizScore} / ${this.quizQuestions.length}</div>
                    <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">${percent}% Accuracy</div>
                </div>

                <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;">
                    <button onclick="StudyEngine.startQuiz('${this.activeNoteId}')" class="btn-primary">
                        Retake Quiz
                    </button>
                    <button onclick="document.getElementById('flashcardTabBtn').click()" class="btn-icon" style="width: auto; padding: 0.5rem 1rem; font-weight: 600;">
                        Study Flashcards
                    </button>
                </div>
            </div>
        `;
    }
};
