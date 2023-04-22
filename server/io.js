module.exports = (io) => {
  //const redisAdapter = require("socket.io-redis");
  const PriorityQueue = require("fastpriorityqueue");

  const unpaired = new PriorityQueue((a, b) => a.timestamp < b.timestamp);
  const unpaired_vid = new PriorityQueue((a, b) => a.timestamp < b.timestamp);

  //io.adapter(redisAdapter({ host: "localhost", port: 6379 }));

  io.on("connection", (socket) => {
    const uid = socket.handshake.query.uid;
    const vid = socket.handshake.query.video;
    socket.vid = vid === "true";
    socket.uid = uid;
    socket.partner = null;
    console.log("socket connected: ", socket.uid, socket.vid);

    socket.on("pair", () => {
      if (socket.data.connected && socket.partner) {
        socket.partner.emit("partner-skipped");
        socket.partner.data.connected = false;
        socket.partner.partner = null;
        socket.partner = null;
      }
      const partner = socket.vid ? unpaired_vid.poll() : unpaired.poll();
      if (!partner || partner.uid === socket.uid) {
        socket.timestamp = Date.now();
        socket.vid ? unpaired_vid.add(socket) : unpaired.add(socket);
        socket.emit("enqueue");
        return;
      }
      socket.vid ? unpaired_vid.remove(socket) : unpaired.remove(socket);
      socket.data.connected = true;
      partner.data.connected = true;
      socket.partner = partner;
      partner.partner = socket;
      socket.emit("paired");
      partner.emit("paired");
      if (socket.vid) {
        partner.emit("vid_paired", socket.uid);
        socket.emit("vid_paired", partner.uid);
      } else {
        console.log("no video", socket.vid);
      }
    });

    socket.on("msg", (msg) => {
      if (!socket.data.connected || !socket.partner) {
        socket.emit("newMsg", {
          sender: "system",
          msg: "You are not connected to Anyone",
        });
        return;
      } else {
        socket.partner.emit("newMsg", msg);
      }
    });
    socket.on("disconnect", () => {
      console.log("socket disconnected:", socket.uid);
      if (!socket.data.connected) {
        socket.vid === true
          ? unpaired_vid.remove(socket)
          : unpaired.remove(socket);
      } else {
        socket.partner.emit("partner-skipped");
        socket.partner.data.connected = false;
      }
    });
    socket.on("join-room", (roomId, userId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-connected", userId);
    });
  });
};
