import { NextRequest, NextResponse } from "next/server";
import { sendCodeToEmail } from "../_controllers/auth";

// Recibe un email y encuentra/crea un user con ese email y le envía un código vía email.
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    await sendCodeToEmail(email);
    return NextResponse.json(
      { message: "Code sent to email" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in POST /api/auth:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
