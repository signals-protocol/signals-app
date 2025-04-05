interface Configs {
  rpcUrl: string;
  USDC: string;
  RangeBetManager: string;
  multicall: string;
  chunkSize: number;
  parallelChunks: number;
  createdBlocknum: number;
}

export const ROOTSTOCK = 31;
export const CITREA = 5115;

export const GLOBAL_CONFIG = {
  chainId: CITREA,
  dateCount: 31,
  startPrice: 75000,
  binCount: 40,
  tickSpacing: 60,
  targetBinStart: 0,
}
export const CHART_CONFIG = {
  height: 500
}

const CONFIGS: Record<number, Configs> = {
  [ROOTSTOCK]: {
    rpcUrl: "https://rpc.testnet.rootstock.io/ftZ3SGjLVuC4p9Bl70AF0EdUBSz3Ca-T",
    USDC: "0xD0be1370aAD4EC814ea4794b0272D01B47239789",
    RangeBetManager: "0x9fDEb59d52b49F95D244Be8f64e307D500b11A3a",
    multicall: "0xcA11bde05977b3631167028862bE2a173976CA11",
    createdBlocknum: 6241138,
    chunkSize: 11,
    parallelChunks: 3,
  },
  [CITREA]: {
    rpcUrl: "https://rpc.testnet.citrea.xyz",
    USDC: "0x73908E35F9b5747f6183111cA417462E8e39c09B",
    RangeBetManager: "0x70f4Ca15671FEF847f93a4A554E8758bd1c8240F",
    multicall: "0xcA11bde05977b3631167028862bE2a173976CA11",
    createdBlocknum: 8529016,
    chunkSize: 11,
    parallelChunks: 3,
  },
} as const;

export const binIndexToBin = (binIndex: number) => {
  return binIndex * GLOBAL_CONFIG.tickSpacing + GLOBAL_CONFIG.targetBinStart;
}

export default CONFIGS;
