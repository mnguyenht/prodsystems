import { Button } from "@/components/ui/button";
import "../../../App.css";

import ChangeSettings from "@/components/changesettings";
import DropDown from "@/components/dropdown";
import { ArrowLeft, ArrowRight, ChevronLast } from "lucide-react";
import { toast } from "sonner";
import React, { useEffect, useRef, useState } from "react";
import { useTimer } from "../../../context/pomoindex";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { TermsContext, useTerms } from "../../../context/flashcardsindex";

import AddTask from "@/components/addtask";
import AddTerm from "@/components/addterm";
import TermRow from './../../term/index';
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";


//hover effects !
//clicking on the card !
//linking props to ui elements !
//drag and drop !
//fix id system when drag and drop + deleting !


//double clicking alot highlights stuff for some reason just disable highlighting !


//flip and slide animations
//arrow keys + space to activate buttons
//migrate data to local storage





function FlashCardComponent() {
  const { terms, setTerms } = useTerms();
  const [activeId, setActiveId] = useState(null);
  const [currentTerm, setCurrentTerm] = useState(terms[0]);
  const [cardStatus, setCardStatus] = useState("term");


  const tableRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const activeTerm = terms.find(t => t.id === activeId);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    setTerms(prev => {
      const oldIndex = prev.findIndex(t => t.id === active.id);
      const newIndex = prev.findIndex(t => t.id === over.id);
      const updated = [...prev];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);

      // recompute order
      return updated.map((t, idx) => ({ ...t, order: idx + 1 }));
    });
  };

  useEffect(() => {
    setCurrentTerm(terms[0])
  }, [terms])



  console.log(terms)

  return (
    <div className="flex flex-col gap-12 items-center p-4 min-h-screen w-full bg-white">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ">
        The Flashcards
      </h2>


      <div className="flex flex-col gap-2">
        <div className="flex flex-col w-200 h-100 overflow-x-hidden font-manrope rounded-md border-4 border-black text-center justify-center items-center cursor-pointer" style={{ userSelect: "none" }} onClick={() => {
          if (window.getSelection()?.toString()) {
            console.log("highlighted instead");
          toast.error("Try ctrl+f to find it in the table instead if you wanna highlight it 👍");
          }

          if (cardStatus === "term") {
            setCardStatus("def");
          } else {
            setCardStatus("term");
          }

        }}>
          <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight p-20" >
            {currentTerm[cardStatus]}
      
          </h3>
        </div>



        <div className="flex flex-row gap-8 items-center justify-center">
          <div className="flex p-4 cursor-pointer hover:scale-110 transition-all active:scale-90  duration-150 ease-out" onClick={() => {
            const idx = terms.findIndex(t => t.id === currentTerm.id);
            if (idx <= 0) {
              setCurrentTerm(terms[terms.length - 1]);
            } else {
              setCurrentTerm(terms[idx - 1]);
            }
          }}>
            <ArrowLeft size={50} className="flex cursor-pointer border-zinc-950  border-2 rounded-full p-2 " />
          </div>
          <h4 className="scroll-m-20 text-2xl font-normal ">
            {currentTerm.order}/{Object.keys(terms).length}
          </h4>
          <div className="flex p-4 cursor-pointer hover:scale-110 transition-all active:scale-90 duration-150 ease-out" onClick={() => {
            const idx = terms.findIndex(t => t.id === currentTerm.id);
            if (idx >= terms.length - 1) {
              setCurrentTerm(terms[0]);
            } else {
              setCurrentTerm(terms[idx + 1]);
            }
          }}
          >
            <ArrowLeft size={50} className="flex cursor-pointer border-zinc-950  border-2 rounded-full p-2 rotate-180" />
          </div>
        </div>
      </div>






      <Table ref={tableRef} className="table-auto w-full max-w-7xl mx-auto px-4 overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[9%] text-left font-bold">Order</TableHead>
            <TableHead className="w-[40%] text-left font-bold">Name</TableHead>
            <TableHead className="w-[60%] text-left font-bold">Description</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <DndContext
            sensors={sensors}
            onDragStart={({ active }) => setActiveId(active.id)}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveId(null)}
          >
            <SortableContext items={terms.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {terms.map(term => (
                <TermRow key={term.id} term={term} />
              ))}
            </SortableContext>

            <DragOverlay adjustScale={false}>
              {activeTerm && (
                <table style={{ width: tableRef.current?.offsetWidth, tableLayout: "fixed" }}>
                  <colgroup>
                    {[...tableRef.current.querySelectorAll("thead th")].map((th, idx) => (
                      <col key={idx} style={{ width: th.offsetWidth + "px" }} />
                    ))}
                  </colgroup>
                  <tbody>
                    <TermRow term={activeTerm} dragOverlay />
                  </tbody>
                </table>
              )}
            </DragOverlay>
          </DndContext>
        </TableBody>
      </Table>

      <div className="fixed bottom-8 right-8 z-50">
        <AddTerm />
      </div>
    </ div>
  );
}

export default FlashCardComponent;
