import { useEffect, useRef, useState } from "react";
import { Flex, Button, Grid, GridItem } from "@chakra-ui/react";
import { FaMicrophone, FaVideoSlash, FaPhone } from "react-icons/fa";
import loader from "./loading.gif";
import ChatBox from "./ChatBox";
import NavBar from "./NavBar";
import Peer from "peerjs";
import { useNavigate } from "react-router-dom";
const SERVER = process.env.REACT_APP_SERVER_URL;

const OmegleVideoChatPage = () => {
  const cam1 = useRef();
  const cam2 = useRef();
  const navigate = useNavigate();
  const io = require("socket.io-client");
  const [socket, setSocket] = useState(null);
  const [peer, setPeer] = useState(null);
  const [stream1, setStream1] = useState(null);
  const [stream2, setStream2] = useState(null);
  const [peers, setPeers] = useState(null);

  function endConn(id) {
    if (peers) {
      peers.close();
    }
    if (stream1) stream1.forEach((track) => track.stop);
    setStream1(() => null);
  }

  const connectToNewUser = async (userId) => {
    if (!peer) {
      return;
    }
    const call = await peer.call(userId, stream2);
    setPeers(() => call);
    call.on("stream", (remoteStream) => {
      setStream1(remoteStream);
    });
  };

  const getVideo = async () => {
    return await navigator.mediaDevices
      .getUserMedia({ video: { width: 480, height: 360 }, audio: true })
      .then((stream) => stream);
  };
  async function peerConnection() {
    return new Peer({
      path: `/peer`,
      secure: true,
      host: "omegle-special-server.onrender.com",
      port: 443,
      config: {
        iceServers: [
          { url: "stun:stun.l.google.com:19302" },
          { url: "stun:stun1.l.google.com:19302" },
        ],
        heartbeat: {
          interval: 5000,
          timeout: 15000,
        },
      },

      debug: 3,
    });
  }

  useEffect(() => {
    if (stream1 !== null) cam1.current.srcObject = stream1;
  }, [stream1, cam1]);

  useEffect(() => {
    if (stream2 !== null) cam2.current.srcObject = stream2;
  }, [stream2, cam2]);

  const getSocket = async (uid) => {
    return await io(`${SERVER}/`, { query: `uid=${uid}&video=true` });
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("vid_paired", (userId) => {
      connectToNewUser(userId);
    });
  }, [socket]);

  useEffect(() => {
    if (!peer) return;
    peer.on("call", (call) => {
      call.answer(stream2);
      call.on("stream", (remoteStream) => {
        setStream1(() => remoteStream);
      });
      setPeers((prev) => ({ ...prev, [call.peer]: call }));
    });

    peer.on("open", (id) => socket.emit("pair", id));
  }, [peer]);

  useEffect(() => {
    const onloadVideo = async () => {
      const stream = await getVideo();
      setStream2(stream);
      const res = await fetch(`${SERVER}/give-me-id`, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());
      if (res.status) {
        const socket = await getSocket(res.uid);
        const peer = await peerConnection();
        setPeer(() => peer);
        setSocket(() => socket);
      } else {
        navigate("/");
      }
    };
    onloadVideo();
  }, []);

  return (
    <Grid w="100%" h="100vh" bg="gray.100" templateRows="auto 1fr">
      <GridItem>
        <NavBar />
      </GridItem>
      <GridItem>
        <Grid
          w="100%"
          h="100%"
          bg="white"
          gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr", md: "auto 1fr" }}
          templateAreas={{
            base: `"cam1" "cam2" "controls"`,
            sm: `"cam1 cam2" "chat chat" "controls controls"`,
            md: `"cam1 chat" "cam2 chat" "controls controls"`,
          }}
          templateRows={{
            base: "1fr 1fr auto",
            sm: "auto 1fr auto",
            md: "1fr 1fr auto",
          }}
        >
          <GridItem
            area="cam1"
            pos="relative"
            bg="green.200"
            border="5px solid transparent"
          >
            <Flex
              w="100%"
              justify="center"
              height="100%"
              pos="absolute"
              zIndex={0}
              bg="black"
            >
              <img src={loader} alt="" />
            </Flex>
            <Flex transform="rotateY(180deg)" pos="absolute" zIndex={1}>
              <video autoPlay ref={cam1} height="100%" />
            </Flex>
            <svg
              viewBox="0 0 4 3"
              width={{ base: "100%", sm: "auto" }}
              height={{ base: "auto", sm: "100%" }}
              fill="red"
            />
          </GridItem>
          <GridItem
            pos="relative"
            area="cam2"
            bg="green.200"
            border="5px solid transparent"
          >
            <Flex
              w="100%"
              justify="center"
              height="100%"
              pos="absolute"
              zIndex={0}
              bg="black"
            >
              <img src={loader} alt="" />
            </Flex>
            <Flex zIndex={1} transform="rotateY(180deg)" pos="absolute">
              <video muted autoPlay ref={cam2} height="100%" />
            </Flex>
            <svg viewBox="0 0 4 3" width="auto" height="100%" fill="red" />
          </GridItem>
          <GridItem area="chat" bg="blue.500" overflow="hidden">
            <ChatBox socket={socket} video={true} data={{ endConn, peer }} />
          </GridItem>
          <GridItem area="controls" bg="gray.200" p={4}>
            <Flex justify="center" align="center" h="100%">
              <Button
                variant="outline"
                colorScheme="red"
                mr={2}
                leftIcon={<FaPhone />}
              >
                Disconnect
              </Button>
              <Button
                leftIcon={<FaMicrophone />}
                variant="outline"
                colorScheme="green"
                mr={4}
              >
                Mute
              </Button>
              <Button
                leftIcon={<FaVideoSlash />}
                variant="outline"
                colorScheme="red"
              >
                Stop Video
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};

export default OmegleVideoChatPage;
