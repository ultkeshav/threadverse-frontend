export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AuthUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}