# Contributing to AuthChain

## Development Setup
1. Clone the repo
2. Deploy the smart contract to Sepolia testnet via Remix IDE
3. Update `contractAddress` in `Frontend/index.html`
4. Run `cd Backend && npm install && node Backend.js`
5. Open `http://localhost:3000`

## Smart Contract Changes
- Edit `Smart Contract/Authentication.sol`
- Redeploy via Remix IDE
- Update ABI in frontend if interface changes

## Code Style
- Use ES6+ syntax
- Add JSDoc comments for all functions
- Test on Sepolia before mainnet
