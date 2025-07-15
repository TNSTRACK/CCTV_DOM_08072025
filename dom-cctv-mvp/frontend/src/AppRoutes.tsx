// src/AppRoutes.tsx
// Configuración de rutas principales de la aplicación

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

// Componentes de layout
import MainLayout from '@/components/Layout/MainLayout';
import AuthLayout from '@/components/Layout/AuthLayout';

// Páginas
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import EventsPage from '@/pages/EventsPage';
import EventDetailPage from '@/pages/EventDetailPage';
import UndocumentedEventsPage from '@/pages/UndocumentedEventsPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Componente para rutas públicas (redirigir si ya está autenticado)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

/**
 * Configuración principal de rutas
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </PublicRoute>
        }
      />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Redirigir raíz a dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard */}
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* Eventos */}
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:eventId" element={<EventDetailPage />} />
        
        {/* Documentación de eventos */}
        <Route path="undocumented-events" element={<UndocumentedEventsPage />} />
        
        {/* Página 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Ruta de fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;