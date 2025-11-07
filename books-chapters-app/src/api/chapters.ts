import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4005',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chapters API
export const getChapters = async (bookId?: string) => {
  const endpoint = bookId ? `/chapters/book/${bookId}` : '/chapters';
  const { data } = await api.get(endpoint);
  return data;
};

export const createChapter = async (chapter: { title: string; bookId: string }) => {
  const { data } = await api.post(`/chapters/book/${chapter.bookId}`, {title: chapter.title});
  return data;
};

export const updateChapter = async (
  id: string,
  patch: { title: string }
) => {
  const { data } = await api.put(`/chapters/${id}`, patch);
  return data;
};

export const deleteChapter = async (id: string) => {
  const { data } = await api.delete(`/chapters/${id}`);
  return data;
};
