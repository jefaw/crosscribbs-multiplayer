import React, { useState, useEffect } from "react";
import { socket } from "../connections/socket";

export default function TestSocket() {
  const [message, setMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("Connecting to server...");

  useEffect(() => {
    let started = false;
    socket.on("connect", () => {
      console.log("Successfully connected to the server!");
      if (!started) {
        socket.emit("startGame");
        started = true;
      }
    });

    socket.on("gameStateUpdate", (data) => {
      console.log("Received game state update:", data);
      setServerMessage(data.message);
    });

    return () => {
      socket.off("connect");
      socket.off("gameStateUpdate");
    };
  }, []);

  const handleSendMessage = () => {
    socket.emit("sendMessage", message);
    setMessage("");
  };

  return (
    <div>
      <h1>Socket.IO Test Client</h1>
      <p>Server Message: {serverMessage}</p>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
      <button
        onClick={handleSendMessage}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 cursor-pointer text-sm"
      >
        Send Message to the Server
      </button>
    </div>
  );
}
