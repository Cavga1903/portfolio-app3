import apiClient from '../../../api/client';
import { endpoints } from '../../../api/endpoints';
import { User } from '../../../app/store/authStore';

export interface LoginResponse {
  user: User;
  token: string;
}

export interface SignupResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(endpoints.auth.login, {
      email,
      password,
    });
    return response.data;
  },

  signup: async (
    email: string,
    password: string,
    name: string
  ): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>(endpoints.auth.signup, {
      email,
      password,
      name,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(endpoints.auth.logout);
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>(endpoints.auth.me);
    return response.data;
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiClient.post<{ token: string }>(endpoints.auth.refresh);
    return response.data;
  },
};

