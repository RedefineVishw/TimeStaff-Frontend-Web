import { apiRequest } from "@/lib/api";

export interface Role {
  id: string;
  name: string;
  description: string | null;
}

export const getRoles = () =>
  apiRequest<Role[]>({
    url: "/roles",
    method: "GET",
  });
