import { LivePrediction } from "./interfaces";

interface LivePredictionRowProps {
  prediction: LivePrediction;
}

export function LivePredictionRow({ prediction }: LivePredictionRowProps) {
  return (
    <tr key={prediction.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {prediction.range}
        </div>
        <div className="text-sm text-gray-500">{prediction.shares}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {prediction.avg}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {prediction.bet}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {prediction.value}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {prediction.toWin}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {prediction.date}
      </td>
    </tr>
  );
}
