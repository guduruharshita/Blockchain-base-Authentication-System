# AuthChain — Blockchain-Based Authentication System

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat&logo=solidity&logoColor=white)](https://soliditylang.org)
[![Node.js](https://img.shields.io/badge/Node.js-14+-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Ethers.js](https://img.shields.io/badge/Ethers.js-5.7-2535A0?style=flat)](https://docs.ethers.io)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)](https://sqlite.org)
[![MetaMask](https://img.shields.io/badge/MetaMask-F6851B?style=flat&logo=metamask&logoColor=white)](https://metamask.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)

## What It Does

**AuthChain** replaces the traditional username/password database with an immutable Ethereum smart contract as the identity layer. Users register and authenticate via their MetaMask wallet — credentials are stored on-chain, and all authentication events are logged to SQLite for audit compliance. The system demonstrates a decentralized approach to identity management without a centralized auth server.

> Research paper on the security model included: `Research Paper.pdf`

## Features

- **On-chain identity**: Registration and login verified against an Ethereum smart contract
- **MetaMask wallet auth**: Ethers.js integration for seamless Web3 UX
- **Full audit log**: All events persisted to SQLite + flat log file
- **Admin controls**: Contract-level user ban functionality
- **Glassmorphism UI**: Responsive, modern frontend design

## Tech Stack

| Layer | Technology |
|-------|------------|
| Smart Contract | Solidity 0.8.20 — Ethereum (Sepolia testnet) |
| Frontend | HTML5, CSS3, JavaScript ES6+, Ethers.js 5.7 |
| Backend | Node.js, Express.js 5.x |
| Database | SQLite3 |

## Project Structure

```
├── Frontend/
│   ├── index.html              # Dashboard + wallet connect
│   ├── register.html
│   ├── login.html
│   ├── resetPassword.html
│   └── deactivateAccount.html
├── Backend/
│   ├── Backend.js              # Express server + event logging
│   └── package.json
├── Smart Contract/
│   └── Authentication.sol
├── .env.example
├── CONTRIBUTING.md
├── Research Paper.pdf
└── README.md
```

## Quick Start

### 1. Deploy the Smart Contract

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Load `Smart Contract/Authentication.sol`
3. Compile (Solidity 0.8.20) and deploy to Sepolia testnet
4. Copy the deployed contract address

### 2. Configure Frontend

```javascript
// Frontend/index.html
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### 3. Run the Backend

```bash
cd Backend
npm install
node Backend.js
# Server at http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Log registration event |
| POST | `/api/login` | Log login event |
| POST | `/api/resetPassword` | Log password reset |
| POST | `/api/deactivate` | Log account deactivation |

## Smart Contract Functions

| Function | Access |
|----------|--------|
| `register(username, password)` | Public |
| `login(password)` | Public |
| `resetPassword(newPassword)` | Authenticated user |
| `deactivateAccount()` | Authenticated user |
| `banUser(address)` | Admin only |

> ⚠️ Passwords stored in plain text — this is a research prototype. Production use requires ZK-proofs or hashing.

## Security Notes

See `Research Paper.pdf` for full threat model and security analysis. Recommended production hardening: ZK-SNARKs for credential verification, hardware wallet admin keys, and HTTPS-only deployment.

## License

MIT — see [LICENSE](LICENSE)

## Author

**Harshita Guduru** — [GitHub](https://github.com/guduruharshita) · [LinkedIn](https://linkedin.com/in/harshita-guduru)
