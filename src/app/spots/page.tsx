import { getSpots, getSpotLikedByUser } from "@/lib/firestore";
import { getSession } from "@/lib/auth";
import { SpotList } from "@/components/spots/SpotList";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SpotsPage() {
  const [session, spots] = await Promise.all([getSession(), getSpots()]);

  // Hydrate liked status for current user
  if (session) {
    await Promise.all(
      spots.map(async (spot) => {
        spot.liked = await getSpotLikedByUser(spot.id, session.uid);
      })
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-heading font-bold text-2xl">Walking Spots</h1>
        <Link
          href="/spots/new"
          className="bg-honey text-white px-4 py-2 rounded-2xl text-sm font-heading font-semibold hover:bg-honey-dark transition-colors"
        >
          + Add Spot
        </Link>
      </div>
      <SpotList spots={spots} />
    </div>
  );
}
