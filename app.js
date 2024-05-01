const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;
const domain = process.env.RAILWAY_PUBLIC_DOMAIN || "http://localhost"
const DEBUG = false;

app.get("/", (req, res) => {
  if(DEBUG === true) console.log("'/' path requested");
  return res.sendFile(__dirname + "/index.html");
});

let text = "";

io.on("connection", (socket) => {
  if(DEBUG === true) console.log("a user connected");
  socket.emit("to_client", text);

  socket.on("from_client", (msg) => {
    text = msg;
    socket.broadcast.emit("to_client", text);
    if(DEBUG === true)  console.log("message: " + text);
  });
  socket.on("disconnect", () => {
    if(DEBUG === true) console.log("user disconnected");
  });
});

server.listen(port, () => {
  if(DEBUG === true) console.log(`server running at ${domain}:${port}`);
});
