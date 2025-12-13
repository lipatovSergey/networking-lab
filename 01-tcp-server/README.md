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

### 8. Reliability, ACK, and connection closing (FIN)

TCP guarantees reliable delivery **at the byte level**, not at the message level.

To do this, TCP internally uses:

- **byte sequence numbers** — every byte in the stream has a position,
- **ACK (acknowledgment)** messages — confirmation of received bytes,
- **retransmission** — lost bytes are sent again automatically.

How ACK works conceptually:

- the receiver confirms **all bytes up to a certain number**,
- an ACK like `ACK = 5002` means:

  > “I have received all bytes up to 5001 and I am waiting for byte 5002.”

Important points about ACK:

- ACK is **not sent after every byte**,
- ACK usually confirms **a whole range of bytes at once**,
- if an ACK does not move forward for some time, the sender assumes data was lost and retransmits it.

##### Data loss handling

If some bytes are lost during transmission:

- the receiver keeps acknowledging the **last continuous byte received**,
- the sender detects that progress has stopped,
- the sender **retransmits the missing bytes**.

This process is **completely invisible** to the application code.
From Node.js point of view:

- either data arrives correctly,
- or the connection is closed with an error.

##### Connection termination (FIN)

TCP does not guess when data ends.
The end of the byte stream is always **explicitly signaled**.

To finish sending data, a side sends a **FIN** flag, which means:

> “I will not send any more bytes.”

Important details:

- FIN is **not a data byte**, it is a control signal,
- FIN does **not** mean that the other side has received all data yet,
- FIN only means that **this side is done sending**.

A TCP connection is closed **in both directions**:

1. one side sends `FIN`,
2. the other side acknowledges it (`ACK`),
3. the other side sends its own `FIN`,
4. the first side acknowledges it.

Only after this exchange is the TCP connection fully closed.

##### Key takeaway about reliability

- TCP guarantees **ordered and reliable delivery of bytes**,
- TCP does **not know** about messages, requests, or responses,
- TCP does **not know** how many bytes “should” be sent,
- message boundaries and data length must be defined by a protocol **above TCP** (for example, HTTP).

---
