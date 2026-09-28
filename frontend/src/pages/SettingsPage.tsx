import React from 'react';
import { LogOut, Building2, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/auth-context';

export const SettingsPage: React.FC = () => {
  const { user, activeTenant, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl select-none">
      {/* Encabezado Unificado */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#161616] tracking-tight">
          Configuración
        </h1>
        <p className="text-xs text-[#68656A] mt-0.5">
          Detalles de tu cuenta de usuario y espacio de organización activo
        </p>
      </div>

      <div className="p-6 rounded-[22px] bg-white/80 backdrop-blur-[20px] border border-white/80 shadow-[0_4px_24px_rgba(20,20,30,0.04)] space-y-6">
        {/* Cuenta */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8F8B92] block">
            Cuenta
          </span>
          <div className="pt-1 border-t border-[rgba(20,20,20,0.06)]">
            <div className="text-sm font-bold text-[#161616]">
              {user?.fullName || 'Luis Méndez'}
            </div>
            <div className="text-xs font-mono text-[#68656A] mt-0.5">
              {user?.email || 'luis@techconsulting.es'}
            </div>
          </div>
        </div>

        {/* Organización */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8F8B92] block">
            Organización
          </span>
          <div className="pt-1 border-t border-[rgba(20,20,20,0.06)] space-y-3">
            <div>
              <div className="text-sm font-semibold text-[#161616]">
                {activeTenant?.name || 'TechConsulting Soluciones S.L.'}
              </div>
              <div className="text-xs font-mono text-[#68656A] mt-0.5">
                CIF: {activeTenant?.taxId || 'B-88776655'}
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
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8F8B92] block">
            Sesión
          </span>
          <div className="pt-2 border-t border-[rgba(20,20,20,0.06)] flex items-center justify-between">
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
