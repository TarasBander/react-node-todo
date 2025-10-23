import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import { Container, Typography, CssBaseline } from '@mui/material';

export default function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          React Query + Material UI ToDo
        </Typography>
        <AddTodo />
        <TodoList />
      </Container>
    </>
  );
}
