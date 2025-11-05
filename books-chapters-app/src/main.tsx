
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import {  QueryClientProvider } from '@tanstack/react-query';
import  {queryClient}  from './queryClient';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store';
import './index.css'; // optional, may not exist yet



createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

