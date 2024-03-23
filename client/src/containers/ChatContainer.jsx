import Chat from "../components/Chat";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getId } from "../data/home";
import { ROUTES } from "../constants";

const io = require("socket.io-client");

const SERVER = process.env.REACT_APP_SERVER_URL;

export default function ChatContainer() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [socket, setSocket] = useState();

  useEffect(() => {
    const fetchId = async () => {
      setLoading(true);
      const { status, data } = await getId();
      setLoading(false);
      if (status) {
        setSocket(
          io.connect(`${SERVER}/`, { query: `uid=${data.uid}&video=false` })
        );
      } else {
        navigate(ROUTES.HOME);
      }
    };
    fetchId();
  }, []);
  return <Chat socket={socket} loading={loading} />;
}
