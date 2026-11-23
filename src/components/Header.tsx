import { useContext, useState } from "react";
import { DataContext } from "../DataContext";
import { DropdownPrimitive } from "./DropdownPrimitive";

import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { DialogPrimitive } from "./DialogPrimitive";
import AddNewBoardForm from "./AddNewBoardForm";
export const Header = () => {
  const { data, setData, selectedBoardIndex } = useContext(DataContext);
  const [isOpen, setOpen] = useState(false);
  const OnEditBoardHanler = () => setOpen(true);
  const onDeleteHandler = () => {
    if (window.confirm("Do you want to delete this Board ?")) {
      setData((current) => {
        return current.toSpliced(selectedBoardIndex, 1);
      });
    }
  };
  return (
    <header className="flex items-center h-24.25 ">
      <div className="text-[50px] flex items-center w-[20%] gap-4 self-stretch font-bold border-r border-gray-300 pl-5">
        Kanban
      </div>
      <div className="justify-between text-[30px] font-semibold flex pl-5 w-[80%] h-24.25 items-center border-r border-b border-gray-300">
        <h2>Platform Launch</h2>
        <div className="pr-5">
          <DropdownPrimitive
            trigger={<DotsVerticalIcon className="font-bold h-6 w-6 " />}
            items={[
              { label: "Edit Board", onClick: OnEditBoardHanler },
              { label: "Delete Board", onClick: onDeleteHandler, disabled: false },
            ]}
          />
          <DialogPrimitive title="Edit Board" isOpen={isOpen} setOpen={setOpen}>
            <AddNewBoardForm
              boardId={data[selectedBoardIndex]?.id}
              columns={data[selectedBoardIndex]?.columns}
              title={data[selectedBoardIndex]?.title}
              toggleDialog={setOpen}
            />
          </DialogPrimitive>
        </div>
      </div>
    </header>
  );
};
