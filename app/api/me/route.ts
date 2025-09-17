import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../_middlewares/authMiddleware";
import { getUserData, updateUserData } from "../_controllers/user";
import { userSchema } from "../_schemas/userSchema";

export async function GET(req: NextRequest) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }
    const user = await getUserData(authResponse.email as string);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in GET /api/me:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }
    const body = await req.json();
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const updatedUser = await updateUserData(
      body,
      authResponse.email as string
    );
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User Updated" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in GET /api/me:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
