import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Typography, List, ListItem, ListItemButton, ListItemText,
  Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Stack, CircularProgress, Alert
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { openBookDialog as openDialog, closeBookDialog as closeDialog, updateBookId} from '../features/ui/uiBookSlice';
import * as api from '../api/books';

export default function BooksPage() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const { dialogOpen, dialogMode, currentBookId } = useSelector(
    (state: RootState) => state.uiBooks
  );

  // get selected genereId from Redux (selected in GenerePage)
  const genereId = useSelector((state: RootState) => state.uiGeneres.currentGenereId);

  const [title, setTitle] = useState('');

  // Fetch books for the selected genere
  const { data: books, isLoading, isError } = useQuery({
    queryKey: ['books', genereId],
    queryFn: () => genereId ?api.getBooks(genereId): api.getBooks(),
    enabled: !!genereId,
  });

  // Mutations
  const createMutation = useMutation<any, Error, { title: string; genereId: string }>({
    mutationFn: api.createBook,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books', genereId] }),
  });

  const updateMutation = useMutation<any, Error, { id: string; patch: { title: string } }>({
    mutationFn: ({ id, patch }) => api.updateBook(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books', genereId] }),
  });

  const deleteMutation = useMutation<any, Error, string>({
    mutationFn: api.deleteBook,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books', genereId] }),
  });

  // Dialog handlers
  const handleOpenCreate = () => {
    setTitle('');
    dispatch(openDialog({ mode: 'create' }));
  };

  const handleOpenEdit = (book: { _id: string; title: string }) => {
    setTitle(book.title);
    dispatch(openDialog({ mode: 'edit', bookId: book._id }));
  };

  const handleClose = () => dispatch(closeDialog());

  const handleSave = async () => {
    if (!title.trim()) return;

    try {
      if (dialogMode === 'create') {
        await createMutation.mutateAsync({ title, genereId : genereId! });
      } else if (dialogMode === 'edit' && currentBookId) {
        await updateMutation.mutateAsync({ id: currentBookId, patch: { title } });
      }
      handleClose();
    } catch {
      alert('Failed to save book');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch {
      alert('Failed to delete book');
    }
  };

  // UI states
  if (!genereId)
    return (
      <Typography sx={{ mt: 4, textAlign: 'center' }}>
        Please select a genere first.
      </Typography>
    );

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Failed to load books</Alert>;

  return (
    <Box sx={{ maxWidth: 600, m: '40px auto', textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Manage Books</Typography>
      <Button variant="contained" onClick={handleOpenCreate} sx={{ mb: 3 }}>
        + Add Book
      </Button>

      {(!books || books.length === 0) ? (
        <Typography>No books found for this genere</Typography>
      ) : (
        <List>
          {books.map((book: any) => (
            <div key={book._id}>
              <ListItem
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => handleOpenEdit(book)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(book._id)}><Delete /></IconButton>
                  </Stack>
                }
                disablePadding
              >
                <ListItemButton
                  onClick={()=>dispatch(updateBookId(book._id))}
                  component={Link}
                  to={`/books/${book._id}/chapters`}
                  sx={{ border: '1px solid #ccc', mb: 1 }}
                >
                  <ListItemText primary={book.title} />
                </ListItemButton>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      )}

      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>{dialogMode === 'create' ? 'Add Book' : 'Edit Book'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {dialogMode === 'create' ? 'Create' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 3 }}>
        <Button component={Link} to="/genere" variant="outlined">
          ← Back to Generes
        </Button>
      </Box>
    </Box>
  );
}
