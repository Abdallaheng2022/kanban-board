import "./App.css";
import { Header } from "./components/Header.tsx";
import { SlideMenu } from "./components/SlideMenu.tsx";
import Workspace from "./components/Workspace.tsx";
import { useEffect, useState } from "react";
import { DataContext, type Board } from "./DataContext.ts";
function App() {
  const [selectedBoardIndex, setSelectedBoardIndex] = useState(0);
  const [dataState, setDataState] = useState<Board[]>(() => {
    const savedData = localStorage.getItem("data");
    if (!savedData) return [];
    try {
      return JSON.parse(savedData) as Board[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(dataState));
  }, [dataState]);
  return (
    <DataContext.Provider
      value={{
        data: dataState!,
        setData: setDataState,
        setSelectedBoardIndex,
        selectedBoardIndex,
      }}
    >
      <div className="flex flex-col w-full h-screen">
        <Header />
        <div className="flex flex-1">
          <SlideMenu />
          <Workspace />
        </div>
      </div>
    </DataContext.Provider>
  );
}

export default App;
