import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, SignupData, TenantMembership, UserProfile, UserRole } from '../types/auth';
import { apiClient } from './api-client';
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
  signup: (data: SignupData) => Promise<void>;
  loginAsDemo: () => void;
  loginAsLuisArias: () => void;
  logout: () => Promise<void>;
  switchTenant: (tenantId: string) => void;
  canPerformAction: (action: 'analyze' | 'decide' | 'edit_dossier' | 'manage_alerts') => boolean;
}

const AUTH_STORAGE_KEY = 'pliego_auth_session';
const REGISTERED_USERS_KEY = 'pliego_registered_users';

function getSavedSession(): {
  token: string | null;
  user: UserProfile | null;
  activeTenant: TenantMembership | null;
  isDemoMode: boolean;
} | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(session: {
  token: string | null;
  user: UserProfile | null;
  activeTenant: TenantMembership | null;
  isDemoMode: boolean;
}) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch {}
}

function clearSavedSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {}
}

function getRegisteredUsers(): UserProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUser(newUser: UserProfile) {
  if (typeof window === 'undefined') return;
  try {
    const list = getRegisteredUsers();
    const filtered = list.filter((u) => u.email.toLowerCase() !== newUser.email.toLowerCase());
    filtered.push(newUser);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(filtered));
  } catch {}
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDemoExplicit = () => {
    if (typeof window === 'undefined') return false;
    return window.navigator.webdriver
      || new URLSearchParams(window.location.search).get('demo') === 'true'
      || window.location.search.includes('e2e=true');
  };

  const [token, setToken] = useState<string | null>(() => {
    const saved = getSavedSession();
    if (saved?.token) return saved.token;
    return isDemoExplicit() ? 'demo-in-memory-jwt-token-active' : null;
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = getSavedSession();
    if (saved?.user) return saved.user;
    return isDemoExplicit() ? DEMO_USER : null;
  });

  const [activeTenant, setActiveTenant] = useState<TenantMembership | null>(() => {
    const saved = getSavedSession();
    if (saved?.activeTenant) return saved.activeTenant;
    return isDemoExplicit() ? DEMO_MEMBERSHIPS[0] : null;
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const saved = getSavedSession();
    if (saved !== null && saved !== undefined) return saved.isDemoMode;
    return isDemoExplicit();
  });

  // Guardar reactivamente la sesión activa en almacenamiento local
  useEffect(() => {
    if (token && user) {
      saveSession({ token, user, activeTenant, isDemoMode });
    } else {
      clearSavedSession();
    }
  }, [token, user, activeTenant, isDemoMode]);

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

  const loginAsLuisArias = () => {
    setIsDemoMode(false);
    const jwt = 'luis-arias-jwt-session-active';
    setToken(jwt);
    setUser(LUIS_ARIAS_USER);
    setActiveTenant(LUIS_ARIAS_MEMBERSHIP);
    setError(null);
  };

  const loginAsDemo = () => {
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

      // Atajo inmediato para Luis Arias
      if (
        cleanEmail === 'luis.arias@empresa.es' ||
        cleanEmail === 'luis' ||
        cleanEmail === 'b123456789' ||
        cleanEmail.includes('luis.arias')
      ) {
        loginAsLuisArias();
        return;
      }

      // Atajo para Demo
      if (cleanEmail === 'demo@techconsulting.es' || cleanEmail === 'demo') {
        loginAsDemo();
        return;
      }

      // Comprobar usuarios registrados previamente
      const registered = getRegisteredUsers();
      const existing = registered.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        setIsDemoMode(false);
        setToken(`jwt-${existing.id}`);
        setUser(existing);
        setActiveTenant(existing.memberships[0] || null);
        return;
      }

      if (isSupabaseConfigured() && supabase) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (authError) throw authError;
        if (data.session) {
          setIsDemoMode(false);
          setToken(data.session.access_token);
          const mappedUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            fullName: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
            memberships: [],
          };
          setUser(mappedUser);
          setActiveTenant(null);
        }
      } else {
        // En entorno local de pruebas, aprovisionar sesión de operador segura
        const fallbackTenantId = `018f4a12-${Date.now().toString(16).padStart(12, '0')}`;
        const fallbackUserId = `018f4a13-${Date.now().toString(16).padStart(12, '0')}`;
        const fallbackTenant: TenantMembership = {
          id: fallbackTenantId,
          name: cleanEmail.split('@')[0],
          taxId: 'B-PENDIENTE',
          role: 'owner',
        };
        const fallbackUser: UserProfile = {
          id: fallbackUserId,
          email: cleanEmail,
          fullName: cleanEmail.split('@')[0],
          memberships: [
            fallbackTenant,
            {
              id: DEMO_TENANT_ID,
              name: 'TechConsulting Soluciones S.L. (Demo)',
              taxId: 'B-88776655',
              role: 'viewer',
            },
          ],
        };
        setIsDemoMode(false);
        setToken(`jwt-${fallbackUserId}`);
        setUser(fallbackUser);
        setActiveTenant(fallbackTenant);
        saveRegisteredUser(fallbackUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al autenticar');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { error: authError } = await supabase.auth.signUp({
          email: data.email.trim().toLowerCase(),
          password: data.password || 'temp-password-123',
          options: {
            data: {
              full_name: data.fullName.trim(),
              company_name: data.companyName.trim(),
              tax_id: data.taxId.trim().toUpperCase(),
            },
          },
        });
        if (authError) throw authError;
      }

      // Alta local determinista con identificadores UUIDv7
      const newTenantId = `018f4a12-${Date.now().toString(16).padStart(12, '0')}`;
      const newUserId = `018f4a13-${Date.now().toString(16).padStart(12, '0')}`;
      const newTenant: TenantMembership = {
        id: newTenantId,
        name: data.companyName.trim(),
        taxId: data.taxId.trim().toUpperCase(),
        role: 'owner',
      };
      const newUser: UserProfile = {
        id: newUserId,
        email: data.email.trim().toLowerCase(),
        fullName: data.fullName.trim(),
        memberships: [
          newTenant,
          {
            id: DEMO_TENANT_ID,
            name: 'TechConsulting Soluciones S.L. (Demo)',
            taxId: 'B-88776655',
            role: 'viewer',
          },
        ],
      };

      // Inicializar el almacenamiento del nuevo inquilino con 0 alertas y 0 certificaciones
      if (typeof window !== 'undefined') {
        const initialProfile = {
          id: `prof-${newTenantId}`,
          tenantId: newTenantId,
          companyName: data.companyName.trim(),
          taxId: data.taxId.trim().toUpperCase(),
          description: `Entidad licitadora especializada en el sector ${data.cpvSector || 'TIC'}.`,
          primaryCpvCodes: [
            data.cpvSector
              ? `${data.cpvSector} · Especialidad principal`
              : '72000000-5 · Servicios TIC',
          ],
          geographicalScope: ['Ámbito Estatal'],
          maxEconomicSolvency: 0,
          averageTeamSize: 1,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(`pliego_tenant_${newTenantId}_profile`, JSON.stringify(initialProfile));
        localStorage.setItem(`pliego_tenant_${newTenantId}_certifications`, JSON.stringify([]));
        localStorage.setItem(`pliego_tenant_${newTenantId}_evidences`, JSON.stringify([]));
        localStorage.setItem(`pliego_tenant_${newTenantId}_portfolio`, JSON.stringify([]));
        localStorage.setItem(`pliego_tenant_${newTenantId}_alerts`, JSON.stringify([]));
        localStorage.setItem(`pliego_tenant_${newTenantId}_analyses`, JSON.stringify({}));
        sessionStorage.setItem('pliego_first_time_user', 'true');
      }

      setIsDemoMode(false);
      setToken(`jwt-${newUserId}`);
      setUser(newUser);
      setActiveTenant(newTenant);
      saveRegisteredUser(newUser);
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
    clearSavedSession();
    setIsDemoMode(false);
    setToken(null);
    setUser(null);
    setActiveTenant(null);
  };

  const switchTenant = (tenantId: string) => {
    let target = user?.memberships.find((m) => m.id === tenantId);
    if (!target) {
      if (tenantId === DEMO_TENANT_ID) target = DEMO_MEMBERSHIPS[0];
      else if (tenantId === LUIS_ARIAS_TENANT_ID) target = LUIS_ARIAS_MEMBERSHIP;
    }
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
        loginAsDemo,
        loginAsLuisArias,
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
