import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth-context';
import { Button } from '../components/ui/Button';
import { SilkBackground } from '../components/layout/SilkBackground';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 select-none overflow-x-hidden bg-[var(--canvas)]">
      {/* Fondo Linear puro: canvas + orbes radiales adaptativos */}
      <SilkBackground />

      {/* Botón flotante para alternar tema */}
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      {/* Tarjeta doble-bisel completamente adaptada al tema */}
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-4xl min-h-[520px] rounded-[20px] border border-[var(--hairline)] overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-[var(--surface-1)] shadow-2xl"
      >
        {/* Panel izquierdo — editorial */}
        <div className="relative p-8 sm:p-10 flex flex-col justify-between overflow-hidden border-r border-[var(--hairline)] bg-[var(--surface-2)]">
          {/* Orbe decorativo tenue lavanda */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(94,106,210,0.12),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity duration-200">
              <div className="w-7 h-7 rounded-[8px] bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold">
                ✦
              </div>
              <span className="font-semibold text-sm tracking-tight text-[var(--ink)]">Pliego AI</span>
            </Link>

            <h2 className="text-2xl sm:text-[1.85rem] font-semibold tracking-[-0.04em] leading-[1.15] pt-6 text-[var(--ink)]">
              La IA analiza.<br />
              La evidencia sustenta.<br />
              <span className="text-[var(--primary)] font-normal italic">La persona decide.</span>
            </h2>
          </div>

          <div className="relative z-10 pt-6 border-t border-[var(--hairline)] space-y-1.5">
            <div className="flex items-center gap-2 text-[var(--ink-secondary)] text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#047857] dark:text-[#10b981]" />
              <span>Aislamiento multi-tenant por fila garantizado</span>
            </div>
            <p className="text-[11px] text-[var(--ink-tertiary)] font-mono">
              Tokens criptográficos en memoria activa. Cero persistencia en localStorage.
            </p>
          </div>
        </div>

        {/* Panel derecho — formulario */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-[var(--surface-1)]">
          <div className="space-y-1 mb-7">
            <h1 className="text-xl font-semibold text-[var(--ink)] tracking-[-0.03em]">
              Iniciar sesión
            </h1>
            <p className="text-xs text-[var(--ink-secondary)]">
              Introduce tu correo corporativo para acceder a tu espacio
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-[var(--ink-secondary)] mb-1.5 tracking-[0.02em] uppercase">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@empresa.es"
                className="w-full px-3 py-2.5 bg-[var(--surface-2)] border border-[var(--hairline)] rounded-[8px] text-sm text-[var(--ink)] placeholder-[var(--ink-tertiary)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/50 focus:outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[var(--ink-secondary)] mb-1.5 tracking-[0.02em] uppercase">
                Contraseña
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-[var(--surface-2)] border border-[var(--hairline)] rounded-[8px] text-sm text-[var(--ink)] placeholder-[var(--ink-tertiary)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/50 focus:outline-none transition-all duration-200"
              />
            </div>

            {error && (
              <div className="p-3 rounded-[8px] bg-[#D93838]/10 text-[#dc2626] dark:text-[#ff6b6b] border border-[#D93838]/30 text-xs">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-1 bg-[var(--primary)] hover:opacity-90 text-white font-semibold"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Iniciar sesión
            </Button>

            <div className="relative my-3 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--hairline)]" />
              </div>
              <span className="relative px-3 text-[10px] uppercase tracking-widest text-[var(--ink-tertiary)] font-mono bg-[var(--surface-1)]">
                O explorar plataforma
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                loginAsDemo();
                navigate('/app/inicio');
              }}
              className="w-full py-2.5 px-3 rounded-[8px] bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-medium border border-[var(--primary)]/25 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acceder con Empresa Demo (TechConsulting S.L.)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-center pt-2 space-y-2">
              <p className="text-xs text-[var(--ink-secondary)]">
                ¿Aún no tienes cuenta?{' '}
                <Link to="/registro" className="font-semibold text-[var(--primary)] hover:underline transition-colors">
                  Registra tu empresa gratis
                </Link>
              </p>
              <p>
                <Link to="/" className="text-[11px] text-[var(--ink-tertiary)] hover:text-[var(--ink)] transition-colors">
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
