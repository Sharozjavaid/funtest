"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { User } from "@/types";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [dogName, setDogName] = useState(user.dogName);
  const [dogBreed, setDogBreed] = useState(user.dogBreed);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setAvatarUrl(url);
    } catch {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/users/${user.uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, dogName, dogBreed, avatarUrl }),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push(`/profile/${user.uid}`);
      router.refresh();
    } catch {
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <h1 className="font-heading font-bold text-2xl mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="font-heading font-medium text-sm text-bark block mb-1.5">
            Avatar
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="text-sm text-bark-light"
          />
          {uploading && <p className="text-xs text-bark-light mt-1">Uploading...</p>}
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Avatar preview"
              className="w-16 h-16 rounded-full object-cover mt-2"
            />
          )}
        </div>

        <Input
          id="displayName"
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
        <Input
          id="dogName"
          label="Dog's Name"
          value={dogName}
          onChange={(e) => setDogName(e.target.value)}
          placeholder="Buddy"
        />
        <Input
          id="dogBreed"
          label="Dog's Breed"
          value={dogBreed}
          onChange={(e) => setDogBreed(e.target.value)}
          placeholder="Golden Retriever"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Card>
  );
}
