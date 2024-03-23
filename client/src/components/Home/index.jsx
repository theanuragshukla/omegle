import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

import Preferences from "../Preferences";
import NavBar from "../../common/NavBar";
import { MODES, ROUTES } from "../../constants";

function Home({ handleSubmit, loading }) {
  const [accepted, setAccepted] = useState(false);
  const [prefs, setPrefs] = useState({});

  return (
    <Flex flexDir="column">
      <NavBar />
      <Grid
        templateRows={{ base: "1fr", md: "auto auto auto" }}
        templateColumns={{ base: "1fr", md: "1fr auto 1fr" }}
        p={4}
      >
        <GridItem p={4}>
          <Flex flexDir="column" gap={4}>
            <VStack spacing={4} mt="8">
              <Heading as="h1" fontSize="4xl" mb="4" color="teal.500">
                Welcome to CampusConnect
              </Heading>
              <Text fontSize="lg" color="gray.600">
                The ultimate virtual hangout for college students!
              </Text>
              <Text fontSize="lg" color="gray.600">
                Skip the small talk and dive straight into the world of
                spontaneous connections.
              </Text>
              <Text fontSize="lg" color="gray.600">
                No login required – just set your preferences, hit start, and
                let the serendipity unfold.
              </Text>
              <Text fontSize="lg" color="gray.600">
                CampusConnect is where the unpredictability of college life
                meets the excitement of online chats.
              </Text>
              <Text fontSize="lg" color="gray.600">
                Ready to spark some unplanned friendships? Click the button
                below and get started now!
              </Text>
            </VStack>
            <Checkbox
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
            >
              I agree to the Terms and Conditions, and abide to follow all the
              rules imposed in college campus.
            </Checkbox>
            <Flex justify="center" align="flex-start" mt={8} gap={8} h="100%">
              <Button
                isLoading={loading[MODES.TEXT]}
                colorScheme="blue"
                isDisabled={!accepted}
                onClick={() =>
                  handleSubmit({
                    prefs,
                    next: ROUTES.CHAT,
                    mode: MODES.TEXT,
                  })
                }
              >
                Start Chatting
              </Button>
              <Button
                isLoading={loading[MODES.VIDEO]}
                colorScheme="red"
                isDisabled={!accepted}
                onClick={() =>
                  handleSubmit({
                    prefs,
                    next: ROUTES.VIDEO,
                    mode: MODES.VIDEO,
                  })
                }
              >
                Video Chat
              </Button>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem>
          <Divider orientation="vertical" />
        </GridItem>
        <GridItem p={4}>
          <Preferences setPrefs={setPrefs} />
        </GridItem>
      </Grid>
    </Flex>
  );
}

export default Home;
