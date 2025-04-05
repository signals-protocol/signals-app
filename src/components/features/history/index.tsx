import { useEffect, useState } from "react";
import HistoryHeader from "./HistoryHeader";
import { Tabs, TabType } from "./Tabs";
import {
  LivePrediction,
  EndedPrediction,
  PredictionSummary,
  PredictionLog,
} from "./interfaces";
import { getPredictionHistory } from "core/getPredictionHistory";
import { useAppKitAccount } from "@reown/appkit/react";
import { EventLog } from "ethers";
import { GLOBAL_CONFIG } from "core/configs";
import { LivePredictionRow } from "./LivePredictionRow";
import { parsePredictionLogs } from "./parser";

const PredictionHistory = () => {
  const { address } = useAppKitAccount();
  const [items, setItems] = useState<LivePrediction[]>([]);

  useEffect(() => {
    if (!address) return;

    const addItems = (items: EventLog[]) => {
      const logs = items.map((item) => ({
        marketId: Number(item.args.marketId),
        buyer: item.args.buyer,
        binIndices: item.args.binIndices.map(Number),
        amounts: item.args.amounts,
        totalCost: item.args.totalCost,
        txHash: item.transactionHash,
      }));
      parsePredictionLogs(GLOBAL_CONFIG.chainId, logs).then((res) => {
        setItems((prevItems) => [...prevItems, ...res]);
      });
    };

    setItems([]);
    getPredictionHistory(GLOBAL_CONFIG.chainId, address, addItems);
  }, [address]);

  const [activeTab, setActiveTab] = useState<TabType>("Live");

  // 요약 정보
  const liveSummary: PredictionSummary = {
    positionValue: "$0.04",
    profitAndLoss: "-$9.95",
    volumeTraded: "$9.99",
    predictionCount: "1",
  };

  const endedSummary: PredictionSummary = {
    positionValue: "$20.04",
    profitAndLoss: "+$0.05",
    volumeTraded: "$19.99",
    predictionCount: "2 (1-1)",
  };
  const currentSummary = activeTab === "Live" ? liveSummary : endedSummary;

  return (
    <div className="">
      <HistoryHeader />

      {/* 탭 네비게이션 */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 요약 정보 */}
      <div className="grid grid-cols-4 gap-5 my-[60px]">
        <div className="border p-4 rounded-lg">
          <p className="text-sm text-surface-on-var">Position value</p>
          <p className="text-lg font-semibold">
            {currentSummary.positionValue}
          </p>
        </div>
        <div className="border p-4 rounded-lg">
          <p className="text-sm text-surface-on-var">Profit and Loss</p>
          <p
            className={`text-lg font-semibold ${
              currentSummary.profitAndLoss.startsWith("+")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {currentSummary.profitAndLoss}
          </p>
        </div>
        <div className="border p-4 rounded-lg">
          <p className="text-sm text-surface-on-var">Volume traded</p>
          <p className="text-lg font-semibold">{currentSummary.volumeTraded}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <p className="text-sm text-surface-on-var">
            # of Prediction{activeTab === "Ended" ? " (Win-Loss)" : ""}
          </p>
          <p className="text-lg font-semibold">
            {currentSummary.predictionCount}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-outline-var">
          <thead className="font-bold text-sm text-surface-on">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Prediction
              </th>
              {activeTab === "Ended" && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Result
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                AVG
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                BET
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                VALUE
              </th>
              {activeTab === "Live" && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  TO WIN
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                DATE
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-outline-var">
            {items.map((item) => (
              <LivePredictionRow key={item.range} prediction={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictionHistory;
