## Lab 4 — TLS / HTTPS (Summary)

### Goal of the Lab

To understand how HTTPS actually works:
how TLS establishes a secure connection,
what role certificates play,
and how encryption keys are derived.

---

### HTTPS as a Protocol Stack

HTTPS is **not a separate protocol**, but a combination of layers:

```
HTTP   — request/response contract
TLS    — encryption and authentication
TCP    — reliable byte transport
```

Each layer is independent:
HTTP does not know about TLS, and TLS does not know about HTTP.

---

### Role of Certificates

Certificates are used **for server authentication**,
**not for encrypting application data**.

TLS uses a certificate chain:

```
Leaf certificate      (*.google.com)
Intermediate CA       (WR2)
Root CA               (GTS Root R1)
```

Each certificate:

- is signed **exactly once**
- is validated **independently**
- has its own expiration and constraints

---

### Chain of Trust

Certificate validation is performed by the **client**, not the server:

1. The site certificate (`*.google.com`)
   is verified using the **public key of WR2**
2. The intermediate certificate (WR2)
   is verified using the **public key of GTS Root R1**
3. The root certificate (GTS Root R1)
   must exist in the client’s **trust store**

If **any** certificate in the chain is:

- expired
- revoked
- incorrectly signed

→ the entire connection is considered insecure.

The Root CA does **not** override or “fix” invalid intermediates.

---

### Trust Store

The trust store is a collection of **trusted root certificates** built into the OS or browser.

Root certificates:

- are trusted by presence, not by verification
- are self-signed
- serve as the anchor of trust for the entire system

Adding a root certificate to a trust store is a **high-risk operation**.

---

### TLS Handshake (TLS 1.3, simplified)

1. The client initiates the TLS connection (`ClientHello`)
2. The server responds and sends its certificates
3. The client validates the certificate chain
4. Client and server exchange **public parameters**
5. Each side independently computes a **shared secret**
6. Symmetric keys are derived from this secret
7. Encrypted application data transfer begins

⚠️ The secret is **never transmitted over the network**.

---

### Traffic Encryption

- Application data is encrypted using **symmetric encryption** (e.g. AES-GCM)
- Asymmetric cryptography is used **only during the handshake**
- Certificates are **not used to encrypt traffic**, only to authenticate the server

---

### Key Takeaways

- HTTPS = HTTP over TLS over TCP
- Certificates establish trust, not encryption
- Every certificate in the chain is validated independently
- The Root CA is a trust anchor, not a “magic signature”
- Shared secrets are derived, not exchanged
- Backend developers should understand TLS, but never implement it themselves
