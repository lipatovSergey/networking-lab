# Lab #3 — TCP Traffic Analysis (Packet Sniffing)

## Lab Goal

To understand **how TCP really works under HTTP**:

- how a connection is established
- how data is transferred
- what `seq`, `ack`, and `win` mean
- why one HTTP request is split into multiple TCP packets

---

## Tools

- Express (used as a real HTTP server)
- `tcpdump` (to analyze TCP packets)
- `curl` (HTTP client)

---

## Big Picture

HTTP works **on top of TCP**.
TCP is a **bidirectional byte stream**, not messages or packets.

In one TCP connection there are **two independent streams**:

- client → server
- server → client

Each stream has its own:

- `seq`
- `ack`
- `win`

---

## TCP Handshake

Before any data transfer, TCP establishes a connection:

1. `SYN` — client asks to open a connection
2. `SYN + ACK` — server agrees
3. `ACK` — client confirms

After this, the connection is established.

---

## Data Transfer

### HTTP Request

The client sends an HTTP request:

- data is sent in a TCP packet with flag `P.` (PSH + ACK)
- `seq` shows which bytes are being sent
- `ack` confirms data received **from the server**

### HTTP Response

The server sends the response:

- it uses **its own sequence numbers**
- `ack` confirms bytes received **from the client**
- `ack` does not change if the client sends no new data

---

## Connection Closing

The connection is closed using `FIN` packets:

- one side sends `FIN`
- the other side acknowledges it
- then closes its side as well

---

## TCP Fields Explained

### `seq` (sequence number)

Shows:

> which bytes **I am sending**

Example:

```
seq 1:78
```

Meaning:

- bytes `1–77` were sent
- total of 77 bytes

---

### `ack` (acknowledgement number)

Shows:

> which byte **I expect next from the other side**

Rule:

```
ack = N  ⇔  bytes 1..(N−1) were received
```

Example:

```
ack 78
```

Meaning:

- bytes `1–77` were received
- next expected byte is `78`

---

### `win` (receive window)

Shows:

> how many bytes **I can still receive**, starting from `ack`

`win`:

- reflects the **state of the receive buffer**
- is not directly related to how much data was already received
- may slightly fluctuate (`512 → 509`, etc.)

Example:

```
ack 412
win 512
```

Meaning:

- bytes `1–411` were received
- starting from `412`, up to 512 more bytes can be accepted

---

## Important Notes

- TCP does **not reset `seq` and `ack` between HTTP requests**
- HTTP requests are application-level logic
- TCP works independently as a transport layer
- `ack` always confirms the **opposite direction**
- `win` is **flow control**, not network speed
- `win = 0` means the receiver temporarily cannot accept data

---

## Main Insight of the Lab

> TCP is not about packets or requests.
> It is about two independent byte streams with acknowledgements and buffer control.

HTTP simply uses this mechanism.

---

## Status

Lab completed.
TCP is understood at the level of byte streams and receive buffers.
