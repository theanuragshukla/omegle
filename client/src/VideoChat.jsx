import { useEffect, useRef } from "react";
import { Box, Flex, Heading, Button, Grid, GridItem } from "@chakra-ui/react";
import { FaVideo, FaMicrophone, FaVideoSlash, FaPhone } from "react-icons/fa";
import ChatBox from "./ChatBox";
import NavBar from "./NavBar";

const OmegleVideoChatPage = () => {
  const cam1 = useRef();
  const cam2 = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 480, height: 360 }, audio: true })
      .then((stream) => {
        cam1.current.srcObject = stream;
        cam2.current.srcObject = stream;
      });
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
              <video autoPlay ref={cam2} height="100%" />
            </Flex>{" "}
            <svg viewBox="0 0 4 3" width="auto" height="100%" fill="red" />
          </GridItem>
          <GridItem area="chat" bg="blue.500" overflow="hidden">
            <ChatBox />
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
