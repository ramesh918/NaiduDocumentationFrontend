import { Routes, Route, Link, Navigate } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import ChaptersPage from './pages/ChaptersPage';
import ContentPage from './pages/ContentPage';

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: 'Inter, system-ui, Arial' }}>
      <header style={{ marginBottom: 16 }}>
        <Link to="/books" style={{ fontSize: 20, fontWeight: 600 }}>Books</Link>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/:bookId/chapters" element={<ChaptersPage />} />
          <Route path="/books/:bookId/chapters/:chapterId/contents" element={<ContentPage />} />
        </Routes>
      </main>
    </div>
  );
}