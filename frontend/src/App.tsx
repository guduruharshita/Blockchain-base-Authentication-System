import { useEffect } from "react";
import { useAuthChain } from "./hooks/useAuthChain";
import WalletConnect from "./components/WalletConnect";
import RegisterForm   from "./components/RegisterForm";
import Dashboard      from "./components/Dashboard";

export default function App() {
  const {
    step, address, token, profile, isAdmin, error, loading,
    connectWallet, signIn, registerUser, disconnect,
  } = useAuthChain();

  // Auto sign-in if already connected via wallet
  useEffect(() => {
    if (step === "connecting" && address) {
      signIn(address);
    }
  }, [step, address, signIn]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-chain-400 to-purple-400 bg-clip-text text-transparent">
            AuthChain
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Decentralized identity on Ethereum
          </p>
        </header>

        <div className="bg-gray-900 border border-chain-800 rounded-2xl p-6 shadow-2xl">
          {step === "disconnected" && (
            <WalletConnect onConnect={connectWallet} loading={loading} error={error} />
          )}

          {(step === "connecting" || step === "connected") && (
            <RegisterForm
              address={address}
              onRegister={(u) => registerUser(u, address, token)}
              onSignIn={() => signIn(address)}
              loading={loading}
              error={error}
            />
          )}

          {step === "registered" && profile && (
            <Dashboard
              address={address}
              profile={profile}
              isAdmin={isAdmin}
              onDisconnect={disconnect}
            />
          )}
        </div>

        <footer className="text-center mt-6 text-xs text-gray-600">
          Smart contract on Ethereum Sepolia ·{" "}
          <a
            href="https://github.com/guduruharshita/blockchain-base-authentication-system"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            GitHub
          </a>
        </footer>
      </div>
    </div>
  );
}
