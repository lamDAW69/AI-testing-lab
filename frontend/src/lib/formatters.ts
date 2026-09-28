/**
 * Utilidades de formateo siguiendo las directrices de interfaz de Vercel
 * - Espacio indivisible en unidades y monedas
 * - Consistencia decimal en monedas
 * - Fechas y plazos legibles
 */

export function formatCurrency(amount: number, currency = 'EUR'): string {
  const formatted = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return formatted;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDeadlineDays(deadlineString: string): {
  label: string;
  isUrgent: boolean;
  isExpired: boolean;
} {
  if (!deadlineString) {
    return { label: 'Sin fecha límite', isUrgent: false, isExpired: false };
  }

  const now = new Date();
  const deadline = new Date(deadlineString);
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: 'Plazo expirado', isUrgent: false, isExpired: true };
  }

  if (diffDays === 0) {
    return { label: 'Vence hoy', isUrgent: true, isExpired: false };
  }

  if (diffDays === 1) {
    return { label: 'Vence mañana (1 día)', isUrgent: true, isExpired: false };
  }

  if (diffDays <= 7) {
    return { label: `${diffDays} días restantes`, isUrgent: true, isExpired: false };
  }

  return { label: `${diffDays} días restantes`, isUrgent: false, isExpired: false };
}
