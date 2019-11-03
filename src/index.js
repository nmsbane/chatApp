const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const {
  generateMessage,
  generateLocationMessage
} = require("./utils/messages");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require("./utils/users");

const port = process.env.PORT || 3000;

const publicDirPath = path.join(__dirname, "../public"); // __dirname gives path to index.js file

app.use(express.static(publicDirPath));

// let count = 0;

io.on("connection", socket => {
  // for connection
  // socket is a connection between client and server

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      username,
      room
    });

    if (error) {
      return callback(error);
    }

    socket.join(room);

    // socket.emit, io.emit, socket.broadcast.emit
    // io.to.emit, socket.broadcast.to.emit
    socket.emit("message", generateMessage("Welcome!")); // to emit to the particular connection
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(`${user.username} has joined!`)); // to emit to everybody but not that particular connection

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }
    io.to("node.js").emit("message", generateMessage(message)); // will emit the event for all the connected browsers, send it to everyone
    // calling callback will acknowledge the event
    callback();
  });

  // for disconnection, use socket
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left`)
      );
    }
  });

  // for listening to sendLocation event
  socket.on("sendLocation", (coords, callback) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback("location shared with the server");
  });
});

server.listen(port, () => {
  console.log("Server is up on port " + port);
});
