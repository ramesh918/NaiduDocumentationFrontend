import { api } from './apiClient';

// GET content by chapterId
export async function getContent(chapterId: string) {
  const res = await api.get(`/contents/chapter/${chapterId}`);
  return res.data;
}

// SAVE (create or update) content
export async function saveContent({
  chapterId,
  content,
}: {
  chapterId: string;
  content: string;
}) {
  const res = await api.post(`/contents/chapter/${chapterId}`, { content });
  return res.data;
}
