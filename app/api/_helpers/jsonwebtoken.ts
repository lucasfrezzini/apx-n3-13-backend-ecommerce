import jwt from "jsonwebtoken";

export function generateToken(obj: Record<string, unknown>): string {
  return jwt.sign(obj, process.env.JWT_SECRET as string);
}

export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as Record<
      string,
      unknown
    >;
  } catch (error: unknown) {
    console.error("Token verification failed:", error);
    return null;
  }
}
