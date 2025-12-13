const net = require("net");

const PORT = 4000;

const client = net.createConnection({ port: PORT }, () => {
  console.log("Connected to server");

  // send to server
  client.write("First message\n");
  client.write("Second message\n");
  client.write("Third message\n");
});

let buffer = "";
client.on("data", (data) => {
  buffer += data.toString("utf8");

  let newLineIndex;
  while ((newLineIndex = buffer.indexOf("\n")) !== -1) {
    const rawMessage = buffer.slice(0, newLineIndex);
    buffer = buffer.slice(newLineIndex + 1);
    const message = rawMessage.trim();
    console.log(`Received from server ${message}`);
  }
});

client.on("end", () => {
  console.log("Disconnected from server");
});

client.on("error", (err) => {
  console.error("Client error:", err.message);
});
