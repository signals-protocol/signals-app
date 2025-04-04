import { formatEther, Signer } from "ethers";
import { BetManager__factory } from "../typechain";
import CONFIGS from "./configs";
import { TICK_SPACING, TARGET_BIN_START } from "./getHeatmapData";
async function predictPrice(
  chainId: number,
  signer: Signer,
  marketId: number,
  binIndex: number,
  ticket: bigint,
  amount: bigint
) {
  const config = CONFIGS[chainId];
  const bm = BetManager__factory.connect(config.RangeBetManager, signer);
  const bin = binIndex * TICK_SPACING + TARGET_BIN_START;
  const tx = await bm.buyTokens(marketId, [bin], [ticket], amount);
  const receipt = await tx.wait();
  return receipt;
}

export default predictPrice;
