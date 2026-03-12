import { getDb } from "./firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import type { User, Post, Spot, SpotComment, PostComment } from "@/types";

const db = () => getDb();

// ── Users ──

export async function getUserById(uid: string): Promise<User | null> {
  const doc = await db().collection("users").doc(uid).get();
  if (!doc.exists) return null;
  return { uid: doc.id, ...doc.data() } as User;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const snap = await db()
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { uid: doc.id, ...doc.data() } as User;
}

export async function createUser(email: string): Promise<User> {
  const ref = db().collection("users").doc();
  const user: Omit<User, "uid"> = {
    email,
    displayName: email.split("@")[0],
    dogName: "",
    dogBreed: "",
    avatarUrl: "",
    createdAt: new Date().toISOString(),
  };
  await ref.set(user);
  return { uid: ref.id, ...user };
}

export async function updateUser(
  uid: string,
  data: Partial<Pick<User, "displayName" | "dogName" | "dogBreed" | "avatarUrl">>
): Promise<void> {
  await db().collection("users").doc(uid).update(data);
}

// ── Posts ──

export async function createPost(data: {
  userId: string;
  content: string;
  imageUrl: string;
  location: Post["location"];
}): Promise<Post> {
  const ref = db().collection("posts").doc();
  const post = {
    ...data,
    createdAt: new Date().toISOString(),
  };
  await ref.set(post);
  return { id: ref.id, ...post };
}

export async function getPosts(options?: {
  cursor?: string;
  limit?: number;
  userId?: string;
}): Promise<{ posts: Post[]; nextCursor: string | null }> {
  const limit = options?.limit ?? 20;
  let query = db()
    .collection("posts")
    .orderBy("createdAt", "desc")
    .limit(limit + 1);

  if (options?.userId) {
    query = db()
      .collection("posts")
      .where("userId", "==", options.userId)
      .orderBy("createdAt", "desc")
      .limit(limit + 1);
  }

  if (options?.cursor) {
    const cursorDoc = await db().collection("posts").doc(options.cursor).get();
    if (cursorDoc.exists) {
      query = query.startAfter(cursorDoc);
    }
  }

  const snap = await query.get();
  const docs = snap.docs;
  const hasMore = docs.length > limit;
  const posts = docs.slice(0, limit).map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Post
  );

  // Hydrate user data
  const userIds = [...new Set(posts.map((p) => p.userId))];
  const users = await Promise.all(userIds.map(getUserById));
  const userMap = new Map(users.filter(Boolean).map((u) => [u!.uid, u!]));
  for (const post of posts) {
    post.user = userMap.get(post.userId) ?? undefined;
  }

  return {
    posts,
    nextCursor: hasMore ? docs[limit - 1].id : null,
  };
}

// ── Spots ──

export async function createSpot(data: {
  name: string;
  description: string;
  location: Spot["location"];
  createdBy: string;
  imageUrl?: string;
}): Promise<Spot> {
  const ref = db().collection("spots").doc();
  const spot = {
    ...data,
    imageUrl: data.imageUrl || "",
    likeCount: 0,
    createdAt: new Date().toISOString(),
  };
  await ref.set(spot);
  return { id: ref.id, ...spot };
}

export async function getSpots(): Promise<Spot[]> {
  const snap = await db()
    .collection("spots")
    .orderBy("likeCount", "desc")
    .limit(50)
    .get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Spot);
}

export async function toggleSpotLike(
  spotId: string,
  uid: string
): Promise<{ liked: boolean; likeCount: number }> {
  const spotRef = db().collection("spots").doc(spotId);
  const likeRef = spotRef.collection("likes").doc(uid);

  return db().runTransaction(async (tx) => {
    const likeDoc = await tx.get(likeRef);
    const spotDoc = await tx.get(spotRef);
    if (!spotDoc.exists) throw new Error("Spot not found");

    const currentCount = spotDoc.data()!.likeCount ?? 0;

    if (likeDoc.exists) {
      tx.delete(likeRef);
      tx.update(spotRef, { likeCount: Math.max(0, currentCount - 1) });
      return { liked: false, likeCount: Math.max(0, currentCount - 1) };
    } else {
      tx.set(likeRef, { likedAt: new Date().toISOString() });
      tx.update(spotRef, { likeCount: currentCount + 1 });
      return { liked: true, likeCount: currentCount + 1 };
    }
  });
}

export async function getSpotLikedByUser(
  spotId: string,
  uid: string
): Promise<boolean> {
  const doc = await db()
    .collection("spots")
    .doc(spotId)
    .collection("likes")
    .doc(uid)
    .get();
  return doc.exists;
}

export async function getSpotById(spotId: string): Promise<Spot | null> {
  const doc = await db().collection("spots").doc(spotId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Spot;
}

export async function createSpotComment(data: {
  spotId: string;
  userId: string;
  content: string;
}): Promise<SpotComment> {
  const ref = db()
    .collection("spots")
    .doc(data.spotId)
    .collection("comments")
    .doc();
  const comment = {
    spotId: data.spotId,
    userId: data.userId,
    content: data.content,
    createdAt: new Date().toISOString(),
  };
  await ref.set(comment);
  return { id: ref.id, ...comment };
}

export async function getSpotComments(spotId: string): Promise<SpotComment[]> {
  const snap = await db()
    .collection("spots")
    .doc(spotId)
    .collection("comments")
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();

  const comments = snap.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as SpotComment
  );

  // Hydrate user data
  const userIds = [...new Set(comments.map((c) => c.userId))];
  const users = await Promise.all(userIds.map(getUserById));
  const userMap = new Map(users.filter(Boolean).map((u) => [u!.uid, u!]));
  for (const comment of comments) {
    comment.user = userMap.get(comment.userId) ?? undefined;
  }

  return comments;
}

// ── Post Comments ──

export async function getPostById(postId: string): Promise<Post | null> {
  const doc = await db().collection("posts").doc(postId).get();
  if (!doc.exists) return null;
  const post = { id: doc.id, ...doc.data() } as Post;
  post.commentCount = post.commentCount ?? 0;
  // Hydrate user data
  if (post.userId) {
    post.user = (await getUserById(post.userId)) ?? undefined;
  }
  return post;
}

export async function createPostComment(data: {
  postId: string;
  userId: string;
  content: string;
}): Promise<PostComment> {
  const ref = db()
    .collection("posts")
    .doc(data.postId)
    .collection("comments")
    .doc();
  const comment = {
    postId: data.postId,
    userId: data.userId,
    content: data.content,
    createdAt: new Date().toISOString(),
  };
  await ref.set(comment);

  // Increment commentCount on the post document
  await db()
    .collection("posts")
    .doc(data.postId)
    .update({ commentCount: FieldValue.increment(1) });

  return { id: ref.id, ...comment };
}

export async function getPostComments(postId: string): Promise<PostComment[]> {
  const snap = await db()
    .collection("posts")
    .doc(postId)
    .collection("comments")
    .orderBy("createdAt", "asc")
    .limit(100)
    .get();

  const comments = snap.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as PostComment
  );

  // Hydrate user data
  const userIds = [...new Set(comments.map((c) => c.userId))];
  const users = await Promise.all(userIds.map(getUserById));
  const userMap = new Map(users.filter(Boolean).map((u) => [u!.uid, u!]));
  for (const comment of comments) {
    comment.user = userMap.get(comment.userId) ?? undefined;
  }

  return comments;
}
