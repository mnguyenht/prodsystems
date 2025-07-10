import { createContext, useContext } from "react";

export const TasksContext = createContext({} as { tasks: any[], setTasks: Function });
export const useTasks = () => useContext(TasksContext);

export default TasksContext;
