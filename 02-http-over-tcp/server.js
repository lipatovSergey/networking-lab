const net = require("net");

const PORT = 4001;

const server = net.createServer((socket) => {
  console.log("New client connected");

  const sectionSeparator = "\r\n\r\n";
  const lineSeparator = "\r\n";
  socket.on("data", (chunk) => {
    const data = chunk.toString("utf8");

    const separatorIndex = data.indexOf(sectionSeparator);
    const headerSection =
      separatorIndex === -1 ? data : data.slice(0, separatorIndex);

    const headerSectionLines = headerSection
      .split(lineSeparator)
      .map((line) => line.trim())
      .filter(Boolean); // clean empty lines

    const requestLine = headerSectionLines[0].split(" ");
    const headerLines = headerSectionLines.slice(1);
    const headers = {};
    for (const line of headerLines) {
      const index = line.indexOf(":");
      if (index === -1) continue;
      const key = line.slice(0, index).trim().toLowerCase();
      const value = line.slice(index + 1).trim();
      headers[key] = value;
    }
    const request = {
      method: requestLine[0],
      path: requestLine[1],
      httpVersion: requestLine[2],
      headers: headers,
    };
    console.log("New request: ", request);
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
