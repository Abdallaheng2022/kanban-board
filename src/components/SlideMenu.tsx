import clsx from "clsx";
import { useContext, useState, type Dispatch, type SetStateAction } from "react";
import { DialogPrimitive } from "./DialogPrimitive";
import boardIcon from "../assets/icon-board.svg";
import { DataContext } from "../DataContext.ts";
import AddNewBoardForm from "./AddNewBoardForm.tsx";

export interface SlideMenuProps {
  selectedBoardIndex: number;
  setBoardIndex: Dispatch<SetStateAction<number>>;
}

const boardIconImg = <img src={boardIcon} alt="board" />;
export const SlideMenu = () => {
  const [isOpen, setOpen] = useState(false);
  const { data, selectedBoardIndex, setSelectedBoardIndex } = useContext(DataContext);
  return (
    <aside className="slide-menu bg-white p-4 w-[20%] h-full! border-r border-gray-300">
      <h2>All Boards({data?.length})</h2>

      <ul>
        {data?.map((item, index) => (
          <li key={item.id}>
            <button
              className={clsx(
                "flex w-full items-center rounded-r-full gap-4 px-4 py-3 text-left font-bold text-gray-500 hover:bg-purple-100",
                selectedBoardIndex === index && "bg-purple-600 text-white! hover:bg-purple-600"
              )}
              onClick={() => setSelectedBoardIndex(index)}
            >
              {" "}
              {boardIconImg} {item.title}{" "}
            </button>
          </li>
        ))}
        <li>
          <DialogPrimitive
            title="Create New Board"
            triggerComponent={
              <button className="flex items-center  px-4 py-3  gap-4 rounded-r-full text-left font-bold text-purple-600 hover:bg-purple-100">
                {boardIconImg} + Create New Board
              </button>
            }
            isOpen={isOpen}
            setOpen={setOpen}
          >
            <div className="pt-5">
              <AddNewBoardForm toggleDialog={setOpen} />
            </div>
          </DialogPrimitive>
        </li>
      </ul>
    </aside>
  );
};
