import TasksContext from "./context/index";
import BrowerRouter from "./router/index";
import { useState, useEffect } from "react";

import TimerContext from "./context/pomoindex";
import TermsContext from "./context/flashcardsindex";

const App = () => {
  const placeholder = [
    {
      id: 1,
      order: 1,
      term: "Add a card to get started",
      def: "Use the + button on the bottom right corner",
    },
  ];
  // Sets the state 
  const [terms, setTerms] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("terms"));
      if (Array.isArray(stored) && stored.length > 0) {
        return stored;
      }
    } catch {}
    return placeholder;
  });



  const [tasks, setTasks] = useState([
   {
  id: 1,
  list: "List 1",
  name: "Fix long text breaking the card",
  description: "Ensure text wraps or truncates so the card layout stays intact",
  completed: false,
},
{
  id: 2,
  list: "List 1",
  name: "Right‑click no longer closes sidebar",
  description: "Filter out right‑clicks from outside‑click logic to keep sidebar open",
  completed: false,
},
  {
    id: 3,
    list: "List 2",
    name: "Right‑click no longer closes sidebar", 
    description: "Filter out right‑clicks from outside‑click logic to keep sidebar open",
    completed: false,
  },
  {
    id: 4,
    list: "List 2", 
    name: "Edit menu now has validation",
    description: "Prefills task info in the edit dialog and enforces required input checks using react-hook-form",
    completed: false,
  },
   {
    id: 5,
    list: "List 2",
    name: "weird border drag and drop thing", 
    description: "yeah", 
    completed: false,
  },


  ]);

  

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
    }, 1000);

    return () => clearInterval(interval);
  }, [ticking, seconds]);

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
