import { Product } from './catalog';

export type AdminUser = {
  id: string;
  name?: string;
  email: string;
  role: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AdminUser;
};

export type Quote = {
  id: string;
  customerName: string;
  company?: string | null;
  email: string;
  phone: string;
  notes?: string | null;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    notes?: string | null;
    product: Product;
  }>;
};

export type ContactMessage = {
  id: string;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  status: string;
  createdAt: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  name?: string | null;
  isActive: boolean;
  createdAt: string;
};
