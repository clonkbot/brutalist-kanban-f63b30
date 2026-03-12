import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col">
      {/* Brutalist grid pattern background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <main className="flex-1 flex items-center justify-center p-4 relative">
        <div className="w-full max-w-md">
          {/* Logo/Title */}
          <div className="mb-8 text-center">
            <h1
              className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              KANBAN
            </h1>
            <div className="h-2 bg-black mx-auto w-32 mt-2" />
            <p className="mt-4 font-mono text-sm text-neutral-600 tracking-wide">
              ORGANIZE. EXECUTE. DOMINATE.
            </p>
          </div>

          {/* Auth Form */}
          <div className="border-4 border-black bg-white shadow-[12px_12px_0_0_#000] p-6 md:p-8 relative">
            {/* Corner accents */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#ff3333]" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#ffcc00]" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#00cc66]" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#3366ff]" />

            <h2
              className="text-2xl font-black uppercase tracking-tight mb-6 border-b-4 border-black pb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {flow === "signIn" ? "ACCESS GRANTED" : "JOIN THE GRID"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">
                  EMAIL
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full border-4 border-black p-3 font-mono text-lg focus:outline-none focus:ring-0 focus:border-[#ff3333] transition-colors bg-[#f5f5f0]"
                  placeholder="user@domain.com"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">
                  PASSWORD
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full border-4 border-black p-3 font-mono text-lg focus:outline-none focus:ring-0 focus:border-[#ff3333] transition-colors bg-[#f5f5f0]"
                  placeholder="••••••••"
                />
              </div>

              <input name="flow" type="hidden" value={flow} />

              {error && (
                <div className="border-4 border-[#ff3333] bg-[#ff3333]/10 p-3 font-mono text-sm text-[#ff3333]">
                  ERROR: {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white border-4 border-black p-4 font-black text-xl uppercase tracking-wider hover:bg-[#ff3333] hover:text-black transition-colors disabled:opacity-50 shadow-[4px_4px_0_0_#666] hover:shadow-[2px_2px_0_0_#666] active:shadow-none active:translate-x-1 active:translate-y-1"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {isSubmitting ? "PROCESSING..." : flow === "signIn" ? "ENTER" : "REGISTER"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t-2 border-dashed border-neutral-300">
              <button
                type="button"
                onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                className="w-full font-mono text-sm text-neutral-600 hover:text-black transition-colors uppercase tracking-wider"
              >
                {flow === "signIn" ? "→ CREATE NEW ACCOUNT" : "→ ALREADY HAVE ACCESS"}
              </button>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => signIn("anonymous")}
                className="w-full border-4 border-dashed border-neutral-400 p-3 font-mono text-sm text-neutral-600 hover:border-black hover:text-black transition-colors uppercase tracking-wider"
              >
                CONTINUE AS GUEST
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center">
        <p className="font-mono text-xs text-neutral-400 tracking-wide">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}
