// src/features/genere/genereSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {api as apiClient} from '../../api/apiClient';

export interface Genere {
  _id: string;
  title: string;
}

interface GenereState {
  generes: Genere[];
  loading: boolean;
  error: string | null;
}

const initialState: GenereState = {
  generes: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchGeneres = createAsyncThunk('generes/fetchAll', async () => {
  const res = await apiClient.get<Genere[]>('/generes');
  console.log('Fetched generes:', res.data);
  return res.data;
});

export const createGenere = createAsyncThunk(
  'generes/create',
  async (title: string) => {
    const res = await apiClient.post<Genere>('/generes', { title });
    return res.data;
  }
);

export const updateGenere = createAsyncThunk(
  'generes/update',
  async ({ id, patch }: { id: string; patch: Partial<Genere> }) => {
    const res = await apiClient.put<Genere>(`/generes/${id}`, patch);
    return res.data;
  }
);

export const deleteGenere = createAsyncThunk(
  'generes/delete',
  async (id: string) => {
    await apiClient.delete(`/generes/${id}`);
    return id;
  }
);

const genereSlice = createSlice({
  name: 'generes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGeneres.fulfilled, (state, action) => {
        state.loading = false;
        state.generes = action.payload;
      })
      .addCase(fetchGeneres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch generes';
      })
      .addCase(createGenere.fulfilled, (state, action) => {
        state.generes.push(action.payload);
      })
      .addCase(updateGenere.fulfilled, (state, action) => {
        const index = state.generes.findIndex(g => g._id === action.payload._id);
        if (index !== -1) state.generes[index] = action.payload;
      })
      .addCase(deleteGenere.fulfilled, (state, action) => {
        state.generes = state.generes.filter(g => g._id !== action.payload);
      });
  },
});

export default genereSlice.reducer;
