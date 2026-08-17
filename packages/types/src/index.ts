export interface AgentPayload {
    serverId: string; // nombre del servidor
    secretToken: string; // token de autenticación
    metrics: {
        cpuLoad: number; // carga del CPU
        cpuUsed?: number; // uso del CPU en porcentaje
        cpuCore?: number; // número de núcleos
        ramUsed: number; // uso de RAM
        ramTotal: number; // RAM total
        uptime: number; // tiempo de actividad
    };
    timestamp: number; // timestamp de la medición
}

export default AgentPayload;