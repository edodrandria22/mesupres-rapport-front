export interface User {
  id?: number;
  email: string;
  entite: string;
  idRole?: number;
  role: "Admin" | "Utilisateur" | string;
  dateValidation?: string | null;
  rang?: number;
  sigle?: string;
  emailCopie?: string;
}

export interface Entite {
  id: number;
  nom: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  entite: string;
  entiteId: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

