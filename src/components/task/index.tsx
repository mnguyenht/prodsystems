

import "@fontsource/manrope";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";


import "../../App.css";
import { TasksContext, useTasks } from "@/context";
import TaskRow from "../taskrow";
import React from "react";

function Task({ search, currentList, currentSort, listNames }) {
  const { tasks, setTasks } = useTasks();

  const filtered = tasks.filter((t) =>
    (t.name || "").toLowerCase().includes((search || "").toLowerCase())
  );

  function sortTasks(list) {
    if (currentSort === "Id") {
      return list.map((t) => (
        <TaskRow key={t.id} task={t} listNames={listNames} />
      ));
    }
    if (currentSort === "Alphabetical") {
      return [...list]
        .sort((a, b) => a.name.localeCompare(b.name)) //actual sorting
        .map((t) => <TaskRow key={t.id} task={t} listNames={listNames} />);
    }
    if (currentSort === "Completed") {
      return [...list]
        .sort((a, b) => a.completed - b.completed) //actual sorting
        .map((t) => <TaskRow key={t.id} task={t} listNames={listNames} />);
    }
  }

  if (currentList === "All Lists") {
    return sortTasks(filtered);
  } else {
    return sortTasks(filtered.filter((t) => t.list === currentList));
  }
}

export default Task