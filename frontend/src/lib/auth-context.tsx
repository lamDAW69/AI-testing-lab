import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, SignupData, TenantMembership, UserProfile, UserRole } from '../types/auth';
import { apiClient } from './api-client';
import { supabase, isSupabaseConfigured } from './supabase';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  loginAsDemo: () => void;
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
  email: 'demo@techconsulting.es',
  fullName: 'Operador Demo',
  memberships: DEMO_MEMBERSHIPS,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // La demo sólo puede activarse por una intención explícita. Un navegador de
  // pruebas no es una identidad y no debe conceder acceso automáticamente.
  const isDemoExplicit = () => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('demo') === 'true';
  };

  // El token JWT vive EXCLUSIVAMENTE en memoria JavaScript para inmunidad contra ataques XSS (Regla 4.2 AGENTS.md)
  // Por defecto, un visitante comienza como null (sesión no iniciada).
  const [token, setToken] = useState<string | null>(() => {
    return isDemoExplicit() ? 'demo-in-memory-jwt-token-active' : null;
  });
  const [user, setUser] = useState<UserProfile | null>(() => {
    return isDemoExplicit() ? DEMO_USER : null;
  });
  const [activeTenant, setActiveTenant] = useState<TenantMembership | null>(() => {
    return isDemoExplicit() ? DEMO_MEMBERSHIPS[0] : null;
  });
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return isDemoExplicit();
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Listener para Supabase Auth reactivo en vivo
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setToken(session.access_token);
        const mappedUser: UserProfile = {
          id: session.user.id,
          email: session.user.email || 'usuario@licitaia.es',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Operador',
          // Las membresías nunca proceden del cliente ni de datos demo. El
          // backend debe resolverlas desde tenant_memberships tras validar JWT.
          memberships: [],
        };
        setUser(mappedUser);
        setActiveTenant(null);
        setIsDemoMode(false);
      } else {
        setToken(null);
        setUser(null);
        setActiveTenant(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
        if (data.session) {
          setIsDemoMode(false);
          setToken(data.session.access_token);
          const mappedUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || email.split('@')[0],
            memberships: [],
          };
          setUser(mappedUser);
          setActiveTenant(null);
        }
      } else {
        // Nunca convertir credenciales arbitrarias en una sesión demo.
        throw new Error('El inicio de sesión no está disponible hasta configurar Supabase Auth. Puedes usar la demo explícita para explorar el producto.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al autenticar');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = () => {
    setIsDemoMode(true);
    setToken('demo-in-memory-jwt-token-active');
    setUser(DEMO_USER);
    setActiveTenant(DEMO_MEMBERSHIPS[0]);
    setError(null);
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    setError(null);
    try {
      // El alta debe crear tenant, membresía owner y dossier en una transacción
      // de backend tras validar JWT. Este contrato aún no existe: fallamos
      // cerradamente antes de crear una cuenta de Auth sin tenant asociado.
      void data;
      throw new Error('El registro corporativo estará disponible cuando el backend de provisión segura esté configurado. No se ha creado ninguna cuenta.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar la empresa');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Silenciar si la sesión ya no era válida
      }
    }
    // Limpieza completa del estado en memoria
    setIsDemoMode(false);
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
        isDemoMode,
        isLoading,
        error,
        login,
        signup,
        loginAsDemo,
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
