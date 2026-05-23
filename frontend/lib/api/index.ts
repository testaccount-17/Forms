import { apiFetch } from '@/lib/api/client';

export interface Page {
  id: string;
  client_id: string;
  title: string;
  slug: string;
  description: string | null;
  schema_json: Record<string, unknown>;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  client_id: string | null;
  first_admin: boolean;
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

export interface ClientProfile {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  address: string | null;
  age: number | null;
  phone_no: string | null;
  state: string | null;
  view: string;
}

export function getPages(): Promise<Page[]> {
  return apiFetch<Page[]>('/pages');
}

export function getUserProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/users/me');
}

export function getClientProfile(): Promise<ClientProfile> {
  return apiFetch<ClientProfile>('/clients/me');
}

export interface OnboardingPayload {
  first_name: string;
  middle_name?: string;
  last_name: string;
  address?: string;
  age?: number;
  phone_no?: string;
  state?: string;
}

export function completeOnboarding(payload: OnboardingPayload): Promise<ClientProfile> {
  return apiFetch<ClientProfile>('/clients/onboarding', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
