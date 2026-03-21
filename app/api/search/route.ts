import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { algoliasearch } from "algoliasearch";
import { AlgoliaAPI } from "../_database/algolia";
import { handleRoute, AppError } from "../_helpers/api-error";

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID as string;
const ALGOLIA_SEARCH_API_KEY = process.env.ALGOLIA_SEARCH_API_KEY as string;
const ALGOLIA_INDEX_NAME = "algolia_kora_dataset";

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY);
const algoliaClient = new AlgoliaAPI<any>(client, ALGOLIA_INDEX_NAME);

const querySchema = z.object({
  q: z.string().optional().default(""),
  offset: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 0))
    .refine((v) => !Number.isNaN(v) && v >= 0, {
      message: "offset must be a non-negative integer",
    }),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 20))
    .refine((v) => !Number.isNaN(v) && v > 0 && v <= 100, {
      message: "limit must be between 1 and 100",
    }),
});

export async function GET(req: NextRequest) {
  return handleRoute(async () => {
    const rawSearch = Object.fromEntries(req.nextUrl.searchParams.entries());
    const parsed = querySchema.safeParse(rawSearch);
    if (!parsed.success) {
      throw new AppError("Invalid search params", 400, {
        code: "validation_error",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { q, offset, limit } = parsed.data;
    const results = await algoliaClient.search(q, limit, offset);

    return NextResponse.json(
      {
        success: true,
        query: q,
        page: results.page,
        total: results.nbHits,
        totalPages: results.nbPages,
        hitsPerPage: results.hitsPerPage,
        results: results.hits,
      },
      { status: 200 },
    );
  });
}
