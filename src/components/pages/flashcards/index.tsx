import { Button } from "@/components/ui/button";
import "../../../App.css";

import ChangeSettings from "@/components/changesettings";
import DropDown from "@/components/dropdown";
import { ArrowLeft, ArrowRight, ChevronLast } from "lucide-react";
import { toast } from "sonner";
import React, { useEffect, useRef, useState } from "react";
import { useTimer } from "../../../context/pomoindex";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { TermsContext, useTerms } from "../../../context/flashcardsindex";

import AddTask from "@/components/addtask";
import AddTerm from "@/components/addterm";
import TermRow from "../../termrow/index";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

//hover effects !
//clicking on the card !
//linking props to ui elements !
//drag and drop !
//fix id system when drag and drop + deleting !

//double clicking alot highlights stuff for some reason just disable highlighting !

//Reorder on delete !
//More UX changes !
//flip and slide animations !

//migrate data to local storage !
//arrow keys + space to activate buttons !
//if text is too long it will break the card
//Right click breaks side bar

function FlashCardComponent() {
  const { terms, setTerms } = useTerms();
  const [activeId, setActiveId] = useState(null);
  const [currentTerm, setCurrentTerm] = useState(terms[0]);

  const [animateRight, setAnimateRight] = useState(false);
  const [animateLeft, setAnimateLeft] = useState(false);
  const [flip, setFlip] = useState(false);
  const [open, setOpen] = useState(false);

  //Directions are inverted here to simulate the card direction coming in, making it look more natural
  const handleAnimate = (direction) => {
    if (direction === "left") {
      setAnimateRight(false); // remove
      requestAnimationFrame(() => {
        setAnimateRight(true); // re-add on next frame
      });
    } else {
      setAnimateLeft(false); // remove
      requestAnimationFrame(() => {
        setAnimateLeft(true); // re-add on next frame
      });
    }
  };

  const tableRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  //reordering
  const activeTerm = terms.find((t) => t.id === activeId);
  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    setTerms((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      const updated = [...prev];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      return updated.map((t, idx) => ({ ...t, order: idx + 1 }));
    });
  };

  useEffect(() => {
    setCurrentTerm(terms[0]);
  }, [terms]);

  //Detect if no terms
  useEffect(() => {
    const placeholder = [
      {
        id: 1,
        order: 1,
        term: "Add a card to get started",
        def: "Use the + button on the bottom right corner",
      },
    ];
    if (!Array.isArray(terms) || terms.length === 0) {
      localStorage.setItem("terms", JSON.stringify(placeholder));
      localStorage.setItem("hasVisited", "true");
      setTerms(placeholder); // 👈 reset terms state
      setCurrentTerm(placeholder[0]); // 👈 reset currentTerm
    } else {
      localStorage.setItem("terms", JSON.stringify(terms));
    }
  }, [terms]);

  //Keeps localstorage updated
  useEffect(() => {
    localStorage.setItem("terms", JSON.stringify(terms));
  }, [terms]);

  //space to flip
  useEffect(() => {
    const handleSpace = (e) => {
      if (open) return;
      if (e.code === "Space") {
        // check if e (event object).code is space
        e.preventDefault(); // stop page scroll
        setFlip((prev) => !prev); // toggle flip
      }
    };

    window.addEventListener("keydown", handleSpace); //Listens for keystroke, then runs "handle space"

    return () => {
      window.removeEventListener("keydown", handleSpace); //Clean up
    };
  }, [open]);

  //left right presses
  const handleLeft = () => {
    handleAnimate("left");
    setFlip(false);

    const idx = terms.findIndex((t) => t.id === currentTerm.id);
    setTimeout(() => {
      if (idx <= 0) {
        setCurrentTerm(terms[terms.length - 1]);
      } else {
        setCurrentTerm(terms[idx - 1]);
      }
    }, 125);
  };

  const handleRight = () => {
    handleAnimate("right");
    setFlip(false);

    const idx = terms.findIndex((t) => t.id === currentTerm.id);
    setTimeout(() => {
      if (idx >= terms.length - 1) {
        setCurrentTerm(terms[0]);
      } else {
        setCurrentTerm(terms[idx + 1]);
      }
    }, 125);
  };

  //Left right keypress handler
  useEffect(() => {

    const handleKeyDown = (e) => {
      if (open) return;
      if (e.code === "ArrowLeft") {
        handleLeft();
      } else if (e.code === "ArrowRight") {
        handleRight();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentTerm, terms, open]); 

  
  return (
    <div className="flex flex-col gap-4 items-center p-4 min-h-screen w-full bg-white overflow-y-visible">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 overflow-y-visible">
        The Flashcards
      </h2>

      <div className="flex flex-col">
        {/* OUTER: slide animation + reset on end */}
        <div
          className="overflow-x-hidden"
          style={{
            userSelect: "none",
            animation: animateRight
              ? "slideRight 0.25s ease"
              : animateLeft
                ? "slideLeft 0.25s ease"
                : "none",
          }}
          onAnimationEnd={() => {
            setAnimateRight(false);
            setAnimateLeft(false);
          }}
        >
          <div
            className="flex flex-col w-220 h-110 p-15  rounded-md   text-center justify-center items-center cursor-pointer"
            style={{ perspective: "1000px" }}
            onClick={() => {
              setFlip((f) => !f);
            }}
          >
            <div
              className="relative w-full h-full transition-transform duration-250 ease-in-out"
              style={{
                transformStyle: "preserve-3d",
                transform: flip ? "rotateX(180deg)" : "rotateX(0deg)",
              }}
            >
              <div
                className="absolute inset-0 flex items-center justify-center font-manrope border-4 border-black rounded-md"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div
                  className="p-2 text-center break-words overflow-y-auto flex items-center justify-center"
                  style={{
                    maxHeight: "100%",
                    wordBreak: "break-word",
                    height: "100%",
                    textAlign: "center",
                    flexDirection: "column",
                  }}
                >
                  <div>
                    <h3 className="text-3xl font-semibold">
                      {currentTerm.term}
                    </h3>
                  </div>
                </div>
              </div>

              <div
                className="absolute inset-0 flex items-center justify-center font-manrope border-4 border-black rounded-md"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateX(180deg)",
                }}
              >
                <div
                  className="p-2 text-center break-words overflow-y-auto flex items-center justify-center"
                  style={{
                    maxHeight: "100%",
                    wordBreak: "break-word",
                    height: "100%",
                    textAlign: "center",
                    flexDirection: "column",
                  }}
                >
                  <div>
                    <h3 className="text-2xl font-normal">{currentTerm.def}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-8 items-center justify-center translate-y-[-20px]">
          <div
            className="flex p-4 cursor-pointer hover:scale-110 transition-all active:scale-90  duration-150 ease-out"
            onClick={handleLeft}
          >
            <ArrowLeft
              size={50}
              className="flex cursor-pointer border-zinc-950  border-2 rounded-full p-2 "
            />
          </div>

          <div className="w-20 h-20  flex items-center justify-center cursor-pointer">
            <h4 className="text-2xl font-normal">
              {currentTerm.order}/{terms.length}
            </h4>
          </div>

          <div
            className="flex p-4 cursor-pointer hover:scale-110 transition-all active:scale-90 duration-150 ease-out"
            onClick={handleRight}
          >
            <ArrowLeft
              size={50}
              className="flex cursor-pointer border-zinc-950  border-2 rounded-full p-2 rotate-180"
            />
          </div>
        </div>
      </div>

      <Table
        ref={tableRef}
        className="table-auto w-full max-w-7xl mx-auto px-4 overflow-hidden"
      >
        <TableHeader>
          <TableRow>
            <TableHead className="w-[9%] text-left font-bold">Order</TableHead>
            <TableHead className="w-[40%] text-left font-bold">Name</TableHead>
            <TableHead className="w-[60%] text-left font-bold">
              Description
            </TableHead>
          </TableRow>
        </TableHeader>
        <DndContext
          sensors={sensors}
          onDragStart={({ active }) => setActiveId(active.id)}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <TableBody>
            <SortableContext
              items={terms.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {terms.map((term) => (
                <TermRow key={term.id} term={term} />
              ))}
            </SortableContext>
          </TableBody>

          <DragOverlay adjustScale={false}>
            {activeTerm && (
              <table
                style={{
                  width: tableRef.current?.offsetWidth,
                  tableLayout: "fixed",
                }}
              >
                <colgroup>
                  {[...tableRef.current?.querySelectorAll("thead th")].map(
                    (th, idx) => (
                      <col key={idx} style={{ width: th.offsetWidth + "px" }} />
                    )
                  )}
                </colgroup>
                <tbody>
                  <TermRow term={activeTerm} dragOverlay />
                </tbody>
              </table>
            )}
          </DragOverlay>
        </DndContext>
      </Table>

      <div className="fixed bottom-8 right-8 z-50">
        <AddTerm open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}

export default FlashCardComponent;
