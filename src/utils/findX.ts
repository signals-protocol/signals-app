import { ln } from "./log";
import { parseEther } from "ethers";

const OPTIONS = {
  maxIter: 50,
  tol: 1000n,
  initialGuess: 0,
};

// cost = x + (q - T) * ln(((T+x)/T)
export function findX(cost: bigint, q: bigint, total: bigint): bigint {
  if (total === 0n) return cost;

  const initX = (cost * q) / total;
  let x = initX;
  for (let i = 0; i < OPTIONS.maxIter; i++) {
    const y = calc(x, q, total);
    let diff = y - cost;
    diff = diff < 0n ? -diff : diff;
    console.log("calc res", i, x, y, q, total, diff);
    if (diff < OPTIONS.tol) {
      return x;
    }
    x = x + diff;
  }
  return x;
}

function calc(x: bigint, q: bigint, total: bigint): bigint {
  const one = parseEther("1");
  return x + ((q - total) * ln(((total + x) * one) / total)) / one;
}
