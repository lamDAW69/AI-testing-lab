/**
 * Convierte respuestas de Supabase Auth en mensajes aptos para la interfaz.
 * No mostramos los detalles textuales del proveedor: cambian entre versiones,
 * no están traducidos y pueden revelar información innecesaria sobre cuentas.
 */
export const toAuthErrorMessage = (error: unknown): string => {
  const status = typeof error === 'object' && error !== null && 'status' in error
    ? (error as { status?: unknown }).status
    : null;
  const code = typeof error === 'object' && error !== null && 'code' in error && typeof (error as { code?: unknown }).code === 'string'
    ? (error as { code: string }).code.toLowerCase()
    : '';
  const message = error instanceof Error
    ? error.message.trim()
    : typeof error === 'string'
      ? error.trim()
      : typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: unknown }).message === 'string'
        ? (error as { message: string }).message.trim()
        : '';
  const normalized = `${code} ${message}`.toLowerCase();

  if (
    status === 429 ||
    code === 'over_email_send_rate_limit' ||
    code === 'over_request_rate_limit' ||
    normalized.includes('rate limit') ||
    normalized.includes('rate_limit') ||
    normalized.includes('too many requests') ||
    normalized.includes('over_email_send_rate_limit') ||
    normalized.includes('over_request_rate_limit') ||
    normalized.includes('for security purposes')
  ) {
    return 'Se ha alcanzado temporalmente el límite de envío de correos. Espera unos minutos e inténtalo de nuevo.';
  }

  if (normalized.includes('invalid login credentials')) {
    return 'Correo o contraseña incorrectos.';
  }

  if (normalized.includes('email address') && normalized.includes('invalid')) {
    return 'Introduce una dirección de correo válida.';
  }

  if (normalized.includes('user already registered') || normalized.includes('already been registered')) {
    return 'No ha sido posible completar el registro. Si ya tienes una cuenta, inicia sesión.';
  }

  if (normalized.includes('email not confirmed')) {
    return 'Confirma tu correo electrónico antes de iniciar sesión.';
  }

  if (normalized.includes('signups not allowed') || normalized.includes('signup is disabled')) {
    return 'El registro de nuevas cuentas no está disponible en este momento.';
  }

  // Los mensajes propios ya se han redactado en español y son accionables.
  if (message.startsWith('El ') || message.startsWith('Debes ') || message.startsWith('No se ') || message.startsWith('Se ha ')) {
    return message;
  }

  return 'No hemos podido completar la autenticación. Inténtalo de nuevo.';
};
