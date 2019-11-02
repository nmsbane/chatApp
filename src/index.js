const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirPath = path.join(__dirname, "../public"); // __dirname gives path to index.js file

app.use(express.static(publicDirPath));

// let count = 0;

io.on("connection", socket => {
  // for connection
  // socket is a connection between client and server
  // socket.emit("countUpdated", count);
  // socket.on("increment", () => {
  //   count++;
  //   // socket.emit("countUpdated", count); // will emit countUpdated event for the browser tab which has emitted the increment event
  //   // using io.emit will emit the event for all the connected browsers
  //   io.emit("countUpdated", count);
  // });
  socket.emit("message", "Welcome!"); // to emit to the particular connection
  socket.broadcast.emit("message", "A new user has joined"); // to emit to everybody but not that particular connection

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }
    io.emit("message", message); // will emit the event for all the connected browsers, send it to everyone
    // calling callback will acknowledge the event
    callback();
  });

  // for disconnection, use socket
  socket.on("disconnect", () => {
    io.emit("message", "A user has left");
  });

  // for listening to sendLocation event
  socket.on("sendLocation", (coords, callback) => {
    io.emit(
      "message",
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
    callback("location shared with the server");
  });
});

server.listen(port, () => {
  console.log("Server is up on port " + port);
});
