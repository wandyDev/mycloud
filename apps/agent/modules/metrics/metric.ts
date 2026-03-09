import os from "os";
import { AgentPayload } from "@my_cloud/types";
import config from "../../config/config";
import { io } from "socket.io-client";

if (
  !config.SECRET ||
  !config.API_URL ||
  !config.SERVER_ID ||
  !config.SERVER_KEY ||
  !config.SECRET_TOKEN
) {
  throw new Error("No se encontro la variable SECRET o API_URL");
}

//creamos la conexion con el socket
const socket = io(config.API_URL, {
  auth: {
    serverId: config.SERVER_ID,
    serverKey: config.SERVER_KEY,
    secretToken: config.SECRET_TOKEN,
  },
});

// Esperamos al evento personalizado 'ready' del servidor
socket.on("ready", () => {
  console.log("Servidor validado en DB. Enviando métricas...");
});

//si el servidor no esta autorizado
socket.on("unauthorized", () => {
  console.log("server no autorizado");
  process.exit(1);
});

//funcion que envia las metricas al servidor
async function sendMetrics() {
  //creamos el payload con las metricas
  const payload: AgentPayload = {
    serverId: config.SERVER_ID,
    secretToken: config.SECRET_TOKEN,
    metrics: {
      cpuLoad: os.loadavg()[0], // %
      cpuCore: os.cpus().length, // núcleos
      cpuUsed: os.loadavg()[0] / os.cpus().length, // %
      ramUsed: (os.totalmem() - os.freemem()) / 1024 / 1024 / 1024, // GB
      ramTotal: os.totalmem() / 1024 / 1024 / 1024, // GB
      uptime: os.uptime(), // segundos
    },
    timestamp: Date.now(),
  };

  //formateamos el payload
  const formattedPayload = {
    ...payload,
    metrics: {
      ...payload.metrics,
      cpuLoad: `${payload.metrics.cpuLoad.toFixed(2)} %`,
      ramUsed: `${payload.metrics.ramUsed.toFixed(2)} GB`,
      ramTotal: `${payload.metrics.ramTotal.toFixed(2)} GB`,
      uptime: `${payload.metrics.uptime.toFixed(2)} segundos`,
      cpuUsed: `${payload.metrics.cpuUsed.toFixed(2)} %`,
      cpuCore: payload.metrics.cpuCore,
    },
  };
  try {
    //enviamos el payload al servidor
    if (socket.connected) {
      socket.emit("findMetrics", formattedPayload);
    }
  } catch (e) {
    console.error("Error conectando con el socket", e);
    process.exit(1);
  }
}

export default sendMetrics;
