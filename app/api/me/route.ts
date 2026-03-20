import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../_middlewares/authMiddleware";
import { getUserData, updateUserData } from "../_controllers/user";
import { userSchema } from "../_schemas/userSchema";
import { handleRoute, AppError } from "../_helpers/api-error";

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }
    const user = await getUserData(authResponse.email as string);
    return NextResponse.json({ success: true, user }, { status: 200 });
  });
}

export async function PATCH(req: NextRequest) {
  return handleRoute(async () => {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }
    const body = await req.json();
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      throw new AppError("Invalid user data", 400, {
        code: "validation_error",
        details: validation.error.flatten().fieldErrors,
      });
    }
    const updatedUser = await updateUserData(
      validation.data,
      authResponse.email as string,
    );
    return NextResponse.json({ success: true, message: "User updated", user: updatedUser }, { status: 200 });
  });
}
