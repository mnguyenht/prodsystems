import React from "react";
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
import { Label } from "@/components/ui/label";

import { Settings } from "lucide-react";

import { toast } from "sonner";



function ChangeSettings({
  pomodoroTime,
  setPomodoroTime,
  shortBreakTime,
  setShortBreakTime,
}) {
  const handleSave = () => {
    try {
      localStorage.setItem("pomodoroTime", pomodoroTime.toString());
      localStorage.setItem("shortBreakTime", shortBreakTime.toString());

      toast.success(
        "Settings saved successfully! Changes will appear on next switch."
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="fixed bottom-4 right-4 z-50 cursor-pointer">
          <Button
            variant="outline"
            size="icon"
            className="size-12 cursor-pointer"
          >
            <Settings className="size-6" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pomodoro Settings</DialogTitle>
          <DialogDescription>
            Change your pomodoro status times
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex flex-row justify-between">
            <Label>Pomodoro</Label>
            <Input
              type="number"
              placeholder="(Minutes)"
              value={pomodoroTime}
              onChange={(e) => setPomodoroTime(parseInt(e.target.value))}
              className="w-24 text-center"
            />
          </div>
          <div className="flex flex-row justify-between">
            <Label>Short Break</Label>
            <Input
              type="number"
              placeholder="(Minutes)"
              value={shortBreakTime}
              onChange={(e) => setShortBreakTime(parseInt(e.target.value))}
              className="w-24 text-center"
            />
          </div>
        </div>
        <DialogFooter className="p-0 mt-4">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSave}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ChangeSettings;
