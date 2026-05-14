import { LoginResponse } from '@/types/admin';
import { apiRequest, authenticatedApiRequest } from './api';

export const authService = {
  login: (data: { email: string; password: string }) =>
    apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  me: (token: string) => authenticatedApiRequest<LoginResponse['user']>('/auth/me', token),
};
