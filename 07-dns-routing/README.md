## Lesson 7 — DNS: how domain names really work

In this lesson I focused on understanding **DNS as a name-resolution system**, not as a networking or transport mechanism.

DNS is responsible only for **mapping a domain name to an IP address**.
It does not route traffic, does not transfer data, and does not participate in TCP, TLS, or HTTP.

---

### What DNS actually does

When a client requests a domain name, DNS answers the question:

> “Which IP address corresponds to this name?”

After an IP address is obtained, DNS is no longer involved.
All further communication happens directly with the IP address using TCP/HTTPS.

---

### A and CNAME records

An **A record** maps a domain name directly to an IP address.

A **CNAME record** maps one domain name to another domain name (an alias), not to an IP.

CNAME is resolved entirely by the **recursive DNS resolver**.
The client sends a single DNS request and receives a final answer that already includes the resolved IP address.

The client does not follow CNAMEs manually and does not make additional DNS requests because of them.

---

### Why CNAME is used in practice

CNAME records are commonly used to:

- delegate IP management to cloud or CDN providers
- allow infrastructure changes without modifying client configuration
- simplify DNS management for multiple subdomains
- support dynamic IPs and geographic load balancing

CNAME is an architectural and operational decision, not a performance trick.

---

### DNS vs routing

DNS resolves **names to IPs**.
Routing determines **how packets reach that IP**.

Tools like `dig` are used to inspect DNS resolution.
Tools like `traceroute` are used to observe the network path to an IP address.

These are separate concerns and should not be confused.

---

### Key takeaway

DNS is a **naming system**, not a networking system.
CNAME is an alias mechanism inside DNS.
Once an IP address is resolved, DNS is no longer part of the request lifecycle.
