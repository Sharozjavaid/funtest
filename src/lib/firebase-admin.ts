import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

let app: App;
let db: Firestore;
let storage: Storage;

function getServiceAccount() {
  // Prefer base64-encoded full service account JSON (avoids all escaping issues)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
    return JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, "base64").toString()
    );
  }
  // Fallback to individual env vars (local dev)
  return {
    project_id: process.env.FIREBASE_PROJECT_ID?.trim(),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };
}

function getApp(): App {
  if (!app) {
    const existing = getApps();
    if (existing.length > 0) {
      app = existing[0];
    } else {
      const sa = getServiceAccount();
      app = initializeApp({
        credential: cert({
          projectId: sa.project_id,
          clientEmail: sa.client_email,
          privateKey: sa.private_key,
        }),
        storageBucket: `${sa.project_id}.firebasestorage.app`,
      });
    }
  }
  return app;
}

export function getDb(): Firestore {
  if (!db) {
    db = getFirestore(getApp());
  }
  return db;
}

export function getBucket() {
  if (!storage) {
    storage = getStorage(getApp());
  }
  return storage.bucket();
}
