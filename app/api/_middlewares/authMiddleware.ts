import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../_helpers/jsonwebtoken";

/**
 * Middleware de autenticación.
 * Verifica el token JWT en el header Authorization.
 * Retorna los datos del usuario si es válido, o NextResponse con error.
 */
export async function authMiddleware(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const verification = verifyToken(token);
  if (!verification) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return verification;
}