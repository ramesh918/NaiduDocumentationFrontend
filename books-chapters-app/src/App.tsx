import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import ChaptersPage from './pages/ChaptersPage';
import ContentPage from './pages/ContentPage';
import GenerePage from './pages/GenerePage';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function App() {
  const navigate = useNavigate();

  return (
    <div>
      {/* ======= App Bar ======= */}
      <Box>
        <AppBar position="static" sx={{ textAlign: 'center' }}>
          <Toolbar variant="dense" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              variant="h5"
              color="inherit"
              component="div"
              sx={{ marginTop: '7px', marginLeft: '10px' }}
            >
              My Learning Library
            </Typography>

            {/* ======= Navigation Buttons ======= */}
            <Stack direction="row" spacing={2} sx={{ marginRight: '20px' }}>
              <Button color="inherit" onClick={() => navigate('/genere')}>
                Genere
              </Button>
              <Button color="inherit" onClick={() => navigate('/books')}>
                Books
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>

      {/* ======= Main Routes ======= */}
      <main>
        <Routes>
          {/* Redirect root to genere page */}
          <Route path="/" element={<Navigate to="/genere" replace />} />

          {/* Genere CRUD */}
          <Route path="/genere" element={<GenerePage />} />

          {/* Books under genere or all */}
          <Route path="/books" element={<BooksPage />} />
          <Route path="/genere/:genereId/books" element={<BooksPage />} />

          {/* Chapters for specific book */}
          <Route path="/books/:bookId/chapters" element={<ChaptersPage />} />

          {/* Content for specific chapter */}
          <Route
            path="/books/:bookId/chapters/:chapterId/contents"
            element={<ContentPage />}
          />
        </Routes>
      </main>
    </div>
  );
}
