import CONFIGS, {
  binToBinIndex,
  getBinRange,
  createPriceBins,
  GLOBAL_CONFIG,
} from "core/configs";
import { LivePrediction, PredictionLog } from "./interfaces";
import { formatEther, parseEther } from "ethers";
import { addDays } from "date-fns";
import { avgPriceFormatter, dollarFormatter } from "utils/formatter";
import { BetManager__factory, Multicall__factory } from "typechain";
import { JsonRpcProvider } from "ethers";

export const parsePredictionLogs = async (
  chainId: number,
  predictionLogs: PredictionLog[]
): Promise<LivePrediction[]> => {
  const config = CONFIGS[chainId];
  // assume that only one bin is target
  const priceBins = createPriceBins(
    GLOBAL_CONFIG.startPrice,
    GLOBAL_CONFIG.binCount
  );

  const preParsed = predictionLogs.map((predictionLog) => {
    const binIndex = binToBinIndex(predictionLog.binIndices[0]);
    const range = getBinRange(binIndex, priceBins)!;
    const tickets = predictionLog.amounts[0];
    const avg = (predictionLog.totalCost * parseEther("1")) / tickets;
    const date = addDays(GLOBAL_CONFIG.startDate, predictionLog.marketId);

    return {
      range: `${dollarFormatter(range[0], 0, 2)} to ${dollarFormatter(
        range[1],
        0,
        2
      )}`,
      avg: avgPriceFormatter(avg),
      bet: dollarFormatter(formatEther(predictionLog.totalCost)),
      toWin: dollarFormatter(formatEther(tickets)),
      date: date.toISOString().split("T")[0],
      result: null,
      shares: formatEther(tickets),
      bin: predictionLog.binIndices[0],
      marketId: predictionLog.marketId,
      totalCost: predictionLog.totalCost,
      txHash: predictionLog.txHash, 
      value: "0"
    };
  });

  return preParsed;

  const itf = BetManager__factory.createInterface();
  const querys = predictionLogs.map((log) => ({
    target: config.RangeBetManager,
    callData: itf.encodeFunctionData("calculateBinCost", [
      log.marketId,
      log.binIndices[0],
      log.amounts[0],
    ]),
  })
  );

  const multicall = Multicall__factory.connect(
    config.multicall,
    new JsonRpcProvider(config.rpcUrl)
  )

  const results = await multicall.aggregate.staticCall(querys);

  const currValue = results.returnData.map((data, index) => {
    const value = dollarFormatter(formatEther(data));
    return {
      ...preParsed[index],
      value
    };
  });

  return currValue;
};
