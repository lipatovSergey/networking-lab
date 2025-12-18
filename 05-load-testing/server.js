const http = require("http");

const PORT = 3000;
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello from raw Node HTTP");
    return;
  }

  if (req.url === "/big") {
    const bigResponse = "a".repeat(1_000_000);

    res.statusCode(200);
    res.setHeader("Content-Type", "text/plain");
    res.end(bigResponse);
    return;
  }

  if (req.url === "/wait") {
    res.statusCode = 200;
    setTimeout(() => {
      res.end();
    }, 100);
    return;
  }
  res.statusCode(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log("Server running on http://localhost:3000");
});
