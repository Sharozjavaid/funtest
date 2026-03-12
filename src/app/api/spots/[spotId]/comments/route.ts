import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSpotComments, createSpotComment } from "@/lib/firestore";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ spotId: string }> }
) {
  const { spotId } = await params;
  const comments = await getSpotComments(spotId);
  return NextResponse.json({ comments });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ spotId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { spotId } = await params;
  const body = await request.json();
  const { content } = body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const comment = await createSpotComment({
    spotId,
    userId: session.uid,
    content: content.trim(),
  });

  return NextResponse.json({ comment }, { status: 201 });
}
