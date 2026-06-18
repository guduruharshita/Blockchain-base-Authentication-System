interface Props {
  onConnect: () => void;
  loading: boolean;
  error: string;
}

export default function WalletConnect({ onConnect, loading, error }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <div className="w-20 h-20 rounded-full bg-chain-900 border-2 border-chain-500 flex items-center justify-center text-4xl">
        🔐
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-gray-400 max-w-sm">
          AuthChain uses your Ethereum wallet for passwordless, decentralized identity.
          No personal data is stored off-chain.
        </p>
      </div>
      <button
        onClick={onConnect}
        disabled={loading}
        className="px-8 py-3 bg-chain-600 hover:bg-chain-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        {loading ? (
          <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          "🦊"
        )}
        {loading ? "Connecting…" : "Connect MetaMask"}
      </button>
      {error && (
        <p className="text-red-400 text-sm bg-red-900/20 px-4 py-2 rounded-lg border border-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
