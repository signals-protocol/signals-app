import { findX } from "../utils/findX";

export const calculateBinTicket = async (
  allBins: bigint[],
  targetBin: number,
  amount: bigint
) => {
  const sum = allBins.reduce((acc, bin) => acc + bin, 0n);
  const ticket = findX(amount, allBins[targetBin], sum);
  return ticket;
};
