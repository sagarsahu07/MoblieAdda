# Contributing to Mobile Adda Bhilai

First off, thank you for considering contributing to Mobile Adda Bhilai! It's people like you who make this a great showcase catalog platform.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before interacting with the community.

## How Can I Contribute?

### Reporting Bugs
* Check the existing issues or documentation to make sure it hasn't been reported.
* Open a new issue with a clear title and description, providing as much relevant information as possible, including:
  * Steps to reproduce the bug.
  * Expected behavior vs. actual behavior.
  * Console logs, screenshots, or stack traces if available.

### Suggesting Enhancements
* Open an issue explaining the proposed enhancement.
* Describe the specific use case, how it benefits showroom visitors, and why it belongs in the inventory showcase roadmap.

### Pull Requests
1. Fork the repository and create your branch from `main`.
2. Install dependencies by running `npm run install:all`.
3. If you've added code that should be tested, add tests.
4. Ensure the React frontend compiles cleanly by running `npm run build --prefix frontend`.
5. Ensure the Prisma schema is validated via `npx prisma validate --schema backend/prisma/schema.prisma`.
6. Issue a Pull Request with a descriptive summary of your changes.

## Coding Style
- Keep Javascript clean and modular.
- Avoid hardcoding showroom variables inside React components; always use the `ShopSettings` database table and feed details dynamically via context.
- Keep IMEI codes secure: never expose them to public client controllers.
