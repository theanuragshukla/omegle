import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./containers/HomeContainer";
import Chat from "./containers/ChatContainer";
import VideoChat from "./containers/VideoContainer";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/video" element={<VideoChat />} />
      </Routes>
    </BrowserRouter>
  );
}
