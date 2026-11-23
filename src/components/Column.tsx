import { useContext } from "react";
import Card from "./Card.tsx";
import { type Task } from "./Card.tsx";
import { DataContext } from "../DataContext.ts";
// ==================== DRAG AND DROP (added) ====================
// `useDroppable` turns an HTML element into a "drop zone": a place a dragged item can be released over.
// We need it on the column itself so a card can be dropped into a column even when that column is EMPTY
// (an empty column has no cards to hover over, so without this you could never move a card into it).
import { useDroppable } from "@dnd-kit/react";
// `CollisionPriority` is a list of named priority levels (Lowest, Low, Normal, High, Highest).
// When the pointer is over a card that sits inside a column, it is touching TWO drop targets at once:
// the card and the column. Giving the column a LOW priority tells dnd-kit "prefer the card", so cards
// still sort precisely between each other, and the column only wins when no card is under the pointer.
import { CollisionPriority } from "@dnd-kit/abstract";
// ================== END DRAG AND DROP IMPORTS ==================

export interface ColumnProps {
  id: number;
  title: string;
  tasks: Task[];
  columnindex: number;
}

function Column({ id, title, tasks, columnindex }: ColumnProps) {
  const { setData, selectedBoardIndex } = useContext(DataContext);
  // ==================== DRAG AND DROP (added) ====================
  // Register this column as a drop zone. The hook returns:
  //  - `ref`: a function we attach to the column's <div> so dnd-kit knows which element on screen is the drop zone.
  //  - `isDropTarget`: true while a dragged card is currently over this column (we use it to highlight it).
  const { ref, isDropTarget } = useDroppable({
    // A unique id for this drop zone. It MUST be exactly `column-<id>` because Workspace.tsx builds its
    // `record` with the same keys, and the `move` helper matches the drop zone id to a key in that record
    // to know which column to put the card into.
    id: `column-${id}`,
    // A label describing what kind of thing this is. Cards check this against their own `accept` rule.
    type: "column",
    // This column only accepts items whose `type` is "task" (our cards). Anything else is ignored.
    accept: "task",
    // Lower priority than the cards inside it, so hovering a card beats hovering the column (see import note).
    collisionPriority: CollisionPriority.Low,
  });
  // ================== END DRAG AND DROP HOOK ==================
  const addNewTaskHandler = () => {
    setData((current) => {
      const newData = [...current];
      newData[selectedBoardIndex] = {
        ...newData[selectedBoardIndex],
        columns: newData[selectedBoardIndex].columns.map((column) => {
          if (column.id === id) {
            return {
              ...column,
              tasks: [
                ...column.tasks,
                {
                  id: Date.now(),
                  title: "New Task",
                  description: "card description",
                  columnId: id,
                  columnIndex: columnindex,
                  cardIndex: column.tasks.length,
                },
              ],
            };
          }
          return column;
        }),
      };
      return newData;
    });
  };

  const OnDeleteColHandler = () => {
    setData((current) => {
      const newData = [...current];
      newData[selectedBoardIndex] = {
        ...newData[selectedBoardIndex],
        columns: newData[selectedBoardIndex].columns.filter((column) => column.id !== id),
      };
      return newData;
    });
  };
  return (
    <>
      <div
        className=" group/card relative flex flex-col self-start gap-5 w-70 shrink-0 h-* overflow-x-auto bg-gray-100 rounded-md shadow-md p-4"
        key={id}
        // DRAG AND DROP (added): attach dnd-kit's ref so this <div> becomes the column's drop zone on screen.
        ref={ref}
        // DRAG AND DROP (added): while a card hovers this column, draw a blue outline (#635FC7) so the user
        // sees where the card will land; otherwise `undefined` means "no outline" (the column looks as before).
        style={{ outline: isDropTarget ? "2px solid #635FC7" : undefined }}
      >
        <button
          onClick={OnDeleteColHandler}
          className="absolute inset-x-0 opacity-0   left-auto border-l-2 border-gray-200 text-red pl-2 pr-2  group-hover/card:opacity-100"
        >
          Delete
        </button>

        <h2>
          {title}({tasks.length})
        </h2>

        {tasks.map((task, index) => (
          <Card
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            columnId={id}
            cardIndex={index}
            columnIndex={columnindex}
          />
        ))}
        <button onClick={addNewTaskHandler} className="h-10 border-t-3 border-white">
          + Add New Task
        </button>
      </div>
    </>
  );
}
export default Column;
