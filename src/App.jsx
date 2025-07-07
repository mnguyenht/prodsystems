import React, { useEffect, useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster, toast } from "sonner";
import {
  Plus,
  X,
  Settings,
  ChevronLast,
  ChevronLeft,
  ChevronDown,
  Check,
  ArrowLeftRight,
  Info,
  CircleX,
  PencilLine,
  Trash,
  Search,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "@fontsource/manrope";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import {
  closestCorners,
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensors,
  useSensor,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Separator } from "@/components/ui/separator";
import { createContext, useContext } from "react";
const TasksContext = React.createContext();
const useTasks = () => React.useContext(TasksContext);

function TaskRow({ task, listNames, dragOverlay = false }) {
  const { setTasks } = useTasks();
  const [open, setOpen] = React.useState(false);
  const [moveOpen, setMoveOpen] = React.useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, animateLayoutChanges: () => false });

  const style = dragOverlay
    ? {
        boxShadow: "0 8px 24px rgba(0,0,0,.25)",
        backgroundColor: "#fff",
        borderRadius: "0.5rem",
        cursor: "grabbing",
        display: "table-row",
      }
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      };

  const toggleComplete = () => {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = () => {
    setTasks(prev => prev.filter(t => t.id !== task.id));
  };

  const moveToList = (newList) => {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, list: newList } : t));
    setMoveOpen(false);
  };

  const RowContent = (
    <TableRow
      ref={setNodeRef}
      style={style}
      {...(!dragOverlay && attributes)}
      {...(!dragOverlay && listeners)}
      className="px-4 py-2 w-full hover:bg-gray-100"
    >
      <TableCell className="px-4 py-2 w-[80px]">
        <Checkbox
          className="size-6 cursor-pointer"
          checked={task.completed}
          onCheckedChange={toggleComplete}
          onClick={e => e.stopPropagation()}
          onPointerDown={e => e.stopPropagation()}
        />
      </TableCell>
      <TableCell className={"px-4 py-2 w-[150px] font-medium break-words whitespace-normal " + (task.completed ? "line-through text-gray-400" : "")}>        {task.name}
      </TableCell>
      <TableCell className={"px-4 py-2 w-50 break-words whitespace-normal text-left " + (task.completed ? "line-through text-gray-400" : "")}>        {task.description}
      </TableCell>
      <TableCell className="px-4 py-2 w-[80px] text-right">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={e => {
            e.stopPropagation();
            removeTask();
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
          <ContextMenuItem onClick={toggleComplete} className="cursor-pointer">
            <Check /> {task.completed ? "Uncheck" : "Check"}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setMoveOpen(true)} className="cursor-pointer">
            <ArrowLeftRight /> Move To
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setOpen(true)} className="cursor-pointer">
            <Info /> Info
          </ContextMenuItem>
          <ContextMenuItem onClick={removeTask} className="cursor-pointer">
            <CircleX /> Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{task.name}</DialogTitle>
              <DialogDescription>
                <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
                  <li>{task.description}</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    Completion status = {task.completed.toString()}
                  </code>
                </p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {moveOpen && (
        <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Move Task To:</DialogTitle>
              <DialogDescription>
                <Select onValueChange={moveToList}>
                  <SelectTrigger className="w-full mt-4">
                    <SelectValue placeholder="Select a list" />
                  </SelectTrigger>
                  <SelectContent>
                    {listNames.map(name => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}


function AddTask() {
  const { setTasks } = useTasks();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const addTask = () => {
    if (!name.trim()) return;
    const newTask = { id: Date.now(), name, description, completed: false };
    setTasks((prev) => [...prev, newTask]);
    setName("");
    setDescription("");
  };

  return (
    <Dialog>
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
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>
            What do you wish to accomplish today?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Input
              type="text"
              required
              placeholder="Your Task"
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
                onClick={addTask}
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
const Home = React.forwardRef(
  ({ search, currentList, currentSort, listNames }, ref) => {
    const { tasks } = useTasks();

    return (
      <>
        <Table
          ref={ref}
          className="table-auto w-full max-w-7xl mx-auto px-4 overflow-hidden "
        >
          <TableHeader>
            <TableRow className="">
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
      </>
    );
  }
);

function TopBar({
  currentSort,
  setCurrentSort,
  currentList,
  setCurrentList,
  setSearch,
  listNames,
  newListName,
  setListNames,
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
    <div className="flex relative flex-row gap-8 w-full max-w-7xl items-center mx-auto px-4 py-1  overflow-hidden justify-between ">
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
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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

function TodoList({
  currentSort,
  setCurrentSort,
  currentList,
  setCurrentList,
  search,
  setSearch,
  listNames,
  setListNames,
  newListName,
  setNewListName,
}) {
  const { setTasks, tasks } = useTasks();
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );
  const tableRef = useRef(null);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setTasks((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4 items-center p-4 min-h-screen w-full overflow-x-hidden bg-white">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          The Todo List
        </h2>
        <TopBar
          currentSort={currentSort}
          setCurrentSort={setCurrentSort}
          currentList={currentList}
          setCurrentList={setCurrentList}
          setSearch={setSearch}
          listNames={listNames}
          setListNames={setListNames}
          newListName={newListName}
          setNewListName={setNewListName}
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={({ active }) => setActiveId(active.id)}
          onDragEnd={(e) => {
            handleDragEnd(e);
            setActiveId(null);
          }}
          onDragCancel={() => setActiveId(null)}
        >
          <Home
            ref={tableRef}
            search={search}
            currentList={currentList}
            currentSort={currentSort}
            listNames={listNames}
          />
          <DragOverlay adjustScale={false}>
            {activeId && (
              <table
                style={{
                  width: tableRef.current?.offsetWidth,
                  tableLayout: "fixed",
                }}
              >
                <colgroup>
                  {[...tableRef.current.querySelectorAll("thead th")].map(
                    (th, idx) => (
                      <col key={idx} style={{ width: th.offsetWidth + "px" }} />
                    )
                  )}
                </colgroup>
                <tbody>
                  <TaskRow
                    task={tasks.find((t) => t.id === activeId)}
                    dragOverlay
                  />
                </tbody>
              </table>
            )}
          </DragOverlay>
        </DndContext>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <AddTask search={search} setSearch={setSearch} />
      </div>
    </>
  );
}

// Pomodoro and related components (unchanged)
function ChangeSettings({
  pomodoroTime,
  setPomodoroTime,
  shortBreakTime,
  setShortBreakTime,
}) {
  const handleSave = () => {
    localStorage.setItem("pomodoroTime", pomodoroTime);
    localStorage.setItem("shortBreakTime", shortBreakTime);
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

function Timer({ seconds, minutes }) {
  return (
    <>
      {minutes - 10 < 0 ? "0" + minutes : minutes}:
      {seconds - 10 < 0 ? "0" + seconds : seconds}
    </>
  );
}

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

function Pomodoro({
  status,
  setStatus,
  seconds,
  setSeconds,
  minutes,
  setMinutes,
  ticking,
  setTicking,
  pomodoroTime,
  setPomodoroTime,
  shortBreakTime,
  setShortBreakTime,
}) {
  return (
    <>
      <ChangeSettings
        pomodoroTime={pomodoroTime}
        setPomodoroTime={setPomodoroTime}
        shortBreakTime={shortBreakTime}
        setShortBreakTime={setShortBreakTime}
      />
      <div className="flex flex-col gap-8 items-center p-4 min-h-screen w-full overflow-y-hidden bg-white ">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          The Pomodoro Timer
        </h2>

        <div className="flex flex-col items-center overflow-x-hidden bg-accent p-10 gap-10 font-manrope rounded-md">
          <h1 className="scroll-m-20 text-center text-8xl font-manrope tracking-tight text-balance">
            <Timer
              seconds={seconds}
              setSeconds={setSeconds}
              minutes={minutes}
              setMinutes={setMinutes}
              ticking={ticking}
              setTicking={setTicking}
              status={status}
              setStatus={setStatus}
            />
          </h1>
          <div className="flex flex-col items-center overflow-x-hidden bg-accent gap-4 font-manrope">
            <p className="font-manrope text-lg flex flex-row gap-1">
              Current Status:{" "}
              <DropDown
                status={status}
                setStatus={setStatus}
                setTicking={setTicking}
              />
            </p>

            <div className="flex flex-row gap-6 items-center justify-center">
              <ChevronLast className="size-10 scale-x-[-1] cursor-pointer opacity-0" />
              <Button
                className="scroll-m-20 text-center w-40 h-15 text-xl tracking-tight text-balance cursor-pointer"
                onClick={() => {
                  if (minutes === 0 && seconds === 0) {
                    toast.error("buh");
                    return 0;
                  }
                  setTicking((prev) => !prev);
                }}
              >
                {ticking ? "STOP" : "START"}
              </Button>
              <ChevronLast
                className="size-10 cursor-pointer"
                onClick={() => {
                  // Move selected item to front
                  const reordered = [status[1], status[0]];
                  setStatus(reordered);
                  setTicking(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function HeaderTabs() {
  const location = useLocation();

  const pathToTab = {
    "/": "todolist",
    "/Pomodoro": "pomodoro",
  };

  const currentTab = pathToTab[location.pathname] || "todolist";

  return (
    <div className="fixed top-4 left-4 z-50">
      <Tabs value={currentTab} className="w-[400px]">
        <TabsList>
          <Link to="/">
            <TabsTrigger value="todolist" className="cursor-pointer">
              Todolist
            </TabsTrigger>
          </Link>
          <Link to="/Pomodoro">
            <TabsTrigger value="pomodoro" className="cursor-pointer">
              Pomodoro
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </div>
  );
}

function Task({ search, currentList, currentSort, listNames }) {
  const { tasks, setTasks } = useTasks();

  const filtered = tasks.filter((t) =>
    (t.name || "").toLowerCase().includes((search || "").toLowerCase())
  );

  function sortTasks(list) {
    if (currentSort === "Id") {
      return list.map((t) => (
        <TaskRow key={t.id} task={t} listNames={listNames} />
      ));
    }
    if (currentSort === "Alphabetical") {
      return [...list]
        .sort((a, b) => a.name.localeCompare(b.name)) //actual sorting
        .map((t) => <TaskRow key={t.id} task={t} listNames={listNames} />);
    }
    if (currentSort === "Completed") {
      return [...list]
        .sort((a, b) => a.completed - b.completed) //actual sorting
        .map((t) => <TaskRow key={t.id} task={t} listNames={listNames} />);
    }
  }

  if (currentList === "All Lists") {
    return sortTasks(filtered);
  } else {
    return sortTasks(filtered.filter((t) => t.list === currentList));
  }
}

function App() {
  //TDL
  const [tasks, setTasks] = useState([
    {
      id: 1,
      list: "List 1",
      name: "Add dynamicness to tabs and also cursor pointer highlight",
      description: "",
      completed: false,
    },
    {
      id: 2,
      list: "List 1",
      name: "Make current status a dropdown menu",
      description: "turn status[0].toString() into a dropdown menu",
      completed: false,
    },
    {
      id: 3,
      list: "List 1",
      name: "Switching status after finishing one",
      description: "self explanatory",
      completed: false,
    },
    {
      id: 4,
      list: "List 2",
      name: "Arrow functionality",
      description: "switch only from pomo and short break",
      completed: false,
    },
    {
      id: 5,
      list: "List 2",
      name: "Settings",
      description: "settings tab that allwos people to modify status times",
      completed: false,
    },
  ]);
  const [currentList, setCurrentList] = useState("All Lists");
  const [currentSort, setCurrentSort] = useState("Id");
  const [search, setSearch] = useState("");

  const [listNames, setListNames] = useState([]);
  const [newListName, setNewListName] = useState("");

  //Create listNames
  useEffect(() => {
    const unique = Array.from(new Set(tasks.map((t) => t.list)));
    setListNames(unique);
  }, [tasks]);

  //POMODORO
  const [pomodoroTime, setPomodoroTime] = useState(
    () => parseInt(localStorage.getItem("pomodoroTime")) || 25
  );
  const [shortBreakTime, setShortBreakTime] = useState(
    () => parseInt(localStorage.getItem("shortBreakTime")) || 5
  );

  const [minutes, setMinutes] = useState(0);
  const [ticking, setTicking] = useState(false);
  const [status, setStatus] = useState(["Pomodoro", "Short Break"]);
  const [seconds, setSeconds] = useState(0);

  //Clock logic
  useEffect(() => {
    if (!ticking) return;

    const interval = setInterval(() => {
      //Tick down seconds
      setSeconds((prevSeconds) => {
        if (minutes === 0 && seconds === 0) {
          const reordered = [status[1], status[0]];
          setStatus(reordered);
          return 0;
        }

        if (prevSeconds === 0) {
          return 59;
        } else {
          return prevSeconds - 1;
        }
      });
      //Timer finished congats amazing also seconds == 1 because lifecycle reasons
      setMinutes((prevMinutes) => {
        return seconds === 0 && minutes !== 0 ? prevMinutes - 1 : prevMinutes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [ticking, seconds]);

  //Settings Logic
  useEffect(() => {
    setTicking(false);
    if (status[0] === "Pomodoro") {
      setMinutes(pomodoroTime);
      setSeconds(0);
    } else {
      setMinutes(shortBreakTime);
      setSeconds(0);
    }
  }, [status, pomodoroTime, shortBreakTime]);

  return (
    <>
      <Toaster position="bottom-center" />;
      <BrowserRouter>
        <HeaderTabs />
        <Routes>
          <Route
            path="/"
            element={
              <TasksContext.Provider value={{ tasks, setTasks }}>
                <TodoList
                  currentList={currentList}
                  setCurrentList={setCurrentList}
                  currentSort={currentSort}
                  setCurrentSort={setCurrentSort}
                  search={search}
                  setSearch={setSearch}
                  listNames={listNames}
                  setListNames={setListNames}
                  newListName={newListName}
                  setNewListName={setNewListName}
                />
              </TasksContext.Provider>
            }
          />

          <Route
            path="/Pomodoro"
            element={
              <Pomodoro
                status={status}
                setStatus={setStatus}
                seconds={seconds}
                setSeconds={setSeconds}
                minutes={minutes}
                setMinutes={setMinutes}
                ticking={ticking}
                setTicking={setTicking}
                pomodoroTime={pomodoroTime}
                setPomodoroTime={setPomodoroTime}
                shortBreakTime={shortBreakTime}
                setShortBreakTime={setShortBreakTime}
                className="overflow-hidden"
              />
            }
          />
          <Route path="*" element={<h2>404 Page Not Found</h2>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
