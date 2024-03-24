import { useEffect, useState } from "react";
import Peer from "peerjs";
import { useNavigate } from "react-router-dom";

import VideoChat from "../components/VideoChat";
import { getId } from "../data/home";

const SERVER = process.env.REACT_APP_SERVER_URL;
const PEER_SERVER = process.env.REACT_APP_PEER_HOST;
const PEER_PORT = process.env.REACT_APP_PEER_PORT;
const PEER_SECURE = process.env.REACT_APP_PEER_SECURE==="true";

const io = require("socket.io-client");

export default function VideoContainer() {
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [peer, setPeer] = useState(null);
  const [partner, setPartner] = useState({});
  const [stream1, setStream1] = useState(null);
  const [stream2, setStream2] = useState(null);

  function endConn(id) {
    if (!!partner[id]) {
      partner[id].close();
    }
    if (stream1) stream1.forEach((track) => track.stop);
    setStream1(() => null);
  }

  const connectToNewUser = async (userId) => {
    if (!peer) {
      console.log("Peer not initialized");
      return;
    }
    const call = await peer.call(userId, stream2);
    if (!call) {
      console.log("Call not initialized");
      return;
    }
    setPartner((prev) => ({ ...prev, [call.peer]: call }));
    call.on("stream", (remoteStream) => {
      setStream1(remoteStream);
    });
  };

  const getVideo = async () => {
    return await navigator.mediaDevices
      .getUserMedia({ video: { width: 480, height: 360 }, audio: true })
      .then((stream) => stream);
  };

  async function peerConnection() {
    return new Peer({
      path: `/peer`,
      secure: PEER_SECURE,
      host: PEER_SERVER,
      port: PEER_PORT,
      config: {
        iceServers: [
          { url: "stun:stun.l.google.com:19302" },
          { url: "stun:stun1.l.google.com:19302" },
          {
            url: "turn:numb.viagenie.ca",
            credential: "muazkh",
            username: "webrtc@live.com",
          },
        ],
        heartbeat: {
          interval: 5000,
          timeout: 15000,
        },
      },

      debug: 3,
    });
  }
  const getSocket = async (uid) => {
    return await io(`${SERVER}/`, { query: `uid=${uid}&video=true` });
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("vid_paired", (userId) => {
      connectToNewUser(userId);
    });
  }, [socket]);

  useEffect(() => {
    if (!peer) return;
    if(peer.disconnected) {
      peer.reconnect();
    }
    peer.on("call", (call) => {
      call.answer(stream2);
      call.on("stream", (remoteStream) => {
        setStream1(() => remoteStream);
      });
      setPartner((prev) => ({ ...prev, [call.peer]: call }));
    });
    peer.on("open", (id) => socket.emit("pair", id));
  }, [peer]);

  useEffect(() => {
    const onloadVideo = async () => {
      const stream = await getVideo();
      setStream2(stream);
      const { status, data } = await getId();
      if (status) {
        const socket = await getSocket(data.uid);
        const peer = await peerConnection();
        setPeer(() => peer);
        setSocket(() => socket);
      } else {
        navigate("/");
      }
    };
    onloadVideo();
  }, []);
  return (
    <VideoChat
      stream1={stream1}
      stream2={stream2}
      endConn={endConn}
      socket={socket}
      peer={peer}
    />
  );
}
