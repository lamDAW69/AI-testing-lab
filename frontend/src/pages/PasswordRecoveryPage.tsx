import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SilkBackground } from '../components/layout/SilkBackground';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useAuth } from '../lib/auth-context';

export const PasswordRecoveryPage: React.FC = () => {
  const { requestPasswordReset, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch {
      // El contexto presenta un mensaje seguro y traducido.
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-x-hidden bg-[var(--canvas)]">
      <SilkBackground />
      <div className="fixed top-5 right-5 z-50"><ThemeToggle /></div>
      <main className="relative z-10 w-full max-w-md rounded-[20px] border border-[var(--hairline)] bg-[var(--surface-1)] p-8 sm:p-10 shadow-2xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)] hover:opacity-70">
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--primary)] text-xs text-white">✦</span>
          Pliego AI
        </Link>
        <div className="mt-8 space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]"><Mail className="h-5 w-5" aria-hidden="true" /></div>
          <h1 className="text-xl font-semibold tracking-[-0.03em] text-[var(--ink)]">Recupera tu contraseña</h1>
          <p className="text-sm leading-6 text-[var(--ink-secondary)]">Te enviaremos un enlace de un solo uso para definir una nueva contraseña.</p>
        </div>

        {submitted ? (
          <div className="mt-7 rounded-[10px] border border-[#047857]/30 bg-[#047857]/10 p-4 text-sm text-[var(--ink)]" role="status" aria-live="polite">
            <div className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#10b981]" aria-hidden="true" /><p>Si existe una cuenta para esa dirección, recibirás un enlace de recuperación. Revisa también la carpeta de spam.</p></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="recovery-email" className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.02em] text-[var(--ink-secondary)]">Correo electrónico</label>
              <input id="recovery-email" name="email" type="email" autoComplete="email" spellCheck={false} required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nombre@empresa.es" className="w-full rounded-[8px] border border-[var(--hairline)] bg-[var(--surface-2)] px-3 py-2.5 text-base text-[var(--ink)] placeholder-[var(--ink-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]" />
            </div>
            {error && <p className="rounded-[8px] border border-[#D93838]/30 bg-[#D93838]/10 p-3 text-xs text-[#dc2626] dark:text-[#ff6b6b]" role="alert">{error}</p>}
            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading} icon={<ArrowRight className="h-4 w-4" />}>Enviar enlace de recuperación</Button>
          </form>
        )}
        <p className="mt-6 text-center text-xs text-[var(--ink-secondary)]"><Link to="/login" className="font-semibold text-[var(--primary)] hover:underline">← Volver a iniciar sesión</Link></p>
      </main>
    </div>
  );
};
