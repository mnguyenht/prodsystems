import React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ArrowLeftRight, Check, CircleX, Info, X } from "lucide-react";

import { useTasks } from "@/context";

import "../../App.css";

function TaskRow({ task, listNames, dragOverlay = false }) {
  const { setTasks } = useTasks();
  const [open, setOpen] = React.useState(false);
  const [moveOpen, setMoveOpen] = React.useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, animateLayoutChanges: () => false });

  const style = dragOverlay
    ? {
        boxShadow: "0 8px 24px rgba(0,0,0,.25)",
        backgroundColor: "#fff",
        borderRadius: "0.5rem",
        cursor: "grabbing",
        display: "table-row",
      }
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      };

  const toggleComplete = () => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const removeTask = () => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  };

  const moveToList = (newList) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, list: newList } : t))
    );
    setMoveOpen(false);
  };

  const RowContent = (
    <TableRow
      ref={setNodeRef}
      style={style}
      {...(!dragOverlay && attributes)}
      {...(!dragOverlay && listeners)}
      className="px-4 py-2 w-full hover:bg-gray-100"
    >
      <TableCell className="px-4 py-2 w-[80px]">
        <Checkbox
          className="size-6 cursor-pointer"
          checked={task.completed}
          onCheckedChange={toggleComplete}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        />
      </TableCell>
      <TableCell
        className={
          "px-4 py-2 w-[150px] font-medium break-words whitespace-normal " +
          (task.completed ? "line-through text-gray-400" : "")
        }
      >
        {" "}
        {task.name}
      </TableCell>
      <TableCell
        className={
          "px-4 py-2 w-50 break-words whitespace-normal text-left " +
          (task.completed ? "line-through text-gray-400" : "")
        }
      >
        {" "}
        {task.description}
      </TableCell>
      <TableCell className="px-4 py-2 w-[80px] text-right">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            removeTask();
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <X />
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{RowContent}</ContextMenuTrigger>
        <ContextMenuContent className="p-2">
          <ContextMenuItem onClick={toggleComplete} className="cursor-pointer">
            <Check /> {task.completed ? "Uncheck" : "Check"}
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => setMoveOpen(true)}
            className="cursor-pointer"
          >
            <ArrowLeftRight /> Move To
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => setOpen(true)}
            className="cursor-pointer"
          >
            <Info /> Info
          </ContextMenuItem>
          <ContextMenuItem onClick={removeTask} className="cursor-pointer">
            <CircleX /> Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{task.name}</DialogTitle>
              <DialogDescription>
                <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
                  <li>{task.description}</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    Completion status = {task.completed.toString()}
                  </code>
                </p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {moveOpen && (
        <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Move Task To:</DialogTitle>
              <DialogDescription>
                <Select onValueChange={moveToList}>
                  <SelectTrigger className="w-full mt-4">
                    <SelectValue placeholder="Select a list" />
                  </SelectTrigger>
                  <SelectContent>
                    {listNames.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default TaskRow;
