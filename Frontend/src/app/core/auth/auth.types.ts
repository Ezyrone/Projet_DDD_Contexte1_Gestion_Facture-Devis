export type UserRole = 'COMMERCIAL' | 'FINANCE' | 'CLIENT';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}
