import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import type { Post } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const timeAgo = getTimeAgo(post.createdAt);

  return (
    <Card>
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
          <p className="text-xs text-bark-light/60">{timeAgo}</p>
        </div>
      </div>

      <p className="text-bark mb-3 whitespace-pre-wrap">{post.content}</p>

      {post.imageUrl && (
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3">
          <Image
            src={post.imageUrl}
            alt="Post image"
            fill
            className="object-cover"
            sizes="(max-width: 672px) 100vw, 672px"
          />
        </div>
      )}

      {post.location && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${post.location.lat},${post.location.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-honey hover:text-honey-dark font-semibold transition-colors"
        >
          <span>📍</span> {post.location.name}
        </a>
      )}

      {/* Comment count & View post link */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-sand-dark/30">
        <Link
          href={`/posts/${post.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-bark-light hover:text-honey font-heading font-semibold transition-colors"
        >
          <span>💬</span>
          {(post.commentCount ?? 0) > 0
            ? `${post.commentCount} comment${post.commentCount === 1 ? "" : "s"}`
            : "Comment"}
        </Link>
        <Link
          href={`/posts/${post.id}`}
          className="text-xs text-bark-light/60 hover:text-honey font-heading font-semibold transition-colors"
        >
          View post →
        </Link>
      </div>
    </Card>
  );
}

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
