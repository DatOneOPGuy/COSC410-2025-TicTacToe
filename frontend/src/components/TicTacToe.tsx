import React from "react";

type Player = "X" | "O";
type Cell = Player | null;

type Props = {
  onWin?: (winner: Player | "draw" | null) => void;
  // START CHANGED CODE - Added isNested prop
  isNested?: boolean; // DIFFERENCE: Added isNested prop to distinguish between main and nested games
  // END CHANGED CODE
};

// ----- Backend DTOs -----
type GameStateDTO = {
  id: string;
  board: Cell[];
  current_player: Player;
  winner: Player | null;
  is_draw: boolean;
  status: string;
};

// Prefer env, fallback to localhost:8000
const API_BASE =
  (import.meta as any)?.env?.VITE_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";



// START CHANGED CODE - Modified function signature and added state
export default function TicTacToe({ onWin, isNested = false }: Props) { // DIFFERENCE: Added isNested parameter with default false
  const [state, setState] = React.useState<GameStateDTO | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // DIFFERENCE: Added state for managing multiple mini games in the main game
  const [miniGameStates, setMiniGameStates] = React.useState<(GameStateDTO | null)[]>(Array(9).fill(null));
  const [miniWinners, setMiniWinners] = React.useState<(Player | "draw" | null)[]>(Array(9).fill(null));
// END CHANGED CODE

  // Create a new game on mount
  // START CHANGED CODE - Modified useEffect to handle mini games and isNested dependency
  React.useEffect(() => {
    let canceled = false;
    async function start() {
      setError(null);
      setLoading(true);
      try {
        const gs = await createGame();
        if (!canceled) {
          setState(gs);
          // DIFFERENCE: Added logic to initialize 9 mini games for the main game
          if (!isNested) {
            const miniStates = await Promise.all(
              Array(9).fill(null).map(() => createGame())
            );
            if (!canceled) setMiniGameStates(miniStates);
          }
        }
      } catch (e: any) {
        if (!canceled) setError(e?.message ?? "Failed to start game");
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    start();
    return () => {
      canceled = true;
    };
  }, [isNested]); // DIFFERENCE: Added isNested dependency
  // END CHANGED CODE

  // Notify parent when result changes
  React.useEffect(() => {
    if (!state || !onWin) return;
    if (state.winner) onWin(state.winner);
    else if (state.is_draw) onWin("draw");
  }, [state?.winner, state?.is_draw]);

  async function createGame(): Promise<GameStateDTO> {
    const r = await fetch(`${API_BASE}/tictactoe/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ starting_player: "X" }),
    });
    if (!r.ok) throw new Error(`Create failed: ${r.status}`);
    return r.json();
  }

  async function playMove(index: number): Promise<GameStateDTO> {
    if (!state) throw new Error("No game");
    const r = await fetch(`${API_BASE}/tictactoe/${state.id}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
    });
    if (!r.ok) {
      const detail = await r.json().catch(() => ({}));
      throw new Error(detail?.detail ?? `Move failed: ${r.status}`);
    }
    return r.json();
  }

  async function handleClick(i: number) {
    if (!state || loading) return;
    // Light client-side guard to avoid noisy 400s:
    if (state.winner || state.is_draw || state.board[i] !== null) return;

    setLoading(true);
    setError(null);
    try {
      const next = await playMove(i);
      setState(next);
    } catch (e: any) {
      setError(e?.message ?? "Move failed");
    } finally {
      setLoading(false);
    }
  }

  // START CHANGED CODE - Modified reset function and added handleMiniWin function
  async function reset() {
    setLoading(true);
    setError(null);
    try {
      const gs = await createGame();
      // DIFFERENCE: Added conditional logic for nested vs main game reset
      if (isNested) {
        setMiniWinners(Array(9).fill(null));
      } else {
        setState(gs);
        const miniStates = await Promise.all(
          Array(9).fill(null).map(() => createGame())
        );
        setMiniGameStates(miniStates);
        setMiniWinners(Array(9).fill(null));
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to reset");
    } finally {
      setLoading(false);
    }
  }

  // DIFFERENCE: Added function to handle mini game completion
  const handleMiniWin = (miniIndex: number, miniWinner: Player | "draw" | null) => {
    const newMiniWinners = [...miniWinners];
    newMiniWinners[miniIndex] = miniWinner;
    setMiniWinners(newMiniWinners);
  };
  // END CHANGED CODE

  // START CHANGED CODE - Complete replacement of render logic for nested games and layout changes
  // DIFFERENCE: Added conditional rendering for nested games
  if (isNested) {
    if (!state) {
      return <div className="text-xs text-center">Loading...</div>;
    }

    return (
      <div className="grid grid-cols-3 gap-0.5">
        {state.board.map((cell, i) => (
          <button
            key={i}
            className="aspect-square text-xs font-bold border border-gray-300 flex items-center justify-center disabled:opacity-50 bg-white"
            onClick={() => handleClick(i)}
            disabled={loading || cell !== null || state.winner !== null || state.is_draw}
          >
            {cell}
          </button>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4"> {/* DIFFERENCE: Changed max-width from max-w-sm to max-w-4xl */}
        <div className="mb-2 text-red-600 font-semibold">Error: {error}</div>
        <button className="rounded-2xl px-4 py-2 border" onClick={reset}>
          Retry
        </button>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="max-w-4xl mx-auto p-4"> {/* DIFFERENCE: Changed max-width from max-w-sm to max-w-4xl */}
        <div className="text-center">Loading…</div>
      </div>
    );
  }

  const { board, status } = state;

  return (
    <div className="max-w-4xl mx-auto p-4"> {/* DIFFERENCE: Changed max-width from max-w-sm to max-w-4xl */}
      <div className="text-center mb-4 text-xl font-semibold">{status}</div> {/* DIFFERENCE: Changed mb-2 to mb-4 */}
      <div className="grid grid-cols-3 gap-2">
        {/* DIFFERENCE: Completely replaced the original button grid with nested TicTacToe components */}
        {miniGameStates.map((miniState, i) => (
          <div key={i} className="border-2 border-gray-400 p-1 rounded-lg">
            {miniState ? (
              <TicTacToe
                isNested={true}
                onWin={(miniWinner) => handleMiniWin(i, miniWinner)}
              />
            ) : (
              <div className="text-xs text-center">Loading...</div>
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-4"> {/* DIFFERENCE: Changed mt-3 to mt-4 */}
        <button className="rounded-2xl px-4 py-2 border" onClick={reset} disabled={loading}>
          New Game
        </button>
      </div>
    </div>
  );
  // END CHANGED CODE
}