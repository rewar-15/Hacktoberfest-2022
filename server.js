const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");
require("dotenv").config();
const { auth, requiresAuth } = require('express-openid-connect');
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(
  auth({
  authRequired: false,
  auth0Logout: true,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  secret: process.env.SECRET,
})
);

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

var today = new Date()
var date = today.toLocaleString('default', {year: 'numeric', month: 'long', day: 'numeric' })

app.get("/call", (req, res) => {
  res.sendFile(__dirname + "/public/html/call.html");
});

app.post("/call", (req, res) => {
  if(req.body.submit === "") {
    res.redirect(`/${uuidv4()}`);
  }
})


// app.get('/:room', requiresAuth(), (req, res) => {
//   const roomId = req.params.room;
//   const username = req.oidc.user.nickname;
//   res.render('room', { roomId, username });
// });

app.get("/:room", requiresAuth(),(req, res) => {
  res.render("room", { roomId: req.params.room, dateTime: date,user: req.oidc.user.nickname});
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    });
  });
});
server.listen(process.env.PORT || 3000);
