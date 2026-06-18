import type { UserProfile } from "../types";

interface Props {
  address: string;
  profile: UserProfile;
  isAdmin: boolean;
  onDisconnect: () => void;
}

export default function Dashboard({ address, profile, isAdmin, onDisconnect }: Props) {
  const shortAddr = `${address.slice(0, 6)}…${address.slice(-4)}`;
  const registeredDate = new Date(Number(profile.registeredAt) * 1000).toLocaleDateString();
  const lastLogin = profile.lastLoginAt > 0n
    ? new Date(Number(profile.lastLoginAt) * 1000).toLocaleString()
    : "First login";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">@{profile.username}</h2>
          <p className="text-gray-400 font-mono text-xs">{shortAddr}</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <span className="px-2 py-1 bg-yellow-900/40 border border-yellow-700 text-yellow-400 text-xs rounded-full">
              Admin
            </span>
          )}
          <span className="px-2 py-1 bg-green-900/40 border border-green-700 text-green-400 text-xs rounded-full">
            Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Stat label="Registered" value={registeredDate} />
        <Stat label="Last Login" value={lastLogin} />
      </div>

      <div className="border border-chain-700/50 rounded-lg p-4 bg-chain-900/30">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">On-Chain Identity</h3>
        <div className="space-y-2 text-sm">
          <Row k="Username" v={profile.username} />
          <Row k="Address" v={shortAddr} mono />
          <Row k="Status" v="Active" green />
          <Row k="Role" v={isAdmin ? "Admin" : "User"} />
        </div>
      </div>

      <button
        onClick={onDisconnect}
        className="w-full py-2 border border-chain-700 hover:border-red-700 hover:text-red-400 text-gray-400 text-sm rounded-lg transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-chain-900/50 border border-chain-700/50 rounded-lg p-3">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-white text-sm font-medium mt-1">{value}</p>
    </div>
  );
}

function Row({ k, v, mono, green }: { k: string; v: string; mono?: boolean; green?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{k}</span>
      <span className={`${mono ? "font-mono" : ""} ${green ? "text-green-400" : "text-gray-200"}`}>{v}</span>
    </div>
  );
}
