import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { toggleSpotLike } from "@/lib/firestore";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ spotId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { spotId } = await params;

  try {
    const result = await toggleSpotLike(spotId, session.uid);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Like toggle error:", error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
