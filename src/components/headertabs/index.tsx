import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "@fontsource/manrope";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";

import { Link, useLocation } from "react-router-dom";
import "./../../App.css";
import React from "react";

function HeaderTabs() {
  const location = useLocation();

  const pathToTab = {
    "/": "todolist",
    "/Pomodoro": "pomodoro",
        "/Flashcards": "flashcards",
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
          <Link to="/Flashcards">
            <TabsTrigger value="flashcards" className="cursor-pointer">
              Flashcards
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </div>
  );
}

export default HeaderTabs;
