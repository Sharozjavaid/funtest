import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostById, getPostComments } from "@/lib/firestore";
import { getSession } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
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

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const [session, post, comments] = await Promise.all([
    getSession(),
    getPostById(postId),
    getPostComments(postId),
  ]);

  if (!post) notFound();

  const mapsUrl = post.location
    ? `https://www.google.com/maps/search/?api=1&query=${post.location.lat},${post.location.lng}`
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-bark-light hover:text-honey font-heading font-semibold transition-colors mb-4"
      >
        &larr; Back to Feed
      </Link>

      {/* Post card */}
      <Card className="mb-4">
        {/* Author header */}
        <div className="flex items-center gap-3 mb-3">
          <Link href={`/profile/${post.userId}`}>
            <Avatar
              src={post.user?.avatarUrl}
              alt={post.user?.displayName ?? "User"}
              size="sm"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link
              href={`/profile/${post.userId}`}
              className="font-heading font-semibold text-sm hover:text-honey transition-colors"
            >
              {post.user?.displayName ?? "Unknown"}
            </Link>
            <p className="text-xs text-bark-light/60">
              {getTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Content */}
        <p className="text-bark mb-3 whitespace-pre-wrap">{post.content}</p>

        {/* Image */}
        {post.imageUrl && (
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3">
            <Image
              src={post.imageUrl}
              alt="Post image"
              fill
              className="object-cover"
              sizes="(max-width: 672px) 100vw, 672px"
              priority
            />
          </div>
        )}

        {/* Location */}
        {post.location && mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-honey hover:text-honey-dark font-semibold transition-colors"
          >
            <span>📍</span>
            <span>{post.location.name}</span>
            <span className="text-bark-light/40">·</span>
            <span className="underline">Open in Google Maps</span>
          </a>
        )}
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
        <CommentForm postId={post.id} />
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
