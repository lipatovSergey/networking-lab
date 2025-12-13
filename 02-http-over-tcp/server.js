const net = require("net");

const PORT = 4001;
function breakIntoLines(string) {
  const result = [];
  const lineBreaker = "\r\n";
  let buffer = string;
  let newLineIndex;
  while ((newLineIndex = buffer.indexOf(lineBreaker)) !== -1) {
    const rawLine = string.slice(0, newLineIndex);
    console.log(newLineIndex);
    buffer += buffer.slice(newLineIndex + 1);
    const line = rawLine.trim();
    result.push(line);
  }
  return result;
}

const server = net.createServer((socket) => {
  console.log("New client connected");

  const separator = "\r\n\r\n";
  socket.on("data", (chunk) => {
    data = chunk.toString("utf8");

    const separatorIndex = data.indexOf(separator);
    const header = separatorIndex === -1 ? data : data.slice(0, separatorIndex);
    console.log("Request header: ", header);

    const headerLines = breakIntoLines(header);
    console.log("Header lines", headerLines);
  });

  socket.on("end", () => {
    console.log("Client disconnected (end");
  });

  socket.on("close", () => {
    console.log("Connection closed");
  });

  socket.on("error", (err) => {
    console.error("Socket error: ", err.message);
  });
});

server.listen(PORT, () => {
  console.log(`TCP server is listening on port ${PORT}`);
});
