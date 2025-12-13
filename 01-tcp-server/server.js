// The net is build in Node module provides ability to create TCP servers and TCP clients
const net = require("net");

const PORT = 4000;

const server = net.createServer((socket) => {
  console.log("New client connected");
  let buffer = "";

  socket.on("data", (chunk) => {
    buffer += chunk.toString("utf8");

    let newLineIndex;
    while ((newLineIndex = buffer.indexOf("\n")) !== -1) {
      const rawMessage = buffer.slice(0, newLineIndex); // string without \n
      buffer = buffer.slice(newLineIndex + 1); // store rest in the buffer
      const message = rawMessage.trim();
      console.log("Full message from client ", message);
      socket.write(`You said: ${message}\n`);
    }
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
