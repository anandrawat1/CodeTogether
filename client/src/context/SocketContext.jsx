import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import { initSocket } from "../initSocket";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [socketReady, setSocketReady] = useState(false);

  useEffect(() => {
    const socket = initSocket();
    socketRef.current = socket;
    function handleError(err) {
      console.error("Socket error:", err);
      toast.error("Something went wrong! Try again later.");
      navigate("/");
    }

    socket.on("connect_error", handleError);
    socket.on("connect_failed", handleError);
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setSocketReady(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  return (
    <SocketContext.Provider value={{ socketRef, socketReady }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
