

export type ContentItem = { id: string; title: string; body: string };
export type Chapter = { id: string; bookId: string; title: string; index?: number; contents?: ContentItem[] };
export type Book = { id: string; title: string; description?: string };

let baseUrl = import.meta.env.VITE_API_BASE_URL || '';
let authToken: string | null = null;

export function setBaseUrl(url: string){ baseUrl = url; }
export function setAuthToken(token: string | null){ authToken = token; }

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string,string> = { 'Content-Type': 'application/json', ...(opts.headers as any || {}) };
  if(authToken) headers['Authorization'] = `Bearer ${authToken}`;
  const url = (baseUrl ? baseUrl.replace(/\/+$/, '') : '') + path;
  const res = await fetch(url, { ...opts, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if(!res.ok) {
    // Try to produce a helpful error
    const message = data?.message || `${res.status} ${res.statusText}`;
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  // Books
  getBooks: async (): Promise<Book[]> => request<Book[]>(`/books`),
  createBook: async (b: { title: string; description?: string }) => request<Book>(`/books`, { method: 'POST', body: JSON.stringify(b) }),
  updateBook: async (id: string, patch: Partial<Book>) => request<Book>(`/books/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteBook: async (id: string) => request<{ success: boolean }>(`/books/${id}`, { method: 'DELETE' }),

  // Chapters
  getChaptersByBook: async (bookId: string) => request<Chapter[]>(`/books/${bookId}/chapters`),
  createChapter: async (bookId: string, title: string) => request<Chapter>(`/books/${bookId}/chapters`, { method: 'POST', body: JSON.stringify({ title }) }),
  updateChapter: async (id: string, patch: Partial<Chapter>) => request<Chapter>(`/chapters/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteChapter: async (id: string) => request<{ success: boolean }>(`/chapters/${id}`, { method: 'DELETE' }),

  // Content
  addContent: async (chapterId: string, title: string, body = '') => request<ContentItem>(`/chapters/${chapterId}/contents`, { method: 'POST', body: JSON.stringify({ title, body }) }),
  updateContent: async (chapterId: string, contentId: string, patch: Partial<ContentItem>) => request<ContentItem>(`/chapters/${chapterId}/contents/${contentId}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteContent: async (chapterId: string, contentId: string) => request<{ success: boolean }>(`/chapters/${chapterId}/contents/${contentId}`, { method: 'DELETE' }),
};

