import React from "react";

type Player = "X" | "O";
type Winner = Player | "draw" | null;

type Props = {
  boardWinners: Winner[];
};

export default function MetaBoard({ boardWinners }: Props) {
  return (
    <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10">
      <h3 className="text-base font-semibold mb-3 text-center text-gray-700">Meta Board</h3>
      <div className="grid grid-cols-3 gap-1 border-2 border-gray-800 w-32 h-32 bg-white shadow-lg rounded-lg">
        {boardWinners.map((winner, index) => (
          <div 
            key={index} 
            className="border-gray-800 border-r-2 border-b-2 flex items-center justify-center text-lg font-bold bg-white hover:bg-gray-50 transition-colors"
            style={{
              borderRightWidth: index % 3 < 2 ? '2px' : '0px',
              borderBottomWidth: index < 6 ? '2px' : '0px'
            }}
          >
            {winner || ""}
          </div>
        ))}
      </div>
    </div>
  );
}
