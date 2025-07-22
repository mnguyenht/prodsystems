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
import { TableCell, TableRow } from "@/components/ui/table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "@fontsource/manrope";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import { CircleX, Info, X } from "lucide-react";
import "../../App.css";
import { useTerms } from "../../context/flashcardsindex";
import React from "react";

function TermRow({ term, dragOverlay = false }) {
  const { terms, setTerms } = useTerms();
  const [open, setOpen] = React.useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: term.id, animateLayoutChanges: () => false });

  const style = dragOverlay
    ? {
        boxShadow: "0 8px 24px rgba(0,0,0,.25)",
        backgroundColor: "#fff",
        borderRadius: "0.5rem",
        cursor: "grabbing",
        display: "table-row",
      }
    : {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition,
        opacity: isDragging ? 0 : 1,
      };

  const removeTerm = () => {
    setTerms(prev =>
      prev
        .filter(t => t.id !== term.id)
        .map((t, i) => ({ ...t, order: i + 1 }))
    );
  };

  const RowContent = (
    <TableRow
      ref={setNodeRef}
      style={style}
      {...(!dragOverlay && attributes)}
      {...(!dragOverlay && listeners)}
      className="hover:bg-gray-100"
    >
      <TableCell className="px-5 py-2 font-normal break-words whitespace-normal">
        {term.order}
      </TableCell>

      <TableCell className="py-2 font-medium break-words whitespace-normal">
        {term.term}
      </TableCell>

      <TableCell className="py-2 break-words whitespace-normal text-left">
        {term.def}
      </TableCell>

      <TableCell className="px-4 py-2 text-right">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={e => {
            e.stopPropagation();
            removeTerm();
          }}
          onPointerDown={e => e.stopPropagation()}
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
          <ContextMenuItem
            onClick={() => setOpen(true)}
            className="cursor-pointer"
          >
            <Info className="mr-2 h-4 w-4" /> Info
          </ContextMenuItem>
          <ContextMenuItem
            onClick={removeTerm}
            className="cursor-pointer"
          >
            <CircleX className="mr-2 h-4 w-4" /> Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{term.term}</DialogTitle>
              <DialogDescription>{term.def}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default TermRow;
