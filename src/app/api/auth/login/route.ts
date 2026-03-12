import { NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/firestore";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await getUserByEmail(normalizedEmail);

    if (!user) {
      user = await createUser(normalizedEmail);
    }

    const token = await createSessionToken({ uid: user.uid, email: user.email });
    await setSessionCookie(token);

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
