
import httpClient, { setAuthToken, removeAuthToken } from "../lib/http-client";
import { User } from "../types";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

const authRepository = {
  async login(credentials: AuthCredentials): Promise<User> {
    const response = await httpClient.post<AuthResponse>('/auth/login', credentials, { withAuth: false });
    setAuthToken(response.token);
    return response.user;
  },

  async register(userData: AuthCredentials & { name: string }): Promise<User> {
    const response = await httpClient.post<AuthResponse>('/auth/register', userData, { withAuth: false });
    setAuthToken(response.token);
    return response.user;
  },

  async logout(): Promise<void> {
    await httpClient.post<void>('/auth/logout');
    removeAuthToken();
  },

  async getCurrentUser(): Promise<User> {
    return httpClient.get<User>('/auth/me');
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    return httpClient.put<User>('/auth/profile', userData);
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await httpClient.put<void>('/auth/password', data);
  }
};

export default authRepository;
