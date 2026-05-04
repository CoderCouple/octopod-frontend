import { fetchAuthSession } from "aws-amplify/auth";

export async function authFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const headers = new Headers(options?.headers);

  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    if (idToken) {
      headers.set("Authorization", `Bearer ${idToken}`);
    }
  } catch {
    // Not signed in — continue without auth header
  }

  return fetch(url, { ...options, headers });
}
