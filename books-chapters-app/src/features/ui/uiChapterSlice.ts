import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ChapterUIState {
  dialogOpen: boolean;
  dialogMode: 'create' | 'edit' | null;
  currentChapterId?: string;
  currentBookId?: string;
}

const initialState: ChapterUIState = {
  dialogOpen: false,
  dialogMode: null,
  currentChapterId: undefined,
  currentBookId: undefined,
};

const uiChapterSlice = createSlice({
  name: 'uiChapters',
  initialState,
  reducers: {
    setCurrentBookId: (state, action: PayloadAction<string>) => {
      state.currentBookId = action.payload;
    },
    updateChapterId: (state, action: PayloadAction<string | null>) => {
      state.currentChapterId = action.payload || undefined;
    },
    openChapterDialog: (
      state,
      action: PayloadAction<{ mode: 'create' | 'edit'; chapterId?: string }>
    ) => {
      state.dialogOpen = true;
      state.dialogMode = action.payload.mode;
      state.currentChapterId = action.payload.chapterId;
    },
    closeChapterDialog: (state) => {
      state.dialogOpen = false;
      state.dialogMode = null;
      state.currentChapterId = undefined;
    },
  },
});

export const { setCurrentBookId, openChapterDialog, closeChapterDialog,updateChapterId } =
  uiChapterSlice.actions;

export default uiChapterSlice.reducer;
