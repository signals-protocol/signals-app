import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import {
  citreaTestnet,
  flowTestnet,
  polygonAmoy,
  rootstockTestnet,
} from "@reown/appkit/networks";

const projectId = import.meta.env.VITE_PROJECT_ID;

const metadata = {
  name: "ethglobal-taipei",
  description: "AppKit Example",
  url: "https://reown.com/appkit", // origin must match your domain & subdomain
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

createAppKit({
  adapters: [new EthersAdapter()],
  networks: [polygonAmoy, flowTestnet, citreaTestnet, rootstockTestnet],
  metadata,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});
