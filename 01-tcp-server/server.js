// The net is build in Node module provides ability to create TCP servers and TCP clients
const net = require("net");

const PORT = 4000;

const server = net.createServer((socket) => {
  console.log("New client connected");

  socket.on("data", (chunk) => {
    console.log("Received data from client", chunk.toString());
  });

  socket.on("end", () => {
    console.log("Client disconnected (end)");
  });

  socket.on("close", () => {
    console.log("Connection closed");
  });

  socket.on("error", (err) => {
    console.log("Socket error: ", err.message);
  });
});

server.listen(PORT, () => {
  console.log(`TCP server is listening on port ${PORT}`);
});
