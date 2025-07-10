import { useTasks } from "@/context";

import { PencilLine, Search, Trash } from "lucide-react";

import React from "react";
import { toast } from "sonner";
import "../../App.css";
import { Button } from "../ui/button";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import "@fontsource/manrope";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";




function TopBar({
  currentSort,
  setCurrentSort,
  currentList,
  setCurrentList,
  setSearch,
  listNames,
  newListName,
  setNewListName,
}) {
  const { tasks, setTasks } = useTasks();

  const removeList = (list) => {
    setTasks((prev) => prev.filter((t) => t.list !== list));
    setCurrentList("All Lists");
  };
  
  const renderLists = () => {
    return listNames.map((name) => (
      <SelectItem key={name} value={name}>
        {name}
      </SelectItem>
    ));
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

  return (
   <div className="flex relative flex-row gap-8 w-full max-w-7xl items-center mx-auto px-4 py-1 overflow-hidden justify-between">

      <div className="flex flex-row gap-4 items-center">
        <Select
          value={currentList}
          onValueChange={(val) => {
            setCurrentList(val);
            console.log("Current list:", val);
          }}
        >
          <SelectTrigger className="w-relative hover:border-black cursor-pointer">
            <SelectValue
              placeholder={currentList}
              className="hover:border-b-2 border-b-transparent"
            />
          </SelectTrigger>
          <SelectContent>
            <div className="px-2 py-1 text-sm text-gray-500">Select a List</div>
            <Separator className="my-2 mx-auto" style={{ width: "90%" }} />
            <SelectItem key="All Lists" value="All Lists">
              All Lists
            </SelectItem>
            {renderLists()}
          </SelectContent>
        </Select>
        <Dialog>
          {/* only render trash icon if its not all lists */}
          {currentList === "All Lists" ? null : (
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
                This action cannot be undone. This will permanently delete the
                list and all of its tasks.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <div className="p-0 mt-2 flex flex-row justify-between w-full">
                <DialogClose asChild>
                  <Button
                    variant="secondary"
                    className="hover:background-black cursor-pointer transition-colors duration-200"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => removeList(currentList)}
                  >
                    Delete
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger>
            {currentList === "All Lists" ? null : (
              <PencilLine
                className="text-gray-400 hover:text-black cursor-pointer transition-colors duration-200"
                strokeWidth={1.5}
              />
            )}
          </DialogTrigger>
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
                  <Button
                    variant="secondary"
                    className="hover:background-black cursor-pointer transition-colors duration-200"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button className="cursor-pointer" onClick={renameList}>
                    Update
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
            onChange={(val) => {
              setSearch(val.target.value);
              console.log("Current Search:", val);
            }}
          />
        </div>


      <Select
        value={currentSort}
        onValueChange={(val) => {
          setCurrentSort(val);
          console.log("Current Sort:", val);
        }}
      >
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

export default TopBar