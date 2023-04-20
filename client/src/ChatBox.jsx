import { useEffect, useState } from "react";
import {
  Flex,
  Input,
  Button,
  VStack,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const io = require("socket.io-client");
const SERVER = process.env.REACT_APP_SERVER_URL;
const ChatBox = () => {
  const navigate = useNavigate();
  const [uid, setUid] = useState();
  const [messages, setMessages] = useState([
    { sender: "system", msg: "please wait, connecting..." },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState(null);
  const addMessage = (sender, msg) => {
    setMessages((old) => [...old, { sender, msg }]);
  };

  useEffect(() => {
    fetch(`/give-me-id`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          setUid(res.uid);
          setSocket(io("/", { query: `uid=${res.uid}` }));
        } else {
          navigate("/");
        }
      });
  }, []);

  useEffect(() => {
    // Set up listeners
    if (!socket) return;
    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("pair");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("paired", () => {
      console.log(`Paired`);
      setMessages([{ sender: "System", msg: "Stranger connected" }]);
    });

    socket.on("partner-skipped", () => {
      console.log("Partner Skipped");
      addMessage("System", "Stranger Skipped you");
    });

    socket.on("newMsg", (msg) => {
      addMessage("Stranger", msg);
    });

    socket.on("enqueue", () => {
      addMessage("system", "waiting for partner to join");
    });
    return () => {
      // Disconnect from the server
      socket.disconnect();
    };
  }, [socket]);

  const handleSend = (e) => {
    if (e.key !== "Enter") return;
    addMessage("You", inputValue);
    socket.emit("msg", inputValue);
    setInputValue("");
  };

  return (
    <Grid bg="white" h="100%" templateRows="1fr auto" pb={2}>
      <GridItem overflow="scroll">
        <VStack
          alignItems="flex-start"
          justify="flex-end"
          p={4}
          minH="100%"
          overflow="scroll"
        >
          {messages.map((message, index) => (
            <Text
              key={index}
              px={2}
              py={1}
              borderRadius="md"
              bg={message.sender === "You" ? "red.200" : "green.200"}
              color="black.500"
            >
              {message.sender}: {message.msg}
            </Text>
          ))}
        </VStack>
      </GridItem>{" "}
      <GridItem>
        <Flex px={4} py={2} gap={2}>
          <Button onClick={() => socket.emit("pair")} colorScheme="blue">
            Skip
          </Button>

          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            borderRadius="full"
            mr={2}
            onKeyDown={handleSend}
          />
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default ChatBox;
