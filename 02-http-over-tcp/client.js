const net = require("net");

const PORT = 4001;

const client = net.createConnection({ port: PORT }, () => {
  console.log("Connected to server");

  // send to server
  client.write(
    "GET / HTTP/1.1\r\nHost: localhost\r\nUser-Agent: my-tcp-client/1.0\r\n\r\n"
  );
});

client.on("data", (chunk) => {
  const data = chunk.toString("utf8");
  console.log(`Received from server ${data}`);
});

client.on("end", () => {
  console.log("Disconnected from server");
});

client.on("error", (err) => {
  console.error("Client error: ", err.message);
});
