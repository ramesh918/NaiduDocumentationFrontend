// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import genereReducer from './features/genere/genereSlice';
import uiReducer from './features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    generes: genereReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

