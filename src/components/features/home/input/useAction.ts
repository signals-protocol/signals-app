import { switchNetwork } from "appkit";
import predictPrice from "core/predict";
import { approveUSDC } from "core/token";
import { parseEther } from "ethers";
import { useNavigate } from "react-router-dom";
import { useGetSigner } from "utils/useGetSigner";
import { useEffect, useState } from "react";
interface UseActionProps {
  chainId: number;
  currentBinId: number | null;
  selectedMarketId: number;
  amount: string;
  tickets: bigint;
  shouldApprove: boolean;
}

type ActionState =
  | "need-approve"
  | "approve-loading"
  | "can-predict"
  | "predict-loading"
  | "done";

export default function useAction({
  chainId,
  currentBinId,
  selectedMarketId,
  amount,
  tickets,
  shouldApprove,
}: UseActionProps) {
  const nav = useNavigate();
  const getSigner = useGetSigner();

  const approve = async () => {
    try {
      setState("approve-loading");
      const signer = await getSigner();
      await switchNetwork(chainId);
      await approveUSDC(chainId, signer, parseEther(amount));
      setState("can-predict");
    } catch (error) {
      console.error(error);
      setState("need-approve");
    }
  };

  const predict = async () => {
    if (currentBinId === null) return;
    try {
      setState("predict-loading");
      const signer = await getSigner();
      await predictPrice(
        chainId,
        signer,
        selectedMarketId,
        currentBinId,
        tickets,
        parseEther(amount)
      );
      setState("done");
    } catch (error) {
      console.error(error);
      setState("can-predict");
    }
  };

  const toProfile = () => {
    nav("/profile");
    setState("can-predict");
  };

  const [state, setState] = useState<ActionState>("need-approve");
  useEffect(() => {
    setState(shouldApprove ? "need-approve" : "can-predict");
  }, [shouldApprove]);

  const onClick = () => {
    if (state === "need-approve") {
      approve();
    } else if (state === "can-predict") {
      predict();
    } else if (state === "done") {
      toProfile();
    }
  };

  return {
    onClick,
    state,
  };
}
