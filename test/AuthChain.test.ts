import { expect } from "chai";
import { ethers } from "hardhat";
import { AuthChain } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("AuthChain", () => {
  let contract: AuthChain;
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;
  let adminUser: HardhatEthersSigner;

  beforeEach(async () => {
    [owner, alice, bob, adminUser] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("AuthChain");
    contract = (await Factory.deploy()) as AuthChain;
    await contract.waitForDeployment();
  });

  // ── Registration ────────────────────────────────────────────────────────────

  describe("register()", () => {
    it("registers a new user and emits UserRegistered", async () => {
      const tx = await contract.connect(alice).register("alice_dev");
      const block = await ethers.provider.getBlock("latest");

      await expect(tx)
        .to.emit(contract, "UserRegistered")
        .withArgs(alice.address, "alice_dev", block!.timestamp);
    });

    it("stores correct profile data", async () => {
      await contract.connect(alice).register("alice_dev");
      const profile = await contract.getProfile(alice.address);

      expect(profile.username).to.equal("alice_dev");
      expect(profile.active).to.be.true;
      expect(profile.banned).to.be.false;
      expect(profile.lastLoginAt).to.equal(0n);
    });

    it("reverts if address already registered", async () => {
      await contract.connect(alice).register("alice_dev");
      await expect(contract.connect(alice).register("alice_v2"))
        .to.be.revertedWithCustomError(contract, "AlreadyRegistered");
    });

    it("reverts on duplicate username", async () => {
      await contract.connect(alice).register("sharedname");
      await expect(contract.connect(bob).register("sharedname"))
        .to.be.revertedWithCustomError(contract, "UsernameTaken");
    });

    it("reverts on empty username", async () => {
      await expect(contract.connect(alice).register(""))
        .to.be.revertedWithCustomError(contract, "InvalidUsername");
    });

    it("reverts on username > 32 chars", async () => {
      const long = "a".repeat(33);
      await expect(contract.connect(alice).register(long))
        .to.be.revertedWithCustomError(contract, "InvalidUsername");
    });

    it("reverts when contract is paused", async () => {
      await contract.connect(owner).pause();
      await expect(contract.connect(alice).register("alice_dev"))
        .to.be.revertedWithCustomError(contract, "EnforcedPause");
    });
  });

  // ── Login recording ─────────────────────────────────────────────────────────

  describe("recordLogin()", () => {
    it("updates lastLoginAt and emits LoginRecorded", async () => {
      await contract.connect(alice).register("alice_dev");
      const before = await time.latest();
      const tx = await contract.connect(alice).recordLogin();
      const block = await ethers.provider.getBlock("latest");

      await expect(tx)
        .to.emit(contract, "LoginRecorded")
        .withArgs(alice.address, block!.timestamp);

      const profile = await contract.getProfile(alice.address);
      expect(profile.lastLoginAt).to.be.gte(before);
    });

    it("reverts for unregistered address", async () => {
      await expect(contract.connect(alice).recordLogin())
        .to.be.revertedWithCustomError(contract, "NotRegistered");
    });

    it("reverts for banned user", async () => {
      await contract.connect(alice).register("alice_dev");
      await contract.connect(owner).banUser(alice.address);
      await expect(contract.connect(alice).recordLogin())
        .to.be.revertedWithCustomError(contract, "Banned");
    });
  });

  // ── Deactivation ────────────────────────────────────────────────────────────

  describe("deactivate()", () => {
    it("marks account inactive and frees username", async () => {
      await contract.connect(alice).register("alice_dev");
      await contract.connect(alice).deactivate();

      const profile = await contract.getProfile(alice.address);
      expect(profile.active).to.be.false;

      // username freed — bob can now take it
      await expect(contract.connect(bob).register("alice_dev")).to.not.be.reverted;
    });

    it("reverts for unregistered user", async () => {
      await expect(contract.connect(alice).deactivate())
        .to.be.revertedWithCustomError(contract, "NotRegistered");
    });
  });

  // ── Admin operations ────────────────────────────────────────────────────────

  describe("banUser() / unbanUser()", () => {
    beforeEach(async () => {
      await contract.connect(alice).register("alice_dev");
    });

    it("owner can ban and emits UserBanned", async () => {
      await expect(contract.connect(owner).banUser(alice.address))
        .to.emit(contract, "UserBanned")
        .withArgs(alice.address, owner.address);

      expect((await contract.getProfile(alice.address)).banned).to.be.true;
    });

    it("delegated admin can ban", async () => {
      await contract.connect(owner).grantAdmin(adminUser.address);
      await expect(contract.connect(adminUser).banUser(alice.address)).to.not.be.reverted;
    });

    it("non-admin cannot ban", async () => {
      await expect(contract.connect(bob).banUser(alice.address))
        .to.be.revertedWithCustomError(contract, "Unauthorized");
    });

    it("owner can unban a banned user", async () => {
      await contract.connect(owner).banUser(alice.address);
      await contract.connect(owner).unbanUser(alice.address);
      expect((await contract.getProfile(alice.address)).banned).to.be.false;
    });
  });

  // ── Views ────────────────────────────────────────────────────────────────────

  describe("view helpers", () => {
    it("isActive returns true for active registered user", async () => {
      await contract.connect(alice).register("alice_dev");
      expect(await contract.isActive(alice.address)).to.be.true;
    });

    it("isActive returns false after deactivation", async () => {
      await contract.connect(alice).register("alice_dev");
      await contract.connect(alice).deactivate();
      expect(await contract.isActive(alice.address)).to.be.false;
    });

    it("resolveUsername returns correct address", async () => {
      await contract.connect(alice).register("alice_dev");
      expect(await contract.resolveUsername("alice_dev")).to.equal(alice.address);
    });

    it("isAdmin returns true for owner", async () => {
      expect(await contract.isAdmin(owner.address)).to.be.true;
    });

    it("isAdmin returns true for granted admin, false after revoke", async () => {
      await contract.connect(owner).grantAdmin(adminUser.address);
      expect(await contract.isAdmin(adminUser.address)).to.be.true;

      await contract.connect(owner).revokeAdmin(adminUser.address);
      expect(await contract.isAdmin(adminUser.address)).to.be.false;
    });
  });

  // ── Pause / unpause ──────────────────────────────────────────────────────────

  describe("pause / unpause", () => {
    it("only owner can pause", async () => {
      await expect(contract.connect(alice).pause())
        .to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });

    it("owner can pause and unpause", async () => {
      await contract.pause();
      await contract.unpause();
      // registration works again after unpause
      await expect(contract.connect(alice).register("alice_dev")).to.not.be.reverted;
    });
  });
});
