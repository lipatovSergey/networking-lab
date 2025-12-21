## 🟩 Lesson 8 — Routing, VPN and Tor (Summary)

In this lesson, I studied how network traffic is actually routed through the internet and how VPN and Tor affect this process.

### Routing basics

After resolving a domain name via DNS, the operating system sends packets directly to the **final destination IP**, but it does not know the full route.
Instead, the OS uses a **routing table** and forwards all non-local traffic to the **default gateway** (usually the home router).
Each router on the path makes an independent decision about the **next hop**, without knowing the complete route to the destination.

### Role of the gateway

The gateway is the only network entity the local machine fully relies on.
If an IP address does not belong to a local subnet, the packet is forwarded to the gateway, which then passes it further into the provider’s network and the internet.

### How VPN works

A VPN does not replace the router or the internet connection.
Instead, it creates a **virtual network interface** and modifies routing rules so that all outgoing traffic is sent through this interface.

The VPN client:

- intercepts traffic inside the OS,
- encrypts it before it reaches the router,
- sends encrypted packets to the VPN server.

The ISP can see that a VPN connection exists, but cannot see the contents of the traffic or the final destination.

At the VPN server:

- traffic is decrypted,
- forwarded to the destination server as normal internet traffic.

For external services, the source IP is the VPN server, not the client.

### VPN limitations

VPN provides:

- encryption between client and VPN server,
- IP address masking,
- protection from local networks and ISPs.

VPN does **not** provide full anonymity and does not prevent browser-level tracking.

### Tor overview

Tor is a distributed network of volunteer-operated nodes designed for anonymity rather than simple traffic encryption.

Traffic is routed through multiple nodes:

- Entry (knows the client, not the destination),
- Middle (knows neither),
- Exit (knows the destination, not the client).

Each layer decrypts only its own part of the data, so no single node can identify both the sender and the destination.

Unlike VPN, Tor removes the need to trust a single provider, at the cost of performance.

### Key conclusions

- Routing is hop-by-hop; no device knows the full path.
- VPN encrypts traffic and changes routing, but requires trust in the VPN provider.
- Tor focuses on anonymity by distributing trust across multiple independent nodes.
- VPN and Tor solve different problems and are not interchangeable.
