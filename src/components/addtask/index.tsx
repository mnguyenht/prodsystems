import React, { useState } from "react";
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
import { Plus } from "lucide-react";

import { useTasks } from "@/context";

import { Controller, useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";

function AddTask({ currentList, listNames }) {
  const [open, setOpen] = useState(false);
  const { setTasks } = useTasks();
  const [description, setDescription] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { taskname: "" } });

  const onSubmit = (data) => {
    const listToUse = currentList === "All Lists" ? listNames[0] : currentList;

    const newTask = {
      id: Date.now(),
      list: listToUse,
      name: data.taskname,
      description,
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    reset();
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-12 cursor-pointer"
        >
          <Plus className="size-6" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md flex-col">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>
            What do you wish to accomplish today?
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex  gap-4 flex-col w-full"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <div className="flex flex-col w-full gap-2">
              <Controller
                name="taskname"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    className="w-full"
                    type="text"
                    placeholder="Your Task"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              {errors.taskname && (
                <p className="text-red-500">* This Field is Required</p>
              )}

              <Textarea
                className="w-full"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex w-full justify-end">
            <div className="flex w-full flex-row items-end  justify-end gap-4 ">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    reset();
                    setDescription("");
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" className="cursor-pointer">
                Save
              </Button>

            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddTask;
