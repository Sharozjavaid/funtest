"use client";

import { useState } from "react";

interface SpotLikeButtonProps {
  spotId: string;
  initialLiked: boolean;
  initialCount: number;
}

export function SpotLikeButton({ spotId, initialLiked, initialCount }: SpotLikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/spots/${spotId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold transition-colors ${
        liked
          ? "bg-paw-pink text-white"
          : "bg-sand-dark text-bark hover:bg-paw-pink-light"
      }`}
    >
      🐾 {likeCount}
    </button>
  );
}
