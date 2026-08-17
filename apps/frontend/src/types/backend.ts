export interface RegisterPayload {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  secretToken: string;
}

export interface LoginResponse {
  message: string;
}

export interface TicketResponse {
  message: string;
  ticket: string;
}

export interface CreateServerPayload {
  name: string;
  description: string;
}

export interface CreateServerResponse {
  serverKey: string;
  serverId: string;
}

export interface ServerRecord {
  id: string;
  name: string;
  description: string;
  serverId: string;
  serverKey: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentMetric {
  cpuLoad: number | string;
  ramUsed: number | string;
  ramTotal: number | string;
  uptime: number | string;
  cpuCore?: number;
  cpuUsed?: number | string;
}

export interface AgentPayload {
  serverId: string;
  secretToken: string;
  metrics: AgentMetric;
  timestamp: number;
}