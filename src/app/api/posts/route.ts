import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createPost, getPosts } from "@/lib/firestore";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") ?? undefined;
    const userId = searchParams.get("userId") ?? undefined;
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);

    const result = await getPosts({ cursor, limit, userId });
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, imageUrl, location } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const post = await createPost({
      userId: session.uid,
      content: content.trim(),
      imageUrl: imageUrl || "",
      location: location || null,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
