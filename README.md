<div align="center">

<img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge&logo=statuspage&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/PQC-CNSA%202.0-ff6600?style=for-the-badge&logo=nist&logoColor=white" />
<img src="https://img.shields.io/badge/NIST-800--207-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/ML--KEM-768-purple?style=for-the-badge" />
<img src="https://img.shields.io/badge/Zero%20Trust-eBPF%20Ready-red?style=for-the-badge" />
<img src="https://img.shields.io/badge/Auth-Clerk-blueviolet?style=for-the-badge" />
<img src="https://img.shields.io/badge/Open%20Source-Community%20Driven-success?style=for-the-badge&logo=github" />

<br /><br />

```
  ██████  ██    ██  █████  ██    ██ ██      ████████
 ██    ██ ██    ██ ██   ██ ██    ██ ██         ██
 ██    ██ ██    ██ ███████ ██    ██ ██         ██
 ██ ▄▄ ██  ██  ██  ██   ██ ██    ██ ██         ██
  ██████    ████   ██   ██  ██████  ███████    ██
     ▀▀
```

**Quantum Cryptographic Governance Platform**

### Real-Time PQC Governance for the Quantum Age

**Post-Quantum Cryptography · CNSA 2.0 · Zero Trust · CBOM · HNDL Defense**

[View Dashboard](https://qvault.saisravancherukuri.com) · [Report a Bug](https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization/issues) · [Request a Feature](https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization/issues) · [Discussions](https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization/discussions)

</div>

---

## What This Project Is

QVault is a real-time cryptographic governance platform built for federal agencies, defense contractors, and critical infrastructure operators who need to understand and act on their post-quantum cryptography readiness today, not in a future planning cycle.

It gives security teams a unified operational view of their entire cryptographic estate. That means knowing which nodes are running deprecated algorithms, tracking compliance progress against CNSA 2.0 timelines, generating Cryptographic Bills of Materials (CBOMs), and seeing Zero Trust policy violations the moment they happen.

The project is fully open source because the quantum threat does not discriminate by organization size, budget, or sector. Everyone protecting critical infrastructure deserves access to the same visibility tools.

---

## The Problem Worth Solving

Nation-state adversaries are actively running "Harvest Now, Decrypt Later" (HNDL) campaigns. They intercept and store encrypted communications today, planning to decrypt them once cryptographically relevant quantum computers exist. Most security teams have no way to see how exposed they actually are.

At the same time, regulatory pressure is intensifying. NSM-10 mandates cryptographic inventories. EO 14028 requires Zero Trust adoption. CNSA 2.0 sets hard timelines for PQC migration. NIST FIPS 205 and 206 have finalized ML-DSA and ML-KEM as the approved post-quantum standards. Organizations that are not actively measuring their progress will be caught flat-footed.

The core gap is visibility. You cannot migrate what you have not mapped. QVault closes that gap.

---

## Architecture Overview

```mermaid
graph TB
    subgraph Frontend["Frontend Layer (React + Vite + TypeScript)"]
        CC[Command Center]
        NI[Node Inventory]
        ND[Node Detail]
        CD[Compliance Dashboard]
        CE[CBOM Explorer]
        AC[Alerts Center]
        TF[Telemetry Feed]
        LP[Landing Page]
        AS[Assessment]
        PL[Pipeline Diagram]
        HI[Handshake Inspector]
        RM[Risk Scorecard]
        TC[Threat Clock]
        CB[Config Builder]
    end

    subgraph Auth["Auth Layer (Clerk)"]
        CL[Clerk Provider]
        SI[Sign-In Page]
        SU[Sign-Up Page]
        CG[5-Click Free Gate]
    end

    subgraph API["API Layer (Express 5 + Security Middleware)"]
        HM[Helmet Headers]
        RL[Rate Limiter]
        AL[Audit Logger]
        NR["api/nodes"]
        TR["api/telemetry"]
        CR["api/compliance"]
        CBR["api/cbom"]
        AR["api/alerts"]
        DR["api/dashboard"]
    end

    subgraph DB["Data Layer (PostgreSQL + Drizzle ORM)"]
        NT[(nodes)]
        TT[(telemetry)]
        CT[(compliance)]
        CBT[(cbom)]
        AT[(alerts)]
    end

    subgraph Standards["Compliance Standards"]
        CNSA[CNSA 2.0]
        NIST[NIST 800-207]
        NSM[NSM-10]
        EO[EO 14028]
        FIPS["FIPS 205 and 206"]
    end

    Frontend --> Auth
    Auth --> API
    HM --> RL
    RL --> AL
    AL --> NR
    CC --> DR
    NI --> NR
    CD --> CR
    CE --> CBR
    AC --> AR
    TF --> TR

    NR --> NT
    TR --> TT
    CR --> CT
    CBR --> CBT
    AR --> AT

    CT --> CNSA
    CT --> NIST
    CT --> NSM
    CT --> EO
    CT --> FIPS

    style Frontend fill:#1a0a00,stroke:#ff8800,color:#ffcc88
    style Auth fill:#0a001a,stroke:#aa44ff,color:#ccaaff
    style API fill:#0a0a1a,stroke:#4466ff,color:#aabbff
    style DB fill:#0a1a0a,stroke:#44aa44,color:#aaffaa
    style Standards fill:#1a0a1a,stroke:#aa44ff,color:#ccaaff
```

---

## Security Architecture

QVault is built with security-first principles appropriate for a cryptographic governance tool.

```mermaid
graph LR
    subgraph Browser["Browser"]
        U[User]
        CG[Click Gate\n5 free navigations]
        CL[Clerk Auth\nSession Cookies]
    end

    subgraph Edge["API Layer"]
        HM[Helmet\nSecurity Headers]
        RL[Rate Limiter\n200 req / 15 min]
        WL[Write Limiter\n30 req / 15 min]
        CM[Clerk Middleware\nSession Validation]
        AL[Audit Logger\nWrite Operations]
        EH[Error Handler\nSanitized Responses]
    end

    U -->|1 to 5 visits| CG
    U -->|6th visit| CL
    CL -->|Session Cookie| CM
    CM --> RL
    RL --> WL
    WL --> AL
    HM -->|X-Frame-Options DENY| Browser
    HM -->|X-Content-Type-Options| Browser
    HM -->|Strict-Transport-Security| Browser
    HM -->|Referrer-Policy| Browser
    EH -->|Sanitized errors in prod| Browser

    style Browser fill:#0a001a,stroke:#aa44ff,color:#ccaaff
    style Edge fill:#001a0a,stroke:#44cc44,color:#aaffaa
```

### Security Controls

| Control | Implementation | Detail |
|---|---|---|
| Authentication | Clerk (managed) | Email, Google, GitHub SSO |
| Free preview gate | localStorage counter | 5 tool-page navigations before auth |
| Security headers | Helmet | HSTS, X-Frame-Options, X-Content-Type-Options, CSP, Referrer-Policy |
| General rate limiting | express-rate-limit | 200 requests per 15 minutes per IP |
| Write rate limiting | express-rate-limit | 30 POST/PUT/PATCH/DELETE per 15 minutes per IP |
| Audit logging | Pino structured log | All mutating API calls logged with method, path, IP, timestamp |
| Error sanitization | Global Express handler | Stack traces stripped in production |
| Request size cap | Express body-parser | 1 MB max on JSON and URL-encoded payloads |
| Secret management | Environment variables | No secrets in source code |
| Dependency scanning | Dependabot | Automated CVE alerts on all dependencies |

See [SECURITY.md](SECURITY.md) for the vulnerability disclosure policy.

---

## Data Flow

```mermaid
sequenceDiagram
    participant Node as Cryptographic Node
    participant Collector as Telemetry Collector
    participant Auth as Clerk Auth
    participant API as API Server
    participant Engine as Compliance Engine
    participant UI as Command Center
    participant Alert as Alert System

    Node->>Collector: TLS handshake metadata
    Node->>Collector: Algorithm negotiation events
    Collector->>Auth: Session validation
    Auth-->>Collector: Authorized
    Collector->>API: POST /api/telemetry
    API->>Engine: Score compliance posture
    Engine->>Engine: Map to CNSA 2.0 requirements
    Engine->>Engine: Calculate HNDL exposure score
    API->>Alert: Evaluate Zero Trust policies
    Alert-->>UI: Real-time alert stream
    UI->>API: GET /api/dashboard/summary
    API-->>UI: Aggregated posture snapshot
    UI->>API: GET /api/cbom
    API-->>UI: Cryptographic Bill of Materials
```

---

## Compliance Lifecycle

```mermaid
flowchart LR
    A([Asset Discovery]) --> B([CBOM Generation])
    B --> C([Posture Assessment])
    C --> D{Compliant?}
    D -->|Yes| E([Continuous Monitoring])
    D -->|No| F([Gap Analysis])
    F --> G([Remediation Planning])
    G --> H([Algorithm Migration])
    H --> C
    E --> I([Evidence Package])
    I --> J([ATO / Audit])
    J --> E

    style A fill:#1a0500,stroke:#ff6600,color:#ffaa66
    style B fill:#1a0500,stroke:#ff6600,color:#ffaa66
    style C fill:#0a0a1a,stroke:#4466ff,color:#aabbff
    style D fill:#1a1a00,stroke:#aaaa00,color:#ffff88
    style E fill:#001a00,stroke:#00aa00,color:#88ff88
    style F fill:#1a0000,stroke:#aa0000,color:#ff8888
    style G fill:#1a0500,stroke:#ff6600,color:#ffaa66
    style H fill:#0a0a1a,stroke:#4466ff,color:#aabbff
    style I fill:#001a00,stroke:#00aa00,color:#88ff88
    style J fill:#001a00,stroke:#00aa00,color:#88ff88
```

---

## Quantum Threat Timeline

```mermaid
timeline
    title Cryptographic Threat and Migration Timeline
    2020 : NIST PQC Standardization Round 3 begins
         : Harvest Now Decrypt Later attacks confirmed active
    2022 : NSM-10 mandates federal cryptographic inventories
         : EO 14028 establishes Zero Trust requirements
    2024 : NIST finalizes FIPS 205 (ML-DSA) and FIPS 206 (ML-KEM)
         : CNSA 2.0 migration timeline enforced
    2026 : QVault released as open source
         : SP 800-235 CBOM standard adopted
    2028 : CNSA 2.0 compliance deadline for NSS systems
         : First fault-tolerant QC demonstrations expected
    2030 : Full PQC migration required across federal enterprise
         : RSA-2048 and ECC considered cryptographically broken
    2033 : Cryptographically Relevant Quantum Computer projection
         : All pre-quantum encrypted archives become vulnerable
```

---

## HNDL Risk Model

```mermaid
graph LR
    subgraph Threat["Active HNDL Threat"]
        A[Adversary Collection] --> B[Encrypted Archive]
        B --> C[Storage Until CRQC]
    end

    subgraph Exposure["Your Exposure Window"]
        D[RSA-2048 Session] --> E[15 to 20 Year Vulnerability]
        F[ECC-256 Session] --> E
        G[ML-KEM-768 Session] --> H[Quantum Safe]
    end

    subgraph Mitigation["Mitigation Stack"]
        I[CBOM Inventory] --> J[Algorithm Deprecation]
        J --> K[PQC Rollout]
        K --> L[Continuous Monitoring]
    end

    A -.->|targets| D
    A -.->|targets| F
    A -.->|safe from| G
    L --> B

    style Threat fill:#1a0000,stroke:#cc0000,color:#ffaaaa
    style Exposure fill:#1a0800,stroke:#cc6600,color:#ffccaa
    style Mitigation fill:#001a00,stroke:#00cc00,color:#aaffaa
```

---

## Feature Set

### Platform (live data)

| Module | What It Does |
|---|---|
| Command Center | Executive overview of cryptographic posture, HNDL exposure score, active alerts, and migration velocity |
| Node Inventory | Per-node cryptographic fingerprint including algorithm suite, certificate details, and compliance status |
| Node Detail | Deep drill-down on a single node: algorithm history, cert chain, telemetry timeline |
| CBOM Explorer | Full Cryptographic Bill of Materials aligned to NIST SP 800-235 with dependency mapping and downloadable Markdown report |
| Compliance Dashboard | CNSA 2.0, NIST 800-207, NSM-10, and EO 14028 progress tracking with migration velocity |
| Zero Trust Alerts | Real-time policy violation stream with severity classification and affected node attribution |
| Telemetry Feed | Protocol-level cryptographic events: TLS version, cipher suite negotiation, algorithm transitions |

### Showcase (interactive tools)

| Module | What It Does |
|---|---|
| Pipeline Architecture | Animated 6-stage interactive data flow diagram showing the full telemetry-to-compliance pipeline |
| TLS Handshake Inspector | Step-by-step classical vs. post-quantum TLS handshake comparison with algorithm detail |
| Quantum Risk Scorecard | 2x2 scatter plot mapping all monitored nodes by impact and likelihood |
| HNDL Threat Clock | Live countdown to quantum threat threshold with active harvest feed simulation |
| Config Builder | Fluent Bit and Data Prepper configuration generator with downloadable output |
| Cyber Intel | Threat intelligence feed mapped to active algorithm vulnerabilities |

### Assessment and Onboarding

| Module | What It Does |
|---|---|
| Quantum Readiness Assessment | 5-step intake form, processing animation, animated score gauge, risk findings, 90-day roadmap, downloadable Markdown report |
| Regulatory Mapping | Side-by-side framework coverage for CNSA 2.0, NSM-10, EO 14028, NIST 800-207 |
| Industries | Use case library for Defense, Energy, Finance, and Healthcare sectors |
| Development Roadmap | 5-phase public roadmap with GitHub issue links |

---

## Technology Stack

```mermaid
graph TB
    subgraph Client["Client"]
        R[React 18]
        TS[TypeScript]
        V[Vite 7]
        TW[Tailwind CSS v4]
        RC[Recharts]
        FM[Framer Motion]
        SH[shadcn/ui]
        WO[Wouter Router]
        CK[Clerk React]
        LU[Lucide Icons]
    end

    subgraph Server["Server"]
        EX[Express 5]
        NO[Node.js 24]
        ZO[Zod v4 Validation]
        HE[Helmet Security]
        RA[express-rate-limit]
        CE[Clerk Express]
        PI[Pino Logging]
        OA[OpenAPI Spec]
        OR[Orval Codegen]
    end

    subgraph Data["Data"]
        PG[PostgreSQL 16]
        DR[Drizzle ORM]
    end

    R --> EX
    EX --> PG
    OA --> OR
    OR --> R

    style Client fill:#0a0a1a,stroke:#4488ff,color:#aaccff
    style Server fill:#0a1a0a,stroke:#44cc44,color:#aaffaa
    style Data fill:#1a0a00,stroke:#ff8844,color:#ffcc99
```

---

## Getting Started

### Requirements

- Node.js 20 or later
- PostgreSQL 15 or later
- pnpm 9 or later
- A free [Clerk](https://clerk.com) account for authentication

### Installation

```bash
git clone https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization.git
cd Quantum-Audit-for-Cryptographic-Modernization
pnpm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/qvault
SESSION_SECRET=your_session_secret_here

# Clerk authentication (from your Clerk dashboard)
CLERK_SECRET_KEY=sk_live_...
CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

### Database Setup

```bash
pnpm --filter @workspace/db run push
```

### Start Development Servers

In separate terminals:

```bash
# API Server (port 8080)
pnpm --filter @workspace/api-server run dev

# Frontend Dashboard
pnpm --filter @workspace/quantum-audit run dev
```

---

## How the Free Preview Gate Works

QVault offers 5 free navigations to tool pages before requiring an account. Public and informational pages (landing, about, industries, regulatory, roadmap, innovator) are always open. Once a visitor navigates to 5 distinct tool pages, the 6th click redirects to the sign-in page and resumes from the intended destination after authentication. The counter is stored in `localStorage` and resets permanently once signed in.

```mermaid
flowchart TD
    A[User visits QVault] --> B{Free page?}
    B -->|Yes: landing, about, industries, etc.| C[Always accessible]
    B -->|No: dashboard, nodes, CBOM, etc.| D{Click count}
    D -->|1 to 5| E[Access granted\nCounter increments]
    D -->|6+| F[Redirect to Sign In]
    F --> G{Clerk Auth}
    G -->|Success| H[Counter reset\nRedirect to intended page]
    G -->|Cancel| A

    style A fill:#0a001a,stroke:#aa44ff,color:#ccaaff
    style C fill:#001a00,stroke:#00cc00,color:#aaffaa
    style E fill:#001a00,stroke:#00cc00,color:#aaffaa
    style F fill:#1a0000,stroke:#cc0000,color:#ffaaaa
    style H fill:#001a00,stroke:#00cc00,color:#aaffaa
```

---

## API Reference

### Dashboard

```
GET /api/dashboard/summary         Overall cryptographic posture snapshot
GET /api/dashboard/hndl-exposure   HNDL exposure score and breakdown
```

### Nodes

```
GET  /api/nodes          List all monitored cryptographic nodes
GET  /api/nodes/:id      Get single node with full algorithm detail
POST /api/nodes          Register a new node for monitoring
```

### Telemetry

```
GET  /api/telemetry/stream         Live telemetry event feed
GET  /api/telemetry/node/:nodeId   Per-node telemetry history
POST /api/telemetry                Ingest a new telemetry event
```

### Compliance

```
GET /api/compliance/overview    Framework-by-framework compliance summary
GET /api/compliance/velocity    Migration progress and timeline tracking
```

### CBOM

```
GET  /api/cbom          Full Cryptographic Bill of Materials
GET  /api/cbom/:id      Single CBOM entry with dependency detail
POST /api/cbom          Add or update a CBOM entry
```

### Alerts

```
GET   /api/alerts           Active alert queue with severity ordering
POST  /api/alerts           Create a new alert
PATCH /api/alerts/:id       Update alert status or severity
```

---

## Compliance Frameworks Covered

| Framework | Scope | Status |
|---|---|---|
| CNSA 2.0 | NSS algorithm requirements and migration timelines | Full Coverage |
| NIST 800-207 | Zero Trust architecture principles | Full Coverage |
| NSM-10 | Federal cryptographic inventory mandate | Full Coverage |
| EO 14028 | Cybersecurity executive order requirements | Full Coverage |
| FIPS 205 | ML-DSA (Dilithium) digital signature standard | Full Coverage |
| FIPS 206 | ML-KEM (Kyber) key encapsulation standard | Full Coverage |
| NIST SP 800-235 | CBOM structure and content requirements | Full Coverage |

---

## About the Innovator

<div align="center">

### Sai Sravan Cherukuri

**Cybersecurity Innovator and Open Source Contributor**

</div>

Sai Sravan Cherukuri built this project because he saw the same problem repeating itself across organizations: security teams knew the quantum threat was real, but they had no practical tool to measure their actual exposure or track their progress toward fixing it. Strategy documents and compliance checklists were everywhere. Real-time operational visibility was not.

Rather than build a proprietary product, Sai made a deliberate choice to release everything as open source. His reasoning is straightforward: the cryptographic modernization challenge facing federal agencies, defense contractors, and critical infrastructure operators is too important and too urgent to be locked behind a paywall. The ecosystem needs shared tools and shared urgency.

This is not Sai's first contribution to the security community. His broader commitment is to building practical, open infrastructure that helps the people responsible for protecting national security systems do their jobs better, without requiring enterprise budgets to get started.

> "Visibility precedes action. And action is now urgent."

If you are working on PQC migration, Zero Trust implementation, or cryptographic inventory challenges, Sai welcomes collaboration. File an issue, open a pull request, or start a discussion. Every contribution advances the collective readiness of the ecosystem.

**GitHub:** [saisravan909](https://github.com/saisravan909)

---

## Contributing

This project thrives on community involvement. Here is how to get involved.

**Reporting issues:** Use the [Issues tab](https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization/issues) with as much context as possible.

**Reporting security vulnerabilities:** Follow the process in [SECURITY.md](SECURITY.md). Do not open a public issue for security bugs.

**Submitting changes:** Fork the repository, create a feature branch, make your changes with tests where applicable, and open a pull request against the main branch.

**Requesting features:** Start a [Discussion](https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization/discussions) before building something large, so the community can align on the approach.

**Improving documentation:** Documentation PRs are always welcome and always reviewed quickly.

---

## Roadmap

- [ ] STIX/TAXII threat intelligence integration for HNDL campaign attribution
- [ ] Automated CBOM diff alerts when algorithm dependencies change
- [ ] NIST NCCoE PQC Migration Project playbook templates
- [ ] SCAP content generation for automated compliance scanning
- [ ] OpenTelemetry collector plugin for production telemetry ingestion
- [ ] Role-based access control for multi-team environments
- [ ] Export to PDF for ATO evidence packages
- [ ] Kubernetes operator for automated node discovery
- [ ] Per-user saved assessments and historical posture tracking

---

## License

MIT License. See [LICENSE](LICENSE) for full text.

---

## Acknowledgments

This project builds on the work of the NIST Post-Quantum Cryptography Standardization project, the NCCoE PQC Migration initiative, and the broader open-source security community. The algorithms implemented and tracked here represent years of cryptographic research from academic institutions and national laboratories around the world.

---

<div align="center">

**QVault**

Open Source. Community Driven. Built to secure the future.

CNSA 2.0 · NIST 800-207 · NSM-10 · EO 14028 · FIPS 205 · FIPS 206

[Star this repo](https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization) to support the project and help others find it.

</div>
