export interface User {
  uid: string;
  email: string;
  displayName: string;
  dogName: string;
  dogBreed: string;
  avatarUrl: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl: string;
  location: Location | null;
  createdAt: string;
  commentCount?: number;
  user?: User;
}

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface Spot {
  id: string;
  name: string;
  description: string;
  location: Location;
  imageUrl?: string;
  likeCount: number;
  createdBy: string;
  createdAt: string;
  liked?: boolean;
}

export interface SpotComment {
  id: string;
  spotId: string;
  userId: string;
  content: string;
  createdAt: string;
  user?: User;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  user?: User;
}

export interface SessionPayload {
  uid: string;
  email: string;
}
