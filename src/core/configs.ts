interface Configs {
  rpcUrl: string;
  USDC: string;
  RangeBetManager: string;
  multicall: string;
  chunkSize: number;
  parallelChunks: number;
}

export const ROOTSTOCK = 31;

const CONFIGS: Record<number, Configs> = {
  [ROOTSTOCK]: {
    rpcUrl: "https://mycrypto.testnet.rsk.co",
    USDC: "0xE7CBC29ACbd493B72e2249F4BDbca475cA32e783",
    RangeBetManager: "0xB82dE83a533CF8196CD8691C8acD4892A72c9d47",
    multicall: "0xcA11bde05977b3631167028862bE2a173976CA11",
    chunkSize: 6,
    parallelChunks: 1,
  },
} as const;
export default CONFIGS;
