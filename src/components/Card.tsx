import { useContext, useState } from "react";
import { DataContext } from "../DataContext";
import { produce } from "immer";
// ==================== DRAG AND DROP (added) ====================
// `useSortable` makes an element both draggable AND a drop target inside a sortable list.
// It is what lets a card be picked up, reorder itself among the cards of its column, and
// jump into another column. Note it comes from the "/sortable" sub-path of @dnd-kit/react.
import { useSortable } from "@dnd-kit/react/sortable";
// ================== END DRAG AND DROP IMPORTS ==================

export interface Task {
  id: number;
  title: string;
  description: string;
  columnId: number;
  cardIndex: number;
  columnIndex: number;
}
type EditingField = "title" | "description" | null;
function Card({ id, title, description, cardIndex, columnIndex, columnId }: Task) {
  const { setData, selectedBoardIndex } = useContext(DataContext);
  const [isEditMode, setEditMode] = useState(false);
  const [editingField, setEditingField] = useState<EditingField>(null);
  // ==================== DRAG AND DROP (added) ====================
  // Register this card as a sortable item. The hook returns:
  //  - `ref`: a function we attach to the card's outer <div> so dnd-kit knows which element to move.
  //  - `isDragging`: true while THIS card is the one being dragged (we use it to fade the card).
  // It is placed after `isEditMode` is created because we read `isEditMode` below.
  const { ref, isDragging } = useSortable({
    // A unique id for this card across the whole board. The "task-" prefix keeps it different from
    // column ids (a column and a card can both have id 1 in your data). Workspace.tsx uses the same format.
    id: `task-${id}`,
    // The card's current position inside its column (0 = top). dnd-kit uses it to calculate the new order.
    index: cardIndex,
    // The list this card belongs to. Cards with the same group sort together; when a card is dragged into
    // another column, Workspace.tsx moves it in the data, the card re-renders with the new columnId, and
    // its group changes too. It matches the column drop zone id (`column-<id>`) on purpose.
    group: `column-${columnId}`,
    // A label describing what this is; the columns' `accept: "task"` rule checks this value.
    type: "task",
    // Cards only accept other cards being dragged over them (not columns or anything else).
    accept: "task",
    // While the card's title or description is being edited, turn dragging off so the user can
    // click and select text inside the textarea without accidentally moving the card.
    disabled: isEditMode,
  });
  // ================== END DRAG AND DROP HOOK ==================

  const onDeleteTaskHandler = () => {
    setData((current) => {
      const newData = [...current];
      const newColumns = newData[selectedBoardIndex].columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== id),
          };
        }
        return column;
      });
      newData[selectedBoardIndex] = {
        ...newData[selectedBoardIndex],
        columns: newColumns,
      };
      return newData;
    });
  };
  const onEditHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const field = e.currentTarget.dataset.field;
    if (field === "title" || field === "description") {
      setEditingField(field);
    }
    setEditMode(true);
  };
  const OnBlurHandlerTitle = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setEditingField(null);
    setEditMode(false);
    if (e.target.value.trim() === title) return;

    setData((current) =>
      produce(current, (draft) => {
        draft[selectedBoardIndex].columns[columnIndex].tasks[cardIndex].title =
          e.target.value.trim();
      })
    );
  };

  const OnBlurHandlerDesc = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setEditingField(null);
    setEditMode(false);
    if (e.target.value.trim() === description) return;

    setData((current) =>
      produce(current, (draft) => {
        draft[selectedBoardIndex].columns[columnIndex].tasks[cardIndex].description =
          e.target.value.trim();
      })
    );
  };

  const OnFocusHandler = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const field = e.currentTarget.dataset.field;
    if (field === "title" || field === "description") {
      setEditingField(field);
    }
    e.target.select();
  };

  return (
    <div
      className=" group/task relative flex flex-col w-full  h-full shrink-0 bg-white rounded-md shadow-md p-4 overflow-x-auto"
      key={id}
      // DRAG AND DROP (added): attach dnd-kit's ref so this <div> is the element that gets dragged and sorted.
      ref={ref}
      // DRAG AND DROP (added): make the card half-transparent while it is being dragged, and show a "grab"
      // hand cursor (a "grabbing" hand while dragging) so the user can tell the card can be moved.
      style={{ opacity: isDragging ? 0.5 : 1, cursor: isDragging ? "grabbing" : "grab" }}
    >
      {isEditMode && editingField === "title" ? (
        <textarea
          className="text-heading-l resize-none text-left h-full w-[60%] pb-3"
          onFocus={OnFocusHandler}
          onBlur={OnBlurHandlerTitle}
          defaultValue={title}
          autoFocus
        ></textarea>
      ) : (
        <button
          onClick={onEditHandler}
          data-field="title"
          className="peer text-heading-l text-left h-full w-[60%] pb-3"
        >
          {title}
        </button>
      )}
      <button
        onClick={onDeleteTaskHandler}
        className="absolute inset-y-0 opacity-0 top-0 right-3 border-l-2 border-gray-200 text-red pl-2  group-hover/task:opacity-100"
      >
        Delete
      </button>
      {isEditMode && editingField === "description" ? (
        <textarea
          className="text-heading-l resize-none text-left h-full w-[60%] pb-3"
          autoFocus
          onBlur={OnBlurHandlerDesc}
          onFocus={OnFocusHandler}
          defaultValue={description}
        ></textarea>
      ) : (
        <button
          onClick={onEditHandler}
          data-field="description"
          className="peer text-gray-600 text-left resize-none h-full w-[60%] pb-3"
        >
          {description}
        </button>
      )}
    </div>
  );
}

export default Card;
