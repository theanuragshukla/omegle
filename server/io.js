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

    socket.on("pair", (id) => {
      socket.vidid = id;
      if (socket.data.connected && socket.partner) {
        const partner = socket.partner;
        console.log("socket vidid", id);
        console.log("partner vidid", partner.vidid);
        partner.emit("end-conn", socket.vidid);
        partner.emit("partner-skipped");
        socket.emit("end-conn", partner.vidid);
        partner.data.connected = false;
        partner.partner = null;
        socket.partner = null;
      }
      partner = socket.vid ? unpaired_vid.poll() : unpaired.poll();
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
        partner.emit("vid_paired", id);
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
        if (!socket.partner) return;
        socket.partner.emit("partner-skipped");
        socket.emit("end-conn", socket.partner.vidid);
        socket.partner.emit("end-conn", socket.vidid);
        socket.partner.data.connected = false;
      }
    });
    socket.on("join-room", (roomId, userId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-connected", userId);
    });
  });
};
