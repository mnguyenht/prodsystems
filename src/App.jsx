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

function TaskRow({ task, setTasks, dragOverlay = false }) {
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
        backgroundColor: "#ffffff",
        borderRadius: "0.5rem",
        cursor: "grabbing",
        display: "table-row",
      }
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      };

  const toggleComplete = (checked) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: checked } : t))
    );

  const removeTask = () =>
    setTasks((prev) => prev.filter((t) => t.id !== task.id));

  const RowContent = (
    <TableRow
      ref={setNodeRef}
      style={style}
      {...(!dragOverlay && attributes)}
      {...(!dragOverlay && listeners)}
    >
      <TableCell className="w-[80px] truncate">
        <Checkbox
          className="size-6 cursor-pointer"
          checked={task.completed}
          onCheckedChange={toggleComplete}
          onClick={(e) => e.stopPropagation()}
        />
      </TableCell>

      <TableCell
        className={`w-[150px] truncate font-medium ${
          task.completed ? "line-through text-gray-400" : ""
        }`}
      >
        {task.name}
      </TableCell>

      <TableCell
        className={`w-50 whitespace-nowrap overflow-hidden text-ellipsis break-words text-left ${
          task.completed ? "line-through text-gray-400" : ""
        }`}
      >
        {task.description}
      </TableCell>

      <TableCell className="w-[80px] text-right">
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            removeTask();
          }}
        >
          <X />
        </Button>
      </TableCell>
    </TableRow>
  );

  if (dragOverlay) return RowContent;

  // ✅ Wrap RowContent in ContextMenu
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{RowContent}</ContextMenuTrigger>
      <ContextMenuContent className="p-2">
        <ContextMenuItem>
          <Check />
          Check
        </ContextMenuItem>
        <ContextMenuItem>
          <ArrowLeftRight />
          Move To
        </ContextMenuItem>
        <ContextMenuItem>
          <Info />
          Info
        </ContextMenuItem>
        <ContextMenuItem>
          <CircleX />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

const Task = ({ tasks, setTasks }) =>
  tasks.map((t) => <TaskRow key={t.id} task={t} setTasks={setTasks} />);

function AddTask({ tasks, setTasks }) {
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
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" onClick={addTask}>
                Save
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const Home = React.forwardRef(({ tasks, setTasks }, ref) => (
  <Table
    ref={ref}
    className="table-auto w-full max-w-7xl mx-auto px-4 overflow-hidden"
  >
    <TableHeader>
      <TableRow>
        <TableHead className="w-[80px]">Completed</TableHead>
        <TableHead className="w-[150px]">Name</TableHead>
        <TableHead className="w-[50ch]">Description</TableHead>
        <TableHead className="w-[80px] text-right">Delete</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <Task tasks={tasks} setTasks={setTasks} />
      </SortableContext>
    </TableBody>
  </Table>
));

function TodoList({ tasks, setTasks }) {
  const [currentList, setCurrentList] = useState("List1");
  const [currentSort, setCurrentSort] = useState("Id");
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
          <div className="flex flex-row gap-8 w-full max-w-7xl items-center mx-auto px-4  overflow-hidden justify-between ">
            <div className="flex flex-row gap-4 items-center">
              <Select value={currentList} onValueChange={setCurrentList}>
                <SelectTrigger className="w-relative hover:border-black cursor-pointer">
                  <SelectValue
                    placeholder={currentList}
                    className="hover:border-b-2 border-b-transparent"
                  />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1 text-sm text-gray-500">
                    Select a List
                  </div>
                  <Separator
                    className="my-2 mx-auto"
                    style={{ width: "90%" }}
                  />
                  <SelectItem value="List1">List 1</SelectItem>
                  <SelectItem value="List2">List 2</SelectItem>
                  <SelectItem value="List3">List 3</SelectItem>
                </SelectContent>
              </Select>
              <Trash
                className="text-gray-400 hover:text-black cursor-pointer transition-colors duration-200"
                strokeWidth={1.5}
              />

              <PencilLine
                className="text-gray-400 hover:text-black cursor-pointer transition-colors duration-200"
                strokeWidth={1.5}
              />
            </div>
            <Select value={currentSort} onValueChange={setCurrentSort}>
              <SelectTrigger className="w-relative hover:border-black cursor-pointer">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1 text-sm text-gray-500">
                  Sorting By:
                </div>
                <Separator className="my-2 mx-auto" style={{ width: "90%" }} />
                <SelectItem value="Id">Id</SelectItem>
                <SelectItem value="Alphabetical">Alphabetical</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Home ref={tableRef} tasks={tasks} setTasks={setTasks} />
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
                    setTasks={setTasks}
                    dragOverlay
                  />
                </tbody>
              </table>
            )}
          </DragOverlay>
        </DndContext>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <AddTask tasks={tasks} setTasks={setTasks} />
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

function App() {
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

  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Add dynamicness to tabs and also cursor pointer highlight",
      description: "",
      completed: false,
    },
    {
      id: 2,
      name: "Make current status a dropdown menu",
      description: "turn status[0].toString() into a dropdown menu",
      completed: false,
    },
    {
      id: 3,
      name: "Switching status after finishing one",
      description: "self explanatory",
      completed: false,
    },
    {
      id: 4,
      name: "Arrow functionality",
      description: "switch only from pomo and short break",
      completed: false,
    },
    {
      id: 5,
      name: "Settings",
      description: "settings tab that allwos people to modify status times",
      completed: false,
    },
  ]);

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
              <TodoList
                tasks={tasks}
                setTasks={setTasks}
                className="overflow-hidden"
              />
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
