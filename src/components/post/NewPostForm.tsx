"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { LocationPicker } from "@/components/LocationPicker";
import { LoadingDog } from "@/components/ui/LoadingDog";
import type { Location } from "@/types";

export function NewPostForm() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState<Location | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setImageUrl(url);
    } catch {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, imageUrl, location }),
      });
      if (!res.ok) throw new Error("Failed to create post");
      router.push("/");
      router.refresh();
    } catch {
      setError("Failed to create post");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitting) {
    return (
      <Card>
        <LoadingDog message="Sharing your walk..." />
      </Card>
    );
  }

  return (
    <Card>
      <div className="bg-white rounded-2xl p-4 mb-5 flex justify-center">
        <img
          src="/dog-location.png"
          alt="Mascot ready to pick a walking spot"
          className="h-28 w-auto"
        />
      </div>
      <h1 className="font-heading font-bold text-2xl mb-1">New Post</h1>
      <p className="font-body text-bark-light text-sm mb-4">
        Where are you taking your pup today?
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Textarea
          id="content"
          label="What's happening on your walk?"
          placeholder="Just saw the cutest squirrel..."
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div>
          <label className="font-heading font-medium text-sm text-bark block mb-1.5">
            Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-sm text-bark-light"
          />
          {uploading && <p className="text-xs text-bark-light mt-1">Uploading...</p>}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Upload preview"
              className="w-full max-h-48 object-cover rounded-xl mt-2"
            />
          )}
        </div>

        <LocationPicker onLocationSelect={setLocation} />

        {location && (
          <p className="text-sm text-leaf">
            📍 {location.name} ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
          </p>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" disabled={submitting || !content.trim()}>
          {submitting ? "Posting..." : "Share Walk"}
        </Button>
      </form>
    </Card>
  );
}
