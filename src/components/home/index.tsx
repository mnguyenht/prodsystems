import React from "react";
import { forwardRef } from "react";
import { useTasks } from "@/context";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Task from "../taskrenderer";



type HomeProps = {
  search: string;
  currentList: string;
  currentSort: string;
  listNames: string[];
};

const Home = forwardRef<HTMLTableElement, HomeProps>(function Home(
  { search, currentList, currentSort, listNames },
  ref
) {
  const { tasks } = useTasks();

  return (
    <Table
      ref={ref}
      className="table-auto w-full max-w-7xl mx-auto px-4 overflow-hidden"
    >
      <TableHeader>
        <TableRow>
          <TableHead className="w-[5%] relative px-4 py-2 text-left">
            Completed
            <Separator
              orientation="vertical"
              className="absolute inset-y-0 right-0"
            />
          </TableHead>

          <TableHead className="w-[25%] relative px-4 py-2 text-left">
            Name
            <Separator
              orientation="vertical"
              className="absolute inset-y-0 right-0"
            />
          </TableHead>

          <TableHead className="w-[25%] relative px-4 py-2 text-left">
            Description
            <Separator
              orientation="vertical"
              className="absolute inset-y-0 right-0"
            />
          </TableHead>

          <TableHead className="w-[2%] relative px-4 py-2 text-right">
            Delete
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <Task
            search={search}
            currentList={currentList}
            currentSort={currentSort}
            listNames={listNames}
          />
        </SortableContext>
      </TableBody>
    </Table>
  );
});

export default Home;
