import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPostComments, createPostComment, getUserById } from "@/lib/firestore";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const comments = await getPostComments(postId);
  return NextResponse.json({ comments });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await params;
  const body = await request.json();
  const { content } = body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const comment = await createPostComment({
    postId,
    userId: session.uid,
    content: content.trim(),
  });

  // Hydrate user data for the response
  const user = await getUserById(session.uid);
  comment.user = user ?? undefined;

  return NextResponse.json({ comment }, { status: 201 });
}
