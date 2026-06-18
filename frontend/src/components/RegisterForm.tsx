import { useState } from "react";

interface Props {
  address: string;
  onRegister: (username: string) => void;
  onSignIn: () => void;
  loading: boolean;
  error: string;
}

export default function RegisterForm({ address, onRegister, onSignIn, loading, error }: Props) {
  const [username, setUsername] = useState("");
  const [tab, setTab] = useState<"register" | "signin">("signin");

  const shortAddr = `${address.slice(0, 6)}…${address.slice(-4)}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 bg-chain-900/50 border border-chain-700 rounded-lg px-4 py-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-gray-300 font-mono text-sm">{shortAddr}</span>
      </div>

      <div className="flex border border-chain-700 rounded-lg overflow-hidden">
        {(["signin", "register"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              tab === t ? "bg-chain-600 text-white" : "bg-chain-900/30 text-gray-400 hover:text-white"
            }`}
          >
            {t === "signin" ? "Sign In" : "Register"}
          </button>
        ))}
      </div>

      {tab === "signin" ? (
        <div className="flex flex-col gap-4">
          <p className="text-gray-400 text-sm">
            Already registered? Sign a challenge message to authenticate.
          </p>
          <button
            onClick={onSignIn}
            disabled={loading}
            className="w-full py-3 bg-chain-600 hover:bg-chain-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? "Signing…" : "Sign & Authenticate"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-gray-400 text-sm">
            Choose a username and register your address on-chain.
          </p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username (1-32 chars)"
            maxLength={32}
            className="w-full px-4 py-3 bg-chain-900/50 border border-chain-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-chain-500"
          />
          <button
            onClick={() => username.trim() && onRegister(username.trim())}
            disabled={loading || !username.trim()}
            className="w-full py-3 bg-chain-600 hover:bg-chain-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? "Registering…" : "Register On-Chain"}
          </button>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm bg-red-900/20 px-4 py-2 rounded-lg border border-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
