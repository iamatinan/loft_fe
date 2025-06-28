'use client';

import type { User } from '@/types/user';
import api from '@/utils/api';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;
    try {
      const auth = await api.post('/auth/login', {
        email,
        password,
      }).then((res) => res.data);

      if (!auth || auth.error) {
        return { error: 'Invalid credentials' };
      }
      // ตรวจสอบ token
      const accessToken = auth?.data?.accessToken?.token;
      const refreshToken = auth?.data?.refreshToken?.token;
      if (!accessToken || !refreshToken) {
        return { error: 'Invalid token response' };
      }
      localStorage.setItem('custom-auth-token', accessToken);
      localStorage.setItem('custom-auth-refreshToken', refreshToken);
      return {};
    } catch (err: any) {
      // Handle API/network error
      const errorMsg = err?.response?.data?.meta?.message || err?.message || 'API error';
      return { error: errorMsg };
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('custom-auth-token');
    if (!token) return { data: null };

    try {
      const res = await api.get('/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { data: res.data };
    } catch (err) {
      return { data: null, error: 'Session expired or invalid' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
