# QVault — PQC Governance Dashboard

## Overview

Full-stack open-source PQC governance dashboard for CNSA 2.0, Zero Trust, and Post-Quantum Cryptography compliance. Built by Sai Sravan Cherukuri. Domain: qvault.saisravancherukuri.com.

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Pages / Routes

### Platform (live data)
- `/dashboard` — Command Center (HNDL exposure, compliance score, telemetry chart)
- `/nodes` — Node Inventory (all 10 nodes, algorithm, status)
- `/nodes/:id` — Node Detail
- `/telemetry` — Live eBPF telemetry feed
- `/compliance` — Compliance Velocity (CNSA 2.0 / NIST 800-207)
- `/cbom` — CBOM Explorer with Export Report (downloads audit-ready Markdown)
- `/alerts` — Zero Trust Alerts

### Showcase (cinematic/interactive)
- `/pipeline` — Animated Pipeline Architecture Diagram (6-stage interactive flow)
- `/handshake` — TLS Handshake Inspector (5-step classical vs PQC comparison)
- `/risk-map` — Quantum Risk Scorecard (2x2 SVG scatter plot, all nodes)
- `/threat-clock` — HNDL Threat Clock (countdown + live harvest feed)
- `/config-builder` — Fluent Bit + Data Prepper Config Generator (downloadable)

### Assessment
- `/assessment` — Quantum Readiness Assessment (5-step intake, processing animation, animated score gauge, risk findings, 90-day roadmap, downloadable Markdown report)

### Info
- `/` — Landing page
- `/innovator` — About the Innovator (Sai Sravan Cherukuri)
- `/regulatory` — Regulatory Mapping (CNSA 2.0, NSM-10, EO-14028)
- `/industries` — Industry Use Cases
- `/cyber-intel` — Cyber Intel
- `/demo` — Live Demo (guided tour + scenario simulator)
- `/roadmap` — Development Roadmap (5 phases, 13 GitHub issues)

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
