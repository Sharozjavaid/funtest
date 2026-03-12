import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserById, updateUser } from "@/lib/firestore";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getUserById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ user });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (session.uid !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const allowed: (keyof Parameters<typeof updateUser>[1])[] = [
    "displayName",
    "dogName",
    "dogBreed",
    "avatarUrl",
  ];

  const updates: Record<string, string> = {};
  for (const key of allowed) {
    if (typeof body[key] === "string") {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  await updateUser(id, updates);
  const user = await getUserById(id);
  return NextResponse.json({ user });
}
