
import { configureStore } from '@reduxjs/toolkit';
export const store = configureStore({
  reducer: {
    // add reducers here later, e.g. books: booksReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

