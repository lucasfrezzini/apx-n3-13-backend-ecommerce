import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: "/api/:path*", // Apply only to API routes
};

export default function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") || "";

  const allowedOrigins =
    process.env.NODE_ENV === "production"
      ? [
          process.env.NEXT_PUBLIC_FRONTEND_URL ?? "https://app.example.com",
          process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://admin.example.com",
        ]
      : ["http://localhost:3000", "http://localhost:3001"];

  const isAllowedOrigin = allowedOrigins.includes(origin);

  const allowOriginValue = isAllowedOrigin ? origin : "null";
  const allowHeaders =
    request.headers.get("access-control-request-headers") ||
    "Content-Type, Authorization";

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowOriginValue,
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": allowHeaders,
        "Access-Control-Allow-Credentials": "true",
        Vary: "Origin",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Vary", "Origin");
  }

  return response;
}
