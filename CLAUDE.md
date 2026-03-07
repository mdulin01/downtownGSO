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

### Core
- **Frontend Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Backend/Database:** Firebase (Firestore, Authentication, Storage)
- **Maps Integration:** Mapbox GL JS
- **Deployment:** Vercel (auto-deploys from GitHub main branch)
- **Version Control:** GitHub (mdulin01/downtownGSO)

### Services & APIs
- **Email Notifications:** Resend (API key stored in Google Cloud Secret Manager as `RESEND_API_KEY`)
- **Cloud Functions:** Firebase Functions v2 (Node.js 20, Cloud Run-based)
  - `onUserCreated` — sends welcome email on new user signup
  - `onPostCreated` — sends post notification to users with matching interests
- **Google Cloud Secret Manager:** Stores sensitive keys (Resend API key)
- **Firebase Security Rules:** Custom rules with subcollections for comments and reactions

### Key Libraries
- `lucide-react` — Icons
- `firebase` / `firebase-admin` — Client & server SDK
- `resend` — Email delivery (in Cloud Functions)
- `react-router-dom` — Routing
- `mapbox-gl` — Interactive maps

---

## Project Structure

```
downtowngso/
├── src/
│   ├── components/        # React components (auth, businesses, common, events, layout, map, posts, suggestions)
│   ├── pages/             # Page components (Home, Feed, News, Groups, GroupDetail, Businesses, Events, Admin, About, Suggestions)
│   ├── hooks/             # Custom hooks (useAuth, usePosts, useUpvote, useComments, useGroupComments)
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

- **Pages:** Home, Feed, News, Groups, Businesses, Events, MapExplore, Admin, About, Suggestions
- **Component groups:** auth, businesses, common, events, layout, map, posts, suggestions
- **Custom hooks:** useAuth, usePosts, useUpvote, useComments, useGroupComments
- **Social engagement components:**
  - `Reactions.jsx` — Emoji reactions (love, fire, clap, insightful, sad) for any Firestore collection
  - `ShareButton.jsx` — Web Share API with clipboard fallback
  - `ActivityTicker.jsx` — Real-time live activity feed on homepage
  - `ProfileCompletionModal.jsx` — Onboarding flow with interests + Governors Court group invite
  - `CommentsSection.jsx` / inline `NewsComments` — Comment threads on posts and news
- **Group Detail page** (`/groups/:groupId`) with three tabs:
  - Discussion — real-time group chat via `groups/{groupId}/comments` subcollection
  - Members — fetches user profiles, shows Admin badge for group creator
  - Resources — FAQ (accordion), Links, Documents. Admin (group creator) can add/delete.
- **News admin editing:**
  - Admins see Edit/Delete on hover, "+ New Article" button
  - Inline edit form with image upload to Firebase Storage (`/news/` path)
  - Can also paste image URLs directly
- **Admin emails:** defined in `src/utils/authUtils.js` (`ADMIN_EMAILS` array)
  - Currently: mdulin@gmail.com, adamjosephbritten@gmail.com
- **Firestore subcollections:**
  - `news/{articleId}/comments/{commentId}`
  - `news/{articleId}/reactions/{reactionId}`
  - `posts/{postId}/reactions/{reactionId}`
  - `groups/{groupId}/comments/{commentId}`
  - `groups/{groupId}/resources/{resourceId}`
- **Firebase Storage rules:** `/news/**` allows public read, authenticated write (images <10MB)
- Uses Mapbox GL JS with Geocoding API for location search autocomplete in LocationPicker

---

## Deployment Notes

- **Hosting:** Vercel
- **Custom Domain:** downtownGSO.org
- **Branch Deployments:** Automatic from GitHub pushes
- **Production Build:** Auto-triggered on main/master branch commits

---

## File Scope Boundary

**CRITICAL: When working on this project, ONLY access files within the `downtowngso/` directory.** Do not read, write, or reference files from any sibling project folder (dulinproperties, rainbow-rentals, lifedesigncourse, etc.). If you need something from another project, stop and ask first.
