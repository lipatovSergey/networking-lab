# Lab 2 — HTTP over TCP

## Goal

Understand how HTTP works on top of TCP.

Build a minimal HTTP server using Node.js `net` module, without Express and without the built-in `http` module.

Main idea:

HTTP is just text sent over a TCP connection.

---

## Architecture

- TCP server created with `net.createServer`
- TCP client created with `net.createConnection`
- Data is exchanged as plain text
- All HTTP logic is implemented manually:
  - request parsing
  - response formatting
  - message boundaries

---

## HTTP request structure

An HTTP request has four logical parts:

```
HTTP request
├── request line
├── headers
├── empty line
└── body (optional)
```

---

### Request line

The first line of the request:

```
GET / HTTP/1.1
```

It always contains three values:

- method (`GET`)
- path (`/`)
- HTTP version (`HTTP/1.1`)

The request line is not a header. It is a separate part of the protocol.

---

### Headers

Headers are lines in the following format:

```
Header-Name: Header-Value
```

Example:

```
Host: localhost
User-Agent: my-tcp-client/1.0
```

Important notes about headers:

- Header order does not matter
- Header names are case-insensitive
- There can be many headers
- Header values may contain `:` characters

---

### Empty line

An empty line separates headers from the body.

The separator is always:

```
\r\n\r\n
```

---

### Body

The body is optional and usually present in POST or PUT requests.

Example:

```
{"name":"John"}
```

The size of the body is defined by the `Content-Length` header.

---

## Parsing an HTTP request

Basic parsing steps:

1. Convert the incoming `Buffer` to a string
2. Find the `\r\n\r\n` separator
3. Split the request into:
   - header section
   - body section (not used yet)

4. Split the header section by `\r\n`
5. The first line is the request line
6. The remaining lines are headers

---

### Parsing headers into an object

For each header line:

- find the first `:`
- left side is the header name
- right side is the header value
- trim spaces
- convert header names to lowercase

Result example:

```
{
  host: "localhost",
  "user-agent": "my-tcp-client/1.0"
}
```

---

## HTTP response structure

An HTTP response has the following structure:

```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 20
Connection: close

Hello from raw HTTP!
```

---

### Required response parts

1. Status line (`HTTP/1.1 200 OK`)
2. Headers:
   - Content-Type
   - Content-Length
   - Connection

3. Empty line
4. Body

---

## Content-Length

`Content-Length` must contain the number of bytes, not characters.

In Node.js it is calculated using:

```
Buffer.byteLength(body, "utf8")
```

Without `Content-Length`, the client does not know where the response body ends.

---

## Closing connections

To close the connection with the client after sending the response:

```
socket.end()
```

This sends all remaining data and closes the TCP connection correctly.

---

To stop the server and free the port:

```
server.close()
```

---

## Result

- The client receives a valid HTTP response
- The response body is received completely
- The connection is closed correctly
- The server logs the parsed request:
  - method
  - path
  - HTTP version
  - headers

---

## Limitations of this implementation

This is a simple and naive implementation:

- No TCP buffering
- Assumes the request arrives in a single chunk
- No request body parsing
- No support for multiple requests per connection

These limitations are expected at this stage.

---

## Key takeaways

- HTTP is a text protocol
- TCP is a stream, not message-based
- Message boundaries are defined by the protocol, not by TCP
- `Content-Length` is critical for correct communication
- Frameworks like Express are built on top of this logic

---

## Status

Lab 2 is complete.

The full flow works correctly:

```
TCP client → HTTP request → TCP server
TCP server → HTTP response → TCP client
```
