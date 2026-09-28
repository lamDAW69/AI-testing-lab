import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, TenantMembership, UserProfile, UserRole } from '../types/auth';
import { apiClient } from './api-client';

interface AuthContextValue extends AuthState {
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  switchTenant: (tenantId: string) => void;
  canPerformAction: (action: 'analyze' | 'decide' | 'edit_dossier' | 'manage_alerts') => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Membresías de demostración/desarrollo estructuradas para validar multi-tenant
const DEMO_MEMBERSHIPS: TenantMembership[] = [
  {
    id: '018f4a12-892a-7921-98a1-2d4e8b1e4f1a', // UUIDv7
    name: 'TechConsulting Soluciones S.L.',
    taxId: 'B-88776655',
    role: 'owner',
  },
  {
    id: '018f4a12-892a-7921-98a1-2d4e8b1e4f2b', // UUIDv7 Tenant B
    name: 'Infraestructuras y Obras del Norte S.A.',
    taxId: 'A-11223344',
    role: 'analyst',
  },
];

const DEMO_USER: UserProfile = {
  id: '018f4a12-892a-7921-98a1-2d4e8b1e4fff',
  email: 'usuario@techconsulting.es',
  fullName: 'Luis Méndez',
  memberships: DEMO_MEMBERSHIPS,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // El token JWT vive EXCLUSIVAMENTE en memoria JavaScript para inmunidad contra ataques XSS
  const [token, setToken] = useState<string | null>('demo-in-memory-jwt-token-active');
  const [user, setUser] = useState<UserProfile | null>(DEMO_USER);
  const [activeTenant, setActiveTenant] = useState<TenantMembership | null>(DEMO_MEMBERSHIPS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Configurar apiClient con getters dinámicos
    apiClient.configure({
      getToken: () => token,
      getTenantId: () => activeTenant?.id || null,
      onUnauthorized: () => {
        logout();
      },
    });
  }, [token, activeTenant]);

  const login = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulación de autenticación segura (en producción se llama a Supabase Auth)
      await new Promise((resolve) => setTimeout(resolve, 600));
      setUser(DEMO_USER);
      setActiveTenant(DEMO_MEMBERSHIPS[0]);
      setToken('jwt-session-token-' + Math.random().toString(36).substring(7));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al autenticar');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Limpieza completa del estado en memoria
    setToken(null);
    setUser(null);
    setActiveTenant(null);
  };

  const switchTenant = (tenantId: string) => {
    const target = user?.memberships.find((m) => m.id === tenantId);
    if (target) {
      setActiveTenant(target);
    }
  };

  // Matriz de permisos de interfaz según Sección 5 del Wireframe
  const canPerformAction = (action: 'analyze' | 'decide' | 'edit_dossier' | 'manage_alerts'): boolean => {
    if (!activeTenant) return false;
    const role: UserRole = activeTenant.role;
    // Solo owner, admin y analyst tienen permisos de mutación operativa
    const authorizedRoles: UserRole[] = ['owner', 'admin', 'analyst'];
    return authorizedRoles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeTenant,
        token,
        isLoading,
        error,
        login,
        logout,
        switchTenant,
        canPerformAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
