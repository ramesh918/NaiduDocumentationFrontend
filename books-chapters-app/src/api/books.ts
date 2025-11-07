import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4005',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Books API
export const getBooks = async (genereId?: string) => {
  const endpoint = genereId ? `/books?genereId=${genereId}` : '/books';
  const { data } = await api.get(endpoint);
  return data;
};

export const getBookById = async (id: string) => {
  const { data } = await api.get(`/books/${id}`);
  return data;
};

export const createBook = async (book: {
  title: string;
  genereId: string;
}) => {
  const { data } = await api.post('/books', book);
  return data;
};

export const updateBook = async (
  id: string,
  patch: {
    title?: string;
    genereId?: string;
  }
) => {
  const { data } = await api.put(`/books/${id}`, patch);
  return data;
};

export const deleteBook = async (id: string) => {
  const { data } = await api.delete(`/books/${id}`);
  return data;
};
