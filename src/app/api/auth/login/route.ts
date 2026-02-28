import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { signAdminToken } from "@/lib/auth";
import { COOKIE_NAME, JWT_EXPIRY_SECONDS } from "@/lib/constants";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json() as { email?: string; password?: string };
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Имейл и парола" },
      { status: 400 }
    );
  }

  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email));

  if (!user) {
    return NextResponse.json({ error: "Невалидни данни за вход" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Невалидни данни за вход" }, { status: 401 });
  }

  const token = await signAdminToken({ adminId: user.id, email: user.email });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: JWT_EXPIRY_SECONDS,
  });

  return NextResponse.json({ ok: true });
}
