import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface GenereUIState {
  dialogOpen: boolean;
  dialogMode: 'create' | 'edit' | null;
  currentGenereId?: string | null;
}

const initialState: GenereUIState = {
  dialogOpen: false,
  dialogMode: null,
  currentGenereId: null,
};

const uiGenereSlice = createSlice({
  name: 'uiGenere',
  initialState,
  reducers: {
    openGenereDialog: (
      state,
      action: PayloadAction<{ mode: 'create' | 'edit'; genereId?: string }>
    ) => {
      state.dialogOpen = true;
      state.dialogMode = action.payload.mode;
      state.currentGenereId = action.payload.genereId;
    },
    closeGenereDialog: (state) => {
      state.dialogOpen = false;
      state.dialogMode = null;
      state.currentGenereId = undefined;
    },
    updateGenereId: (state, action: PayloadAction<string | null>) => {
      state.currentGenereId = action.payload;
    }
  },
});

export const { openGenereDialog, closeGenereDialog,updateGenereId } = uiGenereSlice.actions;
export default uiGenereSlice.reducer;
