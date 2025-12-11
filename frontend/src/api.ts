import axios from 'axios';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await api.get('/todos');
  return res.data;
};

export const addTodo = async (title: string): Promise<Todo> => {
  const res = await api.post('/todos', { title });
  return res.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await api.delete(`/todos/${id}`);
};

export const login = async (username: string, password: string): Promise<void> => {
  const res = await api.post('/login', { username, password });
  const token = res.data.token as string;
  localStorage.setItem('token', token);
};
