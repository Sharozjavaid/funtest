import { NextResponse } from "next/server";
import { getSpotById, getSpotComments } from "@/lib/firestore";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ spotId: string }> }
) {
  const { spotId } = await params;

  const spot = await getSpotById(spotId);
  if (!spot) {
    return NextResponse.json({ error: "Spot not found" }, { status: 404 });
  }

  const comments = await getSpotComments(spotId);

  return NextResponse.json({ spot, comments });
}
