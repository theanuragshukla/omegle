import { Flex, Grid, GridItem, Show } from "@chakra-ui/react";
import {useRef,  useEffect, useState } from "react";

import loader from "../../assets/loading.gif";
import ChatBox from "../../common/ChatBox";
import NavBar from "../../common/NavBar";

const VideoChat = ({
  socket,
  peer,
  endConn,
  stream1,
  stream2,
}) => {
  const [miniVid, setMiniVid] = useState(null);
  const cam1 = useRef();
  const cam2 = useRef();
  const miniScreen = useRef();
  const [c1, setC1] = useState(true);

  useEffect(() => {
    if (miniScreen.current) miniScreen.current.srcObject = miniVid;
  }, [miniVid, miniScreen]);

  useEffect(() => {
    setMiniVid(() => (c1 ? stream2 : stream1));
  }, [c1, stream1, stream2]);
  useEffect(() => {
    if (!cam1.current) return;
    cam1.current.srcObject = c1 ? stream1 : stream2;
  }, [cam1, c1, stream1, stream2]);

  useEffect(() => {
    if (!cam2.current) return;
    cam2.current.srcObject = stream2;
  }, [stream2, cam2]);

  return (
    <Grid w="100%" h="100vh" bg="gray.100" templateRows="auto 1fr">
      <GridItem>
        <NavBar />
      </GridItem>
      <GridItem>
        <Grid
          w="100%"
          h={{ base: "calc(150vh - 60px)", sm: "calc(100vh - 60px)" }}
          bg="white"
          gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr", md: "auto 1fr" }}
          templateAreas={{
            base: `"cam1" "chat"`,
            sm: `"cam1 cam2" "chat chat"`,
            md: `"cam1 chat" "cam2 chat"`,
          }}
          templateRows={{
            base: "calc(50vh - 60px) 50vh ",
            sm: "auto 1fr",
            md: "1fr 1fr ",
          }}
        >
          <GridItem
            area="cam1"
            pos="relative"
            bg="green.200"
            boxSizing="border-box"
            border=" 4px solid blanchedalmond"
            borderBottomWidth="2px"
          >
            <Flex
              w="100%"
              justify="center"
              height="100%"
              pos="absolute"
              zIndex={0}
              bg="black"
            >
              {stream1 ? (
                <Flex
                  transform="rotateY(180deg)"
                  pos="absolute"
                  zIndex={1}
                  justify="center"
                  height="100%"
                  bg="black"
                >
                  <video autoPlay ref={cam1} height="100%" />
                </Flex>
              ) : (
                <img src={loader} alt="" />
              )}
            </Flex>
            <Show below="sm">
              <Flex
                transform="rotateY(180deg)"
                pos="absolute"
                zIndex={2}
                justify="center"
                height="60px"
                width="80px"
                bg="blanchedalmond"
                border="2px solid blanchedalmond"
                borderLeftWidth={0}
                bottom={0}
                right={0}
                borderRadius="0 200vmax 200vmax 0"
                overflow="hidden"
              >
                <video
                  autoPlay
                  ref={miniScreen}
                  height="100%"
                  onClick={() => {
                    setC1((prev) => !prev);
                  }}
                />
              </Flex>
            </Show>
            <svg
              viewBox="0 0 4 3"
              width={{ base: "100%", sm: "auto" }}
              height={{ base: "auto", sm: "100%" }}
              fill="red"
            />
          </GridItem>
          <Show above="sm">
            <GridItem
              pos="relative"
              area="cam2"
              bg="green.200"
              border=" 4px solid blanchedalmond"
              borderTopWidth="2px"
            >
              <Flex
                w="100%"
                justify="center"
                height="100%"
                pos="absolute"
                zIndex={0}
                bg="black"
              >
                {stream2 ? (
                  <Flex
                    zIndex={1}
                    transform="rotateY(180deg)"
                    pos="absolute"
                    h="100%"
                    w="100%"
                  >
                    <video muted autoPlay ref={cam2} height="100%" />
                  </Flex>
                ) : (
                  <img src={loader} alt="" />
                )}
              </Flex>

              <svg viewBox="0 0 4 3" width="auto" height="100%" fill="red" />
            </GridItem>
          </Show>
          <GridItem area="chat" bg="blue.500" overflow="hidden">
            <ChatBox socket={socket} video data={{ endConn, peer }} />
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};

export default VideoChat;
