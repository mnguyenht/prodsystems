import { createContext, useContext } from "react";

export const TimerContext = createContext({} as {
  minutes: number;
  setMinutes: (m: number) => void;
  seconds: number;
  setSeconds: (s: number) => void;
  ticking: boolean;
  setTicking: (t: boolean) => void;
  status: string[];
  setStatus: (s: string[]) => void;
  pomodoroTime: number;
  setPomodoroTime: (n: number) => void;
  shortBreakTime: number;
  setShortBreakTime: (n: number) => void;
  switchStatus: () => void;
});

export const useTimer = () => useContext(TimerContext);

export default TimerContext