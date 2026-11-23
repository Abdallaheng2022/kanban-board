import { Button } from "./Button";
import { TextField } from "./TextField";
import { useContext, useState, type Dispatch, type SetStateAction } from "react";
import iconCross from "../assets/icon-cross.svg";
import type { ColumnProps } from "./Column";
import { DataContext } from "../DataContext";
import type { Board } from "../DataContext";
export interface newBoardProp {
  boardId?: number;
  toggleDialog: Dispatch<SetStateAction<boolean>>;
  title?: string;
  columns?: ColumnProps[];
}

function AddNewBoardForm({
  boardId,
  title,
  columns = [{ id: 879650, title: "", tasks: [], columnindex: 0 }],
  toggleDialog,
}: newBoardProp) {
  const { setData, setSelectedBoardIndex } = useContext(DataContext);
  function removeColumnHandler(id: number) {
    setColumnsArray((prev) => prev.filter((column) => id !== column.id));
  }
  const [columnsArray, setColumnsArray] = useState<ColumnProps[]>(() => columns);
  function addNewColumnHandler() {
    setColumnsArray((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: prev[0].title,
        tasks: prev[0].tasks,
        columnindex: prev.length,
      },
    ]);
  }
  function createNewColumnsArray(
    allDataColumns: FormDataEntryValue[],
    columnsArray: ColumnProps[],
    boardId: number | undefined
  ) {
    return columnsArray.map((column, index) => {
      const taskArray = boardId ? column.tasks : [];
      return {
        id: column.id,
        title: String(allDataColumns[index] ?? ""),
        tasks: taskArray,
        columnindex: index,
      };
    });
  }
  function updateData(
    boardId: number | undefined,
    boardName: string,
    newColumnsArray: ColumnProps[],
    setData: Dispatch<SetStateAction<Board[]>>
  ) {
    setData((prev) => {
      if (boardId) {
        return prev.map((item) => {
          if (boardId == item.id) {
            return {
              ...item,
              title: boardName,
              columns: newColumnsArray,
            };
          }
          return item;
        });
      } else {
        setSelectedBoardIndex(prev.length);
        return [
          ...prev!,
          {
            id: Date.now(),
            title: boardName!,
            columns: newColumnsArray,
          },
        ];
      }
    });
  }
  function OnSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    //create new column Array
    const boardName = formData.get("boardname")?.toString();
    const allDataColumns = formData.getAll("name");
    /**
     * form data comes from the form
     * Columns Array to add new data
     * boardId
     *
     */
    const newColumnsArray = createNewColumnsArray(allDataColumns, columnsArray, boardId);
    //Update this data on the screen through DataContext
    console.log({ newColumnsArray });
    //updateData(newColumnsArray,board,setData)
    updateData(boardId, boardName ?? "", newColumnsArray, setData);
    toggleDialog(false);
  }

  return (
    <form className="flex flex-col gap-5" name="name" onSubmit={OnSubmitHandler}>
      <label>Name</label>
      <TextField name="boardname" placeholder="e.g. Web Design" defaultValue={title} />
      <label>Columns</label>
      {columnsArray.map((obj) => (
        <div className="flex flex-row gap-3">
          <TextField defaultValue={obj.title} name="name" key={obj.id} placeholder="e.g. Todo" />
          <button type="button" onClick={() => removeColumnHandler(obj.id)}>
            <img src={iconCross} />
          </button>
        </div>
      ))}
      <Button type="button" variant="secondary" size="lg" isFullWidth onClick={addNewColumnHandler}>
        + Add New Column
      </Button>
      <Button type="submit" variant="primary" size="lg" isFullWidth>
        {boardId ? "Updata" : "Create"} New Board
      </Button>
    </form>
  );
}

export default AddNewBoardForm;
