# Accessible Learning Companion 🌟
### Computer-Based Learning Tool for Students with Intellectual Disabilities

Welcome to the **Accessible Learning Companion**, a complete, functional, accessible web application designed specifically for students with intellectual and developmental disabilities, their educators, and caregivers.

---

## 🔑 Login & Demonstration Credentials

To access the application:

- **Email / User ID:** `kiranfamily.0987@gmail.com`
- **Password:** `kiranfamily.0987`

*(The application includes an interactive password visibility toggle, a "Remember Me" option, a friendly "Need help signing in?" dialog, and safe session management.)*

> **Architectural Note:** In this local client-side demonstration, authentication state is handled cleanly via LocalStorage. In a production deployment, this would be backed by a secure server with HTTPS, hashed passwords (e.g., Argon2), and HTTP-only session tokens.

---

## 🚀 How to Run the Application

This application is built with standard **HTML5, CSS3, and Vanilla JavaScript (ES6+)** with zero required paid APIs, external backends, or build tooling.

### Option A: Open directly in your browser
Simply double-click [`index.html`](file:///c:/Users/KIRAN/Desktop/comminuty_project/index.html) or right-click and choose **Open with Google Chrome / Microsoft Edge / Firefox / Safari**.

### Option B: Local Python HTTP Server (Recommended)
Open your terminal in this directory and run:
```bash
python -m http.server 8080
```
Then visit: `http://localhost:8080` in your web browser.

---

## 🎨 Visual Identity & Accessibility Design System

- **Primary Color:** Soft Royal Blue (`#5B7CFA`)
- **Secondary Color:** Mint Green (`#9DE7C5`)
- **Background Color:** Soft Lavender-White (`#F7F8FC`)
- **Accent Color:** Warm Yellow (`#FFD76A`)
- **Typography:** Dark Navy (`#24304A`) with the highly legible **Nunito** rounded sans-serif font
- **Success:** Gentle Soft Green (`#38A169` / `#DEF7EC`)
- **Encouragement / Retry:** Gentle Coral Red (`#EF4444` / `#FDE8E8`)
- **High Contrast Mode:** High-contrast yellow on dark navy with bold focus rings
- **Themes:** Default Soft Lavender, High Contrast, Calm Blue, and Warm Sunset
- **Touch & Motor Support:** Extra Large Buttons mode with generous spacing
- **Sensory Safety:** Zero flashing animations, no harsh buzzer sounds, and gentle Web Audio synthesizers

---

## 🧩 Comprehensive Application Modules (15 Sections)

1. **Login & Authentication (`#view-login`):** Validates credentials, prevents unauthorized URL access, provides loading feedback and password reveals.
2. **Student Dashboard (`#view-student-dashboard`):** Time-of-day greeting, active student avatar, reward stars, daily streak, dynamic "Continue Learning" recommendation, and quick category shortcuts.
3. **Learning Library (`#view-learning-library`):** Picture-based lessons across all required categories:
   - **Colours:** Red, Blue, Green, Yellow, Orange, Purple, Black, White
   - **Numbers:** Numbers 1–10, 11–20, Counting Objects, Number-to-Picture Association
   - **Shapes:** Circle, Square, Triangle, Rectangle, Star
   - **Animals:** Dog, Cat, Cow, Lion, Elephant, Bird
   - **Everyday Objects:** Chair, Table, Cup, Bottle, Book, Pencil, Bag
   - **Fruits & Vegetables:** Apple, Banana, Orange, Mango, Carrot, Tomato
   - **Emotions:** Happy, Sad, Angry, Scared, Excited, Calm
4. **Interactive Learning Games (`#view-activities`):** 8 functional games:
   - *Picture Selection*
   - *Matching Pairs*
   - *Drag-and-Drop / Tap Category Sorter*
   - *Multiple Choice Quiz*
   - *Memory Card Game*
   - *Sorting Game (Fruits vs Vegetables)*
   - *Step Sequencing Activity*
   - *Audio Identification ("Listen and choose")*
5. **Practice & Revision Room (`#view-practice`):** 3D interactive flip flashcard deck with audio readouts and unhurried self-paced review.
6. **Rewards & Achievements (`#view-rewards`):** Star trophy room, badge shelf, and celebratory particle fanfare.
7. **Student Progress & Analytics (`#view-progress`):** Real-time Chart.js graphs (category accuracy, weekly trends, mastered vs revision topics), plus an HTML5 canvas fallback for offline environments.
8. **Teacher & Caregiver Portal (`#view-teacher-dashboard`):** Student performance inspection, assign learning goals, add educator remarks, and view caregiver observations.
9. **Student Profiles (`#view-student-profiles`):** Multi-student management (Rahul, Ananya, Kiran), avatar selection, age group, learning levels, and language preferences.
10. **Accessibility Settings (`#view-accessibility`):** Live font scaling (Normal, Large, Extra Large), theme picker, reduced motion, simple language mode, audio-first mode, speech rate slider, and volume controls.
11. **Content Management System (CMS) (`#view-cms`):** Create, edit, and delete picture lessons with form validation and safety confirmations.
12. **Ask Milo - Learning Buddy (`#view-milo-assistant`):** Friendly rule-based mascot companion providing concept explanations, hints, emotional encouragement, and speech synthesis.
13. **Daily-Life Skills Module (`#view-daily-skills`):** Step-by-step visual sequencing for Personal Hygiene (handwashing, brushing teeth), Daily Routines (waking up, eating), Safety (traffic lights, safe habits), and Communication (polite greetings, asking for help). Includes an interactive checklist with reward stars!
14. **Printable IEP Report (`#view-reports`):** Formatted summary for Individualized Education Programs with CSV export and clean print layout.
15. **Application Settings (`#view-app-settings`):** JSON backup export, factory defaults reset dialog, and version specifications.

---

## 🎧 Audio & Voice Capabilities

- **Text-to-Speech (TTS):** Browser Web Speech API with anti-overlap queue management, adjustable speech rate, pitch, and volume.
- **Multilingual Support:** English (`en-US`) and Kannada (`kn-IN`) pronunciation with dedicated translations.
- **Speech Recognition:** Voice answers enabled via browser microphone with seamless tap/click fallback.
- **Web Audio API Synthesizer:** Warm harmonic chords for success, soft descending tones for retries, star chimes, and celebration fanfares—guaranteed to play 100% offline without missing external audio files.

---

## 📂 File Structure

```
├── index.html            # Main semantic HTML structure & modal dialogs
├── style.css             # Comprehensive accessible design system & themes
├── test_app.py           # Verification script
├── README.md             # Documentation
└── js/
    ├── storage.js        # LocalStorage wrapper & pre-seeded student/lesson data
    ├── audio.js          # Web Speech API TTS, Speech Recognition & Web Audio tones
    ├── milo.js           # Animated SVG mascot controller & rule-based assistant
    ├── adaptive.js       # Local performance analysis & adaptive difficulty engine
    ├── auth.js           # Demo authentication guard & session manager
    ├── lessons.js        # Learning Library renderer & lesson detail modal
    ├── activities.js     # 8 interactive games with answer validation & scoring
    ├── daily-skills.js   # Life skills step sequences & interactive checklists
    ├── progress.js       # Progress analytics, Chart.js & CSV export engine
    ├── teacher.js        # Teacher remarks, caregiver notes & goal assignments
    ├── accessibility.js  # Live accessibility preferences controller
    ├── cms.js            # Content Management System for custom lessons
    └── app.js            # Application router, dashboard logic & initialization
```
