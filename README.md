# 🎓 StudySync — Modern Collaborative Notes Sharing Platform

**StudySync** is a modern, student-centric academic notes sharing and study acceleration platform. It empowers students to upload, discover, search, review, and master course materials from universities around the globe.

---

## ✨ Features & Upgrades

### 1. ⚡ 100% Standalone & Offline-Ready (Zero CDN Dependency)
- Fully self-contained CSS design system in `css/styles.css`.
- Works completely offline, in local `file:///` mode or through `python serve.py`.
- Safe in-memory storage fallback if `localStorage` is restricted.

### 2. 🌓 Instant Dark / Light Mode
- One-click theme toggle in header with visual sun/moon icons.
- Deep dark slate palette with high contrast readability.
- Saved user preference remembered across reloads.

### 3. 📖 Interactive Note Reader & AI Study Companion
- **Distraction-Free Reading**: Fullscreen modal reader with formatted markdown headings, tables, formula blocks, and code syntax highlighting.
- **✨ AI Key Takeaways Generator**: Click the AI button inside any note to generate instant exam takeaways and conceptual highlights.
- **Customizable Themes**: Paper White, Warm Sepia, Eye-Care Mint, and Night Dark backgrounds.
- **Font Zoom Controls**: `A-`, `100%`, `A+` font scaling.
- **Print & Download**: Instant text file download and browser print layout (`window.print()`).
- **Peer Comments**: Ask questions or post clarifications with community upvotes.

### 4. ⏱️ Integrated Pomodoro Focus Timer
- 25-minute study sprint / 5-minute break timer.
- Clean digital countdown display with Start / Pause and Reset controls.

### 5. 🧠 AI Study Hub (3D Flashcards & Quiz Engine)
- **3D Card Flip**: Smooth 3D animation revealing questions and comprehensive answers.
- **Mastery Tracking**: Mark cards as "Still Learning" or "Got It! Mastered" with live progress bar.
- **Interactive AI Quiz**: Instant multiple-choice quizzes with immediate green/red visual indicators and conceptual explanations.
- **Deck Selector**: Practice topic-specific decks or study across all academic fields combined.

### 6. 🔍 Live Search & Multi-Facet Filtering
- Search across title, subject, course codes (e.g. `CS 201`, `MATH 152`), tags, and full note content.
- Filter by discipline chips: Computer Science, Mathematics, Biology, Chemistry, Physics, Economics, Humanities.
- Filter by resource format: Comprehensive Notes, Cheat Sheets, Formula Sheets, Exam Summaries, Lecture Notes.
- Sort by Most Popular (Upvotes), Highest Rated, Newest, or Most Downloaded.

### 7. 📤 Share Notes & Community Dashboard
- Upload form with course code, university, tags, summary, and markdown note content.
- Automatic **+50 Reputation Points** award for sharing notes.
- "My Library" dashboard for saved bookmarks, uploaded notes, and personal study statistics.
- Community Q&A forum to ask questions and request missing study materials.

---

## 🚀 How to Run

### Method 1: Instant Browser Launch (Recommended)
Simply double click [**`index.html`**](file:///C:/Users/Neeru%20Singh/.gemini/antigravity/scratch/study-sync/index.html) in Windows Explorer or open it in any browser (Chrome, Edge, Firefox, Brave, Safari).

### Method 2: Python Local Server
Run `serve.py` in PowerShell:
```powershell
cd "C:\Users\Neeru Singh\.gemini\antigravity\scratch\study-sync"
python serve.py
```
This automatically starts `http://localhost:8000` and launches it in your default web browser.

---

## 📁 File Structure

```
study-sync/
├── index.html         # Main interface with Pomodoro timer, Reader modal, & Hub
├── css/
│   └── styles.css     # Self-contained design system, dark mode & 3D cards
├── js/
│   ├── data.js        # Seed academic notes, flashcards, quizzes & comments
│   ├── storage.js     # Storage manager with in-memory fallback
│   ├── flashcards.js  # 3D Flashcard and AI Quiz interactive study engine
│   └── app.js         # Navigation, search, theme, timer, reader & upload logic
├── serve.py           # One-click Python local server with auto-browser launch
└── README.md          # Feature guide and instructions
```
