import React from "react";
import { useTasks } from "@/context";
import TaskRow from "../taskrow";
import "../../App.css";

function TaskRenderer({ search, currentList, currentSort, listNames }) {
  const { tasks, setTasks } = useTasks();

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

  const filtered = tasks.filter((t) =>
    (t.name || "").toLowerCase().includes((search || "").toLowerCase())
  );

  if (currentList === "All Lists") {
    return sortTasks(filtered);
  } else {
    return sortTasks(filtered.filter((t) => t.list === currentList));
  }
}

export default TaskRenderer;
