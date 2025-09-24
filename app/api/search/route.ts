import { NextRequest, NextResponse } from "next/server";
import { algoliasearch } from "algoliasearch";
import { AlgoliaAPI } from "../_database/algolia";

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID as string;
const ALGOLIA_SEARCH_API_KEY = process.env.ALGOLIA_SEARCH_API_KEY as string;
const ALGOLIA_INDEX_NAME = "algolia_apparel_sample_dataset";

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY);

// q=query&offset=0&limit=10
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const algoliaClient = new AlgoliaAPI<any>(client, ALGOLIA_INDEX_NAME);
    const results = await algoliaClient.search(query, limit, offset);

    return NextResponse.json(
      {
        results: results.hits,
        total: results.nbHits,
        page: results.page,
        totalPages: results.nbPages,
        hitsPerPage: results.hitsPerPage,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in GET /api/me:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
