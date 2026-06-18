import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { getProvider, getContract } from "../lib/contract";
import { api } from "../lib/api";
import type { UserProfile, AuthStep } from "../types";

interface AuthChainState {
  step: AuthStep;
  address: string;
  token: string;
  profile: UserProfile | null;
  isAdmin: boolean;
  error: string;
  loading: boolean;
}

const initial: AuthChainState = {
  step: "disconnected",
  address: "",
  token: "",
  profile: null,
  isAdmin: false,
  error: "",
  loading: false,
};

export function useAuthChain() {
  const [state, setState] = useState<AuthChainState>(initial);

  const setLoading = (loading: boolean) => setState((s) => ({ ...s, loading, error: "" }));
  const setError   = (error: string)    => setState((s) => ({ ...s, error, loading: false }));

  const connectWallet = useCallback(async () => {
    setLoading(true);
    try {
      const provider = await getProvider();
      const [address] = await provider.send("eth_requestAccounts", []);
      setState((s) => ({ ...s, address, step: "connecting", loading: false }));
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  const signIn = useCallback(async (address: string) => {
    setLoading(true);
    try {
      const { message } = await api.getNonce(address);
      const provider  = await getProvider();
      const signer    = await provider.getSigner();
      const signature = await signer.signMessage(message);
      const { token } = await api.verify(address, signature);

      const contract = getContract(provider);
      const active   = await contract.isActive(address) as boolean;
      const admin    = await contract.isAdmin(address) as boolean;
      let profile: UserProfile | null = null;
      if (active) {
        profile = await contract.getProfile(address) as UserProfile;
      }

      setState((s) => ({
        ...s,
        token,
        profile,
        isAdmin: admin as boolean,
        step: active ? "registered" : "connected",
        loading: false,
      }));
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  const registerUser = useCallback(async (username: string, address: string, token: string) => {
    setLoading(true);
    try {
      const provider = await getProvider();
      const signer   = await provider.getSigner();
      const contract = getContract(signer);

      const tx = await (contract.register as (u: string) => Promise<ethers.ContractTransactionResponse>)(username);
      await tx.wait();
      await api.logAction("register", token, { username, tx: tx.hash });

      const profile = await contract.getProfile(address) as UserProfile;
      setState((s) => ({ ...s, profile, step: "registered", loading: false }));
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  const disconnect = useCallback(() => setState(initial), []);

  return { ...state, connectWallet, signIn, registerUser, disconnect };
}
