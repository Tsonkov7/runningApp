const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const customFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string }).message ?? "Request failed",
    );
  }

  const data =
    res.status === 204 ? undefined : await res.json().catch(() => undefined);

  return {
    data,
    status: res.status,
    headers: res.headers,
  } as T;
};
