"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface CommentFormProps {
  postId: string;
}

export function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      setContent("");
      router.refresh();
    } catch {
      setError("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <h3 className="font-heading font-bold text-sm mb-3">Leave a comment</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Say something nice about this post..."
          rows={3}
          className="w-full bg-cream border border-sand-dark rounded-2xl px-4 py-3 text-sm text-bark placeholder:text-bark-light/50 focus:outline-none focus:ring-2 focus:ring-honey/50 resize-none"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={submitting || !content.trim()}
          >
            {submitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
