import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SilkBackground } from '../components/layout/SilkBackground';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useAuth } from '../lib/auth-context';

export const PasswordResetPage: React.FC = () => {
  const { updatePassword, isLoading, error } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [completed, setCompleted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmation) {
      setValidationError('Las contraseñas no coinciden.');
      return;
    }
    setValidationError(null);
    try {
      await updatePassword(password);
      setCompleted(true);
      window.setTimeout(() => navigate('/login', { replace: true }), 1800);
    } catch {
      // El contexto presenta el error de Supabase sin detalles sensibles.
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-x-hidden bg-[var(--canvas)]">
      <SilkBackground />
      <div className="fixed top-5 right-5 z-50"><ThemeToggle /></div>
      <main className="relative z-10 w-full max-w-md rounded-[20px] border border-[var(--hairline)] bg-[var(--surface-1)] p-8 sm:p-10 shadow-2xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)] hover:opacity-70"><span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--primary)] text-xs text-white">✦</span>Pliego AI</Link>
        <div className="mt-8 space-y-2"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]"><KeyRound className="h-5 w-5" aria-hidden="true" /></div><h1 className="text-xl font-semibold tracking-[-0.03em] text-[var(--ink)]">Define una nueva contraseña</h1><p className="text-sm leading-6 text-[var(--ink-secondary)]">El enlace es de un solo uso. Elige una contraseña de al menos 12 caracteres.</p></div>
        {completed ? <div className="mt-7 flex gap-2 rounded-[10px] border border-[#047857]/30 bg-[#047857]/10 p-4 text-sm text-[var(--ink)]" role="status" aria-live="polite"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#10b981]" aria-hidden="true" />Contraseña actualizada. Te llevamos al inicio de sesión.</div> : <form onSubmit={handleSubmit} className="mt-7 space-y-4"><div><label htmlFor="new-password" className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.02em] text-[var(--ink-secondary)]">Nueva contraseña</label><input id="new-password" name="new-password" type="password" autoComplete="new-password" minLength={12} required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-[8px] border border-[var(--hairline)] bg-[var(--surface-2)] px-3 py-2.5 text-base text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]" /></div><div><label htmlFor="confirm-password" className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.02em] text-[var(--ink-secondary)]">Repite la nueva contraseña</label><input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" minLength={12} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="w-full rounded-[8px] border border-[var(--hairline)] bg-[var(--surface-2)] px-3 py-2.5 text-base text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]" /></div>{(validationError || error) && <p className="rounded-[8px] border border-[#D93838]/30 bg-[#D93838]/10 p-3 text-xs text-[#dc2626] dark:text-[#ff6b6b]" role="alert">{validationError || error}</p>}<Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>Guardar nueva contraseña</Button></form>}
      </main>
    </div>
  );
};
