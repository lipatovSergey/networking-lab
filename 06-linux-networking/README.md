# Lab 6 — Linux Networking: Basic Network Diagnostics

## Lab Goal

To understand how the Linux operating system sees network connections
and to learn how to distinguish between:

- application (code) problems
- TCP problems
- network problems

without using a browser or frameworks.

---

## Key Idea

A backend server is just a **regular Linux process**,
and networking is a **separate layer** that can be diagnosed independently from the code.

---

## Tools Used and What They Show

### `ss -tulpn`

Shows:

- which ports are open
- which processes are listening on them
- whether TCP or UDP is used

Used to check:

> whether the server is running and actually listening on a port.

---

### `lsof -i :PORT`

Shows:

- which process is using a specific port
- PID and user

Used to answer:

> “Who is using this port and why can’t my server start?”

---

### `curl -v`

Shows the full request path:

- DNS resolution
- TCP connection establishment
- HTTP request and response

Helps to see the boundary:

- TCP is responsible for the connection
- HTTP is just text sent over TCP

---

### `ping`

Uses ICMP.

Checks:

- whether a host is reachable on the network level

Does **not** check:

- TCP
- HTTP
- server logic

---

### `traceroute`

Shows the path packets take through the network:

- sequence of routers (hops)
- latency at each hop

Important notes:

- `* * *` is normal (ICMP can be blocked)
- even if traceroute stops, the website may still work

---

### `ip addr`

Shows:

- network interfaces
- IP addresses of the machine

Important:

- `lo (127.0.0.1)` is loopback, only for local connections
- a server bound to `127.0.0.1` is not accessible from outside

---

### `ip route`

Shows:

- where the OS sends outgoing packets
- which gateway is used by default

Key line:

- `default via` — the main gateway to the internet

---

## Key Takeaways

- HTTP works on top of TCP
- TCP works on top of IP
- problems can occur at different layers
- not every issue is caused by the application code
- Linux provides tools to diagnose each networking layer

---

## Result

In this lab, I learned to:

- see a backend server as an OS process
- check whether a server is listening on a port
- distinguish network issues from application issues
- use basic Linux networking tools for diagnostics
