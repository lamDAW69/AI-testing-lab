import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeProvider } from './lib/theme-context';
import { AuthProvider } from './lib/auth-context';
import { DataProvider } from './lib/data-context';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <RouterProvider router={router} future={{ v7_startTransition: true }} />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
