// src/features/Book/BookSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {api as apiClient} from '../../api/books';

export interface Book {
  _id: string;
  title: string;
  genereId: string;
}

interface BookState {
  Books: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BookState = {
  Books: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchBooks = createAsyncThunk('Books/fetchAll', async () => {
  const res = await apiClient.get<Book[]>('/books');
  console.log('Fetched Books:', res.data);
  return res.data;
});

export const createBook = createAsyncThunk(
  'books/create',
  async (title: string) => {
    const res = await apiClient.post<Book>('/books', { title });
    return res.data;
  }
);

export const updateBook = createAsyncThunk(
  'books/update',
  async ({ id, patch }: { id: string; patch: Partial<Book> }) => {
    const res = await apiClient.put<Book>(`/books/${id}`, patch);
    return res.data;
  }
);

export const deleteBook = createAsyncThunk(
  'books/delete',
  async (id: string) => {
    await apiClient.delete(`/books/${id}`);
    return id;
  }
);

const BookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.Books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch Books';
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.Books.push(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.Books.findIndex(g => g._id === action.payload._id);
        if (index !== -1) state.Books[index] = action.payload;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.Books = state.Books.filter(g => g._id !== action.payload);
      });
  },
});

export default BookSlice.reducer;
