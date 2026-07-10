# Security Policy

## Supported Versions

We support security updates for the following versions:

| Version | Supported |
| :--- | :--- |
| 1.0.x | Yes |
| < 1.0.0 | No |

## Reporting a Vulnerability

We take the security of Mobile Adda Bhilai seriously. If you believe you have found a security vulnerability in this project, please report it to us responsibly.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please send an email to the project administrators. 

### Vulnerability Report Checklist
When reporting a vulnerability, please include:
1. **Description**: Detailed description of the potential vulnerability.
2. **Impact**: How this vulnerability affects the showroom database or administrative controls.
3. **PoC (Proof of Concept)**: Steps to reproduce, sample requests, or scripts.
4. **Remediation**: Suggestion on how it could be patched (if available).

We will review your submission and respond within 48 hours to coordinate a patch release.

## Security Practices in Place

- **IMEI Masking**: The sensitive `imei` number is only exposed to authenticated administrative sessions and is omitted from public queries.
- **Session Tokens**: Admin dashboard access is secured via signature-validated JWT tokens with 24h expirations.
- **Environment Isolation**: Secret keys (Supabase Anon Key, JWT Secret, DB credentials) are isolated in `.env` files and omitted from Git history.
- **Validation**: All user inputs are validated before database insertions to prevent query injections or formatting exceptions.
