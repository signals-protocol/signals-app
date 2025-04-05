import { useState } from "react";
import { LivePrediction } from "./interfaces";
import CONFIGS, { GLOBAL_CONFIG } from "core/configs";
import { ShareModal } from "./ShareModal";

interface LivePredictionRowProps {
  prediction: LivePrediction;
}

export function LivePredictionRow({ prediction }: LivePredictionRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const config = CONFIGS[GLOBAL_CONFIG.chainId];
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-bold text-surface-on underline">
          {prediction.range}
        </div>
        <div className="text-sm text-surface-on-var">{(+prediction.shares).toFixed(2)} Shares</div>
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
        <div className="flex gap-2">
          <a href={`${config.explorer}tx/${prediction.txHash}`} target="_blank" rel="noopener noreferrer">
            <img src={`/images/world.png`} alt="world" className="w-5 h-5" />
          </a>
          <img 
            src={`/images/share.png`} 
            alt="share" 
            className="w-5 h-5 cursor-pointer" 
            onClick={openModal}
          />
        </div>
        {isModalOpen && <ShareModal onClose={closeModal} />}
      </td>
    </tr>
  );
}
