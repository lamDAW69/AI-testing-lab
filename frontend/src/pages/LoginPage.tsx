import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth-context';
import { Button } from '../components/ui/Button';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo, isLoading, error } = useAuth();
  const [email, setEmail] = useState('luis@techconsulting.es');
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
    <div className="min-h-screen bg-[#F6F3EF] flex items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-4xl min-h-[540px] bg-white rounded-[24px] border border-[rgba(20,20,20,0.08)] shadow-[0_20px_50px_rgba(20,20,30,0.08)] overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Lado izquierdo: Arte abstracto generativo y branding sutil según Sección 8 */}
        <div className="relative bg-gradient-to-br from-[#161616] via-[#1F1D2B] to-[#12111A] p-8 sm:p-10 flex flex-col justify-between overflow-hidden text-white">
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
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#695CFF] flex items-center justify-center text-white text-xs font-bold">
                ✦
              </div>
              <span className="font-semibold text-sm tracking-tight">Pliego AI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight pt-6">
              La IA analiza.<br />
              La evidencia sustenta.<br />
              <span className="text-[#EEEAFE] font-medium">La persona decide.</span>
            </h2>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 text-xs text-white/60 space-y-1">
            <div className="flex items-center gap-2 text-white/80">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Aislamiento multi-tenant por fila garantizado</span>
            </div>
            <p className="text-[11px] text-white/50 font-mono">
              Tokens criptográficos en memoria activa. Sin persistencia en localStorage.
            </p>
          </div>
        </div>

        {/* Lado derecho: Formulario editorial limpio según Sección 8 */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
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
                className="w-full px-3.5 py-2.5 bg-[#F6F3EF]/70 border border-[rgba(20,20,20,0.08)] rounded-[12px] text-xs text-[#161616] placeholder-[#8F8B92] focus:bg-white focus:border-[#695CFF] focus:outline-none transition-all"
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
                className="w-full px-3.5 py-2.5 bg-[#F6F3EF]/70 border border-[rgba(20,20,20,0.08)] rounded-[12px] text-xs text-[#161616] placeholder-[#8F8B92] focus:bg-white focus:border-[#695CFF] focus:outline-none transition-all"
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
              className="w-full mt-2"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Iniciar sesión
            </Button>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgba(20,20,20,0.08)]"></div>
              </div>
              <span className="relative bg-white px-2 text-[11px] uppercase tracking-wider text-[#8F8B92] font-mono">
                O explorar plataforma
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                loginAsDemo();
                navigate('/app/inicio');
              }}
              className="w-full py-2.5 px-3 rounded-[12px] bg-[#eeeaff]/70 hover:bg-[#eeeaff] text-[#695CFF] text-xs font-semibold border border-[#d5ccfe] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Acceder con Empresa Demo (TechConsulting S.L.)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-center pt-3 space-y-2">
              <p className="text-xs text-[#68656A]">
                ¿Aún no tienes cuenta?{' '}
                <Link to="/registro" className="font-semibold text-[#695CFF] hover:underline">
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
      </div>
    </div>
  );
};
