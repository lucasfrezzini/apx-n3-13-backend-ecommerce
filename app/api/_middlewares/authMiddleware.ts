import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../_helpers/jsonwebtoken";

export async function authMiddleware(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const verification = verifyToken(token);
  console.log("verification", verification);

  if (!verification) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  return verification;
}
