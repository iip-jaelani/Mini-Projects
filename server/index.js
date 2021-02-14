const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8989;

const clc = require("cli-color");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const http = require("http").createServer(app);
app.use(cors());

const io = require("socket.io")(http);

var roomSession = [];

function joinData({ room, id, username, onGame }) {
  const user = { id, username, room, onGame };
  roomSession.push(user);
  return user;
}
function updateSession(room) {
  var d = _.find(roomSession, { room });
  if (d) {
    d.onGame = true;
  }
  return roomSession;
}

//get room list
app.get("/list_users", (req, res) => {
  res.send({
    room: roomSession,
    message: "get users list",
    error: false
  });
});

io.on("connection", (socket) => {
  // create room game for 2 player
  socket.on("createRoom", ({ username, room }) => {
    const data = {
      username,
      id: socket.id,
      room,
      onGame: false
    };
    //find data
    var d = _.find(roomSession, { username });

    if (d) {
      // create confirm failed
      io.emit("confirm_create", {
        error: true
      });
    } else {
      // create room success
      joinData(data);
      // emit list room
      io.emit("rooms", roomSession);
      // create confirm success
      io.emit("confirm_create", {
        error: false,
        room,
        username
      });
    }
  });

  // request join room
  socket.on("join", ({ username, room }) => {
    const data = {
      username,
      id: socket.id,
      room
    };
    console.log("join", data);
    io.emit("ready", data);
  });

  // confirm request join
  socket.on("confirm_room", (data) => {
    if (data.confirm) {
      // update room to in game
      var update = updateSession(data.data.room);
      io.emit("rooms", update);
    }
    io.emit("confirm", data);
  });

  // pick handle
  socket.on("pick_action", (data) => {
    console.log(data);
    io.emit("pick_rival", data);
  });

  // confirm ready to play
  socket.on("confirm_ready", (data) => {
    console.log(data);
    io.emit("rival_ready", data);
  });

  // disconnect
  socket.on("disconnect", () => {
    //remove room
    _.remove(roomSession, function (n) {
      return n.id == socket.id;
    });
    console.log("user disconnected", socket.id);
    io.emit("rooms", roomSession);
  });
});

http.listen(port, () => console.log(clc.yellow(`\n\n>>>server running on port ${port}<<<`)));
