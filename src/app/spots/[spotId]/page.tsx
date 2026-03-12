import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSpotById, getSpotComments, getSpotLikedByUser } from "@/lib/firestore";
import { getSession } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { SpotLikeButton } from "./SpotLikeButton";
import { CommentForm } from "./CommentForm";

export const dynamic = "force-dynamic";

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default async function SpotDetailPage({
  params,
}: {
  params: Promise<{ spotId: string }>;
}) {
  const { spotId } = await params;
  const [session, spot, comments] = await Promise.all([
    getSession(),
    getSpotById(spotId),
    getSpotComments(spotId),
  ]);

  if (!spot) notFound();

  const liked = session ? await getSpotLikedByUser(spotId, session.uid) : false;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${spot.location.lat},${spot.location.lng}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back link */}
      <Link
        href="/spots"
        className="inline-flex items-center gap-1 text-sm text-bark-light hover:text-honey font-heading font-semibold transition-colors mb-4"
      >
        ← Back to Spots
      </Link>

      {/* Spot image */}
      {spot.imageUrl && (
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-4">
          <Image
            src={spot.imageUrl}
            alt={spot.name}
            fill
            className="object-cover"
            sizes="(max-width: 672px) 100vw, 672px"
            priority
          />
        </div>
      )}

      {/* Spot info card */}
      <Card className="mb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="font-heading font-bold text-2xl mb-1">{spot.name}</h1>
            {spot.description && (
              <p className="text-bark-light mt-1">{spot.description}</p>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-honey hover:text-honey-dark font-semibold transition-colors"
            >
              <span>📍</span>
              <span>{spot.location.name}</span>
              <span className="text-bark-light/40">·</span>
              <span className="underline">Open in Google Maps</span>
            </a>
          </div>
          <SpotLikeButton
            spotId={spot.id}
            initialLiked={liked}
            initialCount={spot.likeCount}
          />
        </div>
      </Card>

      {/* Comments section */}
      <div className="mb-4">
        <h2 className="font-heading font-bold text-lg mb-3">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>

        {comments.length === 0 ? (
          <Card>
            <p className="text-bark-light text-center py-4">
              No comments yet. Be the first to share your thoughts!
            </p>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <div className="flex items-start gap-3">
                  <Link href={`/profile/${comment.userId}`}>
                    <Avatar
                      src={comment.user?.avatarUrl}
                      alt={comment.user?.displayName ?? "User"}
                      size="sm"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/profile/${comment.userId}`}
                        className="font-heading font-semibold text-sm hover:text-honey transition-colors"
                      >
                        {comment.user?.displayName ?? "Unknown"}
                      </Link>
                      <span className="text-xs text-bark-light/60">
                        {getTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-bark text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Comment form */}
      {session ? (
        <CommentForm spotId={spot.id} />
      ) : (
        <Card>
          <p className="text-bark-light text-center text-sm">
            <Link href="/login" className="text-honey hover:text-honey-dark font-semibold">
              Log in
            </Link>{" "}
            to leave a comment
          </p>
        </Card>
      )}
    </div>
  );
}
