// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title AuthChain — On-chain identity registry with wallet-signature authentication
/// @notice Stores username profiles keyed by Ethereum address; no passwords stored.
///         Authentication is performed off-chain via EIP-191 personal_sign; the
///         contract only manages the user registry, banning, and role assignments.
contract AuthChain is Ownable, Pausable, ReentrancyGuard {

    // ─── Structs ─────────────────────────────────────────────────────────────

    struct UserProfile {
        string  username;
        bool    active;
        bool    banned;
        uint256 registeredAt;
        uint256 lastLoginAt;
    }

    // ─── State ────────────────────────────────────────────────────────────────

    mapping(address => UserProfile)  private _profiles;
    mapping(string  => address)      private _usernameIndex;
    mapping(address => bool)         private _admins;

    // ─── Events ───────────────────────────────────────────────────────────────

    event UserRegistered(address indexed user, string username, uint256 timestamp);
    event LoginRecorded(address indexed user, uint256 timestamp);
    event UserDeactivated(address indexed user, uint256 timestamp);
    event UserBanned(address indexed user, address indexed by);
    event UserUnbanned(address indexed user, address indexed by);
    event AdminGranted(address indexed admin);
    event AdminRevoked(address indexed admin);

    // ─── Custom errors ────────────────────────────────────────────────────────

    error AlreadyRegistered();
    error UsernameTaken();
    error NotRegistered();
    error Banned();
    error NotActive();
    error Unauthorized();
    error InvalidUsername();

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyAdmin() {
        if (!_admins[msg.sender] && msg.sender != owner()) revert Unauthorized();
        _;
    }

    modifier onlyActiveUser() {
        UserProfile storage p = _profiles[msg.sender];
        if (p.registeredAt == 0)  revert NotRegistered();
        if (p.banned)             revert Banned();
        if (!p.active)            revert NotActive();
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor() Ownable(msg.sender) {}

    // ─── User actions ─────────────────────────────────────────────────────────

    /// @notice Register the caller's address with a chosen username.
    function register(string calldata username) external whenNotPaused nonReentrant {
        if (_profiles[msg.sender].registeredAt != 0)    revert AlreadyRegistered();
        if (_usernameIndex[username]  != address(0))    revert UsernameTaken();
        uint256 len = bytes(username).length;
        if (len == 0 || len > 32)                       revert InvalidUsername();

        _profiles[msg.sender] = UserProfile({
            username:     username,
            active:       true,
            banned:       false,
            registeredAt: block.timestamp,
            lastLoginAt:  0
        });
        _usernameIndex[username] = msg.sender;

        emit UserRegistered(msg.sender, username, block.timestamp);
    }

    /// @notice Record an on-chain login timestamp (called after off-chain sig verification).
    function recordLogin() external onlyActiveUser whenNotPaused {
        _profiles[msg.sender].lastLoginAt = block.timestamp;
        emit LoginRecorded(msg.sender, block.timestamp);
    }

    /// @notice Deactivate the caller's own account.
    function deactivate() external onlyActiveUser nonReentrant {
        string memory uname = _profiles[msg.sender].username;
        _profiles[msg.sender].active = false;
        delete _usernameIndex[uname];
        emit UserDeactivated(msg.sender, block.timestamp);
    }

    // ─── Admin actions ────────────────────────────────────────────────────────

    function banUser(address user) external onlyAdmin {
        if (_profiles[user].registeredAt == 0) revert NotRegistered();
        _profiles[user].banned = true;
        emit UserBanned(user, msg.sender);
    }

    function unbanUser(address user) external onlyAdmin {
        if (_profiles[user].registeredAt == 0) revert NotRegistered();
        _profiles[user].banned = false;
        emit UserUnbanned(user, msg.sender);
    }

    // ─── Owner actions ────────────────────────────────────────────────────────

    function grantAdmin(address admin)  external onlyOwner { _admins[admin] = true;  emit AdminGranted(admin); }
    function revokeAdmin(address admin) external onlyOwner { _admins[admin] = false; emit AdminRevoked(admin); }
    function pause()   external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    // ─── Views ────────────────────────────────────────────────────────────────

    function getProfile(address user) external view returns (UserProfile memory) {
        return _profiles[user];
    }

    function isActive(address user) external view returns (bool) {
        UserProfile storage p = _profiles[user];
        return p.active && !p.banned && p.registeredAt != 0;
    }

    function isAdmin(address account) external view returns (bool) {
        return _admins[account] || account == owner();
    }

    function resolveUsername(string calldata username) external view returns (address) {
        return _usernameIndex[username];
    }
}
