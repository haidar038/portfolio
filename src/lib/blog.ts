export interface BlogPostSummary {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  image: string | null;
  publishedAt: string | null;
  url: string;
}

interface BlogFeedResponse {
  version: 1;
  source: {
    name: string;
    url: string;
  };
  items: BlogPostSummary[];
}

function isBlogPostSummary(value: unknown): value is BlogPostSummary {
  if (!value || typeof value !== "object") return false;

  const post = value as Record<string, unknown>;
  return (
    typeof post.id === "string" &&
    typeof post.title === "string" &&
    typeof post.description === "string" &&
    typeof post.category === "string" &&
    typeof post.categoryLabel === "string" &&
    (typeof post.image === "string" || post.image === null) &&
    (typeof post.publishedAt === "string" || post.publishedAt === null) &&
    typeof post.url === "string"
  );
}

export async function fetchBlogPosts(
  signal?: AbortSignal,
): Promise<BlogPostSummary[]> {
  const response = await fetch("/api/blog", {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch blog feed: ${response.status}`);
  }

  const data: unknown = await response.json();
  if (!data || typeof data !== "object") {
    throw new Error("Invalid blog feed response");
  }

  const feed = data as Partial<BlogFeedResponse>;
  if (
    feed.version !== 1 ||
    !feed.source ||
    typeof feed.source.name !== "string" ||
    typeof feed.source.url !== "string" ||
    !Array.isArray(feed.items) ||
    !feed.items.every(isBlogPostSummary)
  ) {
    throw new Error("Invalid blog feed response");
  }

  return feed.items;
}
