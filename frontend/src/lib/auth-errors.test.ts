import { describe, expect, it } from 'vitest';
import { toAuthErrorMessage } from './auth-errors';

describe('toAuthErrorMessage', () => {
  it('traduce credenciales inválidas sin exponer el mensaje del proveedor', () => {
    expect(toAuthErrorMessage(new Error('Invalid login credentials'))).toBe('Correo o contraseña incorrectos.');
  });

  it('explica el límite temporal de correos de autenticación', () => {
    expect(toAuthErrorMessage(new Error('Email rate limit exceeded')))
      .toBe('Se ha alcanzado temporalmente el límite de envío de correos. Espera unos minutos e inténtalo de nuevo.');
  });

  it('reconoce el status HTTP 429 como límite temporal', () => {
    expect(toAuthErrorMessage({ status: 429, message: 'Too Many Requests' }))
      .toBe('Se ha alcanzado temporalmente el límite de envío de correos. Espera unos minutos e inténtalo de nuevo.');
  });

  it('reconoce el código over_email_send_rate_limit de Supabase GoTrue', () => {
    expect(toAuthErrorMessage({ code: 'over_email_send_rate_limit', message: 'Rate limit exceeded' }))
      .toBe('Se ha alcanzado temporalmente el límite de envío de correos. Espera unos minutos e inténtalo de nuevo.');
    expect(toAuthErrorMessage(new Error('over_email_send_rate_limit')))
      .toBe('Se ha alcanzado temporalmente el límite de envío de correos. Espera unos minutos e inténtalo de nuevo.');
  });

  it('reconoce el código over_request_rate_limit de Supabase GoTrue', () => {
    expect(toAuthErrorMessage({ code: 'over_request_rate_limit', message: 'Too many requests' }))
      .toBe('Se ha alcanzado temporalmente el límite de envío de correos. Espera unos minutos e inténtalo de nuevo.');
    expect(toAuthErrorMessage(new Error('over_request_rate_limit')))
      .toBe('Se ha alcanzado temporalmente el límite de envío de correos. Espera unos minutos e inténtalo de nuevo.');
  });

  it('reconoce el mensaje de protección de seguridad de 60 segundos de GoTrue', () => {
    expect(toAuthErrorMessage(new Error('For security purposes, you can only request this once every 60 seconds')))
      .toBe('Se ha alcanzado temporalmente el límite de envío de correos. Espera unos minutos e inténtalo de nuevo.');
  });

  it('reconoce errores pasados como string', () => {
    expect(toAuthErrorMessage('too many requests'))
      .toBe('Se ha alcanzado temporalmente el límite de envío de correos. Espera unos minutos e inténtalo de nuevo.');
  });

  it('mantiene un mensaje genérico ante errores desconocidos', () => {
    expect(toAuthErrorMessage(new Error('internal provider response')))
      .toBe('No hemos podido completar la autenticación. Inténtalo de nuevo.');
  });
});
