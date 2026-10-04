import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AuthState, SignupData, TenantMembership, UserProfile, UserRole } from '../types/auth';
import { apiClient } from './api-client';
import { toAuthErrorMessage } from './auth-errors';
import { supabase, isSupabaseConfigured } from './supabase';

export const DEMO_TENANT_ID = '018f4a12-892a-7921-98a1-2d4e8b1e4f1a';
export const LUIS_ARIAS_TENANT_ID = '018f4a12-892a-7921-98a1-2d4e8b1e4f3c';

export const LUIS_ARIAS_MEMBERSHIP: TenantMembership = {
  id: LUIS_ARIAS_TENANT_ID,
  name: 'Luis Arias',
  taxId: 'B123456789',
  role: 'owner',
};

export const LUIS_ARIAS_USER: UserProfile = {
  id: '018f4a12-892a-7921-98a1-2d4e8b1e4fbb',
  email: 'luis.arias@empresa.es',
  fullName: 'Luis Arias',
  memberships: [
    LUIS_ARIAS_MEMBERSHIP,
    {
      id: DEMO_TENANT_ID,
      name: 'TechConsulting Soluciones S.L.',
      taxId: 'B-88776655',
      role: 'viewer',
    },
  ],
};

// Membresías estructuradas para validar multi-tenant e impersonación
export const DEMO_MEMBERSHIPS: TenantMembership[] = [
  {
    id: DEMO_TENANT_ID, // UUIDv7
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
  LUIS_ARIAS_MEMBERSHIP,
];

export const DEMO_USER: UserProfile = {
  id: '018f4a12-892a-7921-98a1-2d4e8b1e4fff',
  email: 'demo@techconsulting.es',
  fullName: 'Operador Demo',
  memberships: DEMO_MEMBERSHIPS,
};

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<'provisioned' | 'confirmation_required'>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
  switchTenant: (tenantId: string) => void;
  canPerformAction: (action: 'analyze' | 'decide' | 'edit_dossier' | 'manage_alerts') => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface OnboardingTenantResponse {
  readonly data: {
    readonly tenantId: string;
    readonly name: string;
    readonly taxId: string;
    readonly role: UserRole;
  };
}

function toMembership(response: OnboardingTenantResponse): TenantMembership {
  return {
    id: response.data.tenantId,
    name: response.data.name,
    taxId: response.data.taxId,
    role: response.data.role,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDemoExplicit = () => {
    if (typeof window === 'undefined') return false;
    return window.navigator.webdriver
      || new URLSearchParams(window.location.search).get('demo') === 'true'
      || window.location.search.includes('e2e=true');
  };

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
  // El callback asíncrono de Supabase no debe invalidar la sesión efímera
  // elegida expresamente por el usuario al abrir la demo.
  const demoModeRef = useRef(isDemoExplicit());

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Listener para Supabase Auth reactivo en vivo
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        demoModeRef.current = false;
        setToken(session.access_token);
        const mappedUser: UserProfile = {
          id: session.user.id,
          email: session.user.email || 'usuario@licitaia.es',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Operador',
          memberships: [],
        };
        setUser(mappedUser);
        setActiveTenant(null);
        setIsDemoMode(false);
      } else {
        if (demoModeRef.current) return;
        setToken(null);
        setUser(null);
        setActiveTenant(null);
        setIsDemoMode(false);
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
        // La demo usa una identidad exclusivamente de cliente para mostrar
        // datos de ejemplo; un 401 de la API no debe expulsarla. En una
        // sesión real, en cambio, un 401 sigue cerrando la sesión para no
        // conservar una credencial caducada o revocada.
        if (!isDemoMode) {
          logout();
        }
      },
    });
  }, [token, activeTenant, isDemoMode]);

  const loginAsDemo = () => {
    demoModeRef.current = true;
    setIsDemoMode(true);
    const jwt = 'demo-in-memory-jwt-token-active';
    setToken(jwt);
    setUser(DEMO_USER);
    setActiveTenant(DEMO_MEMBERSHIPS[0]);
    setError(null);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const cleanEmail = email.trim().toLowerCase();

      if (isSupabaseConfigured() && supabase) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (authError) throw authError;
        if (data.session) {
          const membershipResponse = await apiClient.get<OnboardingTenantResponse>('/onboarding/membership', {
            headers: { Authorization: `Bearer ${data.session.access_token}` },
          });
          const membership = toMembership(membershipResponse);
          setIsDemoMode(false);
          setToken(data.session.access_token);
          const mappedUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            fullName: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
            memberships: [membership],
          };
          setUser(mappedUser);
          setActiveTenant(membership);
        }
      } else {
        throw new Error('El inicio de sesión no está disponible hasta configurar Supabase Auth. Puedes usar la demo explícita para explorar el producto.');
      }
    } catch (err) {
      setError(toAuthErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured() || !supabase) {
        throw new Error('La recuperación de contraseña no está disponible hasta configurar Supabase Auth.');
      }

      const redirectTo = `${window.location.origin}/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo,
      });
      if (resetError) throw resetError;
    } catch (err) {
      setError(toAuthErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured() || !supabase) {
        throw new Error('El cambio de contraseña no está disponible hasta configurar Supabase Auth.');
      }
      if (password.length < 12) {
        throw new Error('La contraseña debe tener al menos 12 caracteres.');
      }

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
    } catch (err) {
      setError(toAuthErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData): Promise<'provisioned' | 'confirmation_required'> => {
    setIsLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured() || !supabase) {
        throw new Error('El registro no está disponible hasta configurar Supabase Auth. No se ha creado ninguna cuenta.');
      }
      if (!data.password) {
        throw new Error('Debes indicar una contraseña para crear la cuenta.');
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        options: { data: { full_name: data.fullName.trim() } },
      });
      if (signUpError) throw signUpError;

      // Cuando Supabase exige confirmar el correo no emite sesión. En ese caso
      // no se crea ningún tenant hasta que el usuario pueda autenticarse.
      if (!signUpData.session || !signUpData.user) {
        return 'confirmation_required';
      }

      const provisioned = await apiClient.post<OnboardingTenantResponse>('/onboarding/tenant', {
        legalName: data.companyName.trim(),
        taxId: data.taxId.trim().toUpperCase(),
        cpvCode: data.cpvSector,
      }, {
        headers: { Authorization: `Bearer ${signUpData.session.access_token}` },
      });
      const membership = toMembership(provisioned);
      setIsDemoMode(false);
      setToken(signUpData.session.access_token);
      setUser({
        id: signUpData.user.id,
        email: signUpData.user.email || data.email.trim().toLowerCase(),
        fullName: data.fullName.trim(),
        memberships: [membership],
      });
      setActiveTenant(membership);
      return 'provisioned';
    } catch (err) {
      setError(toAuthErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    demoModeRef.current = false;
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Silenciar si la sesión ya no era válida
      }
    }
    setIsDemoMode(false);
    setToken(null);
    setUser(null);
    setActiveTenant(null);
  };

  const switchTenant = (tenantId: string) => {
    const target = user?.memberships.find((m) => m.id === tenantId);
    if (target) {
      setActiveTenant(target);
      setIsDemoMode(target.id === DEMO_TENANT_ID);
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
        requestPasswordReset,
        updatePassword,
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
