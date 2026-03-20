import { NextRequest, NextResponse } from "next/server";
import { verifyAuthCode } from "../../_controllers/auth";
import { generateToken } from "../../_helpers/jsonwebtoken";
import { handleRoute, AppError } from "../../_helpers/api-error";

// Recibe un email y un código y valida que sean los correctos. En el caso de que sean correctos devuelve un token e invalida el código.
export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const body = await req.json();
    const { email, code } = body;
    if (!email || !code) {
      throw new AppError("Email and code are required", 400, {
        code: "validation_error",
      });
    }
    const validAuth = await verifyAuthCode(email, code);
    if (validAuth === false) {
      throw new AppError("Invalid code, try login again", 401, {
        code: "invalid_auth_code",
      });
    }
    const token = generateToken({
      email,
      userId: validAuth.id,
    });
    return NextResponse.json({ success: true, token }, { status: 200 });
  });
}
