import { Routes, Route, Navigate } from 'react-router-dom';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { Container, Typography, CssBaseline } from '@mui/material';

function TodoPage() {
  return (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        React Query + Material UI ToDo
      </Typography>
      <AddTodo />
      <TodoList />
    </>
  );
}

export default function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<TodoPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
}
