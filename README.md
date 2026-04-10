# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Khuta System — Developer Guide

## Project Overview

Khuta is a course scheduling management system for KFUPM built with React + Vite. The system supports multiple user roles: **Chairman**, **Committee**, and **Faculty**.

---

## Project Structure

```
my-react-app/
└── src/
    ├── shared/
    │   ├── Layout.jsx          ← Shared layout component (sidebar + topbar)
    ├── Committee/
    │   ├── layout/
    │   │   └── CommitteeLayout.jsx  ← Committee-specific layout
    │   ├── CSS/
    │   └── Pages/
    │       ├── AssignCourses.jsx
    │       ├── ManageTerms.jsx
    │       └── ManageCourses.jsx
    ├── Pages/
    │   ├── login.jsx
    │   ├── ChairmanHomePage.jsx
    │   ├── icsFaculty.jsx
    │   ├── schedulingCommittee.jsx
    │   └── teachingLoad.jsx
    ├── styles/
    │   └── global.css          ← Single shared CSS file for the entire project
    ├── App.jsx                 ← Routes definition
    └── main.jsx                ← App entry point
```

---

## Getting Started

### 1. Install dependencies

```bash
cd my-react-app
npm install
npm install react-router-dom
```

### 2. Run the development server

```bash
npm run dev
```

### 3. Open in browser

```
http://localhost:5173
```

---

## Login Credentials

| Role      | Username  | Password |
|-----------|-----------|----------|
| Chairman  | fatimah   | 11       |
| Faculty   | lama      | 22       |
| Committee | nour      | 12       |
| Committee | kawthar   | 12       |

---

## Routing

| Path                          | Page                  | User       |
|-------------------------------|-----------------------|------------|
| `/`                           | Login                 | All        |
| `/chairman-home`              | ICS Courses           | Chairman   |
| `/ics-faculty`                | ICS Faculty           | Chairman   |
| `/ics-committee`              | Scheduling Committee  | Chairman   |
| `/teaching-load`              | Teaching Load         | Chairman   |
| `/committee/assign-courses`   | Assign Courses        | Committee  |
| `/committee/manage-terms`     | Manage Terms          | Committee  |
| `/committee/manage-courses`   | Manage Courses        | Committee  |

---

## How the Layout Works

All pages (except Login) use a shared `Layout.jsx` component that renders the sidebar and topbar. Each user type has their own layout file that passes their specific navigation items and user info.

### Adding a new page

**Step 1** — Create the page component in the right folder:
```jsx
// src/Committee/Pages/NewPage.jsx
export default function NewPage() {
  return <h2>New Page Content</h2>;
}
```

**Step 2** — Add the route in `App.jsx`:
```jsx
import NewPage from './Committee/Pages/NewPage';

// Inside the Committee route block:
<Route path="new-page" element={<NewPage />} />
```

**Step 3** — Add the nav link in `CommitteeLayout.jsx`:
```jsx
const NAV_ITEMS = [
  { path: '/committee/assign-courses', label: 'Assign Courses' },
  { path: '/committee/manage-terms',   label: 'Manage Terms'   },
  { path: '/committee/manage-courses', label: 'Manage Courses' },
  { path: '/committee/new-page',       label: 'New Page'       }, // ← add here
];
```

---

## CSS Guide

The project uses a **single shared CSS file**: `src/styles/global.css`

It is imported **only once** in `main.jsx`:
```jsx
import './styles/global.css'
```

### CSS class naming convention

All layout classes use the `layout__` prefix to avoid conflicts:

| Class | Description |
|---|---|
| `.layout` | Main flex container |
| `.layout__sidebar` | Left sidebar |
| `.layout__logo` | Logo area |
| `.layout__nav` | Navigation list |
| `.layout__nav-link` | Nav button |
| `.layout__nav-link--active` | Active nav button |
| `.layout__footer` | User info + logout |
| `.layout__body` | Right content area |
| `.layout__topbar` | Top bar with breadcrumb |
| `.layout__content` | Scrollable page content |
| `.layout__btn-logout` | Logout button |

### Adding page-specific styles

Add your styles at the bottom of `global.css` using a clear section comment:

```css
/* ══════════════════════════════════════
   MANAGE TERMS PAGE
══════════════════════════════════════ */

.terms-list { ... }
.term-card  { ... }
```

---

## Design Tokens

All colors and spacing are defined as CSS variables in `global.css`:

```css
--primary:       #2d3a8c   /* Main blue */
--accent:        #00b894   /* Green */
--danger:        #e53e3e   /* Red (logout, delete) */
--bg:            #f9fafb   /* Page background */
--white:         #ffffff
--text:          #1a1a2e   /* Primary text */
--text-muted:    #6b7280   /* Secondary text */
--border:        #e5e7eb   /* Borders */
--sidebar-w:     260px     /* Sidebar width */
--topbar-h:      54px      /* Topbar height */
--radius:        8px       /* Border radius */
```

---

## Notes

- Do **not** import `index.css` — it overrides the layout styles.
- Do **not** add styles to `App.css` — use `global.css` only.
- The active nav link uses a green-to-blue gradient: `linear-gradient(135deg, #00b894, #2d3a8c)`.