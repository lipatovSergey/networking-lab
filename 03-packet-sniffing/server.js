const express = require("express");

const PORT = 3000;
const server = express();

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
