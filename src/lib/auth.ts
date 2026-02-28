import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { COOKIE_NAME, JWT_EXPIRY } from "./constants";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface AdminPayload extends JWTPayload {
  adminId: number;
  email: string;
}

export async function signAdminToken(
  payload: Omit<AdminPayload, keyof JWTPayload>
): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(secret);
}

export async function verifyAdminToken(token: string): Promise<AdminPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as AdminPayload;
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}
