import axios from 'axios';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const API_URL = 'http://localhost:4000';

export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await axios.get(`${API_URL}/todos`);
  return res.data;
};

export const addTodo = async (title: string): Promise<Todo> => {
  const res = await axios.post(`${API_URL}/todos`, { title });
  return res.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/todos/${id}`);
};
