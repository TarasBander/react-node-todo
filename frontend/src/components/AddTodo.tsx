import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTodo } from '../api';
import { Box, TextField, Button, Paper } from '@mui/material';

export default function AddTodo() {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTitle('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) mutation.mutate(title);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <Box display="flex" gap={2}>
          <TextField
            label="Enter todo"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
