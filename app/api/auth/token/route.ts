import { NextRequest, NextResponse } from "next/server";
import { verifyAuthCode } from "../../_controllers/auth";
import { generateToken } from "../../_helpers/jsonwebtoken";

// Recibe un email y un código y valida que sean los correctos. En el caso de que sean correctos devuelve un token e invalida el código.
export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json(
        { error: "Email or Code are required" },
        { status: 400 }
      );
    }
    const validAuth = await verifyAuthCode(email, code);
    if (validAuth === false) {
      return NextResponse.json(
        { error: "Valid code, try login again" },
        { status: 401 }
      );
    }
    const token = generateToken({
      email,
      userId: validAuth.id,
    });
    return NextResponse.json({ token }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in POST /api/auth/token:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
