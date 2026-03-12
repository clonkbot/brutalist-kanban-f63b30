import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";
import { Column } from "./Column";
import { TaskModal } from "./TaskModal";

export function KanbanBoard() {
  const { signOut } = useAuthActions();
  const boards = useQuery(api.boards.list);
  const createBoard = useMutation(api.boards.create);
  const deleteBoard = useMutation(api.boards.remove);

  const [selectedBoardId, setSelectedBoardId] = useState<Id<"boards"> | null>(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [showNewBoardForm, setShowNewBoardForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Id<"tasks"> | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<Id<"columns"> | null>(null);

  const selectedBoard = boards?.find((b: Doc<"boards">) => b._id === selectedBoardId);
  const columns = useQuery(
    api.columns.listByBoard,
    selectedBoardId ? { boardId: selectedBoardId } : "skip"
  );
  const tasks = useQuery(
    api.tasks.listByBoard,
    selectedBoardId ? { boardId: selectedBoardId } : "skip"
  );

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    const boardId = await createBoard({ name: newBoardName.trim() });
    setSelectedBoardId(boardId);
    setNewBoardName("");
    setShowNewBoardForm(false);
  };

  if (boards === undefined) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <div className="border-4 border-black p-8 bg-white shadow-[8px_8px_0_0_#000]">
          <div className="animate-pulse font-mono text-xl font-bold">LOADING BOARDS...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col">
      {/* Brutalist grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Header */}
      <header className="border-b-4 border-black bg-white relative z-10">
        <div className="max-w-[1800px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <h1
              className="text-3xl md:text-4xl font-black tracking-tighter text-black uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              KANBAN
            </h1>
            <div className="h-8 w-1 bg-black hidden md:block" />
            {selectedBoard && (
              <div className="hidden md:flex items-center gap-4">
                <span className="font-mono text-sm uppercase tracking-wider text-neutral-500">
                  BOARD:
                </span>
                <span className="font-black text-xl uppercase tracking-tight">
                  {selectedBoard.name}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {selectedBoardId && (
              <button
                onClick={() => setSelectedBoardId(null)}
                className="border-2 md:border-4 border-black px-3 py-2 md:px-4 font-mono text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
              >
                ← BOARDS
              </button>
            )}
            <button
              onClick={() => signOut()}
              className="bg-black text-white border-2 md:border-4 border-black px-3 py-2 md:px-4 font-mono text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-[#ff3333] transition-colors shadow-[2px_2px_0_0_#666] md:shadow-[4px_4px_0_0_#666] hover:shadow-[1px_1px_0_0_#666] md:hover:shadow-[2px_2px_0_0_#666]"
            >
              EXIT
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-hidden">
        {!selectedBoardId ? (
          /* Board Selection */
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <h2
                className="text-3xl md:text-4xl font-black uppercase tracking-tight"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                YOUR BOARDS
              </h2>
              <button
                onClick={() => setShowNewBoardForm(true)}
                className="bg-[#ffcc00] border-4 border-black px-4 md:px-6 py-2 md:py-3 font-black text-lg md:text-xl uppercase tracking-wider hover:bg-[#ff3333] transition-colors shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                + NEW
              </button>
            </div>

            {showNewBoardForm && (
              <form onSubmit={handleCreateBoard} className="mb-8 border-4 border-black bg-white p-4 md:p-6 shadow-[8px_8px_0_0_#000]">
                <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">
                  BOARD NAME
                </label>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    className="flex-1 border-4 border-black p-3 font-mono text-lg focus:outline-none focus:border-[#ff3333] bg-[#f5f5f0]"
                    placeholder="PROJECT NAME"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 md:flex-none bg-black text-white px-6 py-3 font-black uppercase tracking-wider hover:bg-[#00cc66] transition-colors"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      CREATE
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewBoardForm(false)}
                      className="flex-1 md:flex-none border-4 border-black px-6 py-3 font-mono text-sm uppercase hover:bg-neutral-200 transition-colors"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </form>
            )}

            {boards.length === 0 ? (
              <div className="border-4 border-dashed border-neutral-400 p-12 text-center">
                <p className="font-mono text-neutral-500 uppercase tracking-wider">
                  NO BOARDS YET. CREATE ONE TO START.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {boards.map((board: Doc<"boards">, index: number) => (
                  <div
                    key={board._id}
                    className="border-4 border-black bg-white p-4 md:p-6 shadow-[6px_6px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer group relative"
                    onClick={() => setSelectedBoardId(board._id)}
                  >
                    {/* Color accent based on index */}
                    <div
                      className="absolute top-0 left-0 w-full h-2"
                      style={{
                        backgroundColor: ['#ff3333', '#ffcc00', '#00cc66', '#3366ff', '#ff66cc'][index % 5]
                      }}
                    />
                    <h3
                      className="text-2xl md:text-3xl font-black uppercase tracking-tight mt-2 group-hover:text-[#ff3333] transition-colors"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {board.name}
                    </h3>
                    <p className="font-mono text-xs text-neutral-500 mt-2 uppercase">
                      {new Date(board.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this board and all its tasks?")) {
                          deleteBoard({ id: board._id });
                        }
                      }}
                      className="absolute bottom-4 right-4 font-mono text-xs text-neutral-400 hover:text-[#ff3333] uppercase transition-colors"
                    >
                      DELETE
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Kanban Columns */
          <div className="h-[calc(100vh-80px)] overflow-x-auto">
            <div className="flex gap-4 md:gap-6 p-4 md:p-6 min-w-max h-full">
              {columns?.map((column: Doc<"columns">, index: number) => (
                <Column
                  key={column._id}
                  column={column}
                  tasks={tasks?.filter((t: Doc<"tasks">) => t.columnId === column._id) || []}
                  colorIndex={index}
                  onAddTask={() => setAddingToColumn(column._id)}
                  onEditTask={setEditingTask}
                  boardId={selectedBoardId}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Task Modal */}
      {(editingTask || addingToColumn) && selectedBoardId && (
        <TaskModal
          taskId={editingTask}
          columnId={addingToColumn}
          boardId={selectedBoardId}
          onClose={() => {
            setEditingTask(null);
            setAddingToColumn(null);
          }}
        />
      )}

      {/* Footer */}
      <footer className="py-3 text-center border-t border-neutral-200 bg-white/50 relative z-10">
        <p className="font-mono text-xs text-neutral-400 tracking-wide">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}
