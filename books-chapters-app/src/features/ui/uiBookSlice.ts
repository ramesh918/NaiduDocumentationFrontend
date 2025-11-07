import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface BookUIState {
  dialogOpen: boolean;
  dialogMode: 'create' | 'edit' | null;
  currentBookId?: string | null;
}

const initialState: BookUIState = {
  dialogOpen: false,
  dialogMode: null,
  currentBookId: null,
};

const uiBookSlice = createSlice({
  name: 'uiBook',
  initialState,
  reducers: {
    openBookDialog: (
      state,
      action: PayloadAction<{ mode: 'create' | 'edit'; bookId?: string }>
    ) => {
      state.dialogOpen = true;
      state.dialogMode = action.payload.mode;
      state.currentBookId = action.payload.bookId;
    },
    closeBookDialog: (state) => {
      state.dialogOpen = false;
      state.dialogMode = null;
      state.currentBookId = null;
    },
    updateBookId: (state, action: PayloadAction<string | null>) => {
      state.currentBookId = action.payload;
    }
  },
});

export const { openBookDialog, closeBookDialog,updateBookId } = uiBookSlice.actions;
export default uiBookSlice.reducer;
