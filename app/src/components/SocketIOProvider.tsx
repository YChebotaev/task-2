import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { io } from "socket.io-client";

type Socket = ReturnType<typeof io>;

const context = createContext<ReturnType<typeof io> | null>(null);

export const useSocketIO = () => useContext(context);

export const SocketIOProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let i: NodeJS.Timeout;
    let accessToken = localStorage.getItem("accessToken");
    let socket: Socket;

    const setupSocket = () => {
      socket = io(
        `${location.protocol}//${import.meta.env["VITE_SERVICE_ORIGIN"]!}`,
        {
          transports: ["websocket"],
          auth: { token: accessToken },
        },
      );

      setSocket(socket);
    };

    if (accessToken) {
      setupSocket();
    } else {
      i = setInterval(() => {
        accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
          clearInterval(i);

          setupSocket();
        }
      }, 3000);
    }

    return () => {
      socket?.disconnect();

      clearInterval(i);
    };
  }, []);

  return <context.Provider value={socket}>{children}</context.Provider>;
};
