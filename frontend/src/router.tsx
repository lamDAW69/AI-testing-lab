import React, { useEffect } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { TenderDetailPage } from './pages/TenderDetailPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AnalysisDetailPage } from './pages/AnalysisDetailPage';
import { AlertsPage } from './pages/AlertsPage';
import { DossierPage } from './pages/DossierPage';
import { SettingsPage } from './pages/SettingsPage';
import { useAuth } from './lib/auth-context';

// Guarda de rutas autenticadas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

/**
 * Punto de entrada explícito para la demo. Primero establece la identidad
 * efímera de demo y sólo después entra a una ruta protegida. Así evitamos una
 * carrera entre setState() y navigate() que redirigía de vuelta a /login.
 */
const DemoEntry: React.FC = () => {
  const { loginAsDemo, isDemoMode } = useAuth();

  useEffect(() => {
    loginAsDemo();
    // loginAsDemo no depende de datos de ruta; se ejecuta una vez al montar la entrada.
    // React StrictMode puede repetirlo en desarrollo, y ambas ejecuciones son idempotentes.
  }, []);

  return isDemoMode ? <Navigate to="/app/inicio" replace /> : null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/registro',
    element: <RegisterPage />,
  },
  {
    path: '/signup',
    element: <Navigate to="/registro" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/demo',
    element: <DemoEntry />,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/inicio" replace />,
      },
      {
        path: 'inicio',
        element: <HomePage />,
      },
      {
        path: 'catalogo',
        element: <CatalogPage />,
      },
      {
        path: 'oportunidades/:id',
        element: <TenderDetailPage />,
      },
      {
        path: 'portfolio',
        element: <PortfolioPage />,
      },
      {
        path: 'portfolio/:tenderId',
        element: <AnalysisDetailPage />,
      },
      {
        path: 'alertas',
        element: <AlertsPage />,
      },
      {
        path: 'dossier',
        element: <DossierPage />,
      },
      {
        path: 'configuracion',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/app/inicio" replace />,
  },
], {
  future: {
    v7_relativeSplatPath: true,
  },
});
