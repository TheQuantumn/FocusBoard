# FocusBoard 🧠⏱️

**FocusBoard** is a modern, full-stack productivity web application designed for deep work.  
It combines a **Pomodoro timer**, **Kanban task board**, and **ambient focus tools** into a single, distraction-free dashboard.

Built with a premium SaaS-style UI and per-user data persistence, FocusBoard is intended as a **portfolio-grade project** demonstrating real-world full-stack engineering.

---
<img width="960" height="540" alt="image" src="https://github.com/user-attachments/assets/679958cb-8cdc-443e-b63a-879a723a152b" />


## ✨ Features

### 🗂 Kanban Task Board
- Columns: **To Do / Ongoing / Completed**
- Drag & drop between columns
- Smooth drag animations and hover states
- Per-user task isolation
- Delete completed tasks in bulk
- Glassmorphic board container over animated background

### ⏱ Pomodoro Timer
- Focus / Break cycles
- Circular progress ring
- Start / Reset / Skip Break
- Customizable focus & break durations
- Minimal, distraction-free design

### 🎵 Spotify Focus Player
- Embedded Spotify playlist
- Responsive layout (fills available space)
- Designed for long focus sessions

### 🔐 Authentication
- Email + password authentication
- Cookie-based sessions (no JWT on client)
- Login / Signup pages with animated DarkVeil background
- Redirect flow:
  - Signup → Login (prefilled credentials)
  - Login → Board
- Logout support

### 🌌 Ambient UI
- **DarkVeil shader background** (WebGL)
- Subtle glassmorphism with backdrop blur
- Dark modern SaaS dashboard aesthetic
- Inter font with proper typographic hierarchy

---

## 🧱 Tech Stack

### Frontend
- **Next.js (App Router)**
- **TypeScript**
- **React**
- **Inter Font**
- Custom CSS variables (no UI libraries)

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **SQLite**
- Cookie-based authentication
- Per-user data persistence

### Graphics
- **OGL (WebGL)** for DarkVeil animated background



