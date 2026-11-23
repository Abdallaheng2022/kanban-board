import React from "react";
import { type ColumnProps } from "./components/Column";
import type { Dispatch, SetStateAction } from "react";
export interface Board {
  id: number;
  title: string;
  columns: ColumnProps[];
}

export interface DataContextType {
  data: Board[];
  setData: Dispatch<SetStateAction<Board[]>>;
  setSelectedBoardIndex: Dispatch<SetStateAction<number>>;
  selectedBoardIndex: number;
}

export const DataContext = React.createContext<DataContextType>({
  data: [],
  setData: () => {},
  setSelectedBoardIndex: () => {},
  selectedBoardIndex: 0,
});
