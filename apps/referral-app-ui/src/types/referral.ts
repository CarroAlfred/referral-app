import { Pagination } from './util';

export interface Referral {
  id: number;
  givenName: string;
  surname: string;
  email: string;
  phone: string;
  homeNameOrNumber: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  status: 'pending' | 'contacted' | 'completed' | 'declined';
  notes?: string;
  referredBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReferralFormData = Omit<Referral, 'id' | 'createdAt' | 'updatedAt'>; // creation

export interface ReferralState {
  referrals: Referral[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
}

export interface FetchReferralsResponse {
  referrals: Referral[];
  pagination: Pagination;
}
