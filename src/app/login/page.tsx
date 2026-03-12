"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await res.json();

      // New users without a dog name go to onboarding
      if (!data.user.dogName) {
        router.push("/onboarding");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <img
            src="/mascot.png"
            alt="BarkBoard mascot"
            className="h-20 w-auto mx-auto mb-3 rounded-2xl"
          />
          <h1 className="text-3xl font-heading font-bold text-bark mb-2">
            Welcome to BarkBoard
          </h1>
          <p className="text-bark-light font-body">
            Share walks. Find spots. Make furry friends.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="goodboy@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <img src="/mascot.png" alt="" className="h-5 w-auto rounded animate-trot" />
                Sniffing around...
              </span>
            ) : (
              "Enter the Park"
            )}
          </Button>
        </form>

        <p className="text-xs text-bark-light text-center mt-4">
          No password needed — just your email to get started!
        </p>
      </Card>
    </div>
  );
}
