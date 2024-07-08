"use client";
import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface ExecuteButtonProps {
  code: string;
  language: string;
  onResult: (output: string) => void;
}

const ExecuteButton: React.FC<ExecuteButtonProps> = ({
  code,
  language,
  onResult,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("result", (data: { output: string }) => {
      onResult(data.output);
    });

    return () => {
      newSocket.close();
    };
  }, [onResult]);

  const handleExecute = () => {
    if (socket) {
      socket.emit("execute", { language, files: JSON.parse(code) });
    }
  };

  return <button onClick={handleExecute}>Execute</button>;
};

export default ExecuteButton;
