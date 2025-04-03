
import React from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Puzzle, Check, X } from 'lucide-react';

interface PuzzleTrackerProps {
  canControl?: boolean;
}

const PuzzleTracker: React.FC<PuzzleTrackerProps> = ({ canControl = false }) => {
  const { gameState, completePuzzle } = useSocket();

  if (!gameState) {
    return (
      <div className="h-48 glass-card p-4 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Loading puzzle data...</p>
      </div>
    );
  }

  const completedCount = gameState.puzzles.filter(p => p.isCompleted).length;
  const totalCount = gameState.puzzles.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="glass-card p-4 rounded-lg">
      <div className="flex items-center mb-4">
        <Puzzle className="h-5 w-5 mr-2 text-haunted-accent" />
        <h3 className="text-lg font-gothic text-white">Puzzle Progress</h3>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
        <div 
          className="bg-haunted-accent h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Progress text */}
      <p className="text-sm text-gray-300 mb-4">
        {completedCount} of {totalCount} puzzles completed
        {completedCount === totalCount && (
          <span className="ml-2 text-green-400">All puzzles solved!</span>
        )}
      </p>

      {/* Puzzle list */}
      <div className="space-y-2">
        {gameState.puzzles.map((puzzle) => (
          <div 
            key={puzzle.id} 
            className={`flex items-center p-2 rounded ${
              puzzle.isCompleted 
                ? 'bg-green-900/30' 
                : 'bg-haunted-overlay/40'
            }`}
          >
            {puzzle.isCompleted ? (
              <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
            ) : (
              <X className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
            )}
            
            <span className={`flex-grow ${puzzle.isCompleted ? 'text-green-300' : 'text-white'}`}>
              {puzzle.name}
            </span>
            
            {canControl && !puzzle.isCompleted && (
              <button
                onClick={() => completePuzzle(puzzle.id)}
                className="px-2 py-1 text-xs bg-haunted-secondary hover:bg-haunted-accent text-white rounded"
              >
                Mark Complete
              </button>
            )}
            
            {puzzle.isCompleted && puzzle.completedAt && (
              <span className="text-xs text-gray-400">
                {new Date(puzzle.completedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PuzzleTracker;
