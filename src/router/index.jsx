import { Toaster } from "sonner";

import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";

import "@fontsource/manrope";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import HeaderTabs from "../components/headertabs/index";
import TodoList from "../pages/todolist/index";
import Pomodoro from "../pages/pomo/index";

const BrowerRouter = () => {
  // Other:
  // create-browser-router
  // https://reactrouter.com/en/main/routers/create-browser-router

  return (
    <>
      <Toaster position="bottom-center" />;
      <BrowserRouter>
        <HeaderTabs />
        <Routes>
          <Route path="/" element={<TodoList />} />

          <Route
            path="/Pomodoro"
            element={
              <Pomodoro

              />
            }
          />
          <Route path="*" element={<h2>404 Page Not Found</h2>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default BrowerRouter;
