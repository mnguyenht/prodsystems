import React from "react";
import { Link, useLocation } from "react-router-dom";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import "./../../App.css";

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
