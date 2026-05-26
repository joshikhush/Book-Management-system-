# Book Management System (AetherBooks)

A **React + Vite** app for viewing, adding, updating, and deleting books. It uses **JSON Server** for local REST CRUD and automatically falls back to a **localStorage-backed simulated API** when no server is available (e.g. on Vercel/Netlify static hosting).

## Submission links

| Item | Link |
|------|------|
| **GitHub repository** | _Add your repo URL after pushing — see [Publish to GitHub](#publish-to-github) below_ |
| **Live deployed URL** | _Add your Vercel/Netlify URL after deploying — see [Deploy live](#deploy-live-vercel) below_ |

---

## Assignment requirements checklist

| Requirement | Status |
|-------------|--------|
| List books (title, author, genre, publication year) | Done |
| Add book via form | Done |
| Edit existing books | Done |
| Delete books (with confirmation) | Done |
| API integration (JSON Server + REST `fetch`) | Done (local dev) |
| Search by title or author | Done |
| Filter by genre | Done |
| Loading states | Done (skeleton grid + form/toast spinners) |
| Error handling | Done (toasts + API fallback) |
| Clean component structure | Done |
| Styling | Done (dark glassmorphic UI) |
| README with setup instructions | Done (this file) |
| GitHub repository published | **Pending** (git initialized, no remote/commits yet) |
| Live deployment | **Pending** (requires your Vercel/Netlify login) |

**Extras beyond the brief:** dashboard stats, sort options, star ratings, descriptions, toast notifications.

---

## 🌟 Key Features

*   **📊 Stat-packed Dashboard**: Displays vital metrics (Total Books, Average Rating, Top Genre, and Latest Release) calculated dynamically from library data.
*   **🔍 Search & Smart Filters**: Instant, real-time query search covering book titles and authors, plus filter-tabs for genres and multi-key sorting (A-Z, Year, Rating).
*   **🛠️ Full CRUD Operations**:
    *   **Create**: Slide-up glassmorphic form modal with comprehensive validation (Title, Author, Genre, Year, Description, Star Ratings).
    *   **Read**: Displays responsive grid of books with pulsing skeleton loaders for latency simulation.
    *   **Update**: Edits existing book configurations inside a pre-populated modal form.
    *   **Delete**: Confirmation-guided removal of book documents with clean notifications.
*   **🛎️ Dynamic Notification Toast System**: Slide-in corner alerts for real-time progress (loading spinners, success logs, warnings, and errors).
*   **🎨 Custom Genre Badges & Procedural Cover Gradients**: Automatically selects corresponding neon gradients (Deep Cosmic Indigo, Warm Amber, Forest Emerald, Crimson Maroon) based on genre tags, making each book look unique.

---

## 🔌 Core Architecture: The Dual-Mode API

To ensure **100% stability** and zero setup friction, AetherBooks implements a **Dual-Mode API layer** (`src/services/api.js`):

```
                   [ App Mount Check ]
                            │
              Is Local JSON-Server Active?
              /                        \
           ( Yes )                   ( No )
            /                            \
 🔌 [ REST API Mode ]             ⚠️ [ Simulated Mode ]
  • Targets: http://localhost:3001   • Targets: Browser LocalStorage
  • Real HTTP GET/POST/PUT/DELETE    • Stateful local persistence
  • Shared database: db.json         • Simulated latency (600ms-800ms)
                                     • Seeded automatically
```

1.  **REST API Mode (Local)**: Integrates with a local `json-server` REST database. All CRUD operations map to genuine HTTP network requests (`fetch`) mutating a central `db.json` database.
2.  **Simulated API Mode (Live Deployment)**: If the local REST server is unreachable (such as in live static deployments on **Vercel** or **Netlify**), AetherBooks gracefully switches to an in-browser database powered by `localStorage`. It simulates network request delays (600ms-800ms) to show skeleton states and supports complete, stateful CRUD operations that persist across browser reloads!

---

## 👶 Explaining the Codebase to a 5-Year-Old

*   **React (Lego Bricks)**: Our application is built from small, reusable building blocks called "components" (cards, filters, pop-up forms). Instead of rebuilding the entire house when a door breaks, we only swap that one door block!
*   **CSS (Paint & Glitter)**: The styling sheets give our app its glowing neon borders, cozy dark-sky colors, and smooth sliding doors (micro-animations).
*   **api.js (The Smart Helper)**: A robot that takes letters to the local **Post Office** (our database). If the Post Office is closed, the robot opens a temporary box in our **Closet** (`localStorage`). Everything keeps working, and no messages get lost!

---

## 🛠️ Local Development Setup

Follow these simple steps to spin up the local development suite:

### 1. Prerequisites
Ensure you have **Node.js** installed on your system.

### 2. Clone and Setup
```bash
# Install dependencies listed in package.json
npm install
```

### 3. Launch Development Suite
Run the concurrent runner script which starts the Vite server (port 3000) and the JSON-Server backend (port 3001) at the same time:
```bash
npm run dev:all
```

*   Open your browser and navigate to **`http://localhost:3000`** to view the app!
*   The API is active at **`http://localhost:3001/books`**. Changes you make will mutate the local `db.json` file.

---

## Publish to GitHub

From the project folder:

```bash
git add .
git commit -m "Book Management System: CRUD app with JSON Server and deployment fallback"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/books-management-system.git
git push -u origin main
```

Create an empty repository on GitHub first, then replace `YOUR_USERNAME` and the repo name. Update the **Submission links** table at the top of this README with your repo URL.

---

## Deploy live (Vercel)

### Option A — Vercel dashboard (recommended)

1. Push the project to GitHub (steps above).
2. Sign in at [vercel.com](https://vercel.com/) → **Add New** → **Project**.
3. Import the repository. Defaults work: **Build** `npm run build`, **Output** `dist`.
4. Deploy. Copy the production URL into the README submission table.

The live site uses the **localStorage simulated API** automatically (full CRUD persists per browser). No extra backend is required for the assignment demo.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Optional: hosted REST API on production

To use a real remote API (MockAPI, Render-hosted json-server, etc.):

1. Set environment variable `VITE_API_BASE_URL` in Vercel → **Settings** → **Environment Variables**  
   Example: `https://your-app.mockapi.io/v1/books`
2. Redeploy. The app will use HTTP CRUD against that URL instead of localStorage.

See `.env.example` for the variable name.

---

## 📂 Project File Overview

```
src/
├── components/
│   ├── BookCard.jsx    # Displays individual books & triggers edit/delete
│   ├── BookForm.jsx    # Overlay modal handling input validation & ratings
│   ├── Dashboard.jsx   # Aggregates metrics & formats stats counters
│   ├── FilterBar.jsx   # Ties search, genre chip tags, and sorts together
│   ├── Skeleton.jsx    # Pulsing skeleton grid indicating loading states
│   └── Toast.jsx       # Floating notification alert elements
├── services/
│   ├── api.js          # The dual-mode controller managing HTTP & storage
│   └── mockData.js     # Seeds initial books on first bootup
└── styles/
    ├── index.css       # Core typography (Outfit), design tokens, resets
    ├── BookCard.css    # Card aspect-ratio rules and cover styling
    ├── BookForm.css    # Blur backdrops and validation labels
    ├── Dashboard.css   # Neon blurred backgrounds & stat items layout
    ├── FilterBar.css   # Dynamic inputs, chips scrollbars, and sort boxes
    └── Toast.css       # Pop-up animation triggers & alert types CSS
```
