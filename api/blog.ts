/**
 * Vercel Function: same-origin proxy for the Cup of Code portfolio feed.
 * Endpoint: GET /api/blog
 */

const UPSTREAM_URL = "https://cupofcode.cc/api/portfolio-feed?limit=6";
const TIMEOUT_MS = 5_000;
const SUCCESS_CACHE_CONTROL =
  "public, max-age=120, s-maxage=600, stale-while-revalidate=3600";

function json(
  data: unknown,
  status = 200,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return json(
      { error: "Method not allowed" },
      405,
      { Allow: "GET", "Cache-Control": "no-store" },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(UPSTREAM_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error("Cup of Code feed error:", response.status);
      return json(
        { error: "Blog service unavailable" },
        502,
        { "Cache-Control": "no-store" },
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      console.error("Cup of Code feed returned a non-JSON response");
      return json(
        { error: "Invalid blog feed response" },
        502,
        { "Cache-Control": "no-store" },
      );
    }

    const body = await response.text();
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": SUCCESS_CACHE_CONTROL,
      },
    });
  } catch (error) {
    console.error("Blog proxy error:", error);
    return json(
      { error: "Failed to fetch blog posts" },
      502,
      { "Cache-Control": "no-store" },
    );
  } finally {
    clearTimeout(timeout);
  }
}

export default { fetch: handler };
