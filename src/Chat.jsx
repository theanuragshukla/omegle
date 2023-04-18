import NavBar from "./NavBar";
import ChatBox from "./ChatBox";
import { Grid, GridItem } from "@chakra-ui/react";

const Chat = () => {
  return (
    <Grid bg="white" h="100vh" templateRows="auto 1fr" pb={2}>
      <GridItem>
        <NavBar />
      </GridItem>
      <GridItem overflow="hidden">
        <ChatBox />
      </GridItem>
    </Grid>
  );
};

export default Chat;
