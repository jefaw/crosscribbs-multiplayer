// client/socket.ts
import { io } from "socket.io-client";

// export const socket = io("http://localhost:4000");
export const socket = io(import.meta.env.VITE_BACKEND_URL || window.location.origin);

// optional: log connection once
socket.on("connect", () => console.log("Socket connected:", socket.id));
