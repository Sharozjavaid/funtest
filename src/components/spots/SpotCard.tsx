"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import Link from "next/link";
import type { Spot } from "@/types";

interface SpotCardProps {
  spot: Spot;
}

export function SpotCard({ spot }: SpotCardProps) {
  const [liked, setLiked] = useState(spot.liked ?? false);
  const [likeCount, setLikeCount] = useState(spot.likeCount);
  const [loading, setLoading] = useState(false);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${spot.location.lat},${spot.location.lng}`;

  async function handleLike() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/spots/${spot.id}/like`, { method: "POST" });
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
    <Card className="overflow-hidden p-0">
      {spot.imageUrl && (
        <Link href={`/spots/${spot.id}`}>
          <div className="relative w-full aspect-[16/9]">
            <Image
              src={spot.imageUrl}
              alt={spot.name}
              fill
              className="object-cover"
              sizes="(max-width: 672px) 100vw, 672px"
            />
          </div>
        </Link>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link
              href={`/spots/${spot.id}`}
              className="hover:text-honey transition-colors"
            >
              <h3 className="font-heading font-bold text-lg">{spot.name}</h3>
            </Link>
            {spot.description && (
              <p className="text-bark-light text-sm mt-1">{spot.description}</p>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-xs text-honey hover:text-honey-dark font-semibold transition-colors"
            >
              <span>📍</span>
              <span>{spot.location.name}</span>
              <span className="text-bark-light/40">·</span>
              <span className="underline">Directions</span>
            </a>
          </div>
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-sm font-semibold transition-colors ${
              liked
                ? "bg-paw-pink text-white"
                : "bg-sand-dark text-bark hover:bg-paw-pink-light"
            }`}
          >
            🐾 {likeCount}
          </button>
        </div>
      </div>
    </Card>
  );
}
