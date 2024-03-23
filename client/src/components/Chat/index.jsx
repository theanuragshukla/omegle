import { Center, CircularProgress, Grid, GridItem } from "@chakra-ui/react";

import NavBar from "../../common/NavBar";
import ChatBox from "../../common/ChatBox";

const Chat = ({ socket, loading }) => {
  return (
    <Grid bg="white" h="100vh" templateRows="auto 1fr" pb={2}>
      <GridItem>
        <NavBar />
      </GridItem>
      <GridItem overflow="hidden">
        {loading ? (
          <Center mt={8}>
            <CircularProgress size={16} isIndeterminate />{" "}
          </Center>
        ) : (
          <ChatBox socket={socket} />
        )}
      </GridItem>
    </Grid>
  );
};

export default Chat;
