import os from "os";
import type { AgentPayload } from "@my_cloud/types";
import config from "../../config/config";
import { io } from "socket.io-client";

if (
  !config.API_URL ||
  !config.SERVER_ID ||
  !config.SERVER_KEY ||
  !config.SECRET_TOKEN
) {
  throw new Error(
    "Faltan variables en .env (API_URL, SERVER_ID, SERVER_KEY o SECRET_TOKEN). Copia la configuración desde el Dashboard.",
  );
}

// Creamos la conexión con el socket en el namespace /agent
const socket = io(config.API_URL, {
  auth: {
    serverId: config.SERVER_ID,
    serverKey: config.SERVER_KEY,
    secretToken: config.SECRET_TOKEN,
  },
});

// Esperamos al evento personalizado 'ready' del servidor
socket.on("ready", () => {
  console.log("✅ Servidor validado en DB con éxito. Transmitiendo telemetría en vivo...");
  void sendMetrics();
});

// Si el servidor no está autorizado
socket.on("unauthorized", () => {
  console.error("❌ Error: Servidor no autorizado. Revisa que SECRET_TOKEN, SERVER_ID y SERVER_KEY sean correctos.");
  process.exit(1);
});

// Si hay error de conexión
socket.on("connect_error", (err) => {
  console.warn("⚠️  Error de conexión con el backend:", err.message);
});

// Función que envía las métricas al servidor
async function sendMetrics() {
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

  const formattedPayload = {
    ...payload,
    metrics: {
      ...payload.metrics,
      cpuLoad: `${payload.metrics.cpuLoad.toFixed(2)} %`,
      ramUsed: `${payload.metrics.ramUsed.toFixed(2)} GB`,
      ramTotal: `${payload.metrics.ramTotal.toFixed(2)} GB`,
      uptime: `${payload.metrics.uptime.toFixed(2)} segundos`,
      cpuCore: payload.metrics.cpuCore,
    },
  };

  try {
    if (socket.connected) {
      socket.emit("findMetrics", formattedPayload);
      console.log(`📡 [${new Date().toLocaleTimeString()}] Métrica transmitida: CPU ${formattedPayload.metrics.cpuLoad} | RAM ${formattedPayload.metrics.ramUsed}/${formattedPayload.metrics.ramTotal}`);
    } else {
      console.log("⏳ Socket reconectando...");
      socket.connect();
    }
  } catch (e) {
    console.error("Error enviando métricas:", e);
  }
}

export default sendMetrics;
