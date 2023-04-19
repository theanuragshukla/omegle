module.exports = (io) => {
  //const redisAdapter = require("socket.io-redis");
  const PriorityQueue = require("fastpriorityqueue");

  const unpaired = new PriorityQueue((a, b) => a.timestamp < b.timestamp);

  //io.adapter(redisAdapter({ host: "localhost", port: 6379 }));

  io.on("connection", (socket) => {
    const uid = socket.handshake.query.uid;
    socket.uid = uid;
    socket.partner = null;
    console.log("socket connected: ", socket.uid);

    socket.on("pair", () => {
      if (socket.data.connected && socket.partner) {
        socket.partner.emit("partner-skipped");
        socket.partner.data.connected = false;
        socket.partner.partner = null;
        socket.partner = null;
      }
      const partner = unpaired.poll();
      if (!partner || partner.uid === socket.uid) {
        socket.timestamp = Date.now();
        unpaired.add(socket);
        socket.emit("enqueue");
        return;
      }
      unpaired.remove(socket);
      socket.data.connected = true;
      partner.data.connected = true;
      socket.partner = partner;
      partner.partner = socket;
      socket.emit("paired");
      partner.emit("paired");
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
        unpaired.remove(socket);
      } else {
        socket.partner.emit("partner-skipped");
        socket.partner.data.connected = false;
      }
    });
  });
};
