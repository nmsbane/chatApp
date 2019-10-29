const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirPath = path.join(__dirname, "../public"); // __dirname gives path to index.js file

app.use(express.static(publicDirPath));

let count = 0;

io.on("connection", socket => {
  // socket is a connection between client and server
  socket.emit("countUpdated", count);
  socket.on("increment", () => {
    count++;
    // socket.emit("countUpdated", count); // will emit countUpdated event for the browser tab which has emitted the increment event
    // using io.emit will emit the event for all the connected browsers
    io.emit("countUpdated", count);
  });
});

server.listen(port, () => {
  console.log("Server is up on port " + port);
});
