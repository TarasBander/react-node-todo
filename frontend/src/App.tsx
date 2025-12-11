import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import Login from './components/Login';
import { Container, Typography, CssBaseline } from '@mui/material';

export default function App() {
  const isLoginPage = window.location.pathname === '/login';

  if (!isLoginPage) {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        {isLoginPage ? (
          <Login />
        ) : (
          <>
            <Typography variant="h4" align="center" gutterBottom>
              React Query + Material UI ToDo
            </Typography>
            <AddTodo />
            <TodoList />
          </>
        )}
      </Container>
    </>
  );
}
