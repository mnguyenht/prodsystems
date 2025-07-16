import { useEffect, useState, useRef } from "react";
import "../../../App.css";
import "@fontsource/manrope";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";

import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensors,
  useSensor,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import TopBar from "@/components/topbar";
import AddTask from "@/components/addtask";
import TaskRow from "@/components/taskrow";
import Home from "@/components/home";

import { TasksContext, useTasks } from "../../../context/index"; // if you have split context
import React from "react";





function TodoListComponent() {
  const { tasks, setTasks } = useTasks();

  const [currentList, setCurrentList] = useState("All Lists");
  const [currentSort, setCurrentSort] = useState("Id");
  const [search, setSearch] = useState("");
  const [listNames, setListNames] = useState([""]);
  const [newListName, setNewListName] = useState("");

  const tableRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    })
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setTasks((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  useEffect(() => {
    const unique = Array.from(new Set(tasks.map((t) => t.list)));
    setListNames(unique);
  }, [tasks]);
  

  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
    <div className="flex flex-col gap-8 items-center p-4 min-h-screen w-full overflow-y-hidden bg-white">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">The Todo List </h2>

        <TopBar
          currentSort={currentSort}
          setCurrentSort={setCurrentSort}
          currentList={currentList}
          setCurrentList={setCurrentList}
          setSearch={setSearch}
          listNames={listNames}

          newListName={newListName}
          setNewListName={setNewListName}
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={({ active }) => setActiveId(active.id)}
          onDragEnd={(e) => {
            handleDragEnd(e);
            setActiveId(null);
          }}
          onDragCancel={() => setActiveId(null)}
        >
          <Home
            ref={tableRef}
            search={search}
            currentList={currentList}
            currentSort={currentSort}
            listNames={listNames}
          />

          <DragOverlay adjustScale={false}>
            {activeId && (
              <table
                style={{
                  width: tableRef.current?.offsetWidth,
                  tableLayout: "fixed",
                }}
              >
                <colgroup>
                  {[...tableRef.current.querySelectorAll("thead th")].map(
                    (th, idx) => (
                      <col key={idx} style={{ width: th.offsetWidth + "px" }} />
                    )
                  )}
                </colgroup>
                <tbody>
                  <TaskRow
                    task={tasks.find((t) => t.id === activeId)}
                    dragOverlay
                    listNames={undefined}
                  />
                </tbody>
              </table>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <AddTask currentList={currentList} listNames={listNames} />
      </div>
    </TasksContext.Provider>
  );
}

export default TodoListComponent;
