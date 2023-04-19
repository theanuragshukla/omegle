import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Preferences from "./Preferences";
import NavBar from "./NavBar";
const SERVER = process.env.REACT_APP_SERVER_URL;

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${SERVER}/login`, {
      credentials: "include",
      method: "GET",
    });
  }, []);
  const [accepted, setAccepted] = useState(false);
  const [prefs, setPrefs] = useState([]);

  const redirect = (to) => {
    fetch(`${SERVER}/save-preferences`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ preferences: prefs }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          navigate(to);
        }
      });
  };
  return (
    <Flex flexDir="column">
      <NavBar />
      <Grid
        templateRows={{ base: "1fr", md: "auto auto auto" }}
        templateColumns={{ base: "1fr", md: "1fr auto 1fr" }}
        p={4}
      >
        <GridItem p={4}>
          <Flex flexDir="column" gap={8}>
            <Heading>About</Heading>
            <Text>
              Consectetur esse voluptas ratione dolorem unde. At repellat quae
              eaque consequatur officia enim voluptas magnam maxime tempora Odit
              cum eos commodi dolorem velit magnam, quibusdam Rem odit sit
              deserunt fuga natus. Suscipit nesciunt unde id tempora amet! Autem
              blanditiis accusamus nam perferendis et. Corporis fuga quasi at
              inventore nihil Doloribus exercitationem vitae exercitationem
              temporibus consectetur accusantium. Ratione vitae atque eum
              corrupti numquam Exercitationem provident praesentium ipsam
              nostrum cumque? Unde voluptas nesciunt molestias cupiditate
              corrupti. Similique accusamus similique dolores quisquam qui,
              praesentium. Sequi laboriosam hic ipsum in beatae. Assumenda ut
              aliquid numquam eveniet deserunt Voluptas placeat asperiores
              provident consequatur quo. Veniam
            </Text>
            <Checkbox
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
            >
              I agree to the Terms and Conditions, and abide to follow all the
              rules imposed in college campus.
            </Checkbox>
            <Flex justify="center" align="flex-start" mt={8} gap={8} h="100%">
              <Button
                colorScheme="blue"
                isDisabled={!accepted}
                onClick={() => redirect("/chat")}
              >
                Start Chatting
              </Button>
              <Button
                to={accepted ? "/chat" : "#"}
                colorScheme="red"
                isDisabled={!accepted}
                onClick={() => redirect("/video")}
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
