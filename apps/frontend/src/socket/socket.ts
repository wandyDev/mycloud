import { io } from "socket.io-client";
import type { AgentPayload } from "@/types/backend";

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001";

export const socketService = {
  connectToClientChannel(
    ticket: string,
    onMetrics: (data: AgentPayload) => void,
    onConnect?: () => void,
    onError?: (error: Error) => void,
    onDisconnect?: () => void,
  ) {
    const socket = io(`${SOCKET_URL}/client`, {
      autoConnect: false,
      reconnection: false,
      auth: {
        ticket,
      },
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.connect();

    socket.on("connect", () => {
      onConnect?.();
    });

    socket.on("connect_error", (error) => {
      onError?.(error as Error);
    });

    socket.on("disconnect", () => {
      onDisconnect?.();
    });

    socket.on("metrics", onMetrics);

    return () => {
      socket.off("metrics", onMetrics);
      socket.off("connect", onConnect ?? (() => undefined));
      socket.off("connect_error", onError ?? (() => undefined));
      socket.off("disconnect", onDisconnect ?? (() => undefined));
      socket.disconnect();
    };
  },
};
