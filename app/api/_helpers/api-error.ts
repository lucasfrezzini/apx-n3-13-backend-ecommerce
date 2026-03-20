import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { ValidationError, UniqueConstraintError } from "sequelize";

export class AppError extends Error {
  statusCode: number;
  code?: string;
  details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    options?: { code?: string; details?: unknown },
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = options?.code;
    this.details = options?.details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function formatErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      body: {
        success: false,
        error: {
          message: error.message,
          code: error.code ?? (error.statusCode >= 500 ? "server_error" : "app_error"),
          details: error.details,
        },
      },
    };
  }

  if (error instanceof ZodError) {
    return {
      status: 400,
      body: {
        success: false,
        error: {
          message: "Validation failed",
          code: "validation_error",
          details: error.flatten().fieldErrors,
        },
      },
    };
  }

  if (error instanceof UniqueConstraintError) {
    return {
      status: 409,
      body: {
        success: false,
        error: {
          message: "Conflict error",
          code: "conflict_error",
          details: error.errors,
        },
      },
    };
  }

  if (error instanceof ValidationError) {
    return {
      status: 422,
      body: {
        success: false,
        error: {
          message: "Database validation failed",
          code: "db_validation_error",
          details: error.errors,
        },
      },
    };
  }

  // any other unknown error
  return {
    status: 500,
    body: {
      success: false,
      error: {
        message: "Server error",
        code: "server_error",
      },
    },
  };
}

export function handleRoute(
  handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
  return handler().catch((error: unknown) => {
    console.error("API route error:", error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  });
}
