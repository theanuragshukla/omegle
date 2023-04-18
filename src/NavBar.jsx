import { Flex, Heading } from "@chakra-ui/react";
import React from "react";
function NavBar() {
  return (
    <Flex h="60px" bg="blue.500" justify="center" align="center">
      <Heading fontSize="2xl" color="white">
        Omegle! MMMUT Edition
      </Heading>
    </Flex>
  );
}

export default NavBar;
