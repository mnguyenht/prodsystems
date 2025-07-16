import { Button } from "@/components/ui/button";
import "../../../App.css";

import ChangeSettings from "@/components/changesettings";
import DropDown from "@/components/dropdown";
import { ArrowLeft, ArrowRight, ChevronLast } from "lucide-react";
import { toast } from "sonner";
import React from "react";
import { useTimer } from "../../../context/pomoindex";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { TermsContext, useTerms } from "../../../context/flashcardsindex";
import Term from "@/components/term";
import AddTask from "@/components/addtask";
import AddTerm from "@/components/addterm";


//hover effects
//clicking on the card
//linking props to ui elements
//drag and drop
//fix id system when drag and drop + deleting


//double clicking alot highlights stuff for some reason
//flip and slide animations
//arrow keys + space to activate buttons
//migrate data to local storage


//extra: input field to go to card id



function FlashCardComponent() {
  const { terms, setTerms } = useTerms();

  const row = []


  console.log(terms)

  return (
    <div className="flex flex-col gap-12 items-center p-4 min-h-screen w-full bg-white">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ">
        The Flashcards
      </h2>


      <div className="flex flex-col gap-2">
     <div className="flex flex-col w-200 h-100 overflow-x-hidden font-manrope rounded-md border-4 border-black text-center justify-center items-center ">

          <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight p-20">
            How to find total electrons in x orbital
          </h3>



        </div>
        <div className="flex flex-row gap-8 items-center justify-center">
          <div className="flex p-4 cursor-pointer">
            <ArrowLeft size={50} className="flex cursor-pointer border-zinc-950  border-2 rounded-full p-2" />
          </div>
          <h4 className="scroll-m-20 text-2xl font-normal ">
            200/200
          </h4>
          <div className="flex p-4 cursor-pointer">
            <ArrowLeft size={50} className="flex cursor-pointer border-zinc-950  border-2 rounded-full p-2 rotate-180" />
          </div>
        </div>
      </div>






      <Table
        
        className="table-auto w-full max-w-7xl mx-auto px-4 overflow-hidden"
      >
        <TableHeader>
          <TableRow>
            <TableHead className="w-[9%] relative px-4 py-2 text-left font-bold">
              Id

            </TableHead>


            <TableHead className="w-[40%] relative px-4 py-2 text-left font-bold">
              Name

            </TableHead>

            <TableHead className="w-[60%] relative px-4 py-2 text-left font-bold">
              Description
              <Separator
                aria-orientation="vertical"
                className="absolute inset-y-0 right-0"
              />
            </TableHead>


          </TableRow>
        </TableHeader>

        <TableBody>
          <SortableContext
            items={terms.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {terms.map(term => (
              <Term key={term.id} term={term} />
            ))}
          </SortableContext>

        </TableBody>
      </Table>

      <div className="fixed bottom-8 right-8 z-50">
        <AddTerm />
      </div>
    </ div>
  );
}

export default FlashCardComponent;
