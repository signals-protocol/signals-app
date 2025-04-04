import {
  BetManager__factory,
  Multicall,
  Multicall__factory,
} from "../typechain";
import CONFIGS from "./configs";
import { ethers, formatEther } from "ethers";

const TARGET_BIN_START = 0;
const TICK_SPACING = 60;
const TARGET_BIN_COUNT = 40;
function getTargetBins() {
  const targetBins = [];
  let bin = TARGET_BIN_START;
  for (let i = 0; i < TARGET_BIN_COUNT; i++) {
    targetBins.push(bin);
    bin += TICK_SPACING;
  }
  return targetBins;
}

const CHUNK_SIZE = 100; // 한 번에 처리할 쿼리 수
const PARALLEL_CHUNKS = 1; // 병렬 처리할 청크 그룹 수

function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

async function executeMulticall(
  multicall: Multicall,
  queries: string[],
  target: string,
  maxRetries = 3
): Promise<number[]> {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const results = await multicall.aggregate.staticCall(
        queries.map((query) => ({
          target,
          callData: query,
        }))
      );
      return results.returnData.map((d) => +formatEther(d));
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        // 재시도 전에 잠시 대기 (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
        continue;
      }
    }
  }

  throw new Error(
    `Multicall failed after ${maxRetries} attempts: ${lastError}`
  );
}

async function getHeatmapData(
  chainId: number,
  markets: number,
  chunkSize = CHUNK_SIZE,
  parallelChunks = PARALLEL_CHUNKS
) {
  const contracts = CONFIGS[chainId];
  const provider = new ethers.JsonRpcProvider(contracts.rpcUrl);
  const betManager = BetManager__factory.connect(
    contracts.RangeBetManager,
    provider
  );
  const multicall = Multicall__factory.connect(contracts.multicall, provider);

  const querys: string[] = [];
  const bins = getTargetBins();
  for (let marketId = 0; marketId < markets; marketId++) {
    for (let bin of bins) {
      querys.push(
        betManager.interface.encodeFunctionData("getBinQuantity", [
          marketId,
          bin,
        ])
      );
    }
  }

  const chunks = chunkArray(querys, chunkSize);
  const results: number[] = [];

  // 병렬 처리를 위한 청크 그룹 생성
  const groups = chunkArray(chunks, parallelChunks);

  // 각 그룹 순차 실행
  for (const group of groups) {
    const groupResults = await Promise.all(
      group.map((chunk) =>
        executeMulticall(multicall, chunk, contracts.RangeBetManager)
      )
    );
    results.push(...groupResults.flat());
    console.log(`${results.length} / ${querys.length}`);
  }

  // 결과를 market별로 재구성
  const binsPerMarket = bins.length;
  const marketResults: number[][] = [];
  
  for (let i = 0; i < markets; i++) {
    const start = i * binsPerMarket;
    const end = start + binsPerMarket;
    marketResults.push(results.slice(start, end));
  }

  return marketResults;
}

export default getHeatmapData;
