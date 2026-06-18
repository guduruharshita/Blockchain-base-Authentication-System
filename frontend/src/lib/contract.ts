import { ethers } from "ethers";

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string ?? "";

export const CONTRACT_ABI = [
  "function register(string calldata username) external",
  "function recordLogin() external",
  "function deactivate() external",
  "function banUser(address user) external",
  "function unbanUser(address user) external",
  "function getProfile(address user) external view returns (tuple(string username, bool active, bool banned, uint256 registeredAt, uint256 lastLoginAt))",
  "function isActive(address user) external view returns (bool)",
  "function isAdmin(address account) external view returns (bool)",
  "function resolveUsername(string calldata username) external view returns (address)",
  "event UserRegistered(address indexed user, string username, uint256 timestamp)",
  "event LoginRecorded(address indexed user, uint256 timestamp)",
  "event UserDeactivated(address indexed user, uint256 timestamp)",
];

export function getContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

export async function getProvider(): Promise<ethers.BrowserProvider> {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  return new ethers.BrowserProvider(window.ethereum);
}
