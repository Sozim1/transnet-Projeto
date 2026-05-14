import { ContactFormData } from '@/schemas/contact.schema';
import { apiRequest } from './api';

export const contactService = {
  create: (data: ContactFormData) =>
    apiRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
