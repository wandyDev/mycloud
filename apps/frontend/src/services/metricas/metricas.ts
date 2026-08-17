import api from "@/api/api";
import type {
  CreateServerPayload,
  CreateServerResponse,
  ServerRecord,
} from "@/types/backend";

export const metricasService = {
  async createServer(data: CreateServerPayload) {
    const response = await api.post<CreateServerResponse>("/servers", data);
    return response.data;
  },

  async getServers() {
    const response = await api.get<ServerRecord[]>("/servers");
    return response.data;
  },
};