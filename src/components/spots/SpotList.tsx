"use client";

import { SpotCard } from "./SpotCard";
import type { Spot } from "@/types";

interface SpotListProps {
  spots: Spot[];
}

export function SpotList({ spots }: SpotListProps) {
  if (spots.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-heading text-xl text-bark-light mb-2">
          No spots yet!
        </p>
        <p className="text-bark-light/60">
          Be the first to share a great walking spot
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {spots.map((spot) => (
        <SpotCard key={spot.id} spot={spot} />
      ))}
    </div>
  );
}
