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

  it('mantiene un mensaje genérico ante errores desconocidos', () => {
    expect(toAuthErrorMessage(new Error('internal provider response')))
      .toBe('No hemos podido completar la autenticación. Inténtalo de nuevo.');
  });
});
