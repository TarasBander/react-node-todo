import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTodos, deleteTodo, Todo } from '../api';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function TodoList() {
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading, error } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  if (isLoading)
    return (
      <Box textAlign="center" mt={2}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" textAlign="center">
        Error fetching todos
      </Typography>
    );

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <List>
        {todos.map((todo) => (
          <ListItem
            key={todo.id}
            secondaryAction={
              <IconButton
                edge="end"
                color="error"
                onClick={() => deleteMutation.mutate(todo.id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={todo.title} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
