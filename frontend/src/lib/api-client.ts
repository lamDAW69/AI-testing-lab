/**
 * Cliente HTTP Seguro para LicitaIA (Cloudflare Pages + BFF / API)
 *
 * Principios de seguridad aplicados:
 * 1. Tokens en memoria: El token JWT nunca se persiste en localStorage/sessionStorage (inmune a robo por XSS).
 * 2. Multi-Tenant Anti-BOLA: Inyecta obligatoriamente la cabecera X-Tenant-ID resuelta por la membresía activa.
 * 3. Sanitización de errores: No expone trazas internas del servidor ni JWTs en mensajes de error.
 */

class ApiClient {
  private baseUrl: string;
  private tokenGetter: () => string | null = () => null;
  private tenantGetter: () => string | null = () => null;
  private onUnauthorized: () => void = () => {};

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || '/api';
  }

  public configure(config: {
    getToken: () => string | null;
    getTenantId: () => string | null;
    onUnauthorized: () => void;
  }) {
    this.tokenGetter = config.getToken;
    this.tenantGetter = config.getTenantId;
    this.onUnauthorized = config.onUnauthorized;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const cleanBase = this.baseUrl.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const normalizedPath =
      cleanBase.endsWith('/api') && cleanEndpoint.startsWith('/api/')
        ? cleanEndpoint.substring(4)
        : cleanEndpoint;
    const url = `${cleanBase}${normalizedPath}`;
    const headers = new Headers(options.headers || {});

    // Cabeceras obligatorias estándar
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    // Inyección de JWT en memoria
    const token = this.tokenGetter();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Inyección inmutable del Tenant (Anti-BOLA)
    const tenantId = this.tenantGetter();
    if (tenantId) {
      headers.set('X-Tenant-ID', tenantId);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        this.onUnauthorized();
        throw new Error('Su sesión ha expirado o no es válida. Por favor, inicie sesión nuevamente.');
      }

      if (response.status === 403) {
        throw new Error('No tiene los permisos necesarios en esta organización para realizar esta acción.');
      }

      if (response.status === 404) {
        throw new Error('El recurso solicitado no existe o no tiene acceso a él.');
      }

      if (response.status === 429) {
        throw new Error('Límite de solicitudes alcanzado. Por favor, espere unos momentos antes de reintentar.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const userMessage = errorData?.message || `Error en la solicitud (Código ${response.status})`;
        throw new Error(userMessage);
      }

      // Si la respuesta no tiene contenido (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Ocurrió un error inesperado de comunicación con el servidor.');
    }
  }

  public get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
