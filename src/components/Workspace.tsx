import { useContext } from "react";
import Column from "./Column.tsx";
import { DataContext } from "../DataContext.ts";
// ==================== DRAG AND DROP (added) ====================
// `useRef` is a React hook that gives us a "box" (an object with a `.current` property)
// that keeps its value between renders WITHOUT causing a re-render when it changes.
// We use it to remember a copy of the board data from the moment a drag starts,
// so we can put everything back if the user cancels the drag (e.g. presses Escape).
// It is imported on its own line so your original `import { useContext }` line stays untouched.
import { useRef } from "react";
// `DragDropProvider` is the top-level dnd-kit component. Every draggable card and every
// droppable column must be rendered INSIDE it, because it creates the "drag and drop manager"
// that tracks the pointer, detects what you are hovering over, and fires the drag events
// (onDragStart, onDragOver, onDragEnd) that we listen to below.
import { DragDropProvider } from "@dnd-kit/react";
// `move` is a small helper from dnd-kit. You give it your items (here: an object whose keys are
// column ids and whose values are arrays of card ids) plus the current drag event, and it returns
// a NEW object with the dragged card moved to its new position — inside the same column OR into
// a different column. It never mutates the object you pass in, and if nothing needs to move
// it returns the exact same object back (we use that fact below to skip useless updates).
import { move } from "@dnd-kit/helpers";
// We import the `Task` type only for TypeScript (the word `type` means this import disappears
// from the final JavaScript). We need it to describe the lookup table of cards we build below.
import type { Task } from "./Card.tsx";
// ================== END DRAG AND DROP IMPORTS ==================

function WorkSpace() {
  const { data, setData, selectedBoardIndex } = useContext(DataContext);
  const columns = data[selectedBoardIndex]?.columns;
  // ==================== DRAG AND DROP (added) ====================
  // Create the "box" that will hold a snapshot of ALL boards taken when a drag begins.
  // We start it with the current data so it is never empty. Changing `previousData.current`
  // later does not re-render the component — it is just a quiet place to store a value.
  const previousData = useRef(data);

  // This function runs every time the dragged card passes over another card or over a column.
  // dnd-kit hands us the `event`; its type is inferred automatically from DragDropProvider,
  // so here we describe it with `Parameters<typeof move>[1]`, which literally means
  // "whatever type the second argument of `move` is" — that is exactly a drag-over event.
  const onDragOverHandler = (event: Parameters<typeof move>[1]) => {
    // We update the data with the "function" form of setData. React passes us the latest
    // value (`current`), which avoids bugs when several updates happen quickly while dragging.
    setData((current) => {
      // Grab the board the user is currently looking at (the one selected in the side menu).
      const board = current[selectedBoardIndex];
      // Safety check: if there is no board (e.g. the user has not created any yet), change nothing.
      if (!board) return current;
      // `record` will look like { "column-1": ["task-1", "task-2"], "column-2": ["task-3"] }.
      // This is the shape the `move` helper understands: one key per column, one array of card ids per column.
      // We add the "column-" / "task-" prefixes because in your data a column and a card can share the
      // same number (column id 1 and task id 1 both exist), and dnd-kit needs every id to be unique.
      const record: Record<string, string[]> = {};
      // `tasksById` is a lookup table: { "task-1": {full task object}, ... }.
      // `move` only shuffles the id strings around, so afterwards we use this table to turn
      // each id back into the real task object (with its title, description, etc.).
      const tasksById: Record<string, Task> = {};
      // Walk through every column of the current board to fill `record` and `tasksById`.
      board.columns.forEach((column) => {
        // For this column, build its array of card ids, in the order they are shown on screen.
        record[`column-${column.id}`] = column.tasks.map((task) => {
          // Remember the full task object under its prefixed id so we can find it again later.
          tasksById[`task-${task.id}`] = task;
          // Return the prefixed id; `map` collects these into the array for this column.
          return `task-${task.id}`;
        });
      });
      // Ask dnd-kit to move the dragged card based on where the pointer is right now.
      // It figures out the source card, the card/column under the pointer, and the new index.
      const moved = move(record, event);
      // If `move` gave back the very same object, nothing changed position, so we return the
      // old data untouched. Returning the same value tells React "no update needed" (no re-render).
      if (moved === record) return current;
      // Make a shallow copy of the boards array — React state must never be changed in place.
      const newData = [...current];
      // Replace only the selected board with an updated copy of it.
      newData[selectedBoardIndex] = {
        // Keep every other property of the board (id, title) exactly as it was.
        ...board,
        // Rebuild the columns array, keeping the columns in their original order.
        columns: board.columns.map((column, columnIndex) => ({
          // Keep the column's own properties (id, title, columnindex) as they were.
          ...column,
          // Replace its tasks with the new order that `move` calculated for this column.
          tasks: moved[`column-${column.id}`].map((taskKey, cardIndex) => ({
            // Turn the id string back into the real task object (title, description, id...).
            ...tasksById[taskKey],
            // The card may now live in a different column, so store the column it belongs to now.
            columnId: column.id,
            // Store the position of that column on the board (0 = first column).
            columnIndex: columnIndex,
            // Store the card's new position inside its column (0 = top card).
            cardIndex: cardIndex,
          })),
        })),
      };
      // Hand the updated boards back to React; this triggers a re-render with the new card order.
      return newData;
    });
  };
  // ================== END DRAG AND DROP LOGIC ==================
  const addNewColumnHandler = () => {
    setData((current) => {
      const newData = [...current];
      newData[selectedBoardIndex] = {
        ...newData[selectedBoardIndex],
        columns: [
          ...newData[selectedBoardIndex].columns,
          {
            id: Date.now(),
            title: `New Column(${newData[selectedBoardIndex].columns.length})`,
            columnindex: newData[selectedBoardIndex].columns.length,
            tasks: [],
          },
        ],
      };
      return newData;
    });
  };
  return (
    <>
      {/* DRAG AND DROP (added): wrap the whole board in DragDropProvider so every Card (draggable)
          and every Column (drop zone) inside it can talk to the same drag-and-drop manager. */}
      <DragDropProvider
        // onDragStart fires once, the moment the user picks a card up.
        // We save a snapshot of the current data so a cancelled drag can be undone.
        onDragStart={() => {
          // Store the data exactly as it was before anything moved.
          previousData.current = data;
        }}
        // onDragOver fires repeatedly while the card is dragged over other cards or columns.
        // Each time, we move the card in our state so the board updates live under the pointer.
        onDragOver={onDragOverHandler}
        // onDragEnd fires once, when the user drops the card (or cancels the drag).
        onDragEnd={(event) => {
          // `event.canceled` is true if the drag was aborted, for example by pressing Escape.
          // Because onDragOver already changed our data during the drag, we restore the snapshot.
          if (event.canceled) {
            // Put the boards back exactly as they were when the drag started.
            setData(previousData.current);
          }
          // If the drop was NOT cancelled there is nothing more to do: the data is already in its
          // final order thanks to onDragOver, and your existing useEffect in App.tsx saves it to localStorage.
        }}
      >
      <div className="flex flex-row gap-5 w-[80%] h-full shrink-0 overflow-x-auto">
        {columns?.length
          ? columns?.map((column, index) => (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={column.tasks}
                columnindex={index}
              />
            ))
          : []}
        <button
          onClick={
            data?.length >= 1
              ? addNewColumnHandler
              : () => window.confirm("please add a new Board to add new columns ?")
          }
          className="self-start bg-gray-100 w-72 px-3 py-3"
        >
          + Add new Column
        </button>
      </div>
      {/* DRAG AND DROP (added): close the DragDropProvider opened above. */}
      </DragDropProvider>
    </>
  );
}

export default WorkSpace;
