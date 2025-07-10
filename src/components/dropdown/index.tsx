import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "@fontsource/manrope";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import {
    ChevronDown
} from "lucide-react";

import "../../App.css";
import React from "react";


function DropDown({ status, setStatus, setTicking }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border cursor-pointer px-2">
        <ChevronDown className="size-4" />
        <span>{status[0]}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {status.map((item, index) => (
          <DropdownMenuItem
            key={item}
            onClick={() => {
              // Move selected item to front

              const reordered = [item, ...status.filter((s) => s !== item)];
              setStatus(reordered);
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