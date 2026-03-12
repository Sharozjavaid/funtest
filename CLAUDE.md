# BarkBoard

A dog-walking social network where users share walks, discover walking spots, and connect with other dog owners. MVP targeting ~100 users.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 (custom theme via `@theme inline` in globals.css) |
| Database | Firebase Firestore (via `firebase-admin` server-side only) |
| File Storage | Firebase Cloud Storage (via `firebase-admin/storage`) |
| Auth | JWT sessions with `jose` (Edge-compatible), httpOnly cookies |
| Fonts | Fredoka (headings) + Nunito (body) via `next/font/google` |
| Deployment | Vercel |

## Brand & Design System

**Tone**: Warm, playful, family-friendly. Think dog park on a sunny day.

**Palette** (defined as CSS vars in `src/app/globals.css`):
- `cream` #FFF8E7 — page background
- `honey` #F2A922 — primary buttons, accents, links
- `honey-dark` #D4920E — hover states
- `bark` #5C3D2E — body text, headings
- `bark-light` #7A5A4A — secondary text
- `sand` #F5E6C8 — card backgrounds
- `sand-dark` #E8D5B0 — card hover/borders
- `paw-pink` #E8A0BF — accent highlights, likes
- `leaf` #7CB342 — success states
- `stone` #F7F5F0 — alternate section backgrounds

**Typography**: `font-heading` (Fredoka) for all headings/buttons, `font-body` (Nunito) for body text.

**Shape**: `rounded-2xl` on cards/buttons/inputs. Soft shadows. No hard edges.

## Architecture

### Auth Flow
1. Email-only login at `/login` (no passwords)
2. `POST /api/auth/login` finds or creates user in Firestore, issues JWT, sets httpOnly cookie
3. `src/middleware.ts` verifies JWT on all protected routes, redirects to `/login` if invalid
4. New users (empty `dogName`) are redirected to `/onboarding` after login
5. Cookie name: `barkboard-session`, 30-day expiry

### Firestore Collections
- `users/{uid}` — email, displayName, dogName, dogBreed, avatarUrl, createdAt
- `posts/{postId}` — userId, content, imageUrl, location {lat, lng, name}, createdAt
- `spots/{spotId}` — name, description, location {lat, lng}, likeCount, createdBy, createdAt
- `spots/{spotId}/likes/{uid}` — likedAt (deduplication subcollection)

**Required composite index**: `posts` collection — `userId` ASC + `createdAt` DESC (for profile page user posts query).

### Image Uploads
Files go to Firebase Cloud Storage via `POST /api/upload`. The route uses `firebase-admin/storage` to save to the bucket `barkbark-16f5b.firebasestorage.app`, makes files public, and returns the `storage.googleapis.com` URL. Max 5MB, images only.

## File Structure

```
barkboard/
├── .env.local                          # Firebase creds + JWT secret (gitignored)
├── PLAN.md                             # Original implementation plan
├── CLAUDE.md                           # This file
├── next.config.ts                      # Image remote patterns (googleapis, pexels)
├── firestore.indexes.json              # Required Firestore composite indexes
├── src/
│   ├── middleware.ts                    # JWT auth guard for all routes
│   ├── types/index.ts                  # User, Post, Spot, Location, SessionPayload
│   ├── lib/
│   │   ├── firebase-admin.ts           # Admin SDK + Storage singleton
│   │   ├── firestore.ts               # Typed CRUD helpers for all collections
│   │   ├── auth.ts                     # JWT create/verify, cookie helpers, getSession()
│   │   └── geo.ts                      # Haversine distance calculation
│   ├── hooks/
│   │   ├── useCurrentUser.ts           # Client-side user fetch (GET /api/auth/me)
│   │   └── useGeolocation.ts           # Browser geolocation API wrapper
│   ├── components/
│   │   ├── ui/Button.tsx               # Primary/secondary/ghost variants
│   │   ├── ui/Input.tsx                # Labeled text input
│   │   ├── ui/Textarea.tsx             # Labeled textarea
│   │   ├── ui/Card.tsx                 # Sand-colored card container
│   │   ├── ui/Avatar.tsx               # Image or initial-letter fallback
│   │   ├── layout/Navbar.tsx           # Top nav with auth-aware links
│   │   ├── feed/PostCard.tsx           # Single post display with time-ago
│   │   ├── feed/FeedList.tsx           # Infinite-scroll post list
│   │   ├── post/NewPostForm.tsx        # Create post with image + location
│   │   ├── spots/SpotCard.tsx          # Spot with like toggle button
│   │   ├── spots/SpotList.tsx          # Spot list container
│   │   ├── profile/ProfileHeader.tsx   # Avatar + name + edit link
│   │   ├── profile/ProfileForm.tsx     # Edit profile form
│   │   └── LocationPicker.tsx          # Geolocation + name input
│   └── app/
│       ├── layout.tsx                  # Root: fonts, Navbar, <main>
│       ├── globals.css                 # Tailwind theme, colors, animations
│       ├── page.tsx                    # Landing page (unauthed) / Feed (authed)
│       ├── login/page.tsx              # Email login form
│       ├── onboarding/page.tsx         # 4-step new user setup wizard
│       ├── new/page.tsx                # Create post page
│       ├── profile/[id]/page.tsx       # User profile + their posts
│       ├── profile/edit/page.tsx       # Edit own profile
│       ├── spots/page.tsx              # Browse walking spots
│       ├── spots/new/page.tsx          # Add new spot
│       └── api/
│           ├── auth/login/route.ts     # POST: email login/register
│           ├── auth/logout/route.ts    # POST: clear session cookie
│           ├── auth/me/route.ts        # GET: current user from session
│           ├── posts/route.ts          # GET (cursor paginated) / POST
│           ├── users/[id]/route.ts     # GET / PATCH (own profile only)
│           ├── upload/route.ts         # POST: image → Firebase Storage
│           ├── spots/route.ts          # GET (by likeCount) / POST
│           └── spots/[spotId]/like/route.ts  # POST: transactional toggle
```

## Conventions

- **Server components** for pages that fetch data (feed, profile, spots list)
- **"use client"** for interactive pages (login, onboarding, new post, new spot)
- `export const dynamic = "force-dynamic"` on server pages that hit Firestore (prevents build-time prerender errors)
- API routes use `getSession()` from `src/lib/auth.ts` to authenticate
- All Firestore operations go through typed helpers in `src/lib/firestore.ts`
- UI components live in `src/components/ui/` and are reused everywhere
- The landing page (`/`) shows a marketing site for unauthenticated visitors and the feed for logged-in users

## Environment Variables (.env.local)

```
FIREBASE_PROJECT_ID=barkbark-16f5b
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@barkbark-16f5b.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
JWT_SECRET=<random-string-at-least-32-chars>
```

## Commands

```bash
npm run dev     # Start dev server (Turbopack)
npm run build   # Production build
npm run lint    # ESLint
```
