"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { LoadingDog } from "@/components/ui/LoadingDog";

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState("");
  const [dogName, setDogName] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [nameInitialized, setNameInitialized] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill display name from email once user loads
  if (user && !nameInitialized) {
    const emailUsername = user.email.split("@")[0];
    setDisplayName(user.displayName || emailUsername);
    setNameInitialized(true);
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingDog message="Loading your profile..." />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  function nextStep() {
    setError("");
    if (step === 2 && !dogName.trim()) {
      setError("Your dog needs a name!");
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function prevStep() {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
      setAvatarUrl(url);
    } catch {
      setError("Failed to upload image. Try again?");
    } finally {
      setUploading(false);
    }
  }

  async function handleFinish() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/users/${user!.uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          dogName: dogName.trim(),
          dogBreed: dogBreed.trim(),
          avatarUrl,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong saving your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i < step ? "bg-honey" : "bg-sand-dark/30"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Display name */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <img
                src="/mascot.png"
                alt="BarkBoard mascot"
                className="h-16 w-auto mx-auto mb-2 rounded-2xl animate-trot"
              />
              <h1 className="text-2xl font-heading font-bold text-bark mb-1">
                Tell us about you
              </h1>
              <p className="text-bark-light font-body text-sm">
                Let&apos;s set up your BarkBoard profile! This only takes a minute.
              </p>
            </div>

            <Input
              id="displayName"
              label="Display Name"
              placeholder="What should we call you?"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="flex justify-end">
              <Button onClick={nextStep}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Dog info */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <div className="text-4xl mb-2">
                <span role="img" aria-label="dog">🐕</span>
              </div>
              <h1 className="text-2xl font-heading font-bold text-bark mb-1">
                Now the star of the show!
              </h1>
              <p className="text-bark-light font-body text-sm">
                Every good walk starts with a good dog.
              </p>
            </div>

            <Input
              id="dogName"
              label="Dog's Name"
              placeholder="Buddy, Luna, Max..."
              value={dogName}
              onChange={(e) => setDogName(e.target.value)}
              required
            />

            <Input
              id="dogBreed"
              label="Breed (optional)"
              placeholder="Golden Retriever, Mutt Royalty..."
              value={dogBreed}
              onChange={(e) => setDogBreed(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="flex justify-between">
              <Button variant="ghost" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Avatar upload */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <div className="text-4xl mb-2">
                <span role="img" aria-label="camera">📸</span>
              </div>
              <h1 className="text-2xl font-heading font-bold text-bark mb-1">
                Add a photo
              </h1>
              <p className="text-bark-light font-body text-sm">
                Show off that adorable face! (You can always add one later)
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className="w-28 h-28 rounded-full object-cover border-4 border-honey"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-paw-pink/20 flex items-center justify-center border-4 border-dashed border-paw-pink/40">
                  <span className="text-4xl">🐾</span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />

              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading
                  ? "Uploading..."
                  : avatarUrl
                  ? "Change Photo"
                  : "Choose Photo"}
              </Button>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="flex justify-between">
              <Button variant="ghost" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>
                {avatarUrl ? "Next" : "Skip for now"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <img
                src="/mascot.png"
                alt="BarkBoard mascot celebrating"
                className="h-16 w-auto mx-auto mb-2 rounded-2xl"
              />
              <h1 className="text-2xl font-heading font-bold text-bark mb-1">
                You&apos;re all set!
              </h1>
              <p className="text-bark-light font-body text-sm">
                Welcome to the pack!
              </p>
            </div>

            {/* Profile summary */}
            <div className="bg-cream rounded-2xl p-5 flex flex-col items-center gap-3">
              <Avatar
                src={avatarUrl || undefined}
                alt={displayName || "User"}
                size="lg"
              />
              <div className="text-center">
                <p className="font-heading font-bold text-lg text-bark">
                  {displayName}
                </p>
                <p className="font-body text-bark-light text-sm">
                  {dogName}
                  {dogBreed ? ` the ${dogBreed}` : ""}
                </p>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="flex justify-between">
              <Button variant="ghost" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={handleFinish} disabled={saving} size="lg">
                {saving ? "Setting up..." : "Start Exploring 🐾"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
