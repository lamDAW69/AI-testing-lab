import React from 'react';
import { LogOut, Building2, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/auth-context';

export const SettingsPage: React.FC = () => {
  const { user, activeTenant, logout } = useAuth();

  return (
    <div className="space-y-8 max-w-5xl select-none">
      {/* Encabezado con la misma jerarquía editorial que el resto del workspace. */}
      <div>
        <h1 className="app-page-title text-[#161616]">
          Configuración
        </h1>
        <p className="text-xs text-[#68656A] mt-0.5">
          Detalles de tu cuenta de usuario y espacio de organización activo
        </p>
      </div>

      <div className="surface p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cuenta */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8F8B92] block">
            Cuenta
          </span>
          <div className="pt-3 border-t border-[rgba(20,20,20,0.06)]">
            <div className="text-sm font-bold text-[#161616]">
              {user?.fullName || 'Operador'}
            </div>
            <div className="text-xs font-mono text-[#68656A] mt-0.5">
              {user?.email || 'usuario@empresa.com'}
            </div>
          </div>
        </div>

        {/* Organización */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8F8B92] block">
            Organización
          </span>
          <div className="pt-3 border-t border-[rgba(20,20,20,0.06)] space-y-3">
            <div>
              <div className="text-sm font-semibold text-[#161616]">
                {activeTenant?.name || 'Mi Organización'}
              </div>
              <div className="text-xs font-mono text-[#68656A] mt-0.5">
                {activeTenant?.taxId ? `CIF: ${activeTenant.taxId}` : 'CIF: Sin especificar'}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-[#8F8B92] block">Rol Asignado</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#EEEAFE] text-[#5749F5] font-semibold capitalize inline-block mt-1">
                {activeTenant?.role || 'owner'}
              </span>
            </div>
          </div>
        </div>

        {/* Sesión */}
        <div className="space-y-3 md:col-span-2 pt-2 border-t border-[rgba(20,20,20,0.06)]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8F8B92] block">
            Sesión
          </span>
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-[#68656A]">
              Token criptográfico seguro en memoria activa
            </span>
            <Button
              variant="danger"
              size="sm"
              icon={<LogOut className="w-3.5 h-3.5" />}
              onClick={logout}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
