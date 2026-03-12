import { useConvexAuth } from "convex/react";
import { AuthScreen } from "./components/AuthScreen";
import { KanbanBoard } from "./components/KanbanBoard";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <div className="border-4 border-black p-8 bg-white shadow-[8px_8px_0_0_#000]">
          <div className="animate-pulse font-mono text-2xl font-bold tracking-tight">
            LOADING...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <KanbanBoard />;
}
