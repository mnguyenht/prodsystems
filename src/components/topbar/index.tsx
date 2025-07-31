import React, { useState } from "react";
import { useTasks } from "@/context";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PencilLine, Plus, Search, Trash } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";

function TopBar({
  currentSort,
  setCurrentSort,
  currentList,
  setCurrentList,
  setSearch,
  listNames,
  setListNames,
}) {
  const { tasks, setTasks } = useTasks();
  const [newListName, setNewListName] = useState(""); // rename dialog
  const [openCreateList, setOpenCreateList] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { newlist: "" } });

  const removeList = (list) => {
    setTasks((prev) => prev.filter((t) => t.list !== list));
    setCurrentList("All Lists");
  };

  const renameList = () => {
    if (!newListName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (listNames.includes(newListName)) {
      toast.error("Name already exists");
      return;
    }

    const updatedTasks = tasks.map((t) =>
      t.list === currentList ? { ...t, list: newListName } : t
    );
    setTasks(updatedTasks);

    setCurrentList(newListName);
    setNewListName("");
  };

  const createList = (data) => {
    const listName = data.newlist.trim();
    if (!listName) return;

    const newTask = {
      id: Date.now(),
      list: listName,
      name: "By the way",
      description: "Lists will automatically delete themselves upon not having any tasks in them",
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);

    setListNames((prev) =>
      prev.includes(listName) ? prev : [...prev, listName]
    );

    setCurrentList(listName);
    reset();
    setOpenCreateList(false);
  };

  return (
    <div className="flex relative flex-row gap-8 w-full max-w-7xl items-center mx-auto px-4 py-1 overflow-hidden justify-between">
      <div className="flex flex-row gap-4 items-center">
        <Select
          value={currentList}
          onValueChange={(val) => setCurrentList(val)}
        >
          <SelectTrigger className="w-relative hover:border-black cursor-pointer">
            <SelectValue placeholder={currentList} />
          </SelectTrigger>
          <SelectContent>
            <div className="px-2 py-1 text-sm text-gray-500">Select a List</div>
            <Separator className="my-2 mx-auto" style={{ width: "90%" }} />
            <SelectItem key="All Lists" value="All Lists">
              All Lists
            </SelectItem>
            {listNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* create list */}
        <Dialog open={openCreateList} onOpenChange={setOpenCreateList}>
          <DialogTrigger>
            <Plus
              className="text-gray-400 hover:text-black cursor-pointer transition-colors duration-200"
              strokeWidth={1.5}
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New List:</DialogTitle>
            </DialogHeader>

            <form
              className="flex flex-col gap-4 w-full"
              onSubmit={(e) => {
                e.stopPropagation();
                handleSubmit(createList)(e);
              }}
              noValidate
            >
              <Controller
                name="newlist"
                control={control}
                rules={{ required: "List name is required" }}
                render={({ field }) => (
                  <Input
                    className="w-full"
                    type="text"
                    placeholder="List name"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.newlist && (
                <p className="text-red-500">{errors.newlist.message}</p>
              )}

              <DialogFooter>
                <div className="p-0 flex flex-row justify-between w-full">
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Create</Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* delete */}
        <Dialog>
          {currentList !== "All Lists" && (
            <DialogTrigger>
              <Trash
                className="text-gray-400 hover:text-black cursor-pointer transition-colors duration-200"
                strokeWidth={1.5}
              />
            </DialogTrigger>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This will permanently delete the list and all of its tasks.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <div className="p-0 mt-2 flex flex-row justify-between w-full">
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="destructive"
                    onClick={() => removeList(currentList)}
                  >
                    Delete
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* renaming */}
        <Dialog>
          {currentList !== "All Lists" && (
            <DialogTrigger>
              <PencilLine
                className="text-gray-400 hover:text-black cursor-pointer transition-colors duration-200"
                strokeWidth={1.5}
              />
            </DialogTrigger>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename This List:</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              autoComplete="off"
              placeholder="Awesome List 2"
              className="my-2"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />

            <DialogFooter>
              <div className="p-0 flex flex-row justify-between w-full">
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={renameList}>Update</Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* search */}
<div className="absolute left-1/2 -translate-x-1/2">
    <div className="relative">
      <Search
        size="20"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <Input
        type="text"
        autoComplete="off"
        placeholder="Search..."
        className="pl-10 w-48"
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>

      <Select value={currentSort} onValueChange={(val) => setCurrentSort(val)}>
        <SelectTrigger className="w-relative hover:border-black cursor-pointer">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <div className="px-2 py-1 text-sm text-gray-500">Sorting By:</div>
          <Separator className="my-2 mx-auto" style={{ width: "90%" }} />
          <SelectItem value="Id">Id</SelectItem>
          <SelectItem value="Alphabetical">Alphabetical</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default TopBar;
