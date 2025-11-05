import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4005',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generes API
export const getGeneres = async () => {
  const { data } = await api.get('/generes');
  return data;
};

export const createGenere = async (title: string) => {
  const { data } = await api.post('/generes', { title });
  return data;
};

export const updateGenere = async (id: string, patch: { title: string }) => {
  const { data } = await api.put(`/generes/${id}`, patch);
  return data;
};

export const deleteGenere = async (id: string) => {
  const { data } = await api.delete(`/generes/${id}`);
  return data;
};

