const Express = require("express");
const app = new Express();
const http = require("http").Server(app);
var cors = require("cors");
app.use(cors());
const io = require("socket.io")(http, {
  path: "/chat-client/",
});
const port = 3001;

const uuid = require("uuid");

var ROOMS = {};

var admin = [];

io.on("connection", function (socket) {
  // connected io success
  console.log("connected : ID =>", socket.id);

  // only customer create room to chat admin
  socket.on("register", (name) => {
    // create uuid for room id
    let roomID = uuid.v4();
    ROOMS[roomID] = {
      // status true if issue open
      status: true,
      client: { name: name, socketID: socket.id },
      message: [],
    };

    // join customer to room
    socket.join(roomID);

    // send chat detail to client in room
    io.to(roomID).emit("roomID", { roomID, message: ROOMS[roomID].message });

    console.log(ROOMS);

    // sending to all clients except sender
    socket.broadcast.emit("adminReload");
  });

  // admin register to the room
  socket.on("registerAdmin", (roomID) => {
    console.log("registerAdmin", roomID);

    // send chat detail to admin
    socket.emit("roomID", { roomID, message: ROOMS[roomID].message });

    socket.join(roomID);
  });

  // admin close issue
  socket.on("closeIssue", (roomID) => {
    console.log("closeIssue", roomID);
    ROOMS[roomID].status = false;

    // emit too all client in the room -> issue close
    io.to(roomID).emit("issueClose", roomID);

    // sending to all clients except sender
    socket.emit("adminReload");
  });

  // client send message
  socket.on("sendMessage", (msgClient) => {
    console.log("send to", msgClient, msgClient.data, msgClient.roomID);

    // save message to data
    ROOMS[msgClient.roomID].message.push(msgClient.data);

    // emit message to client in room by room id
    io.to(msgClient.roomID).emit("receiveMessage", msgClient.data);
  });
});

app.get("/roomslist", (req, res) => {
  res.send(ROOMS);
});

http.listen(port, function () {
  console.log("Socket run on port:", port);
});
