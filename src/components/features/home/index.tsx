import HeatmapChart from "./heatmap/HeatmapChart";
import ToggleChartSwitch from "./ToggleChartSwitch";
import PredictionInput from "./input";
import { useState } from "react";
import { ROOTSTOCK } from "../../../core/configs";
import { usePrediction } from "./input/usePrediction";

const CHAIN_ID = ROOTSTOCK;
const START_DATE = new Date("2025-03-31");

export default function Home() {
  const [isHeatmap, setIsHeatmap] = useState(true);
  const input = usePrediction(CHAIN_ID, START_DATE, 75000, 40);

  return (
    <div className="flex flex-col gap-2 py-9">
      <ToggleChartSwitch isHeatmap={isHeatmap} setIsHeatmap={setIsHeatmap} />
      <div className="flex gap-12">
        <div className="flex flex-[2.5]">
          {input.heatmapData && (
            <HeatmapChart
              data={input.heatmapData}
              priceBins={input.priceBins}
              onBinClick={input.onBinClick}
            />
          )}
        </div>
        <div className="flex flex-1">
          <PredictionInput {...input} />
        </div>
      </div>
    </div>
  );
}

/*****************************************************************/
/*****************************************************************/
/*****************************************************************/
// function generateNormalDistributionValues(
//   totalVotes: number,
//   dayIndex: number,
//   mean: number
// ) {
//   const baseSigma = 6;
//   const sigmaDelta = 0.2;
//   const sigma = baseSigma + dayIndex * sigmaDelta;
//   const bins = 40;

//   const values = Array.from({ length: bins }, (_, i) =>
//     Math.max(0, Math.exp(-0.5 * Math.pow((i - mean) / sigma, 2)))
//   );

//   const sum = values.reduce((acc, val) => acc + val, 0);
//   const normalizedValues = values.map((v) => v / sum);

//   return normalizedValues.map((v) => Math.round(v * totalVotes));
// }

// // 랜덤 변동폭 생성 함수
// const getRandomDelta = () => Math.floor(Math.random() * 11) - 5; // -5 ~ 5 사이의 랜덤값
// const sampleData: HeatmapDatum[] = Array.from({ length: 15 }, (_, i) => {
//   const totalVotes = 1000 - i * 50;
//   // 초기 mean 값 설정
//   const initialMean = 20;

//   // mean 값들을 누적하여 계산
//   const means = Array.from({ length: i + 1 }).reduce<number[]>(
//     (acc, _, idx) => {
//       const prevMean = acc[idx] ?? initialMean;
//       const newMean = Math.max(0, Math.min(39, prevMean + getRandomDelta())); // 0~39 범위 내로 제한
//       return [...acc, newMean];
//     },
//     []
//   );

//   const currentMean = means[means.length - 1];
//   const values = generateNormalDistributionValues(totalVotes, i, currentMean);
//   return {
//     date: new Date(`2025-04-${String(i + 1).padStart(2, "0")}`),
//     values: values,
//   };
// });
