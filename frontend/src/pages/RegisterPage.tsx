import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth-context';
import { Button } from '../components/ui/Button';
import { SilkBackground } from '../components/layout/SilkBackground';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { ArrowRight, Building2, User, CheckCircle2 } from 'lucide-react';

const inputClass =
  'w-full px-3 py-2.5 bg-[var(--surface-1)] border border-[var(--hairline)] rounded-[8px] text-sm text-[var(--ink)] placeholder-[var(--ink-tertiary)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/50 focus:outline-none transition-all duration-200';

const labelClass =
  'block text-[11px] font-medium text-[var(--ink-secondary)] mb-1.5 tracking-[0.02em] uppercase';

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
  const [confirmationRequired, setConfirmationRequired] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;
    try {
      const result = await signup({
        fullName,
        email,
        password,
        companyName,
        taxId: taxId.toUpperCase().trim(),
        cpvSector,
      });
      if (result === 'confirmation_required') {
        setConfirmationRequired(true);
        setCooldown(60);
        return;
      }
      sessionStorage.setItem('pliego_first_time_user', 'true');
      navigate('/app/inicio');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message.toLowerCase() : '';
      if (
        errMsg.includes('rate') ||
        errMsg.includes('límite') ||
        errMsg.includes('security') ||
        (typeof err === 'object' && err !== null && 'status' in err && (err as { status?: unknown }).status === 429)
      ) {
        setCooldown(60);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-8 select-none overflow-x-hidden bg-[var(--canvas)]">
      {/* Fondo Linear puro: canvas + orbes radiales adaptativos */}
      <SilkBackground />

      {/* Botón flotante para alternar tema */}
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl rounded-[20px] border border-[var(--hairline)] overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] bg-[var(--surface-1)] shadow-2xl"
      >
        {/* Columna Izquierda — editorial */}
        <div className="relative p-8 sm:p-10 flex flex-col justify-between overflow-hidden border-r border-[var(--hairline)] bg-[var(--surface-2)]">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(94,106,210,0.10),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity duration-200">
              <div className="w-7 h-7 rounded-[8px] bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold">
                ✦
              </div>
              <span className="font-semibold text-sm tracking-tight text-[var(--ink)]">Pliego AI</span>
            </Link>

            <div className="pt-4">
              <span className="text-[10px] font-mono tracking-widest text-[var(--ink-tertiary)] uppercase">
                Alta de Nueva Entidad Licitadora
              </span>
              <h2 className="text-2xl sm:text-[1.75rem] font-semibold tracking-[-0.04em] leading-[1.15] mt-2 text-[var(--ink)]">
                Tu dossier y la contratación pública,{' '}
                <span className="text-[var(--primary)] font-normal italic">conectados por IA.</span>
              </h2>
            </div>

            <p className="text-xs text-[var(--ink-secondary)] leading-relaxed max-w-xs pt-2">
              Monitoriza el feed oficial de PLACSP, sella pliegos con hash SHA-256 y precalifica solvencia en segundos.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-[var(--hairline)] space-y-2.5">
            <div className="flex items-start gap-2.5 text-xs text-[var(--ink-secondary)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#047857] dark:text-[#10b981] shrink-0 mt-0.5" />
              <span>Aislamiento estricto multi-tenant por fila (RLS en PostgreSQL).</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[var(--ink-secondary)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#047857] dark:text-[#10b981] shrink-0 mt-0.5" />
              <span>Cero alucinaciones: citas auditables con offsets exactos en PDFs.</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha — formulario */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-[var(--surface-1)]">
          <div className="space-y-1 mb-6">
            <h1 className="text-xl font-semibold text-[var(--ink)] tracking-[-0.03em]">
              Crear cuenta corporativa
            </h1>
            <p className="text-xs text-[var(--ink-secondary)]">
              Separación de identidades: tus datos de operador y la razón social mercantil.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sección 1: Datos del Operador */}
            <div className="p-4 rounded-[12px] border border-[var(--hairline)] space-y-3 bg-[var(--surface-2)]">
              <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--primary)] uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>1. Identidad del Operador</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Nombre completo</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Carlos Gómez"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Correo corporativo</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carlos@empresa.es"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Contraseña segura</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Sección 2: Datos de la Entidad Mercantil */}
            <div className="p-4 rounded-[12px] border border-[var(--hairline)] space-y-3 bg-[var(--surface-2)]">
              <div className="flex items-center gap-2 text-[11px] font-medium text-[#047857] dark:text-[#10b981] uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>2. Entidad Mercantil Licitadora</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Razón Social</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="InnovaTech Consultoría S.L."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>CIF / NIF Empresarial</label>
                  <input
                    type="text"
                    required
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="B-12345678"
                    className={`${inputClass} uppercase`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Sector CPV principal</label>
                <select
                  value={cpvSector}
                  onChange={(e) => setCpvSector(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--surface-1)] border border-[var(--hairline)] rounded-[8px] text-sm text-[var(--ink)] focus:border-[var(--primary)] focus:outline-none transition-all duration-200"
                >
                  <option value="72000000">72000000 — Servicios de TI y Software</option>
                  <option value="48000000">48000000 — Paquetes de software y sistemas de información</option>
                  <option value="71300000">71300000 — Servicios de ingeniería y consultoría técnica</option>
                  <option value="79400000">79400000 — Asesoramiento en gestión y consultoría</option>
                  <option value="45000000">45000000 — Trabajos de construcción y obra pública</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-[8px] bg-[#D93838]/10 text-[#dc2626] dark:text-[#ff6b6b] border border-[#D93838]/30 text-xs">
                {error}
              </div>
            )}

            {confirmationRequired && (
              <div className="p-3 rounded-[8px] bg-[#047857]/10 text-[#047857] dark:text-[#10b981] border border-[#047857]/30 text-xs space-y-1">
                <p>Revisa tu correo y confírmalo. La organización se provisionará de forma segura al iniciar sesión por primera vez.</p>
                {cooldown > 0 && (
                  <p className="text-[11px] font-mono opacity-80">
                    Podrás reenviar el registro en {cooldown}s para evitar bloqueos por límite de envío.
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading || cooldown > 0}
              className="w-full mt-1 bg-[var(--primary)] hover:opacity-90 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {cooldown > 0
                ? `Reintentar en ${cooldown}s`
                : confirmationRequired
                  ? 'Reenviar confirmación de registro'
                  : 'Registrar Empresa y Comenzar'}
            </Button>

            <div className="text-center pt-1">
              <span className="text-xs text-[var(--ink-secondary)]">¿Ya tienes cuenta? </span>
              <Link to="/login" className="text-xs font-semibold text-[var(--primary)] hover:underline transition-colors">
                Inicia sesión aquí
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
