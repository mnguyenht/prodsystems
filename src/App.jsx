import TasksContext from "./context/index";
import BrowerRouter from "./router/index";
import { useState, useEffect } from "react";

import TimerContext from "./context/pomoindex";
import TermsContext from "./context/flashcardsindex";

const App = () => {
  const placeholderTerm = [
    {
      id: 1,
      order: 1,
      term: "Add a card to get started",
      def: "Use the + button on the bottom right corner",
    },
  ];
  // Sets the state for terms
  const [terms, setTerms] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("terms"));
      if (Array.isArray(stored) && stored.length > 0) {
        return stored;
      }
    } catch {}
    return placeholderTerm;
  });

  const placeholderTask = [
    {
      id: 1,
      list: "List 1",
      name: "Create your first task",
      description: "Use the + button below to create your first task",
      completed: false,
    },
  ];
  // Sets the state for tasks
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("tasks"));
      if (Array.isArray(stored) && stored.length > 0) {
        return stored;
      }
    } catch {}
    return placeholderTask;
  });

  const [lists, setLists] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("lists"));
      if (Array.isArray(stored) && stored.length > 0) {
        return stored;
      }
    } catch {}
    return;
  });

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [ticking, setTicking] = useState(false);
  const [status, setStatus] = useState(["Pomodoro", "Short Break"]);

  const [pomodoroTime, setPomodoroTime] = useState(() =>
    parseInt(localStorage.getItem("pomodoroTime") || "25")
  );
  const [shortBreakTime, setShortBreakTime] = useState(() =>
    parseInt(localStorage.getItem("shortBreakTime") || "5")
  );

  // First ever init
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      console.log("Welcome new user!");

      setPomodoroTime(25);
      setShortBreakTime(5);

      localStorage.setItem("pomodoroTime", "25");
      localStorage.setItem("shortBreakTime", "5");
      localStorage.setItem("hasVisited", "true");
    } else {
      // Returning user — load from storage if you like
      const savedPomo = parseInt(localStorage.getItem("pomodoroTime") || "25");
      const savedBreak = parseInt(
        localStorage.getItem("shortBreakTime") || "5"
      );
      setPomodoroTime(savedPomo);
      setShortBreakTime(savedBreak);
    }
  }, []);

  // initialize
  useEffect(() => {
    if (status[0] === "Pomodoro") {
      setMinutes(pomodoroTime);
      setSeconds(0);
    } else {
      setMinutes(shortBreakTime);
      setSeconds(0);
    }
    setTicking(false);
  }, []);

  useEffect(() => {
    if (!ticking) return;
    const interval = setInterval(() => {
      // Tick down seconds
      setSeconds((prevSeconds) => {
        if (minutes === 0 && seconds === 0) {
          const reordered = [status[1], status[0]];
          setStatus(reordered);
          return 0;
        }

        if (prevSeconds === 0) {
          return 59;
        } else {
          return prevSeconds - 1;
        }
      });
      // Timer finished congats amazing also seconds == 1 because lifecycle reasons
      setMinutes((prevMinutes) => {
        return seconds === 0 && minutes !== 0 ? prevMinutes - 1 : prevMinutes;
      });
          console.log(minutes, seconds)
    }, 1000);
    return () => clearInterval(interval);

  }, [ticking, seconds, minutes]);

  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
      <TimerContext.Provider
        value={{
          minutes,
          setMinutes,
          seconds,
          setSeconds,
          ticking,
          setTicking,
          status,
          setStatus,
          setPomodoroTime,
          setShortBreakTime,
          pomodoroTime,
          shortBreakTime,
        }}
      >
        <TermsContext.Provider value={{ terms, setTerms }}>
          <BrowerRouter />
        </TermsContext.Provider>
      </TimerContext.Provider>
    </TasksContext.Provider>
  );
};

export default App;
