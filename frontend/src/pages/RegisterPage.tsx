import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth-context';
import { Button } from '../components/ui/Button';
import { SilkBackground } from '../components/layout/SilkBackground';
import { ArrowRight, Building2, User, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { signup, isLoading, error } = useAuth();
  const navigate = useNavigate();

  // Bloque A: Identidad del Operador (auth.users)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Bloque B: Entidad Jurídica Licitadora (tenants + company_profiles)
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [cpvSector, setCpvSector] = useState('72000000');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({
        fullName,
        email,
        password,
        companyName,
        taxId: taxId.toUpperCase().trim(),
        cpvSector,
      });
      navigate('/app/inicio');
    } catch {
      // Manejado en el contexto
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-8 select-none overflow-x-hidden">
      {/* 1. Fondo de cristal líquido orgánico y ondas de seda (Consistencia con AppShell) */}
      <SilkBackground />

      {/* 2. Tarjeta Flotante Ultra-Glossy con desenfoque de fondo y bordes especulares */}
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl bg-white/80 backdrop-blur-2xl rounded-[28px] border border-white/90 shadow-[0_20px_60px_rgba(21,17,30,0.08)] overflow-hidden grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr]"
      >
        {/* Columna Izquierda: Editorial y Propuesta de Valor */}
        <div className="relative bg-gradient-to-br from-[#16141c]/95 via-[#1a1727]/90 to-[#121019]/95 p-8 sm:p-10 flex flex-col justify-between overflow-hidden text-white backdrop-blur-2xl border-r border-white/10">
          <motion.div
            animate={{
              x: [0, 15, -10, 0],
              y: [0, -20, 10, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-gradient-to-tr from-[#695CFF]/30 to-indigo-400/10 blur-3xl pointer-events-none"
          />

          <div className="relative z-10 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-7 h-7 rounded-[8px] bg-gradient-to-tr from-[#695CFF] to-[#8d82ff] flex items-center justify-center text-white text-xs font-bold shadow-2xs">
                ✦
              </div>
              <span className="font-semibold text-sm tracking-tight">Pliego AI</span>
            </Link>

            <div className="pt-6">
              <span className="text-[11px] font-mono tracking-widest text-[#EEEAFE]/70 uppercase font-semibold">
                Alta de Nueva Entidad Licitadora
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mt-2 text-white">
                Tu dossier empresarial y la contratación pública,<br />
                <span className="text-[#A599FF] font-editorial italic font-normal">conectados por IA.</span>
              </h2>
            </div>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm pt-2">
              Configura el espacio de trabajo de tu empresa para monitorizar el feed oficial de PLACSP, sellar pliegos con hash SHA-256 y precalificar solvencia técnica y económica en segundos.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 space-y-3">
            <div className="flex items-start gap-2.5 text-xs text-white/80">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <span>Aislamiento estricto multi-tenant por fila (RLS en PostgreSQL).</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-white/80">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <span>Cero alucinaciones: citas auditables con offsets exactos en PDFs.</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario Guiado de Separación de Identidades */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-white/70 backdrop-blur-md">
          <div className="space-y-1 mb-6">
            <h1 className="text-2xl font-extrabold text-[#161616] tracking-tight">
              Crear cuenta corporativa
            </h1>
            <p className="text-xs text-[#68656A]">
              Cumple con la separación de identidades: tus datos de operador y la razón social mercantil.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Sección 1: Datos del Operador */}
            <div className="p-4 rounded-[16px] bg-[#FAF8F5] border border-[rgba(20,20,20,0.06)] space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#161616]">
                <User className="w-3.5 h-3.5 text-[#685cff]" />
                <span>1. Identidad del Operador (Cuenta Personal)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#423d4c] mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Carlos Gómez"
                    className="w-full px-3 py-2 bg-white border border-[rgba(20,20,20,0.1)] rounded-[10px] text-xs text-[#161616] placeholder-[#8F8B92] focus:border-[#685cff] focus:ring-1 focus:ring-[#685cff] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#423d4c] mb-1">
                    Correo corporativo
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carlos@empresa.es"
                    className="w-full px-3 py-2 bg-white border border-[rgba(20,20,20,0.1)] rounded-[10px] text-xs text-[#161616] placeholder-[#8F8B92] focus:border-[#685cff] focus:ring-1 focus:ring-[#685cff] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#423d4c] mb-1">
                  Contraseña segura
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full px-3 py-2 bg-white border border-[rgba(20,20,20,0.1)] rounded-[10px] text-xs text-[#161616] placeholder-[#8F8B92] focus:border-[#685cff] focus:ring-1 focus:ring-[#685cff] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Sección 2: Datos de la Entidad Mercantil */}
            <div className="p-4 rounded-[16px] bg-[#FAF8F5] border border-[rgba(20,20,20,0.06)] space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#161616]">
                <Building2 className="w-3.5 h-3.5 text-[#218a58]" />
                <span>2. Entidad Mercantil Licitadora (Dossier y Tenant)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#423d4c] mb-1">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="InnovaTech Consultoría S.L."
                    className="w-full px-3 py-2 bg-white border border-[rgba(20,20,20,0.1)] rounded-[10px] text-xs text-[#161616] placeholder-[#8F8B92] focus:border-[#685cff] focus:ring-1 focus:ring-[#685cff] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#423d4c] mb-1">
                    CIF / NIF Empresarial
                  </label>
                  <input
                    type="text"
                    required
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="B-12345678"
                    className="w-full px-3 py-2 bg-white border border-[rgba(20,20,20,0.1)] rounded-[10px] text-xs text-[#161616] placeholder-[#8F8B92] uppercase focus:border-[#685cff] focus:ring-1 focus:ring-[#685cff] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#423d4c] mb-1">
                  Sector CPV principal de licitación
                </label>
                <select
                  value={cpvSector}
                  onChange={(e) => setCpvSector(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[rgba(20,20,20,0.1)] rounded-[10px] text-xs text-[#161616] focus:border-[#685cff] focus:outline-none transition-all"
                >
                  <option value="72000000">72000000 - Servicios de Tecnologías de la Información y Software</option>
                  <option value="48000000">48000000 - Paquetes de software y sistemas de información</option>
                  <option value="71300000">71300000 - Servicios de ingeniería y consultoría técnica</option>
                  <option value="79400000">79400000 - Asesoramiento en gestión y consultoría estratégica</option>
                  <option value="45000000">45000000 - Trabajos de construcción y obra pública</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-[10px] bg-[#FEF0F0] text-[#D93838] border border-[#FCD2D2] text-xs">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 shadow-[0_4px_14px_rgba(104,92,255,0.25)] active:scale-98"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Registrar Empresa y Comenzar
            </Button>

            <div className="text-center pt-2">
              <span className="text-xs text-[#69666d]">¿Ya tienes una cuenta registrada? </span>
              <Link to="/login" className="text-xs font-semibold text-[#685cff] hover:underline">
                Inicia sesión aquí
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
