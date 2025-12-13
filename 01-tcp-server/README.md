_TCP (Transmission Control Protocol)_ - is a transport-layer protocol that creates a reliable connection between two devices and makes sure all data arrives correctly,in order, and without loss. It does this by establishing the connection first, checking that each piece of data is received, and resending anything that get lost.

_IP_ - (Internet Protocol Address) - Unique numerical identifier assigned to a device on a network. `195.34.32.116`
_Port_ - Identifier that allows an operating system to direct incoming network data to the correct application.
_Socket_ - combination of an IP address and a port number that identifies a communication endpoint.

## Notes: TCP Server and Client. Byte Stream and Protocol over TCP

In this lab, I implemented a **TCP server** and a **TCP client** using the built-in `net` module in Node.js.

### 1. What TCP is in practice

TCP is a transport protocol that **allows a client and a server to communicate**.
Before sending any data, TCP **establishes a connection**. During this step, both sides exchange special control messages (handshake).

TCP guarantees that:

- data is delivered reliably,
- data order is preserved,
- lost data is sent again if an error happens.

### 2. Server and port

The server **listens on a specific port** (in our case, port `4000`).
We give the server an instruction:

> “If someone connects to this port, treat it as a client and react to its actions in this way.”

**Multiple clients can connect to the same port at the same time.**

Each client connection is a separate **socket**, uniquely identified by:

- client IP address,
- client port number.

So one server port can handle many parallel client connections.

### 3. Byte stream and chunks

TCP **does not send messages**.
TCP sends a **stream of bytes**, which the application receives as **chunks**.

Important points:

- one `write` is **not equal** to one `chunk`,
- one `chunk` may contain data from several `write` calls,
- one `write` may arrive as multiple `chunk`s.

How data is grouped into chunks depends on:

- the operating system,
- TCP buffers,
- network conditions,
- Nagle’s algorithm.

Nagle’s algorithm tries to **send data using as few chunks as possible**:

> if data can be sent together, it will likely be combined.

### 4. Encoding and UTF-8

TCP sends **bytes**, not text.
In Node.js, a `chunk` is a `Buffer`.

To work with text, we:

- decode bytes into a string using UTF-8,
- use `chunk.toString("utf8")`.

This is important because:

- UTF-8 is a multibyte encoding,
- one character may use several bytes,
- bytes of one character can be split between different chunks.

### 5. Protocol over TCP (line protocol)

To correctly rebuild messages from a byte stream, both sides must **agree on a protocol**.

In this lab, we used a **line-based protocol**:

- each message **must end with `\n`**,
- both the server and the client follow this rule.

### 6. Buffering and message parsing

How data is processed:

1. A string `buffer` is created.
2. For every incoming `chunk`:
   - it is decoded from UTF-8,
   - it is **appended to the buffer**.

3. While the buffer contains `\n`:
   - take the substring from the start up to `\n` — this is **one complete message**,
   - save the remaining data back into the buffer to **avoid data loss**,
   - process the message.

Buffering is **required**, otherwise parts of data or characters may be lost.

### 7. Final conclusion

- TCP is a **byte stream**, not a message protocol.
- TCP **does not define message boundaries**.
- A protocol is **always required** on top of TCP.
- The simplest protocol is using a delimiter like `\n`.
- Buffering and parsing by delimiter is a basic pattern for text protocols.
- HTTP, Redis, SMTP, and many other protocols work using the same idea.

---
