# 🔐 AuthChain — Blockchain-Based Authentication System

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat&logo=solidity&logoColor=white)](https://soliditylang.org)
[![Node.js](https://img.shields.io/badge/Node.js-14+-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Ethers.js](https://img.shields.io/badge/Ethers.js-5.7-2535A0?style=flat)](https://docs.ethers.io)
[![Express](https://img.shields.io/badge/Express-5.1-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)](https://sqlite.org)
[![MetaMask](https://img.shields.io/badge/MetaMask-F6851B?style=flat&logo=metamask&logoColor=white)](https://metamask.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)

---

## What It Does

**AuthChain** is a decentralized authentication system that uses Ethereum smart contracts to handle user registration, login, and account management — replacing the traditional username/password database with an immutable on-chain identity layer. A Node.js/Express backend logs all authentication events to SQLite, while a MetaMask-integrated frontend provides the user interface. The system was the subject of a published research paper exploring blockchain as an alternative to centralized identity providers.

> 📄 Research paper included in this repository (`Research Paper.pdf`)

---

## ✨ Features

- **On-chain identity**: Registration and login verified against an Ethereum smart contract
- **MetaMask integration**: Wallet-based authentication via Ethers.js
- **Event audit log**: All auth events logged to SQLite + flat file for compliance
- **Admin controls**: Ban malicious users directly from the contract
- **Glassmorphism UI**: Modern, responsive frontend design

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Smart Contract | Solidity 0.8.20, Ethereum (Sepolia testnet) |
| Frontend | HTML5, CSS3, JavaScript ES6+, Ethers.js |
| Backend | Node.js, Express.js 5.x |
| Database | SQLite3 |

---

## 📂 Project Structure

```
Blockchain-base-Authentication-System/
├── Frontend/
│   ├── index.html              # Dashboard + wallet connect
│   ├── register.html           # User registration
│   ├── login.html              # Login page
│   ├── resetPassword.html      # Password reset
│   └── deactivateAccount.html  # Account deactivation
├── Backend/
│   ├── Backend.js              # Express server + event logging
│   ├── package.json
│   ├── authchain.db            # SQLite event log
│   └── authchain_logs.txt      # Flat file audit log
├── Smart Contract/
│   └── Authentication.sol      # AuthChain Solidity contract
├── Research Paper.pdf
├── package.json
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites

- Node.js v14+
- MetaMask browser extension
- Test ETH on Sepolia testnet ([faucet](https://sepoliafaucet.com/))
- [Remix IDE](https://remix.ethereum.org/) for contract deployment

### 1. Clone the repo

```bash
git clone https://github.com/guduruharshita/Blockchain-base-Authentication-System.git
cd Blockchain-base-Authentication-System
```

### 2. Deploy the Smart Contract

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Paste `Smart Contract/Authentication.sol`
3. Compile with Solidity 0.8.20
4. Deploy to Sepolia testnet via MetaMask
5. Copy the deployed contract address

### 3. Configure the frontend

Update the contract address in `Frontend/index.html`:

```javascript
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### 4. Start the backend

```bash
cd Backend
npm install
node Backend.js
```

Server runs at `http://localhost:3000`

### 5. Open the app

Navigate to `http://localhost:3000` in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Log registration event |
| POST | `/api/login` | Log login event |
| POST | `/api/resetPassword` | Log password reset |
| POST | `/api/deactivate` | Log account deactivation |

---

## 📜 Smart Contract — Key Functions

| Function | Description |
|----------|-------------|
| `register(username, password)` | Create on-chain identity |
| `login(password)` | Authenticate against contract |
| `resetPassword(newPassword)` | Update stored credential |
| `deactivateAccount()` | Self-deactivate |
| `banUser(address)` | Admin: ban a wallet address |

> ⚠️ Passwords are stored in plain text for demonstration. Production use requires hashing or zero-knowledge proofs.

---

## 🔒 Security Notes

- This project is a research prototype, not production-ready
- See `Research Paper.pdf` for the full security analysis and threat model
- Recommended improvements: ZK-SNARKs for credential verification, hardware wallet admin keys

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👤 Author

**Harshita Guduru** — [GitHub](https://github.com/guduruharshita) · [LinkedIn](https://linkedin.com/in/harshita-guduru)

---

*Made with Ethereum and Node.js*
