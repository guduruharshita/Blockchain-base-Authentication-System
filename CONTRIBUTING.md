# Contributing to AuthChain

## Development Setup
1. Clone the repo
2. Deploy `Smart Contract/Authentication.sol` to Sepolia testnet via [Remix IDE](https://remix.ethereum.org/)
3. Copy the deployed contract address into `Frontend/index.html`
4. Run `cd Backend && npm install && node Backend.js`
5. Open `http://localhost:3000`

## Smart Contract
- Edit `Smart Contract/Authentication.sol`
- Recompile and redeploy on any change
- Update the contract ABI in the frontend if the interface changes

## Code Style
- ES6+ syntax throughout
- Add JSDoc comments for exported functions
- Test all flows on Sepolia before any mainnet deployment
