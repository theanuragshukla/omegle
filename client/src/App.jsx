import React from "react";
import { ChakraProvider, GlobalStyle } from "@chakra-ui/react";

import theme from "./styles/theme";
import Router from "./Router";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <GlobalStyle />
      <Router />
    </ChakraProvider>
  );
}

export default App;
