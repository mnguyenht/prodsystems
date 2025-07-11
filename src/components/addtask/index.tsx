
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Plus,
} from "lucide-react";


import "../../App.css";

import { useTasks } from "@/context";
import React from "react";

function AddTask({currentList, listNames}) {
  const { setTasks } = useTasks();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

const addTask = () => {
  if (!name.trim()) return;

  const listToUse =
    currentList === "All Lists" ? listNames[0] : currentList;

  const newTask = {
    id: Date.now(),
    list: listToUse,
    name,
    description,
    completed: false,
  };

  setTasks((prev) => [...prev, newTask]);
  setName("");
  setDescription("");
};


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-12 cursor-pointer"
        >
          <Plus className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>
            What do you wish to accomplish today?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Input
              type="text"
              required
              placeholder="Your Task"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="text"
              required
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="p-0">
          <div className="flex w-full justify-between items-center">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setName("");
                  setDescription("");
                }}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="button"
                onClick={addTask}
                className="cursor-pointer"
              >
                Save
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddTask