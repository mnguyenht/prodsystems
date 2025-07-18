import "./App.css";
import TasksContext from "./context/index";
import BrowerRouter from "./router/index";
import { useState, useEffect } from "react";

import TimerContext from "./context/pomoindex";
import TermsContext from "./context/flashcardsindex";

const App = () => {
  const [terms, setTerms] = useState([
    {
      id: 1,
      order: 1,
      term: "Torque def",
      def: "a force's ability to cause rotation",
    },
    {
      id: 2,
      order: 2,
      term: "What is buoyant force",
      def:
        "If we think about gauge pressure, the lower we are the more pressure there is. So the pressure pushing the bottom surfaces (which is facing up) is going to be higher than the pressure from the top surfaces (which is facing down). So the net UP force of that is the buoyant force, that's overall pushing the object up. And it will keep pushing the obj up until the bottom pressure cannot withstand the top pressure + weight of the object.",
    },
    {
      id: 3,
      order: 3,
      term: "Find total electrons in _ orbital",
      def:
        "find what block the element is on the periodic table, then count all the elements that atom went through inside that block",
    },
        {
      id: 4,
      order: 4,
      term: "Intermolecular Forces(IMF)",
      def:
        "the attraction between 2 molecules",
    },
    
        {
      id: 5,
      order: 5,
      term: "Categorical vs Block Grant",
      def:
        "Categorical Grants: States/Local grants for a specific purpose. Block Grants: same thing but States/Local areas get more flexibility",
    },
    

  ]);



  const [tasks, setTasks] = useState([
    {
      id: 1,
      list: "List 1",
      name: "Pomodoro now runs even when not in page",
      description: "Pomodoro continues to run even when you're on another page",
      completed: false,
    },
    {
      id: 2,
      list: "List 1",
      name: "Fixed first time intialization resulting in 0 pomodoro time",
      description:
        "Without previous localstorage data, the pomodoro timer would start at 0, and or result in NaN aswell",
      completed: false,
    },
    {
      id: 3,
      list: "List 1",
      name: "Fixed creating tasks without assigning lists",
      description:
        "Now creating a task will add it to whatever list you're in, or the first list if not in a list",
      completed: false,
    },
    {
      id: 4,
      list: "List 2",
      name: "Extra: Moved all pomo states into a context",
      description: "",
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

  //First ever init
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
      //Tick down seconds
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
      //Timer finished congats amazing also seconds == 1 because lifecycle reasons
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
