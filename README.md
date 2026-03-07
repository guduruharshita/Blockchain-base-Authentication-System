# 🔐 Blockchain Login System

A decentralized authentication system that combines Ethereum blockchain technology with traditional web services for secure user authentication.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Smart Contract](#smart-contract)
- [Frontend Pages](#frontend-pages)
- [Database Schema](#database-schema)
- [Security Considerations](#security-considerations)
- [License](#license)

---

## 🌟 Overview

**AuthChain** is a blockchain-based authentication system that leverages Ethereum smart contracts to provide secure, decentralized user registration and login functionality. The system combines the power of Web3 technology with traditional web backend services to create a hybrid authentication mechanism.

### Key Highlights

- 🔗 **Blockchain-Powered**: Uses Ethereum smart contracts for secure identity verification
- 👛 **Wallet-Based Authentication**: MetaMask wallet integration for seamless user experience
- 📊 **Event Logging**: Comprehensive logging with SQLite database and file-based logs
- 🎨 **Modern UI**: Beautiful glassmorphism design with responsive layout
- 🛡️ **Admin Controls**: Admin functionality to ban users and manage platform

---

## ✨ Features

### Authentication Features
- **Wallet Connection**: Connect MetaMask wallet for blockchain-based authentication
- **User Registration**: Register with username and password stored on blockchain
- **Secure Login**: Verify credentials against smart contract
- **Password Reset**: Reset password functionality via smart contract
- **Account Deactivation**: Self-service account deactivation

### Admin Features
- **User Ban Management**: Admin can ban malicious users
- **Event Monitoring**: Track all authentication events

### Logging & Monitoring
- **Terminal Logging**: Real-time event logging to console
- **File Logging**: Persistent log files for audit trails
- **Database Logging**: SQLite database for structured event storage

---

## 🛠 Tech Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with glassmorphism effects
- **JavaScript (ES6+)**: Client-side logic
- **Ethers.js**: Ethereum wallet integration (v5.7.2)

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework (v5.1.0)
- **SQLite3**: Lightweight database (v5.1.7)

### Smart Contract
- **Solidity**: Smart contract language (v0.8.20)
- **Ethereum**: Blockchain platform

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │  Index  │ │ Register│ │  Login  │ │ Reset   │ │Deactivate│  │
│  │   Page  │ │   Page  │ │   Page  │ │Password │ │ Account │   │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │
│       └───────────┴───────────┴───────────┴───────────┘        │
│                              │                                   │
│                     Ethers.js (Web3)                            │
└──────────────────────────────┼──────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────┐
│                     Smart Contract Layer                        │
│                    ┌─────────────────────┐                     │
│                    │   AuthChain.sol      │                     │
│                    │  (Ethereum Mainnet/  │                     │
│                    │   Testnet)           │                     │
│                    └─────────────────────┘                     │
└──────────────────────────────┼──────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────┐
│                       Backend Layer                              │
│                    ┌─────────────────────┐                     │
│                    │   Express.js API    │                     │
│                    └──────────┬──────────┘                     │
│                               │                                   │
│         ┌────────────────────┼────────────────────┐            │
│         │                    │                    │            │
│    ┌────▼────┐        ┌───────▼───────┐    ┌──────▼──────┐      │
│    │ SQLite  │        │  Log Files    │    │  Terminal   │      │
│    │   DB    │        │ (txt files)   │    │   Output    │      │
│    └─────────┘        └───────────────┘    └─────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
Blockchain Login System/
│
├── 📄 README.md                    # This file
├── 📄 package.json                 # Root package configuration
│
├── 📁 Backend/                     # Backend server
│   ├── 📄 Backend.js              # Express server with API endpoints
│   ├── 📄 package.json            # Backend dependencies
│   ├── 📄 authchain.db            # SQLite database file
│   └── 📄 authchain_logs.txt      # Event log file
│
├── 📁 Frontend/                   # Frontend web pages
│   ├── 📄 index.html              # Main dashboard
│   ├── 📄 register.html           # User registration
│   ├── 📄 login.html              # User login
│   ├── 📄 resetPassword.html      # Password reset
│   └── 📄 deactivateAccount.html  # Account deactivation
│
└── 📁 Smart Contract/             # Ethereum smart contract
    └── 📄 Authentication.sol      # AuthChain smart contract
```

---

## 🚀 Getting Started

### Prerequisites

Before running this project, ensure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MetaMask Browser Extension** - [Install](https://metamask.io/)
- **Ethereum Wallet** with some test ETH (for testnet) or mainnet ETH

### Recommended Tools

- **Git** for version control
- **VS Code** or any code editor
- **Remix IDE** (optional) for smart contract deployment

---

## 📥 Installation

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/blockchain-login-system.git
cd blockchain-login-system
```

### 2. Install Root Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 4. Deploy Smart Contract

Deploy the `Authentication.sol` contract to Ethereum (testnet recommended for development):

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create a new file and paste the contract code
3. Compile the contract
4. Deploy to testnet (Sepolia/Goerli) or local network
5. Copy the deployed contract address
6. Update the `contractAddress` in `Frontend/index.html`

### 5. Configure Frontend

Update the contract address in `Frontend/index.html`:

```javascript
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the Backend directory:

```env
PORT=3000
DATABASE_NAME=authchain.db
LOG_FILE=authchain_logs.txt
```

### Smart Contract Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `contractAddress` | Ethereum contract address | Required |
| `network` | Ethereum network | testnet |

---

## 📖 Usage

### Starting the Backend Server

```bash
cd Backend
node Backend.js
```

The server will start on `http://localhost:3000`

### Accessing the Frontend

Open your browser and navigate to:
```
http://localhost:3000
```

### Using the Application

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask
2. **Register**: Navigate to Register page and create an account
3. **Login**: Use the Login page to authenticate
4. **Manage Account**: Reset password or deactivate as needed

---

## 🔌 API Endpoints

The backend provides the following RESTful API endpoints:

### Authentication Events

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/api/register` | Log user registration | `{ userAddress, username }` |
| POST | `/api/login` | Log user login | `{ userAddress }` |
| POST | `/api/resetPassword` | Log password reset | `{ userAddress }` |
| POST | `/api/deactivate` | Log account deactivation | `{ userAddress }` |

### Example API Usage

```bash
# Register event
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"userAddress": "0x123...", "username": "johndoe"}'

# Login event
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"userAddress": "0x123..."}'
```

---

## 📜 Smart Contract

### Contract: AuthChain

**Location**: `Smart Contract/Authentication.sol`

#### Key Functions

| Function | Description | Visibility |
|----------|-------------|------------|
| `register(string _username, string _password)` | Register new user | Public |
| `login(string _password)` | Authenticate user | Public |
| `resetPassword(string _newPassword)` | Update password | Public |
| `deactivateAccount()` | Deactivate account | Public |
| `banUser(address _user)` | Ban a user | Admin only |
| `getUser(address _userAddress)` | Get user details | Public |

#### Events

- `UserSignedUp(address indexed userAddress, string username)`
- `LoginAttempt(address indexed userAddress, bool success)`
- `PasswordReset(address indexed userAddress)`
- `UserDeactivated(address indexed userAddress)`
- `UserBanned(address indexed userAddress)`

#### Security Notes

⚠️ **Important**: This contract stores passwords in plain text for demonstration purposes. In production:
- Use password hashing (e.g., bcrypt)
- Consider using zero-knowledge proofs
- Implement proper access controls
- Use hardware wallets for admin functions

---

## 🌐 Frontend Pages

### 1. Dashboard (`index.html`)
- Main entry point
- Wallet connection
- User profile display
- Admin ban functionality

### 2. Registration (`register.html`)
- New user registration form
- Username and password input
- MetaMask integration

### 3. Login (`login.html`)
- User authentication
- Password verification via smart contract

### 4. Reset Password (`resetPassword.html`)
- Password reset functionality
- Security verification

### 5. Deactivate Account (`deactivateAccount.html`)
- Account self-deactivation
- Data removal from blockchain

---

## 🗄 Database Schema

### Events Table

```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    user_address TEXT NOT NULL,
    username TEXT,
    timestamp TEXT NOT NULL
);
```

### Log File Format

```
[2024-01-15T10:30:00.000Z] [REGISTER] User Address: 0x123..., Username: johndoe
[2024-01-15T10:35:00.000Z] [LOGIN] User Address: 0x123...
[2024-01-15T10:40:00.000Z] [RESET_PASSWORD] User Address: 0x123...
```

---

## 🔒 Security Considerations

1. **Smart Contract Security**
   - Plain text passwords (demo only - use hashing in production)
   - Admin functions properly restricted
   - Input validation implemented

2. **Backend Security**
   - Input sanitization
   - Error handling
   - Secure database connections

3. **Frontend Security**
   - Client-side validation
   - Secure wallet interactions
   - HTTPS recommended for production

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 👤 Author

- **Your Name** - Initial work

---

## 🙏 Acknowledgments

- [Ethers.js Documentation](https://docs.ethers.io/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Express.js Documentation](https://expressjs.com/)
- [MetaMask Developer Documentation](https://docs.metamask.io/)

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/blockchain-login-system/issues) page
2. Create a new issue with detailed description
3. Contact the maintainers

---

**Made with ❤️ and 🔗 Blockchain Technology**

