# Lab 5 — Load Testing

## Goal of the lab

To understand **how a backend behaves under load** and to learn how to interpret basic performance metrics:

- latency
- percentiles (p50 / p95 / p99)
- requests per second (RPS)
- bytes per second

This lab shows the difference between:

- fast code
- and a fast HTTP service.

---

## Tool

**autocannon** was used to generate load.

Autocannon:

- creates many HTTP clients,
- sends real HTTP requests,
- measures the server as a “black box”.

Important: autocannon **does not benchmark code**, it load-tests the **entire HTTP interface**.

---

## Baseline

A simple HTTP endpoint was tested:

- small response
- no database
- no artificial delays

### Observations

- very high RPS
- minimal latency
- no visible bottlenecks

### Conclusion

A simple endpoint without I/O does not hit any limits.

---

## Experiment A — Large response (`/big`)

The endpoint returns a large payload (~1 MB).

### Observations

- RPS dropped almost by half
- bytes/sec also decreased
- latency remained very low

### Conclusions

- the bottleneck is **network and sockets**, not CPU
- large responses keep connections busy longer
- throughput is limited by bandwidth
- fast code ≠ scalable service

---

## Experiment B — Artificial delay (`/wait`)

The endpoint:

- returns a small response
- adds a delay using `setTimeout` (database simulation)

### Case: 100 ms delay

Observations:

- latency ≈ 100 ms
- RPS ≈ 100 with 10 connections
- very low bytes/sec

### Case: 10 ms delay

Observations:

- latency ≈ 10 ms
- RPS ≈ 900 with 10 connections

### Key insight

For I/O-bound workloads:

```
RPS ≈ connections / latency
```

Latency is defined by the operation itself, while throughput depends on concurrency.

---

## Experiment C — Effect of concurrency (`-c`)

The `/wait` endpoint with a 100 ms delay was tested with different numbers of connections.

### Results

| Connections | Latency | Req/sec |
| ----------- | ------- | ------- |
| 1           | ~100 ms | ~10     |
| 10          | ~100 ms | ~100    |
| 50          | ~100 ms | ~500    |

### Conclusions

- latency remains almost constant
- RPS and bytes/sec grow nearly linearly
- scaling is achieved through concurrency
- JavaScript is single-threaded, but requests are handled concurrently

---

## Key concepts

### Latency

The time from sending an HTTP request to receiving the full HTTP response on the client.

### Percentiles

- **p50** — median request
- **p95 / p97.5** — near-worst cases
- **p99** — tail latency, critical for user experience

Average latency alone does not describe real system behavior.

---

## I/O and the Node.js model

- I/O is any interaction with the outside world (database, network, disk)
- I/O does not block the JavaScript thread
- While one request waits for the database, JS can process others
- This is called **concurrency**, not parallelism

Node.js:

- one JavaScript thread
- many concurrent I/O operations
- an event loop that switches between ready tasks

---

## Main takeaways

- Backend performance is not just about code speed
- Bottlenecks can be:
  - network
  - I/O latency
  - sockets

- Large responses reduce throughput
- I/O-bound services scale via concurrency
- Latency is a property of an operation
- RPS is a property of the system
- Node.js is efficient for I/O-bound workloads but sensitive to CPU blocking
