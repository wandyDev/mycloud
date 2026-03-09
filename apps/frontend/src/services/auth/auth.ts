import api from "../../api/api";
import type { components } from "../../types/api-schema";
export const authService = {
  async login(data: components["schemas"]["LoginDto"]) {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  async register(data: components["schemas"]["CreateAuthDto"]) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },
};
