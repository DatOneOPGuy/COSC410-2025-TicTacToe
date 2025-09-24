import TicTacToe from "@/components/TicTacToe";
import MetaBoard from "@/components/MetaBoard";
import { useState } from "react";

type Player = "X" | "O";
type Winner = Player | "draw" | null;

export default function App() {
  // Track winners for each board (0-8 for the 9 boards)
  const [boardWinners, setBoardWinners] = useState<(Winner)[]>([
    null, null, null, null, null, null, null, null, null
  ]);

  const handleWinnerChange = (boardIndex: number, winner: Winner) => {
    setBoardWinners(prev => {
      const newWinners = [...prev];
      newWinners[boardIndex] = winner;
      return newWinners;
    });
  };
  return (
    <div className="min-h-screen p-8 relative">
      {/* Meta Board */}
      <MetaBoard boardWinners={boardWinners} />
      
      {/* Main 3x3 TicTacToe Grid */}
      <div className="grid grid-cols-3 max-w-6xl mx-auto">
        {/* Row 1 */}
        <div className="border-gray-800 border-r-8 border-b-8">
          <TicTacToe isActive={true} onWinnerChange={(winner) => handleWinnerChange(0, winner)} />
        </div>
        <div className="border-gray-800 border-r-8 border-b-8">
          <TicTacToe isActive={true} onWinnerChange={(winner) => handleWinnerChange(1, winner)} />
        </div>
        <div className="border-gray-800 border-b-8">
          <TicTacToe isActive={true} onWinnerChange={(winner) => handleWinnerChange(2, winner)} />
        </div>
        
        {/* Row 2 */}
        <div className="border-gray-800 border-r-8 border-b-8">
          <TicTacToe isActive={true} onWinnerChange={(winner) => handleWinnerChange(3, winner)} />
        </div>
        <div className="border-gray-800 border-r-8 border-b-8">
          <TicTacToe isActive={true} onWinnerChange={(winner) => handleWinnerChange(4, winner)} />
        </div>
        <div className="border-gray-800 border-b-8">
          <TicTacToe isActive={false} onWinnerChange={(winner) => handleWinnerChange(5, winner)} />
        </div>
        
        {/* Row 3 */}
        <div className="border-gray-800 border-r-8">
          <TicTacToe isActive={true} onWinnerChange={(winner) => handleWinnerChange(6, winner)} />
        </div>
        <div className="border-gray-800 border-r-8">
          <TicTacToe isActive={true} onWinnerChange={(winner) => handleWinnerChange(7, winner)} />
        </div>
        <div className="border-gray-800">
          <TicTacToe isActive={true} onWinnerChange={(winner) => handleWinnerChange(8, winner)} />
        </div>
      </div>
    </div>
  );
}

