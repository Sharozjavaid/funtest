import { readFileSync } from "fs";
import { resolve } from "path";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// ── Load .env.local manually (no dotenv dependency) ─────────────────────────
const envPath = resolve(__dirname, "../../.env.local");
const envFile = readFileSync(envPath, "utf-8");
const env: Record<string, string> = {};
for (const line of envFile.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let val = trimmed.slice(eqIdx + 1).trim();
  // strip surrounding quotes
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  env[key] = val;
}

// ── Initialize Firebase Admin ───────────────────────────────────────────────
const projectId = env.FIREBASE_PROJECT_ID;
const app = initializeApp({
  credential: cert({
    projectId,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore(app);

// ── Seed Data ───────────────────────────────────────────────────────────────

const USERS = [
  {
    id: "seed-user-1",
    email: "maria.santos@example.com",
    displayName: "Maria Santos",
    dogName: "Luna",
    dogBreed: "Labrador Mix",
    avatarUrl: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    id: "seed-user-2",
    email: "jake.thompson@example.com",
    displayName: "Jake Thompson",
    dogName: "Biscuit",
    dogBreed: "Corgi",
    avatarUrl: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    id: "seed-user-3",
    email: "priya.patel@example.com",
    displayName: "Priya Patel",
    dogName: "Koda",
    dogBreed: "Husky",
    avatarUrl: "https://images.pexels.com/photos/3726314/pexels-photo-3726314.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    id: "seed-user-4",
    email: "tyler.chen@example.com",
    displayName: "Tyler Chen",
    dogName: "Mochi",
    dogBreed: "Shiba Inu",
    avatarUrl: "https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    id: "seed-user-5",
    email: "aisha.williams@example.com",
    displayName: "Aisha Williams",
    dogName: "Duke",
    dogBreed: "German Shepherd",
    avatarUrl: "https://images.pexels.com/photos/333083/pexels-photo-333083.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    id: "seed-user-6",
    email: "ben.rodriguez@example.com",
    displayName: "Ben Rodriguez",
    dogName: "Churro",
    dogBreed: "Chihuahua Mix",
    avatarUrl: "https://images.pexels.com/photos/4148015/pexels-photo-4148015.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    id: "seed-user-7",
    email: "emma.larsen@example.com",
    displayName: "Emma Larsen",
    dogName: "Finn",
    dogBreed: "Golden Retriever",
    avatarUrl: "https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    id: "seed-user-8",
    email: "carlos.mendoza@example.com",
    displayName: "Carlos Mendoza",
    dogName: "Coco",
    dogBreed: "Poodle Mix",
    avatarUrl: "https://images.pexels.com/photos/1390784/pexels-photo-1390784.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    id: "seed-user-9",
    email: "sarah.kim@example.com",
    displayName: "Sarah Kim",
    dogName: "Bear",
    dogBreed: "Bernese Mountain Dog",
    avatarUrl: "https://images.pexels.com/photos/1562983/pexels-photo-1562983.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
  {
    id: "seed-user-10",
    email: "diego.vargas@example.com",
    displayName: "Diego Vargas",
    dogName: "Pepper",
    dogBreed: "Border Collie",
    avatarUrl: "https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
  },
];

const SPOTS = [
  {
    id: "seed-spot-1",
    name: "Fiesta Island Off-Leash Park",
    description: "The holy grail of off-leash in SD. Huge open space right on the water.",
    location: { lat: 32.7635, lng: -117.2230, name: "Fiesta Island Off-Leash Park" },
    createdBy: "seed-user-1",
    imageUrl: "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
  },
  {
    id: "seed-spot-2",
    name: "Dog Beach, Ocean Beach",
    description: "The OG dog beach. Leash-free, sandy, and always a good time.",
    location: { lat: 32.7489, lng: -117.2553, name: "Dog Beach, Ocean Beach" },
    createdBy: "seed-user-2",
    imageUrl: "https://images.pexels.com/photos/1612846/pexels-photo-1612846.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
  },
  {
    id: "seed-spot-3",
    name: "Balboa Park",
    description: "Miles of trails through gardens and canyons. Keep pups leashed but so worth it.",
    location: { lat: 32.7341, lng: -117.1446, name: "Balboa Park" },
    createdBy: "seed-user-3",
    imageUrl: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
  },
  {
    id: "seed-spot-4",
    name: "Kate Sessions Park",
    description: "Best views of the bay. Great open grass area for fetch.",
    location: { lat: 32.7690, lng: -117.2195, name: "Kate Sessions Park" },
    createdBy: "seed-user-7",
    imageUrl: "https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
  },
  {
    id: "seed-spot-5",
    name: "Grape Street Dog Park",
    description: "Neighborhood gem in South Park. Separate small dog area.",
    location: { lat: 32.7275, lng: -117.1376, name: "Grape Street Dog Park" },
    createdBy: "seed-user-6",
    imageUrl: "https://images.pexels.com/photos/1429734/pexels-photo-1429734.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
  },
  {
    id: "seed-spot-6",
    name: "Nate's Point Dog Park",
    description: "Shaded off-leash area right in Balboa Park. Gets busy on weekends.",
    location: { lat: 32.7358, lng: -117.1534, name: "Nate's Point Dog Park, Balboa Park" },
    createdBy: "seed-user-5",
    imageUrl: "https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
  },
  {
    id: "seed-spot-7",
    name: "Coronado Dog Beach",
    description: "North end of Coronado beach. Stunning views and chill vibes.",
    location: { lat: 32.6804, lng: -117.1824, name: "Coronado Dog Beach" },
    createdBy: "seed-user-4",
    imageUrl: "https://images.pexels.com/photos/1078981/pexels-photo-1078981.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
  },
  {
    id: "seed-spot-8",
    name: "Torrey Pines State Reserve",
    description: "Incredible coastal trail. Dogs on leash only but the views are unreal.",
    location: { lat: 32.9210, lng: -117.2542, name: "Torrey Pines State Reserve" },
    createdBy: "seed-user-3",
    imageUrl: "https://images.pexels.com/photos/1666012/pexels-photo-1666012.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
  },
  {
    id: "seed-spot-9",
    name: "Mission Bay Park",
    description: "Huge waterfront park. Great for long walks along the bay.",
    location: { lat: 32.7749, lng: -117.2320, name: "Mission Bay Park" },
    createdBy: "seed-user-8",
    imageUrl: "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
  },
  {
    id: "seed-spot-10",
    name: "Sunset Cliffs",
    description: "Dramatic ocean cliffs at golden hour. Not off-leash but beautiful.",
    location: { lat: 32.7195, lng: -117.2563, name: "Sunset Cliffs" },
    createdBy: "seed-user-9",
    imageUrl: "https://images.pexels.com/photos/1032651/pexels-photo-1032651.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
  },
  {
    id: "seed-spot-11",
    name: "Del Mar Dog Beach",
    description: "North of the powerplant. Dogs go wild here. Best at low tide.",
    location: { lat: 32.9622, lng: -117.2690, name: "Del Mar Dog Beach" },
    createdBy: "seed-user-10",
    imageUrl: "https://images.pexels.com/photos/1612846/pexels-photo-1612846.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
  },
  {
    id: "seed-spot-12",
    name: "Presidio Park",
    description: "Historic hilltop park with great trails and shade. Hidden gem.",
    location: { lat: 32.7608, lng: -117.1953, name: "Presidio Park" },
    createdBy: "seed-user-1",
    imageUrl: "https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop",
  },
];

// Deterministic random likes for each spot (3-15 likes)
const SPOT_LIKES: Record<string, string[]> = {
  "seed-spot-1": ["seed-user-1", "seed-user-2", "seed-user-3", "seed-user-5", "seed-user-7", "seed-user-8", "seed-user-9", "seed-user-10"],
  "seed-spot-2": ["seed-user-1", "seed-user-2", "seed-user-4", "seed-user-5", "seed-user-6", "seed-user-7", "seed-user-8", "seed-user-9", "seed-user-10"],
  "seed-spot-3": ["seed-user-1", "seed-user-3", "seed-user-5", "seed-user-7", "seed-user-9"],
  "seed-spot-4": ["seed-user-2", "seed-user-4", "seed-user-6", "seed-user-7", "seed-user-10"],
  "seed-spot-5": ["seed-user-1", "seed-user-5", "seed-user-6", "seed-user-8"],
  "seed-spot-6": ["seed-user-2", "seed-user-3", "seed-user-4", "seed-user-5", "seed-user-8", "seed-user-9"],
  "seed-spot-7": ["seed-user-1", "seed-user-3", "seed-user-4", "seed-user-6", "seed-user-7", "seed-user-8", "seed-user-9", "seed-user-10"],
  "seed-spot-8": ["seed-user-1", "seed-user-2", "seed-user-3", "seed-user-4", "seed-user-5", "seed-user-6", "seed-user-7", "seed-user-8", "seed-user-9", "seed-user-10"],
  "seed-spot-9": ["seed-user-2", "seed-user-5", "seed-user-9"],
  "seed-spot-10": ["seed-user-1", "seed-user-3", "seed-user-4", "seed-user-7", "seed-user-8", "seed-user-9", "seed-user-10"],
  "seed-spot-11": ["seed-user-1", "seed-user-2", "seed-user-3", "seed-user-5", "seed-user-6", "seed-user-7", "seed-user-10"],
  "seed-spot-12": ["seed-user-1", "seed-user-4", "seed-user-8"],
};

// ── Spot Comments ──────────────────────────────────────────────────────────

const SPOT_COMMENTS: { spotId: string; userId: string; content: string }[] = [
  // Fiesta Island (seed-spot-1) — 5 comments
  { spotId: "seed-spot-1", userId: "seed-user-1", content: "Best spot in SD hands down. Luna goes absolutely nuts here" },
  { spotId: "seed-spot-1", userId: "seed-user-2", content: "Went at 7am on a Saturday and it was perfect. Not too crowded" },
  { spotId: "seed-spot-1", userId: "seed-user-7", content: "Finn loves the water here. We come back every single week" },
  { spotId: "seed-spot-1", userId: "seed-user-8", content: "Pro tip: bring extra water, there's not much shade" },
  { spotId: "seed-spot-1", userId: "seed-user-10", content: "Pepper ran for 45 minutes straight. She slept the whole car ride home" },

  // Dog Beach OB (seed-spot-2) — 5 comments
  { spotId: "seed-spot-2", userId: "seed-user-6", content: "We come here every weekend! Churro has his own friend group now lol" },
  { spotId: "seed-spot-2", userId: "seed-user-1", content: "Sunset sessions here are unbeatable. Luna chases seagulls the whole time" },
  { spotId: "seed-spot-2", userId: "seed-user-4", content: "Water access is great here. Mochi actually swam for the first time!" },
  { spotId: "seed-spot-2", userId: "seed-user-9", content: "Gets a little crowded on weekends but worth it. Bear loves it" },
  { spotId: "seed-spot-2", userId: "seed-user-5", content: "My fav off-leash area. Duke can run free and I don't stress" },

  // Balboa Park (seed-spot-3) — 4 comments
  { spotId: "seed-spot-3", userId: "seed-user-3", content: "The canyon trails are incredible. Koda and I explore new ones every time" },
  { spotId: "seed-spot-3", userId: "seed-user-7", content: "Just discovered the east side trails last month. Game changer for our morning routine" },
  { spotId: "seed-spot-3", userId: "seed-user-1", content: "So many good paths. Only downside is leash-only but totally worth it" },
  { spotId: "seed-spot-3", userId: "seed-user-10", content: "Early mornings here before the tourists are the best. Pepper loves it" },

  // Kate Sessions (seed-spot-4) — 4 comments
  { spotId: "seed-spot-4", userId: "seed-user-2", content: "The views are insane. Best walk I've done in San Diego" },
  { spotId: "seed-spot-4", userId: "seed-user-7", content: "Finn could play fetch here all day. The grass area is huge" },
  { spotId: "seed-spot-4", userId: "seed-user-4", content: "Go right before sunset for the best views of the bay. Trust me" },
  { spotId: "seed-spot-4", userId: "seed-user-6", content: "Perfect after-work spot. Not too far from downtown" },

  // Grape Street (seed-spot-5) — 4 comments
  { spotId: "seed-spot-5", userId: "seed-user-6", content: "Love that they have a separate area for small dogs. Churro thanks you" },
  { spotId: "seed-spot-5", userId: "seed-user-5", content: "New water fountains are a game changer. Duke approves" },
  { spotId: "seed-spot-5", userId: "seed-user-8", content: "Great neighborhood park. Coco always has a blast here" },
  { spotId: "seed-spot-5", userId: "seed-user-1", content: "Gets muddy after rain but worth it. Bring towels for the car ride home" },

  // Nate's Point (seed-spot-6) — 3 comments
  { spotId: "seed-spot-6", userId: "seed-user-5", content: "This is our after-work spot. Duke decompresses and so do I" },
  { spotId: "seed-spot-6", userId: "seed-user-4", content: "Mochi made 3 new friends here today. He's usually so shy!" },
  { spotId: "seed-spot-6", userId: "seed-user-9", content: "Good shade which is rare for a dog park. Bear overheats easily so this is perfect" },

  // Coronado (seed-spot-7) — 4 comments
  { spotId: "seed-spot-7", userId: "seed-user-4", content: "Stunning beach. Mochi found like 10 tennis balls buried in the sand" },
  { spotId: "seed-spot-7", userId: "seed-user-6", content: "Quick evening walk here with Churro. He may be small but he has BIG beach energy" },
  { spotId: "seed-spot-7", userId: "seed-user-10", content: "Low tide is the move. So much more beach to explore" },
  { spotId: "seed-spot-7", userId: "seed-user-3", content: "Took Koda here for the first time and he just stood there staring at the waves lol" },

  // Torrey Pines (seed-spot-8) — 4 comments
  { spotId: "seed-spot-8", userId: "seed-user-3", content: "Morning fog here is magical. Had the whole trail to ourselves" },
  { spotId: "seed-spot-8", userId: "seed-user-2", content: "Biscuit's little corgi legs were NOT built for this trail but he gave it 110%" },
  { spotId: "seed-spot-8", userId: "seed-user-1", content: "Best coastal views in San Diego. Keep dogs leashed but so worth the hike" },
  { spotId: "seed-spot-8", userId: "seed-user-9", content: "Bring lots of water. The trail is exposed and it gets warm. Bear was panting by the end" },

  // Mission Bay (seed-spot-9) — 3 comments
  { spotId: "seed-spot-9", userId: "seed-user-8", content: "3 mile loop along the water. Coco was passed out the rest of the day" },
  { spotId: "seed-spot-9", userId: "seed-user-9", content: "Beautiful but bring water, there's not a lot of shade on the north loop" },
  { spotId: "seed-spot-9", userId: "seed-user-2", content: "Great for a long walk. Biscuit loves watching the boats" },

  // Sunset Cliffs (seed-spot-10) — 3 comments
  { spotId: "seed-spot-10", userId: "seed-user-10", content: "Golden hour here is something else. This city man..." },
  { spotId: "seed-spot-10", userId: "seed-user-7", content: "Not off-leash but honestly the views make up for it. Finn didn't mind" },
  { spotId: "seed-spot-10", userId: "seed-user-1", content: "Dramatic cliffs and amazing sunsets. Just be careful near the edges with your pup" },

  // Del Mar (seed-spot-11) — 4 comments
  { spotId: "seed-spot-11", userId: "seed-user-9", content: "Bear vs. the waves. Spoiler: the waves won. Every single time" },
  { spotId: "seed-spot-11", userId: "seed-user-10", content: "Low tide here is a whole different beach. Pepper ran so far I lost sight of her" },
  { spotId: "seed-spot-11", userId: "seed-user-2", content: "Great for dogs who love to swim. Biscuit was in heaven" },
  { spotId: "seed-spot-11", userId: "seed-user-5", content: "Duke found the biggest stick I've ever seen here. He was SO proud of himself" },

  // Presidio Park (seed-spot-12) — 3 comments
  { spotId: "seed-spot-12", userId: "seed-user-8", content: "Found an amazing shaded trail I never knew about. Seriously underrated spot" },
  { spotId: "seed-spot-12", userId: "seed-user-1", content: "Hidden gem! Luna and I had the whole trail to ourselves on a Tuesday morning" },
  { spotId: "seed-spot-12", userId: "seed-user-4", content: "Nice mix of sun and shade. Mochi doesn't do well in heat so this is perfect for us" },
];

const POST_IMAGES = [
  "https://images.pexels.com/photos/5326902/pexels-photo-5326902.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/4969859/pexels-photo-4969859.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/2759564/pexels-photo-2759564.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/4554292/pexels-photo-4554292.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/20184431/pexels-photo-20184431.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/4005096/pexels-photo-4005096.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/9329558/pexels-photo-9329558.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/19138890/pexels-photo-19138890.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/4504343/pexels-photo-4504343.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/29134542/pexels-photo-29134542.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/16876005/pexels-photo-16876005.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/3726314/pexels-photo-3726314.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/1562983/pexels-photo-1562983.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
];

// Helper: generate a date N days ago at a random hour
function daysAgo(days: number, hour?: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour ?? Math.floor(Math.random() * 14) + 6, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
}

const POSTS = [
  {
    id: "seed-post-1",
    userId: "seed-user-1",
    content: "Sunset walk at Dog Beach and Luna absolutely lost her mind chasing seagulls. Best way to end a Wednesday",
    imageUrl: POST_IMAGES[0],
    location: { lat: 32.7489, lng: -117.2553, name: "Dog Beach, Ocean Beach" },
    createdAt: daysAgo(1, 17),
  },
  {
    id: "seed-post-2",
    userId: "seed-user-2",
    content: "First time taking Biscuit to Fiesta Island and wow, why did we wait so long?? He ran for like 45 minutes straight",
    imageUrl: POST_IMAGES[1],
    location: { lat: 32.7635, lng: -117.2230, name: "Fiesta Island Off-Leash Park" },
    createdAt: daysAgo(1, 10),
  },
  {
    id: "seed-post-3",
    userId: "seed-user-3",
    content: "Morning fog at Torrey Pines with Koda. Had the whole trail to ourselves. This is why we moved to SD",
    imageUrl: POST_IMAGES[2],
    location: { lat: 32.9210, lng: -117.2542, name: "Torrey Pines State Reserve" },
    createdAt: daysAgo(2, 7),
  },
  {
    id: "seed-post-4",
    userId: "seed-user-6",
    content: "Anyone else's dog refuse to leave Dog Beach? Had to literally carry Churro to the car lol",
    imageUrl: POST_IMAGES[3],
    location: { lat: 32.7489, lng: -117.2553, name: "Dog Beach, Ocean Beach" },
    createdAt: daysAgo(2, 16),
  },
  {
    id: "seed-post-5",
    userId: "seed-user-5",
    content: "PSA: Grape Street dog park just got new water fountains installed! Finally",
    imageUrl: "",
    location: { lat: 32.7275, lng: -117.1376, name: "Grape Street Dog Park" },
    createdAt: daysAgo(3, 12),
  },
  {
    id: "seed-post-6",
    userId: "seed-user-10",
    content: "Coronado at low tide hits different. Pepper found approximately 47 tennis balls buried in the sand",
    imageUrl: POST_IMAGES[4],
    location: { lat: 32.6804, lng: -117.1824, name: "Coronado Dog Beach" },
    createdAt: daysAgo(3, 15),
  },
  {
    id: "seed-post-7",
    userId: "seed-user-7",
    content: "Golden hour at Kate Sessions with Finn. The bay views from up there are just unbeatable. We stayed until the sun went down",
    imageUrl: POST_IMAGES[5],
    location: { lat: 32.7690, lng: -117.2195, name: "Kate Sessions Park" },
    createdAt: daysAgo(4, 18),
  },
  {
    id: "seed-post-8",
    userId: "seed-user-4",
    content: "Mochi made 3 new friends at Nate's Point today. He's usually so shy but something about that park just brings it out of him",
    imageUrl: POST_IMAGES[6],
    location: { lat: 32.7358, lng: -117.1534, name: "Nate's Point Dog Park, Balboa Park" },
    createdAt: daysAgo(4, 11),
  },
  {
    id: "seed-post-9",
    userId: "seed-user-9",
    content: "Bear vs. the waves at Del Mar. Spoiler: the waves won. Every single time. He just kept going back for more though",
    imageUrl: POST_IMAGES[7],
    location: { lat: 32.9622, lng: -117.2690, name: "Del Mar Dog Beach" },
    createdAt: daysAgo(5, 9),
  },
  {
    id: "seed-post-10",
    userId: "seed-user-8",
    content: "Found this amazing shaded trail in Presidio Park that I never knew about. Coco and I had it all to ourselves. Seriously underrated spot",
    imageUrl: POST_IMAGES[8],
    location: { lat: 32.7608, lng: -117.1953, name: "Presidio Park" },
    createdAt: daysAgo(5, 14),
  },
  {
    id: "seed-post-11",
    userId: "seed-user-1",
    content: "Saturday morning at Fiesta Island is just chef's kiss. Luna swam for the first time today!!!! I'm a proud dog mom",
    imageUrl: POST_IMAGES[9],
    location: { lat: 32.7635, lng: -117.2230, name: "Fiesta Island Off-Leash Park" },
    createdAt: daysAgo(6, 8),
  },
  {
    id: "seed-post-12",
    userId: "seed-user-3",
    content: "Balboa Park in the early morning before the crowds. Koda loves the canyon trails. Pro tip: start from the east side for the best route",
    imageUrl: POST_IMAGES[10],
    location: { lat: 32.7341, lng: -117.1446, name: "Balboa Park" },
    createdAt: daysAgo(7, 6),
  },
  {
    id: "seed-post-13",
    userId: "seed-user-5",
    content: "Duke absolutely dominated the agility course someone set up at Grape Street. My boy is an athlete and I will not hear otherwise",
    imageUrl: POST_IMAGES[11],
    location: { lat: 32.7275, lng: -117.1376, name: "Grape Street Dog Park" },
    createdAt: daysAgo(7, 15),
  },
  {
    id: "seed-post-14",
    userId: "seed-user-2",
    content: "Biscuit's little legs were NOT built for the Torrey Pines trail but he gave it 110%. We made it halfway and called it a win",
    imageUrl: POST_IMAGES[12],
    location: { lat: 32.9210, lng: -117.2542, name: "Torrey Pines State Reserve" },
    createdAt: daysAgo(8, 10),
  },
  {
    id: "seed-post-15",
    userId: "seed-user-10",
    content: "Sunset Cliffs at golden hour with Pepper. No off-leash but honestly the views make up for it. This city man...",
    imageUrl: POST_IMAGES[13],
    location: { lat: 32.7195, lng: -117.2563, name: "Sunset Cliffs" },
    createdAt: daysAgo(9, 18),
  },
  {
    id: "seed-post-16",
    userId: "seed-user-4",
    content: "Mission Bay loop with Mochi this morning. About 3 miles along the water. He was passed out the rest of the day lol",
    imageUrl: POST_IMAGES[14],
    location: { lat: 32.7749, lng: -117.2320, name: "Mission Bay Park" },
    createdAt: daysAgo(9, 7),
  },
  {
    id: "seed-post-17",
    userId: "seed-user-7",
    content: "Ran into the cutest puppy meetup group at Dog Beach. Finn was in HEAVEN. Like 15 goldens all in one spot. If you know you know",
    imageUrl: POST_IMAGES[0],
    location: { lat: 32.7489, lng: -117.2553, name: "Dog Beach, Ocean Beach" },
    createdAt: daysAgo(10, 16),
  },
  {
    id: "seed-post-18",
    userId: "seed-user-6",
    content: "Quick evening walk at Coronado with Churro. He may be small but he has BIG beach energy. Dude was zooming everywhere",
    imageUrl: POST_IMAGES[3],
    location: { lat: 32.6804, lng: -117.1824, name: "Coronado Dog Beach" },
    createdAt: daysAgo(11, 17),
  },
  {
    id: "seed-post-19",
    userId: "seed-user-9",
    content: "Bear and I tried the north loop at Mission Bay today. Beautiful but bring water, there's not a lot of shade on that stretch",
    imageUrl: "",
    location: { lat: 32.7749, lng: -117.2320, name: "Mission Bay Park" },
    createdAt: daysAgo(12, 9),
  },
  {
    id: "seed-post-20",
    userId: "seed-user-8",
    content: "Early Sunday at Fiesta Island. Coco went absolutely bonkers in the shallow water. Pretty sure she thinks she's a seal now",
    imageUrl: POST_IMAGES[1],
    location: { lat: 32.7635, lng: -117.2230, name: "Fiesta Island Off-Leash Park" },
    createdAt: daysAgo(13, 8),
  },
  {
    id: "seed-post-21",
    userId: "seed-user-1",
    content: "Rainy day walk at Balboa Park. Luna didn't mind at all, she was splashing through every puddle. We were both soaked by the end lol",
    imageUrl: "",
    location: { lat: 32.7341, lng: -117.1446, name: "Balboa Park" },
    createdAt: daysAgo(14, 11),
  },
  {
    id: "seed-post-22",
    userId: "seed-user-10",
    content: "Del Mar at low tide is a whole different beach. Pepper ran so far I lost sight of her for a sec. She came back with the biggest stick I've ever seen",
    imageUrl: POST_IMAGES[7],
    location: { lat: 32.9622, lng: -117.2690, name: "Del Mar Dog Beach" },
    createdAt: daysAgo(15, 10),
  },
  {
    id: "seed-post-23",
    userId: "seed-user-5",
    content: "Taking Duke to Nate's Point after work has become our thing. Great way to decompress. He just runs and runs and I sit on the bench and breathe",
    imageUrl: POST_IMAGES[6],
    location: { lat: 32.7358, lng: -117.1534, name: "Nate's Point Dog Park, Balboa Park" },
    createdAt: daysAgo(16, 17),
  },
  {
    id: "seed-post-24",
    userId: "seed-user-2",
    content: "Kate Sessions Park pro tip: go right before sunset. The whole bay lights up and there's usually a nice breeze. Biscuit approved",
    imageUrl: POST_IMAGES[5],
    location: { lat: 32.7690, lng: -117.2195, name: "Kate Sessions Park" },
    createdAt: daysAgo(17, 18),
  },
  {
    id: "seed-post-25",
    userId: "seed-user-3",
    content: "Weekend hike at Torrey Pines with the whole crew. Koda was so tired he fell asleep in the car before we even left the parking lot",
    imageUrl: POST_IMAGES[2],
    location: { lat: 32.9210, lng: -117.2542, name: "Torrey Pines State Reserve" },
    createdAt: daysAgo(18, 8),
  },
];

// ── Post Comments ──────────────────────────────────────────────────────────

const POST_COMMENTS: { postId: string; userId: string; content: string }[] = [
  // seed-post-1 — Luna chasing seagulls at Dog Beach (3 comments)
  { postId: "seed-post-1", userId: "seed-user-7", content: "omg Luna is the cutest!! 😍" },
  { postId: "seed-post-1", userId: "seed-user-6", content: "haha Churro is such a character at Dog Beach too" },
  { postId: "seed-post-1", userId: "seed-user-3", content: "that sunset tho 🔥" },

  // seed-post-2 — Biscuit at Fiesta Island (3 comments)
  { postId: "seed-post-2", userId: "seed-user-1", content: "Fiesta Island is literally the best. Luna goes crazy there every time" },
  { postId: "seed-post-2", userId: "seed-user-5", content: "how's parking there? been meaning to check it out" },
  { postId: "seed-post-2", userId: "seed-user-7", content: "Finn says hi from across the internet 🐾" },

  // seed-post-3 — Koda at Torrey Pines (2 comments)
  { postId: "seed-post-3", userId: "seed-user-9", content: "looks amazing, adding to our list!" },
  { postId: "seed-post-3", userId: "seed-user-2", content: "love this trail. we go every morning" },

  // seed-post-4 — Churro refusing to leave Dog Beach (4 comments)
  { postId: "seed-post-4", userId: "seed-user-1", content: "Luna does the same thing!! I swear she pretends she can't hear me" },
  { postId: "seed-post-4", userId: "seed-user-4", content: "Mochi just sits down and refuses to move lol" },
  { postId: "seed-post-4", userId: "seed-user-10", content: "Pepper would try to herd everyone lol" },
  { postId: "seed-post-4", userId: "seed-user-7", content: "we were there last weekend too! small world" },

  // seed-post-5 — Grape Street water fountains (2 comments)
  { postId: "seed-post-5", userId: "seed-user-6", content: "finally!! Churro thanks whoever made that happen" },
  { postId: "seed-post-5", userId: "seed-user-8", content: "Biscuit approves of this spot 10/10" },

  // seed-post-6 — Coronado low tide (3 comments)
  { postId: "seed-post-6", userId: "seed-user-4", content: "Mochi found like 10 tennis balls there too! what is it about that beach" },
  { postId: "seed-post-6", userId: "seed-user-3", content: "Koda would lose his mind here" },
  { postId: "seed-post-6", userId: "seed-user-7", content: "this is why San Diego is the best dog city" },

  // seed-post-7 — Kate Sessions golden hour (3 comments)
  { postId: "seed-post-7", userId: "seed-user-2", content: "the views from up there are insane. Biscuit approved 🐶" },
  { postId: "seed-post-7", userId: "seed-user-9", content: "jealous!! need to get Duke out more" },
  { postId: "seed-post-7", userId: "seed-user-1", content: "we need to do a group walk here sometime" },

  // seed-post-8 — Mochi at Nate's Point (2 comments)
  { postId: "seed-post-8", userId: "seed-user-5", content: "what time do you usually go? want to avoid crowds" },
  { postId: "seed-post-8", userId: "seed-user-3", content: "that's so sweet! Koda is shy too but he's getting better" },

  // seed-post-9 — Bear vs waves at Del Mar (3 comments)
  { postId: "seed-post-9", userId: "seed-user-10", content: "haha Pepper does the same thing. they never learn 😂" },
  { postId: "seed-post-9", userId: "seed-user-1", content: "Luna would be right there with him. solidarity!" },
  { postId: "seed-post-9", userId: "seed-user-6", content: "Churro refuses to go in the water. he just barks at it from the shore" },

  // seed-post-11 — Luna swam for first time (3 comments)
  { postId: "seed-post-11", userId: "seed-user-7", content: "proud dog mom moment!! Finn learned to swim at Fiesta too" },
  { postId: "seed-post-11", userId: "seed-user-3", content: "congrats Luna!! 🎉 Koda still won't go past his knees" },
  { postId: "seed-post-11", userId: "seed-user-8", content: "Coco was the same way. then one day she just went for it" },

  // seed-post-13 — Duke agility course (2 comments)
  { postId: "seed-post-13", userId: "seed-user-10", content: "Pepper would try to herd everyone through the course lol" },
  { postId: "seed-post-13", userId: "seed-user-2", content: "meanwhile Biscuit would just sit there and watch 😂" },

  // seed-post-14 — Biscuit at Torrey Pines (3 comments)
  { postId: "seed-post-14", userId: "seed-user-6", content: "haha those little corgi legs!! Churro would never make it" },
  { postId: "seed-post-14", userId: "seed-user-3", content: "love this trail. the fog in the morning is magical" },
  { postId: "seed-post-14", userId: "seed-user-9", content: "Bear made it the whole way but was DONE after. slept for 12 hours" },

  // seed-post-17 — Golden puppy meetup at Dog Beach (3 comments)
  { postId: "seed-post-17", userId: "seed-user-1", content: "15 goldens in one spot?? Luna would have lost her mind" },
  { postId: "seed-post-17", userId: "seed-user-8", content: "we need to organize a BarkBoard meetup! this is amazing" },
  { postId: "seed-post-17", userId: "seed-user-5", content: "Duke would just try to play with all of them at once" },

  // seed-post-20 — Coco at Fiesta Island (2 comments)
  { postId: "seed-post-20", userId: "seed-user-1", content: "Sunday morning Fiesta Island crew!! we were probably there at the same time" },
  { postId: "seed-post-20", userId: "seed-user-4", content: "Mochi thinks he's a seal too 😂 must be something in the water" },

  // seed-post-22 — Pepper at Del Mar low tide (2 comments)
  { postId: "seed-post-22", userId: "seed-user-9", content: "Bear found the biggest stick there too! they must hide them at low tide" },
  { postId: "seed-post-22", userId: "seed-user-7", content: "low tide Del Mar is unbeatable. adding this to our weekend plans" },

  // seed-post-24 — Kate Sessions sunset pro tip (3 comments)
  { postId: "seed-post-24", userId: "seed-user-7", content: "noted!! Finn and I will try this week" },
  { postId: "seed-post-24", userId: "seed-user-10", content: "this is why San Diego is the best dog city" },
  { postId: "seed-post-24", userId: "seed-user-4", content: "Mochi says thanks for the pro tip 🐕" },

  // seed-post-25 — Koda at Torrey Pines weekend hike (2 comments)
  { postId: "seed-post-25", userId: "seed-user-2", content: "sleeping in the parking lot is the highest compliment a dog can give a trail" },
  { postId: "seed-post-25", userId: "seed-user-5", content: "jealous!! need to get Duke out there soon" },
];

// ── Seed Functions ──────────────────────────────────────────────────────────

async function seedUsers() {
  console.log("\n--- Seeding Users ---");
  const batch = db.batch();
  for (const user of USERS) {
    const ref = db.collection("users").doc(user.id);
    batch.set(ref, {
      email: user.email,
      displayName: user.displayName,
      dogName: user.dogName,
      dogBreed: user.dogBreed,
      avatarUrl: user.avatarUrl,
      createdAt: daysAgo(30 + Math.floor(Math.random() * 30)),
    });
    console.log(`  + User: ${user.displayName} (${user.dogName} the ${user.dogBreed})`);
  }
  await batch.commit();
  console.log(`  Wrote ${USERS.length} users`);
}

async function seedSpots() {
  console.log("\n--- Seeding Spots ---");
  const batch = db.batch();
  for (const spot of SPOTS) {
    const likers = SPOT_LIKES[spot.id] || [];
    const ref = db.collection("spots").doc(spot.id);
    batch.set(ref, {
      name: spot.name,
      description: spot.description,
      location: spot.location,
      imageUrl: spot.imageUrl,
      likeCount: likers.length,
      createdBy: spot.createdBy,
      createdAt: daysAgo(20 + Math.floor(Math.random() * 20)),
    });
    console.log(`  + Spot: ${spot.name} (${likers.length} likes)`);
  }
  await batch.commit();
  console.log(`  Wrote ${SPOTS.length} spots`);

  // Now write likes subcollections
  console.log("\n--- Seeding Spot Likes ---");
  let likeCount = 0;
  for (const spot of SPOTS) {
    const likers = SPOT_LIKES[spot.id] || [];
    // Batch likes per spot (Firestore batch limit is 500, we're well under)
    const batch = db.batch();
    for (const userId of likers) {
      const likeRef = db.collection("spots").doc(spot.id).collection("likes").doc(userId);
      batch.set(likeRef, { likedAt: daysAgo(Math.floor(Math.random() * 15)) });
      likeCount++;
    }
    await batch.commit();
  }
  console.log(`  Wrote ${likeCount} spot likes`);
}

async function seedSpotComments() {
  console.log("\n--- Seeding Spot Comments ---");
  let commentCount = 0;

  // Group comments by spotId for batching
  const commentsBySpot = new Map<string, typeof SPOT_COMMENTS>();
  for (const comment of SPOT_COMMENTS) {
    const existing = commentsBySpot.get(comment.spotId) || [];
    existing.push(comment);
    commentsBySpot.set(comment.spotId, existing);
  }

  for (const [spotId, comments] of commentsBySpot) {
    const batch = db.batch();
    comments.forEach((comment, idx) => {
      const commentId = `seed-comment-${spotId}-${idx + 1}`;
      const ref = db.collection("spots").doc(spotId).collection("comments").doc(commentId);
      batch.set(ref, {
        spotId: comment.spotId,
        userId: comment.userId,
        content: comment.content,
        createdAt: daysAgo(Math.floor(Math.random() * 14) + 1, Math.floor(Math.random() * 14) + 6),
      });
      commentCount++;
    });
    await batch.commit();
    const spotName = SPOTS.find(s => s.id === spotId)?.name;
    console.log(`  + ${comments.length} comments on "${spotName}"`);
  }

  console.log(`  Wrote ${commentCount} spot comments`);
}

async function seedPosts() {
  console.log("\n--- Seeding Posts ---");
  // Pre-compute comment counts per post
  const commentCountByPost = new Map<string, number>();
  for (const comment of POST_COMMENTS) {
    commentCountByPost.set(comment.postId, (commentCountByPost.get(comment.postId) || 0) + 1);
  }

  const batch = db.batch();
  for (const post of POSTS) {
    const ref = db.collection("posts").doc(post.id);
    const commentCount = commentCountByPost.get(post.id) || 0;
    batch.set(ref, {
      userId: post.userId,
      content: post.content,
      imageUrl: post.imageUrl,
      location: post.location,
      createdAt: post.createdAt,
      commentCount,
    });
    // Find user name for logging
    const user = USERS.find((u) => u.id === post.userId);
    const preview = post.content.length > 60 ? post.content.slice(0, 60) + "..." : post.content;
    console.log(`  + Post by ${user?.displayName}: "${preview}" (${commentCount} comments)`);
  }
  await batch.commit();
  console.log(`  Wrote ${POSTS.length} posts`);
}

async function seedPostComments() {
  console.log("\n--- Seeding Post Comments ---");
  let commentCount = 0;

  // Group comments by postId for batching
  const commentsByPost = new Map<string, typeof POST_COMMENTS>();
  for (const comment of POST_COMMENTS) {
    const existing = commentsByPost.get(comment.postId) || [];
    existing.push(comment);
    commentsByPost.set(comment.postId, existing);
  }

  for (const [postId, comments] of commentsByPost) {
    const batch = db.batch();
    comments.forEach((comment, idx) => {
      const commentId = `seed-pcomment-${postId}-${idx + 1}`;
      const ref = db.collection("posts").doc(postId).collection("comments").doc(commentId);
      batch.set(ref, {
        postId: comment.postId,
        userId: comment.userId,
        content: comment.content,
        createdAt: daysAgo(Math.floor(Math.random() * 14) + 1, Math.floor(Math.random() * 14) + 6),
      });
      commentCount++;
    });
    await batch.commit();
    const postPreview = POSTS.find(p => p.id === postId)?.content.slice(0, 40);
    console.log(`  + ${comments.length} comments on "${postPreview}..."`);
  }

  console.log(`  Wrote ${commentCount} post comments`);
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== BarkBoard Seed Script ===");
  console.log(`Project: ${projectId}`);
  console.log(`Seeding ${USERS.length} users, ${SPOTS.length} spots, ${POSTS.length} posts, ${SPOT_COMMENTS.length} spot comments, ${POST_COMMENTS.length} post comments\n`);

  try {
    await seedUsers();
    await seedSpots();
    await seedSpotComments();
    await seedPosts();
    await seedPostComments();

    console.log("\n=== Seed Complete! ===");
    console.log(`  Users:         ${USERS.length}`);
    console.log(`  Spots:         ${SPOTS.length}`);
    console.log(`  Posts:         ${POSTS.length}`);
    console.log(`  Likes:         ${Object.values(SPOT_LIKES).flat().length}`);
    console.log(`  Spot Comments: ${SPOT_COMMENTS.length}`);
    console.log(`  Post Comments: ${POST_COMMENTS.length}`);
    console.log("\nAll documents use 'seed-' prefixed IDs. Re-running will overwrite, not duplicate.");
  } catch (err) {
    console.error("\nSeed failed:", err);
    process.exit(1);
  }
}

main();
