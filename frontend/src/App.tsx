import TicTacToe from "@/components/TicTacToe";

export default function App() {
  return (
    <div className="min-h-screen p-8">
      <div className="grid grid-cols-3 max-w-6xl mx-auto">
        {Array.from({ length: 9 }, (_, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const isRightBorder = col < 2;
          const isBottomBorder = row < 2;
          
          return (
            <div
              key={i}
              className={`border-gray-800 ${
                isRightBorder ? 'border-r-8' : ''
              } ${isBottomBorder ? 'border-b-8' : ''}`}
            >
              <TicTacToe />
            </div>
          );
        })}
      </div>
    </div>
  );
}

