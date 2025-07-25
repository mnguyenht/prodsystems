import React from "react";

import { Button } from "@/components/ui/button";

import { ChevronLast } from "lucide-react";

import { toast } from "sonner";

import { useTimer } from "@/context/pomoindex";
import ChangeSettings from "@/components/changesettings";
import DropDown from "@/components/dropdown";



function PomodoroComponent() {
  const {
    minutes,
    seconds,
    setSeconds,
    setMinutes,
    ticking,
    setTicking,
    status,
    setStatus,
    pomodoroTime,
    setPomodoroTime,
    shortBreakTime,
    setShortBreakTime,
  } = useTimer();

  const switchStatus = () => {
    const reordered = [status[1], status[0]];
    setStatus(reordered);
    setTicking(false);

    if (reordered[0] === "Pomodoro") {
      setMinutes(pomodoroTime);
      setSeconds(0);
    } else {
      setMinutes(shortBreakTime);
      setSeconds(0);
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center p-4 min-h-screen w-full overflow-y-hidden bg-white">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        The Pomodoro Timer
      </h2>

      <ChangeSettings
        pomodoroTime={pomodoroTime}
        setPomodoroTime={setPomodoroTime}
        shortBreakTime={shortBreakTime}
        setShortBreakTime={setShortBreakTime}
      />

      <div className="flex flex-col items-center overflow-x-hidden bg-accent p-10 gap-10 font-manrope rounded-md">
        <h1 className="scroll-m-20 text-center text-8xl font-manrope tracking-tight text-balance">
          {minutes < 10 ? `0${minutes}` : minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </h1>

        <div className="flex flex-col items-center overflow-x-hidden bg-accent gap-4 font-manrope">
          <p className="font-manrope text-lg flex flex-row gap-1">
            Current Status:{" "}
            <DropDown
              status={status}
              setStatus={setStatus}
              setTicking={setTicking}
            />
          </p>

          <div className="flex flex-row gap-6 items-center justify-center">
            <ChevronLast className="size-10 scale-x-[-1] cursor-pointer opacity-0" />

            <Button
              className="scroll-m-20 text-center w-40 h-15 text-xl tracking-tight text-balance cursor-pointer"
              onClick={() => {
                if (minutes === 0 && seconds === 0) {
                  toast.error("Time’s up!");
                  return;
                }
                setTicking(!ticking);
              }}
            >
              {ticking ? "STOP" : "START"}
            </Button>

            <ChevronLast
              className="size-10 cursor-pointer"
              onClick={switchStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PomodoroComponent;
