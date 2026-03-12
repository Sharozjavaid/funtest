# BarkBoard — Implementation Plan

## Context
Building a dog-walking social network where users share walks, photos, and discover popular walking spots. MVP for ~100 users. The Firebase project `barkbark-16f5b` is already created.

## Stack
- **Next.js 15** (App Router) → deployed on Vercel
- **Firebase Admin SDK** (server-side only) → Firestore for data
- **Vercel Blob** → image uploads
- **Tailwind CSS** → styling with custom warm palette
- **jose** → JWT session tokens (Edge-compatible)

## Design System
- **Fonts**: Fredoka (headings, bubbly) + Nunito (body, readable)
- **Palette**: Cream `#FFF8E7` background, Honey `#F2A922` primary, Bark Brown `#5C3D2E` text, Sand `#F5E6C8` cards, Paw Pink `#E8A0BF` accents, Leaf Green `#7CB342` success
- **Style**: Rounded corners (`rounded-2xl`), soft shadows, warm and family-friendly

## Firestore Collections
- `users/{uid}` — email, displayName, dogName, dogBreed, avatarUrl, createdAt
- `posts/{postId}` — userId, content, imageUrl, location {lat, lng, name}, createdAt
- `spots/{spotId}` — name, description, location {lat, lng}, likeCount, createdBy, createdAt
- `spots/{spotId}/likes/{uid}` — likedAt (for deduplication)

## Auth Flow
1. User enters email at `/login`
2. `POST /api/auth/login` — find or create user in Firestore, generate JWT (via `jose`), set httpOnly cookie
3. `middleware.ts` — verify cookie on all protected routes, redirect to `/login` if missing/invalid
4. No passwords, no OAuth — demo-grade email-only auth

## Pages (7 routes)
1. `/` — Global feed (all posts, newest first)
2. `/login` — Email sign-in
3. `/profile/[id]` — User profile + their posts
4. `/profile/edit` — Edit profile (dog name, breed, avatar)
5. `/new` — Create a post (text + photo + location)
6. `/spots` — Browse nearby walking hot spots
7. `/spots/new` — Add a new walking spot

## API Routes
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/auth/login` | Email login/register, set cookie |
| POST | `/api/auth/logout` | Clear cookie |
| GET | `/api/posts` | Paginated feed (cursor-based) |
| POST | `/api/posts` | Create post |
| GET | `/api/users/[id]` | Get user profile |
| PATCH | `/api/users/[id]` | Update own profile |
| POST | `/api/upload` | Upload image → Vercel Blob |
| GET | `/api/spots` | Get spots (optionally near lat/lng) |
| POST | `/api/spots` | Create spot |
| POST | `/api/spots/[spotId]/like` | Toggle like (transaction) |

## File Structure
```
barkboard/
├── .env.local
├── middleware.ts                    # Auth guard
├── next.config.ts
├── tailwind.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Fonts, navbar, global styles
│   │   ├── page.tsx                # Feed
│   │   ├── globals.css
│   │   ├── login/page.tsx
│   │   ├── profile/[id]/page.tsx
│   │   ├── profile/edit/page.tsx
│   │   ├── new/page.tsx
│   │   ├── spots/page.tsx
│   │   ├── spots/new/page.tsx
│   │   └── api/
│   │       ├── auth/login/route.ts
│   │       ├── auth/logout/route.ts
│   │       ├── posts/route.ts
│   │       ├── users/[id]/route.ts
│   │       ├── upload/route.ts
│   │       ├── spots/route.ts
│   │       └── spots/[spotId]/like/route.ts
│   ├── lib/
│   │   ├── firebase-admin.ts       # Admin SDK singleton
│   │   ├── firestore.ts            # Typed data helpers
│   │   ├── auth.ts                 # JWT create/verify/cookie
│   │   └── geo.ts                  # Haversine distance
│   ├── components/
│   │   ├── ui/                     # Button, Input, Card, Avatar
│   │   ├── layout/Navbar.tsx
│   │   ├── feed/PostCard.tsx, FeedList.tsx
│   │   ├── spots/SpotCard.tsx, SpotList.tsx
│   │   ├── profile/ProfileHeader.tsx, ProfileForm.tsx
│   │   ├── post/NewPostForm.tsx
│   │   └── LocationPicker.tsx
│   ├── hooks/
│   │   ├── useCurrentUser.ts
│   │   └── useGeolocation.ts
│   └── types/index.ts
```

## Build Order

### Phase 1: Scaffold + Foundation
1. `npx create-next-app@latest barkboard` with TypeScript, Tailwind, App Router, src dir
2. Install deps: `firebase-admin`, `jose`, `@vercel/blob`
3. Configure Tailwind theme (colors, fonts, shadows, border-radius)
4. Set up root layout with Fredoka + Nunito via `next/font/google`
5. Create types in `src/types/index.ts`
6. Set up `src/lib/firebase-admin.ts` (requires service account key from Firebase Console)

### Phase 2: Auth
7. Implement `src/lib/auth.ts` (JWT with jose)
8. Build `POST /api/auth/login` and `POST /api/auth/logout`
9. Build `middleware.ts`
10. Build `/login` page

### Phase 3: Profiles
11. Build `GET/PATCH /api/users/[id]`
12. Build `/profile/[id]` and `/profile/edit` pages
13. Build UI components (Avatar, ProfileHeader, ProfileForm)

### Phase 4: Posts + Feed
14. Build `POST /api/upload` (Vercel Blob)
15. Build `GET/POST /api/posts`
16. Build PostCard, FeedList, NewPostForm components
17. Build `/new` page and `/` feed page

### Phase 5: Spots + Location
18. Build `useGeolocation` hook and `LocationPicker` component
19. Build `GET/POST /api/spots` and `POST /api/spots/[spotId]/like`
20. Build SpotCard, SpotList components
21. Build `/spots` and `/spots/new` pages
22. Implement `src/lib/geo.ts` for distance calculations

### Phase 6: Polish
23. Loading states, error states, empty states
24. Responsive design (mobile-first)
25. Edge cases (no avatar, no location permission, etc.)

## Setup Prerequisite
Before coding, you need to generate a **Firebase Admin service account key**:
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON — we'll extract `project_id`, `client_email`, and `private_key` for `.env.local`

## Verification
- `npm run dev` → login with email → create profile → post with photo → view feed
- Visit `/spots` → add a spot → like it → verify count updates
- Test on mobile viewport (375px)
- Deploy to Vercel, test end-to-end with real Firestore + Vercel Blob
