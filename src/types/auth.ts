export type UserRole = 'guest' | 'admin' | 'barangay';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  barangayId?: string; // For barangay officials
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  // TODO: Add forgotPassword, resetPassword
}