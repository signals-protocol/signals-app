interface Configs {
  rpcUrl: string;
  USDC: string;
  RangeBetManager: string;
  multicall: string;
}

export const ROOTSTOCK = 31;

const CONFIGS: Record<number, Configs> = {
  [ROOTSTOCK]: {
    rpcUrl: "https://mycrypto.testnet.rsk.co",
    USDC: "0xA8Af982597D7A17c651c801B801EC86C92171A5d",
    RangeBetManager: "0x78070bF4525A5A5600Ff97220139a6F77F840A96",
    multicall: "0xcA11bde05977b3631167028862bE2a173976CA11",
  },
} as const;
export default CONFIGS;
