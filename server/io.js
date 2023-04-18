const redis = require("redis");
const { promisify } = require("util");

const redisClient = redis.createClient();

// Promisify Redis methods
const saddAsync = promisify(redisClient.sadd).bind(redisClient);
const sismemberAsync = promisify(redisClient.sismember).bind(redisClient);
const srandmemberAsync = promisify(redisClient.srandmember).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Rate limiting settings
const RATE_LIMIT_WINDOW = 30 * 1000; // 30 seconds
const RATE_LIMIT_COUNT = 10;

// Store active sockets and their corresponding partner's socket id
const activeSockets = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);

    // Store the socket id in Redis
    saddAsync("active_sockets", socket.id);

    socket.on("disconnect", async () => {
      console.log(`User ${socket.id} disconnected`);

      // Remove the socket from the activeSockets map and Redis
      activeSockets.delete(socket.id);
      await delAsync(socket.id);
      await saddAsync("inactive_sockets", socket.id);

      // Notify the partner that their partner has disconnected
      const partnerSocketId = activeSockets.get(socket.id);
      if (partnerSocketId) {
        const partnerSocket = io.sockets.sockets.get(partnerSocketId);
        if (partnerSocket) {
          partnerSocket.emit("partner_disconnected");
        }
        activeSockets.delete(partnerSocketId);
        await delAsync(partnerSocketId);
        await saddAsync("inactive_sockets", partnerSocketId);
      }
    });

    socket.on("pair", async () => {
      // Check if the user is already paired with someone
      if (activeSockets.has(socket.id)) {
        return;
      }

      // Implement rate limiting
      const timestamp = Date.now();
      const key = `rate_limit_${socket.id}`;
      const count = await saddAsync(key, timestamp);
      await redisClient.expire(key, RATE_LIMIT_WINDOW / 1000);
      if (count > RATE_LIMIT_COUNT) {
        socket.emit("rate_limit_exceeded");
        return;
      }

      // Find a random partner
      let partnerSocketId;
      do {
        partnerSocketId = await srandmemberAsync("active_sockets");
      } while (
        partnerSocketId === socket.id ||
        activeSockets.has(partnerSocketId)
      );

      // Pair the two users
      activeSockets.set(socket.id, partnerSocketId);
      activeSockets.set(partnerSocketId, socket.id);
      await saddAsync(socket.id, partnerSocketId);
      await saddAsync(partnerSocketId, socket.id);

      // Notify the users that they are paired
      socket.emit("paired", partnerSocketId);
      const partnerSocket = io.sockets.sockets.get(partnerSocketId);
      if (partnerSocket) {
        partnerSocket.emit("paired", socket.id);
      }
    });

    socket.on("skip", async () => {
      // Check if the user is paired with someone
      const partnerSocketId = activeSockets.get(socket.id);
      if (!partnerSocketId) {
        return;
      }
      console.log("partner", partnerSocketId);
      // Remove the current pairing
      activeSockets.delete(socket.id);
      activeSockets.delete(partnerSocketId);
      await delAsync(socket.id);
      await delAsync(partnerSocketId);

      // Notify the users that the pairing has been skipped
      socket.emit("partner_skipped");
      const partnerSocket = io.sockets.sockets.get(partnerSocketId);
      if (partnerSocket) {
        partnerSocket.emit("partner_skipped");
      }

      // Pair the user with a new partner
      socket.emit("pair");
    });
  });
};
