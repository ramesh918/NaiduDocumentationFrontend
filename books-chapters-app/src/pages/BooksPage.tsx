import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/apiClient';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

interface Book {
  id: string;
  title: string;
  description?: string;
  genereId: string;
}

export default function BooksPage() {
  const { genereId } = useParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        setError(null);

        const data = genereId
          ? await api.getBooksByGenere(genereId)
          : await api.getBooks();

        setBooks(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load books');
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [genereId]);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  if (books.length === 0)
    return (
      <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
        No books found{genereId ? ' for this genere' : ''}.
      </Typography>
    );

  return (
    <Box sx={{ maxWidth: 600, margin: '40px auto', textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {genereId ? 'Books in this Genere' : 'All Books'}
      </Typography>

      <List>
        {books.map((book) => (
          <div key={book.id}>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to={`/books/${book.id}/chapters`}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  mb: 1,
                }}
              >
                <ListItemText
                  primary={book.title}
                  secondary={book.description || ''}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>

      <Box sx={{ mt: 3 }}>
        <Button component={Link} to="/genere" variant="outlined">
          ← Back to Generes
        </Button>
      </Box>
    </Box>
  );
}
