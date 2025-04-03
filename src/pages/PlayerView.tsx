import React, { useEffect, useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import GameTimer from '@/components/GameTimer';
import CluesList from '@/components/CluesList';
import { Link } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';

const PlayerView: React.FC = () => {
  const { gameState } = useSocket();
  const [showGameOver, setShowGameOver] = useState(false);
  
  // Check for game completion
  useEffect(() => {
    if (!gameState) return;
    
    // If the game is not active and we have an end time, the game is over
    if (!gameState.isActive && gameState.endTime) {
      setShowGameOver(true);
    } else {
      // Game is still active
      setShowGameOver(false);
    }
  }, [gameState]);

  if (showGameOver) {
    return <GameOverScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-haunted bg-haunted-texture bg-blend-overlay text-white p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-gothic mb-2 text-white animate-glow tracking-wider">
          Fikri's Haunted Basement
        </h1>
        <p className="ghost-text text-lg text-gray-300">Find the way out before time expires</p>
      </header>

      {!gameState || !gameState.isActive ? (
        <WaitingScreen />
      ) : (
        <div className="flex-grow flex flex-col">
          <div className="mb-8 flex justify-center">
            <GameTimer large />
          </div>
          
          <div className="max-w-5xl mx-auto w-full">
            <CluesList />
          </div>
        </div>
      )}
      
      <footer className="mt-8 text-center text-sm text-gray-400">
        <Link 
          to="/master" 
          className="inline-flex items-center text-haunted-accent hover:text-haunted-highlight"
        >
          <LockKeyhole className="h-4 w-4 mr-1" />
          Game Master Access
        </Link>
      </footer>
    </div>
  );
};

const WaitingScreen: React.FC = () => (
  <div className="flex-grow flex flex-col items-center justify-center text-center">
    <div className="haunted-panel p-8 rounded-lg max-w-md animate-float">
      <h2 className="text-2xl font-gothic mb-4">Awaiting Game Start</h2>
      <p className="mb-6 text-gray-300">
        The game has not yet begun. Please wait for the Game Master to start your experience.
      </p>
      <div className="spinner"></div>
    </div>
  </div>
);

const GameOverScreen: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-haunted bg-haunted-texture bg-blend-overlay text-white p-4">
    <div className="max-w-2xl text-center">
      <h1 className="text-5xl font-gothic mb-6 animate-glow text-haunted-accent">GAME OVER</h1>
      <div className="haunted-panel p-8 rounded-lg mb-8">
        <p className="text-xl mb-4 ghost-text">
          Your time in Fikri's Haunted Basement has ended.
        </p>
        <p className="text-gray-300 mb-6">
          The adventure is complete. The spirits of the basement await your next visit.
          Will you dare to enter again?
        </p>
        <div className="flex justify-center">
          <Link to="/" className="haunted-button">
            Return to Start
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default PlayerView;
