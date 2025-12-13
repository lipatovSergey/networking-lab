const net = require("net");

const PORT = 4000;

const client = net.createConnection({ port: PORT }, () => {
  console.log("Connected to server");

  // send to server
  client.write("First!\n");
  client.write("Second!\n");
  client.write("Third!\n");
});

client.on("data", (data) => {
  console.log("Received from server:", data.toString());
});

client.on("end", () => {
  console.log("Disconnected from server");
});

client.on("error", (err) => {
  console.error("Client error:", err.message);
});
