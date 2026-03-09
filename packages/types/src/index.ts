export interface AgentPayload {
    serverId: string; // nombre del servidor
    secretToken: string; // token de autenticación
    metrics: {
        cpuLoad: number; // carga del CPU
        ramUsed: number; // uso de RAM
        ramTotal: number; // RAM total
        uptime: number; // tiempo de actividad
    };
    timestamp: number; // timestamp de la medición
}