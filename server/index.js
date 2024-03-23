require("dotenv").config();
const express = require("express");

const app = express();

const http = require("http").Server(app);
const sessions = require("express-session");
const cors = require("cors");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const { ExpressPeerServer } = require("peer");

const chat = require("./io");

const port = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const LOCAL = process.env.DEV || false;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const allowed_origins = [
  "https://warm-united-urchin.ngrok-free.app", 
  "http://localhost:3000"
];

const server = http.listen(port, () => {
  console.log(`running on port ${port}`);
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use(
  cors({
    origin: ["http://localhost:3000", "https://warm-united-urchin.ngrok-free.app"],
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  if(allowed_origins.includes(req.headers.origin))
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/peer", peerServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const localSessionCookieOptions = () => {
  if (LOCAL) {
    return {
      httpOnly: false,
    };
  } else {
    return {};
  }
};

app.use(
  sessions({
    name: "omegleSecretEdition",
    genid: function () {
      return crypto.randomUUID();
    },
    secret: "lorem",
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      path: "/",
      ...localSessionCookieOptions(),
    },
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      ttl: 1000 * 60 * 60,
      autoRemove: "native",
    }),
  })
);

app.get("/login", (req, res) => {
  req.session.user = {
    preferences: [],
  };
  res.json({ status: true, uid: req.session.id });
});
app.post("/save-preferences", (req, res) => {
  const { preferences } = req.body;
  req.session.user = {
    preferences,
  };
  res.status(200).json({ status: true, msg: "success" });
});

app.get("/give-me-id", (req, res) => {
  if (req.session.id) {
    res.json({ status: true, data: { uid: req.session.id }, msg: "success" });
  } else {
    res.json({ status: false, msg: "Not logged in" });
  }
});

const io = require("socket.io")(server, {
  cors: {
    origin: CLIENT_URL,
  },
});

chat(io);
