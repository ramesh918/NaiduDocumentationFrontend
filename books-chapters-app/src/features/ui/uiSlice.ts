import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  currentGenereId: string | null;
  currentBookId?: string | null;
  dialogOpen: boolean;
  dialogMode: 'create' | 'edit';
}

const initialState: UIState = {
  currentGenereId: null,
  currentBookId: null,
  dialogOpen: false,
  dialogMode: 'create',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<{ mode: 'create' | 'edit'; genereId?: string, bookId?:string }>) => {
      state.dialogOpen = true;
      state.dialogMode = action.payload.mode;
      state.currentGenereId = action.payload.genereId || null;
      state.currentBookId = action.payload.bookId || null;
    },
    closeDialog: (state) => {
      state.dialogOpen = false;
      state.currentGenereId = null;
      state.currentBookId = null;
    },
    updateGenereId: (state, action: PayloadAction<string | null>) => {
      state.currentGenereId = action.payload;
    }
  },
});

export const { openDialog, closeDialog, updateGenereId } = uiSlice.actions;
export default uiSlice.reducer;
