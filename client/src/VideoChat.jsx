import { useEffect, useRef, useState } from "react";
import { Flex, Button, Grid, GridItem } from "@chakra-ui/react";
import { FaMicrophone, FaVideoSlash, FaPhone } from "react-icons/fa";
import ChatBox from "./ChatBox";
import NavBar from "./NavBar";
import Peer from "peerjs";
import { useNavigate } from "react-router-dom";
const OmegleVideoChatPage = () => {
  const cam1 = useRef();
  const cam2 = useRef();
  const navigate = useNavigate();
  const io = require("socket.io-client");

  const [socket, setSocket] = useState(null);
  const [peer, setPeer] = useState(null);
  const [stream1, setStream1] = useState(null);
  const [stream2, setStream2] = useState(null);

  const connectToNewUser = (peerr, userId, stream) => {
    if (!peer) {
      console.log("peer undefined", peerr);
      return;
    }
    const call = peerr.call(userId, stream);
    call.on("stream", (remoteStream) => {
      setStream1(remoteStream);
    });
  };
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 480, height: 360 }, audio: true })
      .then((stream) => {
        setStream2(stream);
      });
  }, []);

  useEffect(() => {
    fetch(`/give-me-id`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          setSocket(io("/", { query: `uid=${res.uid}&video=true` }));
        } else {
          navigate("/");
        }
      });
  }, []);

  useEffect(() => {
    if (!socket) return;
    setPeer(
      new Peer(socket.uid, {
        path: "/peer",
        host: "localhost",
        port: 5000,
        config: {
          iceServers: [
            { url: "stun:stun01.sipphone.com" },
            { url: "stun:stun.ekiga.net" },
            { url: "stun:stunserver.org" },
            { url: "stun:stun.softjoys.com" },
            { url: "stun:stun.voiparound.com" },
            { url: "stun:stun.voipbuster.com" },
            { url: "stun:stun.voipstunt.com" },
            { url: "stun:stun.voxgratia.org" },
            { url: "stun:stun.xten.com" },
            {
              url: "turn:192.158.29.39:3478?transport=udp",
              credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
              username: "28224511:1379330808",
            },
            {
              url: "turn:192.158.29.39:3478?transport=tcp",
              credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
              username: "28224511:1379330808",
            },
          ],
        },

        debug: 3,
      })
    );
  }, [socket]);

  useEffect(() => {
    cam1.current.srcObject = stream1;
    console.log("stream1 recieved");
  }, [stream1, cam1]);

  useEffect(() => {
    cam2.current.srcObject = stream2;
  }, [stream2, cam2]);

  useEffect(() => {
    console.log("peer: ", peer);
    if (!socket || !peer) return;
    socket.on("vid_paired", (userId) => {
      console.log("vid paired", userId);
      connectToNewUser(peer, userId, stream2);
    });

    const onOpen = () => {
      socket.emit("pair");
    };

    peer.on("open", onOpen);
    peer.on("call", (call) => {
      call.answer(stream2);
      call.on("stream", (remoteStream) => {
        setStream1(remoteStream);
      });
    });

    return () => {
      peer.off("open", onOpen);
      peer.disconnect();
      peer.destroy();
      socket.off("vid_paired");
    };
  }, [peer, socket]);

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
            <Flex pos="absolute" alignItems="flex-end" height="100%">
              <video autoPlay ref={cam1} height="100%" />
            </Flex>{" "}
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
            <Flex pos="absolute">
              <video muted autoPlay ref={cam2} height="100%" />
            </Flex>{" "}
            <svg viewBox="0 0 4 3" width="auto" height="100%" fill="red" />
          </GridItem>
          <GridItem area="chat" bg="blue.500" overflow="hidden">
            <ChatBox socket={socket} video={true} />
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
