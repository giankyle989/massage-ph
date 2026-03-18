import { describe, it, expect } from 'vitest';
import { LoginSchema, ChangePasswordSchema } from './auth';

describe('LoginSchema', () => {
  it('validates valid credentials', () => {
    const result = LoginSchema.safeParse({
      email: 'admin@massageph.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = LoginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = LoginSchema.safeParse({
      email: 'admin@massageph.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('ChangePasswordSchema', () => {
  it('validates valid password change', () => {
    const result = ChangePasswordSchema.safeParse({
      currentPassword: 'oldpassword',
      newPassword: 'newpassword123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects new password under 8 characters', () => {
    const result = ChangePasswordSchema.safeParse({
      currentPassword: 'oldpassword',
      newPassword: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty current password', () => {
    const result = ChangePasswordSchema.safeParse({
      currentPassword: '',
      newPassword: 'newpassword123',
    });
    expect(result.success).toBe(false);
  });
});
