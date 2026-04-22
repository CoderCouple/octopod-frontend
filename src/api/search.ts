import type { SearchRequest, SearchResult } from "@/types/search";

const BASE_URL =
  // eslint-disable-next-line n/no-process-env
  process.env.NEXT_PUBLIC_INGEST_API_URL || "http://localhost:8000/api/v1";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export function searchDevelopers(params: SearchRequest) {
  return request<SearchResult[]>("/developer-profile/search", {
    method: "POST",
    body: JSON.stringify(params),
  });
}
