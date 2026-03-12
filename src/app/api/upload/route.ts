import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getBucket } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 });
  }

  const bucket = getBucket();
  const fileName = `uploads/${session.uid}/${Date.now()}-${file.name}`;
  const fileRef = bucket.file(fileName);

  const buffer = Buffer.from(await file.arrayBuffer());

  await fileRef.save(buffer, {
    metadata: { contentType: file.type },
  });

  await fileRef.makePublic();

  const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

  return NextResponse.json({ url });
}
