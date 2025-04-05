import { Link } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import { useGetSigner } from "utils/useGetSigner";
import { switchNetwork } from "appkit";
import { GLOBAL_CONFIG } from "core/configs";
import { getUSDC } from "core/token";
import { useState } from "react";
export default function Header() {
  const { address } = useAppKitAccount();
  const getSigner = useGetSigner();
  const [isRequesting, setIsRequesting] = useState(false);
  const reqUSDC = async () => {
    await switchNetwork(GLOBAL_CONFIG.chainId);
    setIsRequesting(true)
    const signer = await getSigner();
    await getUSDC(GLOBAL_CONFIG.chainId, signer);
    setIsRequesting(false);
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl px-6 mx-auto">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl flex items-center gap-1.5 font-bold text-primary">
              <img src="/logo.png" alt="logo" className="w-6 h-6" />
              Signals
            </Link>
          </div>
          <div className="flex gap-6 items-center">
            <Link to="/" className="text-gray-800">
              Home
            </Link>
            <Link to="/profile" className="text-gray-800">
              Profile
            </Link>
            {address ? <appkit-account-button /> : <appkit-connect-button />}

            <button
            disabled={isRequesting}
            className="btn-secondary" onClick={reqUSDC}>
              {isRequesting ? "Getting USDC..." : "Request USDC"}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
