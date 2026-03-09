import { io } from "socket.io-client";

const socket = io("http://localhost:3001/api/v1/metrics");

export const socketService = {
  findMetrics: () => {
    socket.emit("findMetrics");
  },
};
