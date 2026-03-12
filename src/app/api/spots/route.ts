import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createSpot, getSpots } from "@/lib/firestore";

export async function GET() {
  const spots = await getSpots();
  return NextResponse.json({ spots });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, location, imageUrl } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") {
    return NextResponse.json({ error: "Location is required" }, { status: 400 });
  }

  const spot = await createSpot({
    name: name.trim(),
    description: (description || "").trim(),
    location: {
      lat: location.lat,
      lng: location.lng,
      name: location.name || name.trim(),
    },
    createdBy: session.uid,
    imageUrl: imageUrl || "",
  });

  return NextResponse.json({ spot }, { status: 201 });
}
