import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";

interface TaskModalProps {
  taskId: Id<"tasks"> | null;
  columnId: Id<"columns"> | null;
  boardId: Id<"boards">;
  onClose: () => void;
}

type Priority = "low" | "medium" | "high";

export function TaskModal({ taskId, columnId, boardId, onClose }: TaskModalProps) {
  const tasks = useQuery(api.tasks.listByBoard, { boardId });
  const existingTask = tasks?.find((t: Doc<"tasks">) => t._id === taskId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority | "">("");

  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || "");
      setPriority(existingTask.priority || "");
    }
  }, [existingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskId && existingTask) {
      await updateTask({
        id: taskId,
        title: title.trim(),
        description: description.trim() || undefined,
        priority: priority || undefined,
      });
    } else if (columnId) {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        columnId,
        boardId,
        priority: priority || undefined,
      });
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg border-4 border-black bg-white shadow-[12px_12px_0_0_#000] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b-4 border-black p-4 md:p-6 bg-[#ffcc00]">
          <h2
            className="text-2xl md:text-3xl font-black uppercase tracking-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {taskId ? "EDIT TASK" : "NEW TASK"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">
              TITLE *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-4 border-black p-3 font-mono text-base md:text-lg focus:outline-none focus:border-[#ff3333] bg-[#f5f5f0]"
              placeholder="TASK NAME"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">
              DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-4 border-black p-3 font-mono text-sm focus:outline-none focus:border-[#ff3333] bg-[#f5f5f0] resize-none"
              placeholder="Add details..."
              rows={3}
            />
          </div>

          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">
              PRIORITY
            </label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "high", label: "HIGH", color: "#ff3333" },
                { value: "medium", label: "MEDIUM", color: "#ffcc00" },
                { value: "low", label: "LOW", color: "#00cc66" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(priority === opt.value ? "" : opt.value as Priority)}
                  className={`px-3 md:px-4 py-2 border-4 border-black font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                    priority === opt.value
                      ? "shadow-none translate-x-1 translate-y-1"
                      : "shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000]"
                  }`}
                  style={{
                    backgroundColor: priority === opt.value ? opt.color : "white",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-3 pt-4 border-t-2 border-dashed border-neutral-300">
            <button
              type="submit"
              className="flex-1 bg-black text-white border-4 border-black p-3 md:p-4 font-black text-lg md:text-xl uppercase tracking-wider hover:bg-[#00cc66] transition-colors shadow-[4px_4px_0_0_#666] hover:shadow-[2px_2px_0_0_#666]"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {taskId ? "UPDATE" : "CREATE"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 md:flex-none border-4 border-black p-3 md:p-4 font-mono text-sm uppercase tracking-wider hover:bg-neutral-200 transition-colors"
            >
              CANCEL
            </button>
          </div>
        </form>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-10 h-10 bg-[#ff3333] border-4 border-black text-black font-black text-xl flex items-center justify-center hover:bg-black hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}
