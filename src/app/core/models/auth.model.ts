export interface User {
  id: number;
  email: string;
  username: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}