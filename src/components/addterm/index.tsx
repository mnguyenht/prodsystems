
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

import { useTerms } from "../../context/flashcardsindex";
import React from "react";

function AddTerm({ open, setOpen }) {
  const { setTerms } = useTerms();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
 


  const addTerm = () => {
    if (!name.trim()) return;

    setTerms((prev) => {
      const newTerm = {
        id: Date.now(),
        order: prev.length + 1,
        term: name,
        def: description,
      };
      return [...prev, newTerm];
    });

    setName("");
    setDescription("");
  };
if (open) {
  console.log("Still in the menu!");
} if (!open) {
  console.log("Not in the menu!");
}



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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Term</DialogTitle>
          <DialogDescription>
            What do you want to learn?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Input
              type="text"
              required
              placeholder="Your Term"
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
                onClick={addTerm}
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

export default AddTerm