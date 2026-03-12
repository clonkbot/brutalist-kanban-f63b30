import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

const PRIORITY_STYLES = {
  high: { bg: '#ff3333', label: 'HIGH' },
  medium: { bg: '#ffcc00', label: 'MED' },
  low: { bg: '#00cc66', label: 'LOW' },
};

interface TaskCardProps {
  task: Doc<"tasks">;
  onEdit: () => void;
  color: string;
}

export function TaskCard({ task, onEdit, color }: TaskCardProps) {
  const deleteTask = useMutation(api.tasks.remove);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task._id);
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="border-4 border-black bg-white p-3 md:p-4 shadow-[4px_4px_0_0_#000] cursor-grab active:cursor-grabbing hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all group relative"
    >
      {/* Left color bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ backgroundColor: color }}
      />

      {/* Priority Badge */}
      {task.priority && task.priority in PRIORITY_STYLES && (
        <div
          className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider mb-2 border-2 border-black"
          style={{ backgroundColor: PRIORITY_STYLES[task.priority as keyof typeof PRIORITY_STYLES].bg }}
        >
          {PRIORITY_STYLES[task.priority as keyof typeof PRIORITY_STYLES].label}
        </div>
      )}

      {/* Title */}
      <h4
        className="font-bold text-base md:text-lg uppercase tracking-tight leading-tight"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="mt-2 font-mono text-xs text-neutral-600 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Actions */}
      <div className="mt-3 pt-2 border-t-2 border-dashed border-neutral-200 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="font-mono text-xs uppercase tracking-wider text-neutral-500 hover:text-black transition-colors"
        >
          EDIT
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Delete this task?")) {
              deleteTask({ id: task._id });
            }
          }}
          className="font-mono text-xs uppercase tracking-wider text-neutral-400 hover:text-[#ff3333] transition-colors"
        >
          DELETE
        </button>
      </div>

      {/* Timestamp */}
      <div className="absolute bottom-2 right-2 font-mono text-[10px] text-neutral-300">
        {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
