export interface User {
  id: string;
  email: string;
  full_name: string;
  pension_number: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
  role: 'pensioner' | 'admin';
  created_at: string;
}

export interface LifeCertificate {
  id: string;
  user_id: string;
  submission_date: string;
  month: number;
  year: number;
  witness_name: string;
  witness_phone: string;
  witness_relationship: string;
  certificate_photo_url?: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_review';
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}