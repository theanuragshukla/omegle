import NavBar from "./NavBar";
import ChatBox from "./ChatBox";
import { Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const io = require("socket.io-client");

const Chat = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState();
  useEffect(() => {
    fetch(`/give-me-id`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          setSocket(io.connect("/", { query: `uid=${res.uid}&video=false` }));
        } else {
          navigate("/");
        }
      });
  }, []);

  return (
    <Grid bg="white" h="100vh" templateRows="auto 1fr" pb={2}>
      <GridItem>
        <NavBar />
      </GridItem>
      <GridItem overflow="hidden">
        <ChatBox socket={socket} />
      </GridItem>
    </Grid>
  );
};

export default Chat;
