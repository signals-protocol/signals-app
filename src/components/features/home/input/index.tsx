import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import formatDate from "./formatDate";
import { useRef } from "react";
import { usePrediction } from "./usePrediction";
import { formatEther, formatUnits, parseEther } from "ethers";
import useAction from "./useAction";
import cn from "utils/cn";

export default function PredictionInput({
  chainId,
  selectedMarketId,
  currentBinId,
  selectedDate,
  setSelectedDate,
  currBin,
  tickets,
  amount,
  setAmount,
  shouldApprove,
  balance,
}: ReturnType<typeof usePrediction>) {
  const ref = useRef<DatePicker>(null);
  const formattedDate = formatDate(selectedDate);
  const handleClick = () => {
    ref.current?.setOpen(true);
  };

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 정규식 수정 - 소수점만 있는 경우(예: "3.")도 허용
    const regex = /^[0-9]*\.?[0-9]*$/;
    // 소수점 이하 18자리 제한 로직 추가
    if (regex.test(e.target.value)) {
      const parts = e.target.value.split(".");
      if (parts.length === 2 && parts[1].length > 18) {
        return; // 소수점 이하 18자리 초과시 입력 무시
      }
      setAmount(e.target.value);
    }
  };

  const avgPrice =
    tickets > 0n ? (parseEther(amount || "0") * parseEther("1")) / tickets : 0n;
  const action = useAction({
    chainId,
    currentBinId,
    selectedMarketId,
    amount,
    shouldApprove,
    tickets,
  });

  return (
    <div>
      <div
        className="bg-surface-container-high px-5 py-3 font-bold flex items-center gap-2 rounded-lg"
        onClick={handleClick}
      >
        <span>{formattedDate}</span>
        <DatePicker
          ref={ref}
          selected={selectedDate}
          onChange={(date: Date | null) => {
            if (date) {
              setSelectedDate(date);
            }
          }}
          dateFormat="(d MMM yyyy)"
          placeholderText="Select date"
          className="bg-surface-container-high outline-none"
        />
      </div>

      <div>
        <div className="flex justify-between mt-6">
          <p className="">BTC Price</p>
          {currBin ? (
            <div className="flex flex-col items-end">
              <p>${currBin[0]}</p>
              <p>~${currBin[1]}</p>
            </div>
          ) : (
            <p>Select price bin</p>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <p>avg price</p>
          <div className="">
            <p>
              ¢
              {Math.floor(Number(formatUnits(avgPrice ? avgPrice : "0", 15))) /
                10}
            </p>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <p>amount</p>
          <input
            value={amount}
            onChange={onChangeValue}
            className="text-right outline-none underline"
          />
        </div>
        <div className="flex justify-between mt-6">
          <p>To win</p>
          <p>${formatEther(tickets)}</p>
        </div>
        <div className="flex justify-between mt-6">
          <p>USDC Balance</p>
          <p>${formatEther(balance)}</p>
        </div>
      </div>

      <button
        onClick={action.onClick}
        className={cn(
          action.state === "done" ? "btn-secondary" : "btn-primary",
          "mt-4 w-full"
        )}
        disabled={
          action.state === "approve-loading" ||
          action.state === "predict-loading"
        }
      >
        {action.state === "need-approve"
          ? "Approve USDC"
          : action.state === "approve-loading"
          ? "Approving"
          : action.state === "can-predict"
          ? "Predict"
          : action.state === "predict-loading"
          ? "Placing Prediction"
          : action.state === "done"
          ? "Prediction Confirmed"
          : ""}
      </button>
    </div>
  );
}
