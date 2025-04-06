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
  const [showQRPopover, setShowQRPopover] = useState(false);

  const reqUSDC = async () => {
    await switchNetwork(GLOBAL_CONFIG.chainId);
    setIsRequesting(true);
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
            <Link
              to="/"
              className="text-xl flex items-center gap-1.5 font-bold text-primary"
            >
              <img src="/logo.png" alt="logo" className="w-6 h-6" />
              Signals
            </Link>
          </div>
          <div className="flex gap-5 items-center">
            <Link to="/profile" className="text-gray-800">
              History
            </Link>
            <a href="https://citrea.xyz/faucet" className="text-gray-800">
              Faucet
            </a>
            <div className="relative">
              <button
                className="text-gray-800 hover:text-primary cursor-pointer"
                onClick={() => setShowQRPopover(!showQRPopover)}
              >
                Try Now!
              </button>

              {/* QR 코드 팝오버 */}
              {showQRPopover && (
                <div className="fixed right-8 top-8 bg-white rounded-2xl shadow-lg p-4 z-50 w-[280px]">
                  <div className="flex justify-between items-center mb-3">
                    <div />
                    <button
                      onClick={() => setShowQRPopover(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-col gap-3 pb-2">
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-100 w-full aspect-square flex items-center justify-center mb-1">
                        <img
                          src="/images/website-qr.png"
                          alt="QR Code 1"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-lg font-bold text-center">
                        Try it out!
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-100 w-full aspect-square flex items-center justify-center mb-1">
                        <img
                          src="/images/discord-qr.png"
                          alt="QR Code 1"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-lg font-bold text-center">
                        Join Discord
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {address ? <appkit-account-button /> : <appkit-connect-button />}

            <button
              disabled={isRequesting}
              className="btn-ghost"
              onClick={reqUSDC}
            >
              {isRequesting ? "Getting USDC..." : "Request USDC"}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
