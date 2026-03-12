"use client";

import { useState, useEffect, useCallback } from "react";
import { PostCard } from "./PostCard";
import { Button } from "@/components/ui/Button";
import type { Post } from "@/types";

export function FeedList({ initialPosts, initialCursor }: {
  initialPosts: Post[];
  initialCursor: string | null;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);

  // Sync with server-rendered data on navigation
  useEffect(() => {
    setPosts(initialPosts);
    setCursor(initialCursor);
  }, [initialPosts, initialCursor]);

  const loadMore = useCallback(async () => {
    if (!cursor || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?cursor=${cursor}`);
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setCursor(data.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading]);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <img
          src="/mascot.png"
          alt="BarkBoard mascot"
          className="h-24 w-auto mx-auto mb-4 rounded-2xl animate-trot"
        />
        <p className="font-heading text-xl text-bark-light mb-2">
          No posts yet!
        </p>
        <p className="text-bark-light/60">Be the first to share a walk</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {cursor && (
        <Button
          variant="secondary"
          onClick={loadMore}
          disabled={loading}
          className="mx-auto"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <img src="/mascot.png" alt="" className="h-4 w-auto rounded animate-trot" />
              Loading...
            </span>
          ) : (
            "Load More"
          )}
        </Button>
      )}
    </div>
  );
}
