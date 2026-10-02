export type UserRole = 'owner' | 'admin' | 'analyst' | 'reviewer' | 'viewer' | 'member';

export interface TenantMembership {
  id: string; // UUIDv7
  name: string;
  taxId?: string; // NIF / CIF
  role: UserRole;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  memberships: TenantMembership[];
}

export interface AuthState {
  user: UserProfile | null;
  activeTenant: TenantMembership | null;
  token: string | null; // JWT almacenado estrictamente en memoria JavaScript
  isDemoMode: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SignupData {
  fullName: string;
  email: string;
  password?: string;
  companyName: string;
  taxId: string;
  cpvSector?: string;
}
