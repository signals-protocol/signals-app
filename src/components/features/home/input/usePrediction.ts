import { useEffect, useMemo, useState } from "react";
import { addDays, differenceInDays } from "date-fns";
import { calculateBinTicket } from "core/calculateBinTicket";
import { HeatmapDatum } from "../heatmap/HeatmapChart";
import { parseEther } from "ethers";
import { useAppKitAccount } from "@reown/appkit/react";
import { getAllowance, getBalance } from "core/token";
import getHeatmapData from "core/getHeatmapData";

const createPriceBins = (startPrice: number, length: number) => {
  return Array.from({ length }, (_, i) => startPrice + i * 500);
};

export const usePrediction = (
  chainId: number,
  startDate: Date,
  startPrice: number,
  binCount: number
) => {
  const { address } = useAppKitAccount();
  // Date
  const [selectedMarketId, setSelectedMarketId] = useState<number>(6);
  // Price Bin
  const [currentBinId, setCurrentBinId] = useState<number | null>(null);
  const priceBins = useMemo(
    () => createPriceBins(startPrice, binCount),
    [startPrice, binCount]
  );

  const [tickets, setTickets] = useState<bigint>(0n);
  const [amount, setAmount] = useState<string>("1");
  const [balance, setBalance] = useState<bigint>(0n);
  const [heatmapData, setHeatmapData] = useState<HeatmapDatum[]>();
  const [allowance, setAllowance] = useState<bigint>(0n);

  useEffect(() => {
    if (currentBinId !== null && heatmapData) {
      calculateBinTicket(
        heatmapData[selectedMarketId].values,
        currentBinId,
        parseEther(amount)
      ).then(setTickets);
    }
  }, [selectedMarketId, currentBinId, amount, heatmapData]);

  useEffect(() => {
    getHeatmapData(chainId, 31, startDate, binCount).then((data) => {
      setHeatmapData(data);
    });
  }, []);

  useEffect(() => {
    if (address) {
      getAllowance(chainId, address).then(setAllowance);
      getBalance(chainId, address).then(setBalance);
    } else {
      setAllowance(0n);
      setBalance(0n);
    }
  }, [address]);

  const currBin =
    currentBinId !== null
      ? [priceBins[currentBinId], priceBins[currentBinId + 1]]
      : [];

  const onBinClick = (marketId: number, binId: number) => {
    setCurrentBinId(binId);
    setSelectedMarketId(marketId);
  };

  return {
    chainId,
    selectedDate: addDays(startDate, selectedMarketId),
    setSelectedDate: (date: Date) => {
      setSelectedMarketId(differenceInDays(date, startDate));
    },
    selectedMarketId,
    setSelectedMarketId,
    priceBins,
    currentBinId,
    setCurrentBinId,
    currBin,
    onBinClick,
    tickets,
    amount,
    setAmount,
    heatmapData,
    shouldApprove: allowance < parseEther(amount || "0"),
    balance,
  };
};
