## Complete Project Setup

### Step 1 : Project Setup 
1. Give this command `npm create vite@latest books-chapters-app -- --template react-ts`
   1. which will create the intial setup of the project 
2. Take default option which come, it will and open this in the browser `http://localhost:5174/`

### Step 2 : Install all Required Packages 
1. Give the commaan `npm i`
2. Install all required packages `npm install @reduxjs/toolkit react-redux @tanstack/react-query react-router-dom markdown-to-jsx uuid`
3. Install deve dependencies as well `npm install -D @types/uuid`
4. run the server again `npm run dev`

### Stpe 3:  Create .env file and keep the followoing in it

```Palintext
   VITE_API_BASE_URL=http://localhost:4005
```
### Step 4: Setting the API Client 
1. Create a folder `api`
2. Create a file `apiClient.ts`

```Typescript
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
```

### Step 5 : Create the store under src

```Typescript
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // add reducers here later, e.g. books: booksReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Stpe 6: Change the main.tsx to this, app bootstrap with React Query, Redux Provider, Router

```Typescript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store';
import './index.css'; // optional, may not exist yet

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
```

### Step 7 : Change the app.tsx

```Typescript
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import ChaptersPage from './pages/ChaptersPage';
import ContentPage from './pages/ContentPage';

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: 'Inter, system-ui, Arial' }}>
      <header style={{ marginBottom: 16 }}>
        <Link to="/books" style={{ fontSize: 20, fontWeight: 600 }}>Books</Link>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/:bookId/chapters" element={<ChaptersPage />} />
          <Route path="/books/:bookId/chapters/:chapterId/contents" element={<ContentPage />} />
        </Routes>
      </main>
    </div>
  );
}
```


   