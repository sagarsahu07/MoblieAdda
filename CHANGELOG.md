# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-09

### Added
- **Monorepo Architecture**: Setup concurrent scripts to run both the Node.js + Express API backend and Vite + React client frontend.
- **Dynamic Shop settings**: Implemented `ShopSettings` schema in database; all addresses, opening hours, WhatsApp links, Google map redirects are loaded from the database, eliminating hardcoded variables in React views.
- **Detailed Mobiles Inventory**: Configured attributes for display panel authenticity checks, battery health metrics, fingerprint/face id functionality, body/frame condition grades, and camera status.
- **Protected IMEI Logs**: Configured sensitive IMEI tracking, restricted to authorized Admin sessions and completely omitted from public listing/detail responses.
- **SEO Optimization**: Integrated text slug navigation (e.g. `/mobiles/brand-model-variant-color`) instead of database UUIDs on public paths, and populated index.html with SEO keywords.
- **Robust Demo Fallback**: Configured offline mock support in `ShopContext.jsx` loaded with contacts from the PDF to demonstrate full dashboard and catalogue capabilities if PostgreSQL is unmigrated.
- **Secure Admin Portal**: Secured administrative endpoints using Bcrypt password hashing and JSON Web Token (JWT) authorizations.
- **Supabase Storage Integration**: Setup upload helper routines to easily add multiple photos to showcase gallery cards.
- **Administrative Logging**: Configured activity log capturing to keep track of additions, updates, deletions, and setting updates on the owner's dashboard.
