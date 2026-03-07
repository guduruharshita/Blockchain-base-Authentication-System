// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AuthChain {
    // Mapping to store user data, keyed by Ethereum address
    mapping(address => User) public users;
    
    // Admin address for managing user bans
    address public admin;

    // User struct to store authentication details
    struct User {
        string username;               // User's chosen username
        string password;               // Plain-text password (not recommended for production)
        uint256 registrationTimestamp; // Timestamp of user registration
        bool exists;                   // Flag to check if user is registered
        bool isBanned;                 // Flag to check if user is banned
    }

    // Events for logging key actions
    event UserSignedUp(address indexed userAddress, string username);
    event LoginAttempt(address indexed userAddress, bool success);
    event PasswordReset(address indexed userAddress);
    event UserDeactivated(address indexed userAddress);
    event UserBanned(address indexed userAddress);

    // Constructor to set the contract deployer as admin
    constructor() {
        admin = msg.sender;
    }

    // Modifier to restrict access to admin functions
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Register a new user with a username and plain-text password
    function register(string memory _username, string memory _password) public {
        require(!users[msg.sender].exists, "User already registered");
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(bytes(_username).length <= 32, "Username too long");
        require(bytes(_password).length > 0, "Password cannot be empty");

        users[msg.sender] = User({
            username: _username,
            password: _password,
            registrationTimestamp: block.timestamp,
            exists: true,
            isBanned: false
        });

        emit UserSignedUp(msg.sender, _username);
    }

    // Login by verifying the provided password against the stored plain-text password
    function login(string memory _password) public {
        require(users[msg.sender].exists, "User not registered");
        require(!users[msg.sender].isBanned, "User is banned");
        bool success = keccak256(abi.encodePacked(users[msg.sender].password)) == keccak256(abi.encodePacked(_password));
        require(success, "Incorrect password");

        emit LoginAttempt(msg.sender, success);
    }

    // Reset password by updating to a new plain-text password
    function resetPassword(string memory _newPassword) public {
        require(users[msg.sender].exists, "User not registered");
        require(!users[msg.sender].isBanned, "User is banned");
        require(bytes(_newPassword).length > 0, "Password cannot be empty");
        users[msg.sender].password = _newPassword;
        emit PasswordReset(msg.sender);
    }

    // Deactivate a user account, marking as deactivated
    function deactivateAccount() public {
        require(users[msg.sender].exists, "User not registered");
        delete users[msg.sender];
        emit UserDeactivated(msg.sender);
    }

    // Admin-only function to ban a user
    function banUser(address _user) public onlyAdmin {
        require(users[_user].exists, "User not registered");
        require(!users[_user].isBanned, "User already banned");
        users[_user].isBanned = true;
        emit UserBanned(_user);
    }

    // Retrieve user details for front-end display
    function getUser(address _userAddress) public view returns (string memory username, uint256 registrationTimestamp, bool exists, bool isBanned, string memory password) {
        require(users[_userAddress].exists, "User not registered");
        User storage user = users[_userAddress];
        return (user.username, user.registrationTimestamp, user.exists, user.isBanned, user.password);
    }
}