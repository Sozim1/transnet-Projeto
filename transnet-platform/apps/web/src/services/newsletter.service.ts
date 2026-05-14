import { apiRequest } from './api';

export const newsletterService = {
  subscribe: (data: { email: string; name?: string }) =>
    apiRequest('/newsletter', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
