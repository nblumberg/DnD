import { Express } from "express";
import http, { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket as SocketIOSocket } from "socket.io";
import { attachCastMemberSockets } from "./castMemberSockets";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";

export type SocketServer = SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type Socket = SocketIOSocket<ClientToServerEvents, ServerToClientEvents>;

let resolvePromise: (server: SocketServer) => void;
const promise = new Promise<SocketServer>((resolve) => {
  resolvePromise = resolve;
});
let io: SocketServer;

export function initializeSockets(app: Express): HttpServer {
  const httpServer = http.createServer(app);
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: true,
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      credentials: true,
    },
  });
  resolvePromise(io);
  io.on("connection", (socket) => {
    console.log(`Player socket connected from ${socket.handshake.address}`);
    socket.join("players");
  });
  io.of("/dm").on("connection", (socket) => {
    console.log(`DM socket connected from ${socket.handshake.address}`);
    socket.join("dm");
  });
  return httpServer;
}

export function getSocketIO(): Promise<SocketServer> {
  return promise;
}

getSocketIO().then((io) => {
  attachCastMemberSockets(io);
});
