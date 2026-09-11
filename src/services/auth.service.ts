import { apiRequest } from "@/lib/api";
import type { AuthUser } from "@/zustand/auth.store";
import type { RegisterFormValues } from "@/schemas/register.schema";
import type { LoginFormValues } from "@/schemas/login.schema";
import type { ResendVerificationFormValues } from "@/schemas/resend-verification.schema";
import type { AcceptInviteFormValues } from "@/schemas/accept-invite.schema";

interface RegisterResponse {
  id: string;
  email: string;
}

export const registerUser = (data: RegisterFormValues) =>
  apiRequest<RegisterResponse>({
    url: "/auth/register",
    method: "POST",
    data,
  });

export const verifyEmail = (token: string) =>
  apiRequest<{ id: string; email: string }>({
    url: "/auth/verify-email",
    method: "GET",
    params: { token },
  });

export const resendVerification = (data: ResendVerificationFormValues) =>
  apiRequest<{ message: string }>({
    url: "/auth/resend-verification",
    method: "POST",
    data,
  });

export const acceptInvite = (data: AcceptInviteFormValues) =>
  apiRequest<{ id: string; email: string }>({
    url: "/auth/accept-invite",
    method: "POST",
    data,
  });

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    organizationId: string | null;
    role: string | null;
  };
}

export const loginUser = (data: LoginFormValues) =>
  apiRequest<LoginResponse>({
    url: "/auth/login",
    method: "POST",
    data,
  });

export const refreshSession = () =>
  apiRequest<{ accessToken: string }>({
    url: "/auth/refresh",
    method: "POST",
  });

export const getMe = () =>
  apiRequest<AuthUser>({
    url: "/auth/me",
    method: "GET",
  });

export const logoutUser = () =>
  apiRequest<null>({
    url: "/auth/logout",
    method: "POST",
  });
