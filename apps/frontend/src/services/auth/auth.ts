import api from "../../api/api";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  TicketResponse,
} from "@/types/backend";

export const authService = {
  async login(data: LoginPayload) {
    console.log("🚀 ~ authService ~ login ~ data:", data);
    console.log("🚀 ~ authService ~ login ~ data:", data);
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  async register(data: RegisterPayload) {
    console.log("🚀 ~ authService ~ register ~ data:", data);
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  async generateTicket() {
    const response = await api.post<TicketResponse>("/auth/ticket");
    return response.data;
  },

  async generateSecretToken() {
    const response = await api.post<{ message: string; secretToken: string }>(
      "/auth/secret-token",
    );
    return response.data;
  },

  async logout() {
    try {
      await api.post<{ message: string }>("/auth/logout");
    } catch {
      // ignore
    }
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    return { message: "Logged out" };
  },
};
