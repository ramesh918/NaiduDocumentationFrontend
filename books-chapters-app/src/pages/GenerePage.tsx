import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Typography, List, ListItem, ListItemButton, ListItemText, Divider,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Stack, CircularProgress, Alert
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import {openGenereDialog as openDialog, closeGenereDialog as closeDialog, updateGenereId } from '../features/ui/uiGenereSlice';
import * as api from '../api/apiClient';

export default function GenerePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { dialogOpen, dialogMode, currentGenereId } = useSelector((state: RootState) => state.uiGeneres);
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');

  // Fetch generes
  const { data: generes, isLoading, isError } = useQuery({ queryKey: ['generes'], queryFn: api.getGeneres });

  // Mutations
  const createMutation = useMutation<any, Error, string>({
    mutationFn: api.createGenere,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['generes'] }),
  });
  const updateMutation = useMutation<any, Error, { id: string; patch: { title: string } }>({
    mutationFn: ({ id, patch }) => api.updateGenere(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['generes'] }),
  });
  const deleteMutation = useMutation<any, Error, string>({
    mutationFn: api.deleteGenere,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['generes'] }),
  });

  // Dialog handlers
  const handleOpenCreate = () => {
    setTitle('');
    dispatch(openDialog({ mode: 'create' }));
  };

  const handleOpenEdit = (genere: { _id: string; title: string }) => {
    setTitle(genere.title);
    dispatch(openDialog({ mode: 'edit', genereId: genere._id }));
  };

  const handleClose = () => dispatch(closeDialog());

  const handleSave = async () => {
    if (!title.trim()) return;
    try {
      if (dialogMode === 'create') {
        await createMutation.mutateAsync(title);
      } else if (dialogMode === 'edit' && currentGenereId) {
        await updateMutation.mutateAsync({ id: currentGenereId, patch: { title } });
      }
      handleClose();
    } catch (err) {
      alert('Failed to save genere');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch {
      alert('Failed to delete genere');
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Failed to load generes</Alert>;

  return (
    <Box sx={{ maxWidth: 600, m: '40px auto', textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Manage Generes</Typography>
      <Button variant="contained" onClick={handleOpenCreate} sx={{ mb: 3 }}>+ Add Genere</Button>

      {generes.length === 0 ? (
        <Typography>No generes found</Typography>
      ) : (
        <List>
          {generes.map((genere: any) => (
            <div key={genere._id}>
              <ListItem
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => handleOpenEdit(genere)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(genere._id)}><Delete /></IconButton>
                  </Stack>
                }
                disablePadding
              >
                <ListItemButton onClick={()=>dispatch(updateGenereId(genere._id))}component={Link} to={`/genere/${genere._id}/books`} sx={{ border: '1px solid #ccc', mb: 1 }}>
                  <ListItemText primary={genere.title} />
                </ListItemButton>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>{dialogMode === 'create' ? 'Add Genere' : 'Edit Genere'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>{dialogMode === 'create' ? 'Create' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
