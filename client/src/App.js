import React from "react";
import { ChakraProvider, GlobalStyle } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import theme from "./theme";
import Home from "./Home";
import Chat from "./Chat";
import VideoChat from "./VideoChat";
function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/video" element={<VideoChat />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
