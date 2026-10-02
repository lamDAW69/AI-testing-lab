import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth-context';
import { Button } from '../components/ui/Button';
import { SilkBackground } from '../components/layout/SilkBackground';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo, isLoading, error } = useAuth();
  const [email, setEmail] = useState('demo@techconsulting.es');
  const [password, setPassword] = useState('••••••••••••');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/app/inicio');
    } catch {
      // Manejado en contexto
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 select-none overflow-x-hidden">
      {/* 1. Fondo de cristal líquido orgánico y ondas de seda (Consistencia con AppShell) */}
      <SilkBackground />

      {/* 2. Tarjeta Flotante Ultra-Glossy con desenfoque de fondo y bordes especulares */}
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-4xl min-h-[540px] bg-white/80 backdrop-blur-2xl rounded-[28px] border border-white/90 shadow-[0_20px_60px_rgba(21,17,30,0.08)] overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Lado izquierdo: Arte abstracto generativo y branding editorial */}
        <div className="relative bg-gradient-to-br from-[#16141c]/95 via-[#1a1727]/90 to-[#121019]/95 p-8 sm:p-10 flex flex-col justify-between overflow-hidden text-white backdrop-blur-2xl border-r border-white/10">
          {/* Formas abstractas con deriva extremadamente lenta (15-25s) */}
          <motion.div
            animate={{
              x: [0, 15, -10, 0],
              y: [0, -20, 10, 0],
              rotate: [0, 4, -3, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-gradient-to-tr from-[#695CFF]/30 to-indigo-400/10 blur-3xl pointer-events-none"
          />

          <motion.div
            animate={{
              x: [0, -18, 12, 0],
              y: [0, 16, -14, 0],
            }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-gradient-to-br from-[#695CFF]/20 to-purple-600/10 blur-3xl pointer-events-none"
          />

          <div className="relative z-10 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-7 h-7 rounded-[8px] bg-gradient-to-tr from-[#685cff] to-[#8d82ff] flex items-center justify-center text-white text-xs font-bold shadow-2xs">
                ✦
              </div>
              <span className="font-semibold text-sm tracking-tight text-white">Pliego AI</span>
            </Link>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight pt-6 text-white">
              La IA analiza.<br />
              La evidencia sustenta.<br />
              <span className="text-[#A599FF] font-editorial italic font-normal">La persona decide.</span>
            </h2>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 text-xs text-white/60 space-y-1.5">
            <div className="flex items-center gap-2 text-white/80">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Aislamiento multi-tenant por fila garantizado</span>
            </div>
            <p className="text-[11px] text-white/50 font-mono">
              Tokens criptográficos en memoria activa. Cero persistencia en localStorage.
            </p>
          </div>
        </div>

        {/* Lado derecho: Formulario editorial limpio */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white/70 backdrop-blur-md">
          <div className="space-y-1 mb-6">
            <h1 className="text-2xl font-extrabold text-[#161616] tracking-tight">
              Iniciar sesión
            </h1>
            <p className="text-xs text-[#68656A]">
              Introduce tu correo corporativo para acceder a tu espacio
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#161616] mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@empresa.es"
                className="w-full px-3.5 py-2.5 bg-white border border-[rgba(20,20,20,0.1)] rounded-[12px] text-xs text-[#161616] placeholder-[#8F8B92] focus:bg-white focus:border-[#685cff] focus:ring-1 focus:ring-[#685cff] focus:outline-none transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#161616] mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[rgba(20,20,20,0.1)] rounded-[12px] text-xs text-[#161616] placeholder-[#8F8B92] focus:bg-white focus:border-[#685cff] focus:ring-1 focus:ring-[#685cff] focus:outline-none transition-all shadow-2xs"
              />
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
              Iniciar sesión
            </Button>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgba(20,20,20,0.08)]"></div>
              </div>
              <span className="relative bg-white/90 px-2 text-[11px] uppercase tracking-wider text-[#8F8B92] font-mono">
                O explorar plataforma
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                loginAsDemo();
                navigate('/app/inicio');
              }}
              className="w-full py-2.5 px-3 rounded-[12px] bg-[#eeeaff] hover:bg-[#d5ccfe]/60 text-[#685cff] text-xs font-semibold border border-[#d5ccfe] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acceder con Empresa Demo (TechConsulting S.L.)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-center pt-3 space-y-2">
              <p className="text-xs text-[#68656A]">
                ¿Aún no tienes cuenta?{' '}
                <Link to="/registro" className="font-semibold text-[#685cff] hover:underline">
                  Registra tu empresa gratis
                </Link>
              </p>
              <p>
                <Link to="/" className="text-[11px] text-[#8F8B92] hover:text-[#161616] transition-colors">
                  ← Volver a la página principal
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
