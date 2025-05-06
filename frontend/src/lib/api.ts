import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001/api',
});

// トークンをセットする関数
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// 画像アップロードAPI
export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await api.post<{ url: string }>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// 課題投稿API
export const createAssignment = async (data: {
  title: string;
  description: string;
  image_url?: string;
}) => {
  const response = await api.post('/assignments', data);
  return response.data;
};

// 課題検索API
export const searchAssignments = async (query: string) => {
  const response = await api.get(`/assignments/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

// 課題削除API（管理者用）
export const deleteAssignment = async (id: string) => {
  const response = await api.delete(`/assignments/${id}`);
  return response.data;
};

export default api;