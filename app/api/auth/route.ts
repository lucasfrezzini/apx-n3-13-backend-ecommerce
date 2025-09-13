import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Auth route is working!" });
}

export async function POST(req: NextRequest) {}
