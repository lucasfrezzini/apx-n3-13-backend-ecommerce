import { NextRequest, NextResponse } from "next/server";
import { sendCodeToEmail } from "../_controllers/auth";
import { z } from "zod";
import { handleRoute, AppError } from "../_helpers/api-error";

const authBodySchema = z.object({
  email: z.string().email("Email is invalid"),
});

// Recibe un email y encuentra/crea un user con ese email y le envía un código vía email.
export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const body = await req.json();
    const validation = authBodySchema.safeParse(body);
    if (!validation.success) {
      throw new AppError("Invalid email", 400, {
        code: "validation_error",
        details: validation.error.flatten().fieldErrors,
      });
    }

    await sendCodeToEmail(validation.data.email);
    return NextResponse.json(
      { success: true, message: "Code sent to email" },
      { status: 200 },
    );
  });
}
