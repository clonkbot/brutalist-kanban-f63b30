import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";
import { TaskCard } from "./TaskCard";

const COLUMN_COLORS = ['#ff3333', '#ffcc00', '#00cc66', '#3366ff', '#ff66cc', '#00cccc'];

interface ColumnProps {
  column: Doc<"columns">;
  tasks: Doc<"tasks">[];
  colorIndex: number;
  onAddTask: () => void;
  onEditTask: (id: Id<"tasks">) => void;
  boardId: Id<"boards">;
}

export function Column({ column, tasks, colorIndex, onAddTask, onEditTask, boardId }: ColumnProps) {
  const moveTask = useMutation(api.tasks.moveTask);
  const color = COLUMN_COLORS[colorIndex % COLUMN_COLORS.length];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-black/5");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-black/5");
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-black/5");

    const taskId = e.dataTransfer.getData("taskId") as Id<"tasks">;
    if (taskId) {
      await moveTask({
        id: taskId,
        columnId: column._id,
        order: tasks.length,
      });
    }
  };

  return (
    <div
      className="w-[300px] md:w-[320px] flex-shrink-0 flex flex-col h-full"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div
        className="border-4 border-black bg-white p-3 md:p-4 shadow-[4px_4px_0_0_#000] mb-4 relative"
      >
        <div
          className="absolute top-0 left-0 w-full h-1.5"
          style={{ backgroundColor: color }}
        />
        <div className="flex items-center justify-between">
          <h3
            className="text-lg md:text-xl font-black uppercase tracking-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {column.name}
          </h3>
          <span
            className="font-mono text-sm font-bold px-2 py-1 border-2 border-black"
            style={{ backgroundColor: color + '33' }}
          >
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4 pr-1 min-h-[200px]">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={() => onEditTask(task._id)}
            color={color}
          />
        ))}
      </div>

      {/* Add Task Button */}
      <button
        onClick={onAddTask}
        className="w-full border-4 border-dashed border-neutral-400 p-3 md:p-4 font-mono text-sm text-neutral-500 uppercase tracking-wider hover:border-black hover:text-black hover:bg-white transition-all group"
      >
        <span className="group-hover:scale-110 inline-block transition-transform">+</span> ADD TASK
      </button>
    </div>
  );
}
