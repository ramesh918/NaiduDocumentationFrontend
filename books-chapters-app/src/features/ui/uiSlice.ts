import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  currentGenereId: string | null;
  dialogOpen: boolean;
  dialogMode: 'create' | 'edit';
}

const initialState: UIState = {
  currentGenereId: null,
  dialogOpen: false,
  dialogMode: 'create',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<{ mode: 'create' | 'edit'; genereId?: string }>) => {
      state.dialogOpen = true;
      state.dialogMode = action.payload.mode;
      state.currentGenereId = action.payload.genereId || null;
    },
    closeDialog: (state) => {
      state.dialogOpen = false;
      state.currentGenereId = null;
    },
  },
});

export const { openDialog, closeDialog } = uiSlice.actions;
export default uiSlice.reducer;
