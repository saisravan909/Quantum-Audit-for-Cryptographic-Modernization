# Security Policy

## Supported Versions

QVault is currently in active development. Security fixes are applied to the latest version on the `main` branch.

| Version | Supported |
|---------|-----------|
| Latest (`main`) | Yes |
| Older tagged releases | No — please upgrade |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability in QVault, please report it privately so it can be addressed before public disclosure.

**Report to:** Sai Sravan Cherukuri  
**GitHub:** Use [GitHub's private vulnerability reporting](https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization/security/advisories/new)

### What to include in your report

- A clear description of the vulnerability
- The component or file affected
- Steps to reproduce the issue
- Potential impact (what an attacker could achieve)
- Any suggested fix, if you have one

### What to expect

- Acknowledgment within 48 hours
- A status update within 7 days
- Credit in the release notes if you wish, once the issue is resolved

## Scope

The following are in scope for security reports:

- Authentication bypass or privilege escalation
- Remote code execution
- SQL injection or database exposure
- Cross-site scripting (XSS) or cross-site request forgery (CSRF)
- Sensitive data exposure via API endpoints
- Insecure dependencies with exploitable CVEs

The following are out of scope:

- Vulnerabilities in demo/simulated data (the dashboard uses synthetic data by default)
- Issues requiring physical access to the server
- Denial of service via resource exhaustion on self-hosted instances
- Social engineering attacks

## Security Architecture

QVault is designed with security-first principles appropriate for a PQC governance tool:

- **Security headers:** All API responses include Helmet-enforced headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Content-Security-Policy, HSTS)
- **Rate limiting:** All API endpoints enforce per-IP rate limits to prevent abuse
- **No secrets in code:** All credentials are managed via environment variables and never committed to the repository
- **Input validation:** API request bodies are validated with Zod schemas before processing
- **Dependency scanning:** Dependabot is enabled on this repository for automated CVE alerts

## Responsible Disclosure

This project follows coordinated disclosure. Once a fix is available and deployed, the vulnerability will be documented in the GitHub Security Advisories tab with credit to the reporter.

Thank you for helping keep QVault and its users safe.
