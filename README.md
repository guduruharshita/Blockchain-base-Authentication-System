# AuthChain

[![CI](https://github.com/guduruharshita/blockchain-base-authentication-system/actions/workflows/ci.yml/badge.svg)](https://github.com/guduruharshita/blockchain-base-authentication-system/actions)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity)](contracts/AuthChain.sol)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)](backend/package.json)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](frontend/package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](tsconfig.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Enterprise-grade decentralized authentication system** built on Ethereum.  
Users authenticate with their wallets via EIP-191 personal signatures — **no passwords stored anywhere**, on-chain or off-chain. The smart contract manages an on-chain identity registry; the backend issues JWTs after cryptographic signature verification.

```
┌─────────────────────────────────────────────────────────────────┐
│                         AuthChain                               │
│                                                                 │
│  ┌──────────────┐    sign message    ┌─────────────────────┐   │
│  │   MetaMask   │ ──────────────────▶│   React Frontend    │   │
│  │   (wallet)   │                    │  (TypeScript + Vite) │   │
│  └──────────────┘                    └──────────┬──────────┘   │
│         │                                       │ POST /nonce  │
│         │ eth_accounts                          │ POST /verify  │
│         ▼                                       ▼              │
│  ┌──────────────┐  verify sig + JWT  ┌─────────────────────┐   │
│  │  Ethereum    │ ◀─────────────────▶│  Express Backend    │   │
│  │  (Sepolia)   │  getProfile()      │  (TypeScript + JWT) │   │
│  │  AuthChain   │                    │  audit log → SQLite │   │
│  │  .sol        │                    └─────────────────────┘   │
│  └──────────────┘                                              │
└─────────────────────────────────────────────────────────────────┘
```

## Contents

- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Smart Contract](#smart-contract)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security](#security)
- [Skills Demonstrated](#skills-demonstrated)

---

## How It Works

Traditional auth stores passwords. AuthChain stores **Ethereum addresses**.

| Step | Action | Where |
|------|--------|-------|
| 1 | User connects MetaMask | Browser |
| 2 | Backend issues a one-time nonce | Off-chain (SQLite, 5-min TTL) |
| 3 | User signs `"Sign in to AuthChain\nAddress: 0x…\nNonce: uuid"` | MetaMask (client-side) |
| 4 | Backend recovers signer address via `ethers.verifyMessage()` | Off-chain |
| 5 | If address matches → issue JWT | Off-chain |
| 6 | Frontend calls `recordLogin()` on-chain (optional timestamping) | Ethereum |

**No password is ever created, stored, or transmitted.**

---

## Architecture

### System Components

```
authchain/
├── contracts/          Smart contract (Hardhat + OpenZeppelin)
├── scripts/            Deployment scripts (TypeScript)
├── test/               Contract unit tests (Mocha + Chai)
├── backend/            REST API (Express + TypeScript + JWT)
└── frontend/           SPA (React 18 + TypeScript + Vite)
```

### Authentication Flow (Sequence Diagram)

```
User          Frontend          Backend               Ethereum
 │                │                 │                    │
 │ click sign-in  │                 │                    │
 │──────────────▶ │                 │                    │
 │                │ POST /nonce     │                    │
 │                │────────────────▶│                    │
 │                │ {nonce, msg}    │                    │
 │                │◀────────────────│                    │
 │ MetaMask popup │                 │                    │
 │◀────────────── │                 │                    │
 │ sign message   │                 │                    │
 │──────────────▶ │                 │                    │
 │                │ POST /verify    │                    │
 │                │ {addr, sig}     │                    │
 │                │────────────────▶│                    │
 │                │                 │ verifyMessage()    │
 │                │                 │ ◀ recovered addr   │
 │                │  {JWT}          │                    │
 │                │◀────────────────│                    │
 │                │                 │  recordLogin()     │
 │                │─────────────────────────────────────▶│
 │                │                 │  tx confirmed      │
 │                │◀─────────────────────────────────────│
```

---

## Smart Contract

**`contracts/AuthChain.sol`** — Solidity 0.8.24 with OpenZeppelin v5

### Features

| Feature | Implementation |
|---------|---------------|
| No stored passwords | Wallet address = identity; EIP-191 signatures for auth |
| Access control | `Ownable` (owner) + delegated `admins` mapping |
| Emergency stop | `Pausable` — owner can halt registrations/logins |
| Reentrancy protection | `ReentrancyGuard` on all state-changing functions |
| Username index | Bi-directional mapping: `address ↔ username` |
| Custom errors | Gas-efficient reverts (not `require` strings) |
| Events | Full event log for all state changes |

### Contract Interface

```solidity
// Register your address with a username (no password)
function register(string calldata username) external;

// Record an on-chain login timestamp
function recordLogin() external;

// Self-deactivate; frees username for reuse
function deactivate() external;

// Admin: ban / unban a user
function banUser(address user) external;
function unbanUser(address user) external;

// Owner: manage admin roles
function grantAdmin(address admin) external;
function revokeAdmin(address admin) external;
function pause() external;
function unpause() external;

// Views
function getProfile(address user) external view returns (UserProfile memory);
function isActive(address user) external view returns (bool);
function isAdmin(address account) external view returns (bool);
function resolveUsername(string calldata username) external view returns (address);
```

### Gas Report (Hardhat)

| Function | Avg Gas |
|----------|---------|
| `register` | ~75,000 |
| `recordLogin` | ~30,000 |
| `deactivate` | ~25,000 |
| `banUser` | ~30,000 |
| `deploy` | ~620,000 |

---

## Quick Start

### Prerequisites

- Node.js 22+, npm 10+
- MetaMask browser extension
- Docker & docker-compose (optional)

### Option A — Docker (recommended)

```bash
git clone https://github.com/guduruharshita/blockchain-base-authentication-system.git
cd blockchain-base-authentication-system
cp .env.example .env          # fill in secrets
cp backend/.env.example backend/.env
docker compose up --build
```

Frontend: http://localhost:5173 · Backend: http://localhost:3001

### Option B — Local development

```bash
# 1. Install root deps (Hardhat)
npm install

# 2. Compile contracts
npm run compile

# 3. Run contract tests
npm run test:contracts

# 4. Backend
cd backend && npm install
cp .env.example .env   # set JWT_SECRET to 32+ random chars
npm run dev            # http://localhost:3001

# 5. Frontend (new terminal)
cd frontend && npm install
cp .env.example .env
npm run dev            # http://localhost:5173
```

### Deploy contract to Sepolia

```bash
# Set SEPOLIA_RPC_URL + DEPLOYER_PRIVATE_KEY in .env
npm run deploy:sepolia
# Copy the printed address → update VITE_CONTRACT_ADDRESS in frontend/.env
```

---

## Project Structure

```
blockchain-base-authentication-system/
│
├── contracts/
│   └── AuthChain.sol             # Identity registry — no passwords
│
├── scripts/
│   └── deploy.ts                 # Hardhat deployment script
│
├── test/
│   └── AuthChain.test.ts         # 23 contract unit tests
│
├── backend/
│   ├── src/
│   │   ├── app.ts                # Express app factory (helmet, cors, rate-limit)
│   │   ├── server.ts             # Entry point
│   │   ├── config.ts             # Zod-validated env config
│   │   ├── db/
│   │   │   └── schema.ts         # SQLite schema + WAL migration
│   │   ├── middleware/
│   │   │   ├── auth.ts           # JWT middleware
│   │   │   └── errorHandler.ts   # Centralised error handling
│   │   └── routes/
│   │       ├── auth.ts           # /api/auth (nonce, verify, me, audit)
│   │       └── audit.ts          # /api/audit (paginated log)
│   ├── Dockerfile                # Multi-stage, non-root user
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Step-based auth flow
│   │   ├── main.tsx
│   │   ├── components/
│   │   │   ├── WalletConnect.tsx # MetaMask connection UI
│   │   │   ├── RegisterForm.tsx  # Register / sign-in tabs
│   │   │   └── Dashboard.tsx     # Authenticated profile view
│   │   ├── hooks/
│   │   │   └── useAuthChain.ts   # Full auth flow logic
│   │   ├── lib/
│   │   │   ├── contract.ts       # ethers.js contract binding
│   │   │   └── api.ts            # Typed REST client
│   │   └── types/
│   │       └── index.ts
│   ├── Dockerfile                # Multi-stage nginx
│   ├── nginx.conf
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── .github/workflows/
│   └── ci.yml                    # Contract + backend + frontend CI
├── hardhat.config.ts
├── docker-compose.yml
└── .env.example
```

---

## API Reference

### `POST /api/auth/nonce`

Request a challenge nonce for signature.

```bash
curl -X POST http://localhost:3001/api/auth/nonce \
  -H "Content-Type: application/json" \
  -d '{"address": "0xAbCd..."}'
```

```json
{
  "nonce": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Sign in to AuthChain\nAddress: 0xAbCd...\nNonce: 550e8400..."
}
```

---

### `POST /api/auth/verify`

Verify signature and receive JWT.

```bash
curl -X POST http://localhost:3001/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0xAbCd...",
    "signature": "0x1234...abcd"
  }'
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "address": "0xabcd..."
}
```

---

### `GET /api/auth/me`

Return authenticated user info.

```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <token>"
```

```json
{
  "address": "0xabcd...",
  "username": "alice_dev"
}
```

---

### `GET /api/audit`

Paginated audit log (requires auth).

```bash
curl "http://localhost:3001/api/audit?address=0xAbCd...&limit=10" \
  -H "Authorization: Bearer <token>"
```

```json
[
  {
    "id": 42,
    "address": "0xabcd...",
    "action": "login",
    "ip": "127.0.0.1",
    "created_at": "2025-01-15T10:30:00.000Z"
  }
]
```

---

## Testing

### Contract Tests (Hardhat)

```bash
npm run test:contracts
```

```
  AuthChain
    register()
      ✓ registers a new user and emits UserRegistered
      ✓ stores correct profile data
      ✓ reverts if address already registered
      ✓ reverts on duplicate username
      ✓ reverts on empty username
      ✓ reverts on username > 32 chars
      ✓ reverts when contract is paused
    recordLogin()
      ✓ updates lastLoginAt and emits LoginRecorded
      ✓ reverts for unregistered address
      ✓ reverts for banned user
    deactivate()
      ✓ marks account inactive and frees username
      ✓ reverts for unregistered user
    banUser() / unbanUser()
      ✓ owner can ban and emits UserBanned
      ✓ delegated admin can ban
      ✓ non-admin cannot ban
      ✓ owner can unban a banned user
    view helpers
      ✓ isActive returns true for active registered user
      ✓ isActive returns false after deactivation
      ✓ resolveUsername returns correct address
      ✓ isAdmin returns true for owner
      ✓ isAdmin returns true for granted admin, false after revoke
    pause / unpause
      ✓ only owner can pause
      ✓ owner can pause and unpause

  23 passing (2s)
```

### Frontend Typecheck

```bash
cd frontend && npm run typecheck
```

---

## Deployment

### Smart Contract (Sepolia)

1. Get Sepolia ETH from [faucet.sepolia.dev](https://faucet.sepolia.dev)
2. Set `SEPOLIA_RPC_URL` and `DEPLOYER_PRIVATE_KEY` in `.env`
3. `npm run deploy:sepolia`
4. Verify on Etherscan: `npx hardhat verify --network sepolia <CONTRACT_ADDRESS>`
5. Update `VITE_CONTRACT_ADDRESS` in frontend `.env`

### Backend (Railway / Render)

| Service | Configuration |
|---------|--------------|
| Build | `cd backend && npm ci && npm run build` |
| Start | `node dist/server.js` |
| Env | `JWT_SECRET`, `ALLOWED_ORIGINS`, `NODE_ENV=production` |

### Frontend (Vercel / Netlify)

| Setting | Value |
|---------|-------|
| Root | `frontend/` |
| Build | `npm run build` |
| Output | `dist/` |
| Env vars | `VITE_CONTRACT_ADDRESS`, `VITE_API_BASE_URL` |

---

## Security

| Threat | Mitigation |
|--------|-----------|
| Password theft | No passwords stored — wallet signature only |
| Replay attacks | One-time nonces with 5-minute TTL |
| JWT forgery | HS256 with 32+ char secret |
| Rate abuse | `express-rate-limit` — 60 req/min per IP |
| XSS / header injection | `helmet` sets all security headers |
| Reentrancy | `ReentrancyGuard` on all state-changing contract functions |
| Admin privilege escalation | Single owner controls admin roster; `Pausable` for emergencies |
| SQLite injection | `better-sqlite3` parameterized queries throughout |

---

## Skills Demonstrated

| Skill | Evidence |
|-------|---------|
| **Solidity** | Custom errors, events, OpenZeppelin v5 (Ownable, Pausable, ReentrancyGuard) |
| **Smart Contract Testing** | 23 Hardhat + Chai tests covering happy path, access control, edge cases |
| **EIP-191 Signatures** | `ethers.verifyMessage()` for wallet-based passwordless auth |
| **TypeScript** | Strict mode across all three layers (contracts, backend, frontend) |
| **React 18** | Custom hooks, typed props, step-based component composition |
| **Express 4** | App factory, Zod validation, centralised error handling, JWT middleware |
| **Security Hardening** | helmet, CORS, rate limiting, nonce-based replay prevention |
| **SQLite** | WAL mode, schema migration, parameterized queries (better-sqlite3) |
| **Docker** | Multi-stage builds for backend (non-root) and frontend (nginx) |
| **CI/CD** | GitHub Actions — contracts + backend + frontend in parallel jobs |
| **Hardhat** | Compile, deploy scripts, Etherscan verification, gas reporting |
| **OpenZeppelin** | v5 contracts with constructor-style ownership |
