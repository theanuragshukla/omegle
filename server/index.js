require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const http = require("http").Server(app);
const sessions = require("express-session");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const chat = require("./io");
const CLIENT_URL = process.env.CLIENT_URL;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", CLIENT_URL);
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  sessions({
    name: "omegleSecretEdition",
    genid: function () {
      return crypto.randomUUID();
    },
    secret: "lorem",
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    },
    resave: true,
    saveUninitialized: false,
  })
);

app.get("/login", (req, res) => {
  req.session.user = {
    preferences: [],
  };
  res.status(200).end();
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
const server = http.listen(port, () => {
  console.log(`running on port ${port}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

chat(io);
