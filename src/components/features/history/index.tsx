import React, { useEffect, useState } from "react";
import HistoryHeader from "./HistoryHeader";
import { Tabs, TabType } from "./Tabs";
import { LivePrediction, EndedPrediction, PredictionSummary, PredictionLog } from "./interfaces";
import { getPredictionHistory } from "core/getPredictionHistory";
import { useAppKitAccount } from "@reown/appkit/react";
import { EventLog } from "ethers";
import { GLOBAL_CONFIG } from "core/configs";

const PredictionHistory= () => {
  const {address} = useAppKitAccount();
  const [items, setItems] = useState<PredictionLog[]>([]);
  useEffect(() => {
    if (!address) return;

    const addItems = (items: EventLog[]) => {
      setItems((prevItems) => [...prevItems, ...items.map(item => ({
        marketId: Number(item.args.marketId),
        buyer: item.args.buyer,
        binIndices: item.args.binIndices.map(Number),
        amounts: item.args.amounts,
        totalCost: item.args.totalCost,
      }))]);
    };

    setItems([]);
    getPredictionHistory(GLOBAL_CONFIG.chainId, address, addItems);
  }, [address]);

  const [activeTab, setActiveTab] = useState<TabType>("Live");

  // 더미 데이터 - 실제로는 API에서 가져올 데이터
  const livePredictions: LivePrediction[] = [
    {
      id: 1,
      range: "$89,500.30 to $89,980.24 on 6 Apr 2025",
      avg: "25K",
      bet: "$9.99",
      value: "$0.04",
      toWin: "$28.32",
      date: "11 days ago",
      shares: "25 shares",
      result: null,
    },
  ];

  const endedPredictions: EndedPrediction[] = [
    {
      id: 1,
      range: "$89,500.30 to $89,980.24 on 2 Apr 2025",
      result: "Loss",
      avg: "25K",
      bet: "$9.99",
      value: "$0.04",
      date: "13 days ago",
      shares: "25 shares",
    },
    {
      id: 2,
      range: "$89,200.42 to $89,520.24 on 3 Apr 2025",
      result: "Win",
      avg: "25K",
      bet: "$10.00",
      value: "$20.00",
      date: "12 days ago",
      shares: "25 shares",
    },
  ];

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

  const currentPredictions =
    activeTab === "Live" ? livePredictions : endedPredictions;
  const currentSummary = activeTab === "Live" ? liveSummary : endedSummary;

  return (
    <div className="">
      <HistoryHeader />

      {/* 탭 네비게이션 */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 요약 정보 */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="text-center">
          <p className="text-sm text-gray-500">Position value</p>
          <p className="text-lg font-semibold">
            {currentSummary.positionValue}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Profit and Loss</p>
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
        <div className="text-center">
          <p className="text-sm text-gray-500">Volume traded</p>
          <p className="text-lg font-semibold">{currentSummary.volumeTraded}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">
            # of Prediction{activeTab === "Ended" ? " (Win-Loss)" : ""}
          </p>
          <p className="text-lg font-semibold">
            {currentSummary.predictionCount}
          </p>
        </div>
      </div>

      {/* 예측 목록 테이블 */}
      {/* {currentPredictions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prediction
                </th>
                {activeTab === "Ended" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AVG
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BET
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  VALUE
                </th>
                {activeTab === "Live" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TO WIN
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DATE
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPredictions.map((prediction) => (
                <tr key={prediction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {prediction.range}
                    </div>
                    <div className="text-sm text-gray-500">
                      {prediction.shares}
                    </div>
                  </td>
                  {activeTab === "Ended" && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          prediction.result === "Win"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {prediction.result}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {prediction.avg}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {prediction.bet}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {prediction.value}
                  </td>
                  {activeTab === "Live" && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prediction.toWin}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {prediction.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {activeTab === "Live"
            ? "No active predictions"
            : "No past predictions"}
        </div>
      )} */}
    </div>
  );
};

export default PredictionHistory;
