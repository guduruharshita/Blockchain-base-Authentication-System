import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying AuthChain with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const AuthChain = await ethers.getContractFactory("AuthChain");
  const contract = await AuthChain.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("AuthChain deployed to:", address);
  console.log("Update VITE_CONTRACT_ADDRESS in frontend/.env with:", address);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
