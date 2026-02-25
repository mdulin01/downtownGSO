# downtownGSO Project Guidelines

## Project Overview

**downtownGSO** is a directory and community platform for downtown Greensboro, NC businesses and events. It provides a searchable, interactive map-based interface for discovering local businesses, events, and community resources.

---

## Key URLs & Resources

| Resource | URL |
|----------|-----|
| **Live Site** | https://downtownGSO.org |
| **GitHub Repository** | https://github.com/mdulin01/downtownGSO |
| **Firebase Console** | https://console.firebase.google.com/project/downtowngso-20d9c |
| **Vercel Dashboard** | https://vercel.com/dashboard |

---

## Technical Stack

- **Frontend Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Backend/Database:** Firebase (Firestore, Authentication, Storage)
- **Maps Integration:** Mapbox GL JS
- **Deployment:** Vercel
- **Version Control:** GitHub (mdulin01/downtownGSO)

---

## Project Structure

```
downtowngso/
├── src/
│   ├── components/        # React components (auth, businesses, common, events, layout, map, posts, suggestions)
│   ├── pages/             # Page components (Home, Feed, Businesses, Events, MapExplore, Admin, etc.)
│   ├── hooks/             # Custom hooks (useAuth, usePosts, useUpvote)
│   ├── utils/             # Utility functions (authUtils)
│   ├── assets/            # Static assets
│   ├── constants.js       # App constants
│   ├── firebase-config.js # Firebase initialization
│   ├── seed-data.js       # Seed data for development
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── package.json
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
└── CLAUDE.md
```

---

## Infrastructure

- **Firebase Project ID:** downtowngso-20d9c
- **Firebase Storage Bucket:** `gs://downtowngso-20d9c.firebasestorage.app`
- **Database:** Firestore
- **Authentication:** Enabled
- **Storage:** Enabled for uploads
- **Mapbox:** Requires API token (in environment variables)
- **Firebase config** is hardcoded in `src/firebase-config.js` (public API keys only)

## Architecture Notes

- **Pages:** Home, Feed, Businesses, Events, MapExplore, Admin, About, Suggestions
- **Component groups:** auth, businesses, common, events, layout, map, posts, suggestions
- **Custom hooks:** useAuth, usePosts, useUpvote
- Uses Mapbox GL JS for interactive map views

---

## Deployment Notes

- **Hosting:** Vercel
- **Custom Domain:** downtownGSO.org
- **Branch Deployments:** Automatic from GitHub pushes
- **Production Build:** Auto-triggered on main/master branch commits

---

## File Scope Boundary

**CRITICAL: When working on this project, ONLY access files within the `downtowngso/` directory.** Do not read, write, or reference files from any sibling project folder (dulinproperties, rainbow-rentals, lifedesigncourse, etc.). If you need something from another project, stop and ask first.
