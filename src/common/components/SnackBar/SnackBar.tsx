import { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { setAppError } from "../../../app/model/appReducer";

type SnackBarProps = {
  message: string | null;
  type: "failed" | "info" | "succeed";
};

export const SnackBar: React.FC<SnackBarProps> = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  let timerId: number | undefined = undefined;
  const handleVisible = () => {
    setIsVisible((prev) => (prev = false));
    dispatch(setAppError({ error: null }));
  };
  const handleTimeOut = () => {
    timerId = setTimeout(() => handleVisible(), 6000);
  };

  useEffect(() => {
    if (message) {
      setIsVisible((prev) => (prev = !isVisible));
      handleTimeOut();
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [message, timerId]);

  const bgColor = {
    failed: "bg-red-300",
    info: "bg-blue-300",
    succeed: "bg-green-300",
  };

  return (
    isVisible && (
      <div className={`fixed bottom-10 transition-transform`}>
        <div
          className={`w-80 opacity-70 border-green-400 text-black rounded-lg flex justify-center p-3 ${bgColor[type]}`}
        >
          <span>{message}</span>
        </div>
      </div>
    )
  );
};
