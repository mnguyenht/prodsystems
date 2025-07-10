import "./App.css";
import TasksContext from "./context/index";
import BrowerRouter from "./router/index";
import { useState } from "react";
const App = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      list: "List 1",
      name: "Add dynamicness to tabs and also cursor pointer highlight",
      description: "",
      completed: false,
    },
    {
      id: 2,
      list: "List 1",
      name: "Make current status a dropdown menu",
      description: "turn status[0].toString() into a dropdown menu",
      completed: false,
    },
    {
      id: 3,
      list: "List 1",
      name: "Switching status after finishing one",
      description: "self explanatory",
      completed: false,
    },
    {
      id: 4,
      list: "List 2",
      name: "Arrow functionality",
      description: "switch only from pomo and short break",
      completed: false,
    },
    {
      id: 5,
      list: "List 2",
      name: "Settings",
      description: "settings tab that allwos people to modify status times",
      completed: false,
    },
  ]);
  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
      <BrowerRouter />
    </TasksContext.Provider>
  );
};

export default App;
