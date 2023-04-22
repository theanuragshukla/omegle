require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const http = require("http").Server(app);
const sessions = require("express-session");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const chat = require("./io");
const MongoStore = require("connect-mongo");
const MONGO_URL = process.env.MONGO_URL;
const path = require("path");
const { ExpressPeerServer } = require("peer");

const server = http.listen(port, () => {
  console.log(`running on port ${port}`);
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peer", peerServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  sessions({
    name: "omegleSecretEdition",
    genid: function () {
      return crypto.randomUUID();
    },
    secret: "lorem",
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 6000,
      path: "/",
    },
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      ttl: 1000 * 60 * 6000,
      autoRemove: "native",
    }),
  })
);

const buildPath = path.normalize(path.join(__dirname, "./build"));
app.use(express.static(buildPath));

app.get("/login", (req, res) => {
  req.session.user = {
    id: req.session.id,
    preferences: [],
  };
  res.status(200).json({ id: req.sessionID });
});
app.post("/save-preferences", (req, res) => {
  const { preferences } = req.body;
  req.session.user = {
    preferences: preferences,
  };
  res.status(200).json({ status: "success" });
});

app.get("/give-me-id", (req, res) => {
  if (req.session.user) {
    res.json({ status: true, uid: req.session.id });
  } else {
    res.json({ status: false });
  }
});
app.get("(/*)?", async (req, res, next) => {
  res.sendFile(path.join(buildPath, "index.html"));
});
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

chat(io);
