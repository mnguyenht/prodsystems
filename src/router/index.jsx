import { Toaster } from "sonner";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import HeaderTabs from "../components/headertabs/index";
import TodoList from "../pages/todolist/index";
import Pomodoro from "../pages/pomo/index";
import Flashcards from "../pages/flashcards/index";

const BrowerRouter = () => {
  return (
    <>
      <Toaster position="bottom-center" />
      <BrowserRouter>
        <HeaderTabs />
        <Routes>
          <Route path="/" element={<TodoList />} />
          <Route path="/Pomodoro" element={<Pomodoro />} />
          <Route path="/Flashcards" element={<Flashcards />} />
          <Route path="*" element={<h2>404 Page Not Found</h2>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default BrowerRouter;
