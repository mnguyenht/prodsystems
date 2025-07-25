import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";



function DropDown({ status, setStatus, setTicking, }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border cursor-pointer px-2">
        <ChevronDown className="size-4" />
        <span>{status[0]}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {status.map((item) => (
          <DropdownMenuItem
            key={item}
            onClick={() => {
              // Move selected item to front

              setStatus([item, ...status.filter((s) => s !== item)]);
              setTicking(false);
            }}
            className="cursor-pointer"
          >
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropDown;
