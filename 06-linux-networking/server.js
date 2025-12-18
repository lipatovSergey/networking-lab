const http = require("http");

const PORT = 3000;

const server = http.createServer((_req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello from server");
});

server.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
