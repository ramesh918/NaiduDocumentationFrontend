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
import {
  openChapterDialog as openDialog,
  closeChapterDialog as closeDialog,
  updateChapterId
} from '../features/ui/uiChapterSlice';
import * as api from '../api/chapters';


export default function ChaptersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const { dialogOpen, dialogMode, currentChapterId } = useSelector(
    (state: RootState) => state.uiChapters
  );

  const { currentBookId } = useSelector((state: RootState) => state.uiBooks);

  const [title, setTitle] = useState('');

  // Fetch chapters for the selected book
  const { data: chapters, isLoading, isError } = useQuery({
    queryKey: ['chapters', currentBookId],
    queryFn: () => api.getChapters(currentBookId as string),
    enabled: !!currentBookId,
  });

  // Mutations
  const createMutation = useMutation<any, Error, { title: string; bookId: string }>({
    mutationFn: api.createChapter,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chapters', currentBookId] }),
  });

  const updateMutation = useMutation<any, Error, { id: string; patch: { title: string } }>({
    mutationFn: ({ id, patch }) => api.updateChapter(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chapters', currentBookId] }),
  });

  const deleteMutation = useMutation<any, Error, string>({
    mutationFn: api.deleteChapter,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chapters', currentBookId] }),
  });

  // Dialog handlers
  const handleOpenCreate = () => {
    setTitle('');
    dispatch(openDialog({ mode: 'create' }));
  };

  const handleOpenEdit = (chapter: { _id: string; title: string }) => {
    setTitle(chapter.title);
    dispatch(openDialog({ mode: 'edit', chapterId: chapter._id }));
  };

  const handleClose = () => dispatch(closeDialog());

  const handleSave = async () => {
    if (!title.trim()) return;

    try {
      if (dialogMode === 'create') {
        await createMutation.mutateAsync({ title, bookId: currentBookId! });
      } else if (dialogMode === 'edit' && currentChapterId) {
        await updateMutation.mutateAsync({ id: currentChapterId, patch: { title } });
      }
      handleClose();
    } catch {
      alert('Failed to save chapter');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch {
      alert('Failed to delete chapter');
    }
  };

  if (!currentBookId)
    return (
      <Typography sx={{ mt: 4, textAlign: 'center' }}>
        Please select a book first.
      </Typography>
    );

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Failed to load chapters</Alert>;

  return (
    <Box sx={{ maxWidth: 600, m: '40px auto', textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Manage Chapters</Typography>
      <Button variant="contained" onClick={handleOpenCreate} sx={{ mb: 3 }}>
        + Add Chapter
      </Button>

      {(!chapters || chapters.length === 0) ? (
        <Typography>No chapters found for this book</Typography>
      ) : (
        <List>
          {chapters.map((chapter: any) => (
            <div key={chapter._id}>
              <ListItem
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => handleOpenEdit(chapter)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(chapter._id)}><Delete /></IconButton>
                  </Stack>
                }
                disablePadding
              >
                <ListItemButton 
                 onClick={()=>dispatch(updateChapterId(chapter._id))}
                                  component={Link}
                                  to={`/books/${currentBookId}/chapters/${chapter._id}/contents`}
                sx={{ border: '1px solid #ccc', mb: 1 }}>
                  <ListItemText primary={chapter.title} />
                </ListItemButton>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>{dialogMode === 'create' ? 'Add Chapter' : 'Edit Chapter'}</DialogTitle>
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
        <Button component={Link} to="/books" variant="outlined">
          ← Back to Books
        </Button>
      </Box>
    </Box>
  );
}

