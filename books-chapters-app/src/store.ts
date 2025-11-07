// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import uiBooksReducer from './features/ui/uiBookSlice';
import uiGenereReducer from './features/ui/uiGenereSlice';
import uiChaptersReducer from './features/ui/uiChapterSlice';
import genereReducer from './features/genere/genereSlice';
import bookReducer from './features/genere/booksSlice';

export const store = configureStore({
  reducer: {
    uiBooks: uiBooksReducer,
    uiGeneres: uiGenereReducer,
    uiChapters: uiChaptersReducer,
    generes: genereReducer,
    books: bookReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

