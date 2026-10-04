/**
 * Convierte respuestas de Supabase Auth en mensajes aptos para la interfaz.
 * No mostramos los detalles textuales del proveedor: cambian entre versiones,
 * no están traducidos y pueden revelar información innecesaria sobre cuentas.
 */
export const toAuthErrorMessage = (error: unknown): string => {
  const message = error instanceof Error ? error.message.trim() : '';
  const normalized = message.toLowerCase();

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

  if (normalized.includes('rate limit') || normalized.includes('too many requests')) {
    return 'Se ha alcanzado temporalmente el límite de envío de correos. Espera unos minutos e inténtalo de nuevo.';
  }

  if (normalized.includes('signups not allowed') || normalized.includes('signup is disabled')) {
    return 'El registro de nuevas cuentas no está disponible en este momento.';
  }

  // Los mensajes propios ya se han redactado en español y son accionables.
  if (message.startsWith('El ') || message.startsWith('Debes ') || message.startsWith('No se ')) {
    return message;
  }

  return 'No hemos podido completar la autenticación. Inténtalo de nuevo.';
};
