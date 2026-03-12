"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { LocationPicker } from "@/components/LocationPicker";
import type { Location } from "@/types";

export default function NewSpotPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<Location | null>(null);
  const [imageUrl, setImageUrl] = useState("");
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
    if (!name.trim() || !location) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, location, imageUrl }),
      });
      if (!res.ok) throw new Error("Failed to create spot");
      router.push("/spots");
      router.refresh();
    } catch {
      setError("Failed to create spot");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Card>
      <h1 className="font-heading font-bold text-2xl mb-4">Add Walking Spot</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="name"
          label="Spot Name"
          placeholder="Riverside Dog Park"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Textarea
          id="description"
          label="Description"
          placeholder="Great off-leash area with water access..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div>
          <label className="font-heading font-medium text-sm text-bark block mb-1.5">
            Photo (optional)
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

        <Button
          type="submit"
          disabled={submitting || !name.trim() || !location}
        >
          {submitting ? "Adding..." : "Add Spot"}
        </Button>
      </form>
      </Card>
    </div>
  );
}
