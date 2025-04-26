import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import GameTimer from '@/components/GameTimer';
import CluesList from '@/components/CluesList';
import { Link } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';

// Calculate font size based on percentage
const calculateFontSize = (sizePercentage: number | undefined) => {
  // Default to 100% if undefined
  const size = sizePercentage || 100;
  
  return {
    base: `${(size / 100).toFixed(2)}rem`, // Base text size
    heading: `${((size * 2.5) / 100).toFixed(2)}rem`, // Heading size (larger)
  };
};

const PlayerView: React.FC = () => {
  const { gameState } = useSocket();
  const [showGameOver, setShowGameOver] = useState(false);
  const gameEndAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Check for game completion
  useEffect(() => {
    if (!gameState) return;
    
    // If the game is not active and we have an end time, the game is over
    if (!gameState.isActive && gameState.endTime) {
      // Play game over sound
      if (gameEndAudioRef.current && !showGameOver) {
        gameEndAudioRef.current.play().catch(e => console.error('Failed to play sound:', e));
      }
      setShowGameOver(true);
    } else {
      // Game is still active
      setShowGameOver(false);
    }
  }, [gameState, showGameOver]);

  if (showGameOver) {
    return <GameOverScreen fontSize={gameState?.displaySettings?.fontSize} />;
  }

  // Calculate font sizes based on the display settings
  const fontSizes = calculateFontSize(gameState?.displaySettings?.fontSize);

  return (
    <div className="min-h-screen flex flex-col bg-haunted bg-haunted-texture bg-blend-overlay text-white p-4 md:p-8" 
         style={{ fontSize: fontSizes.base }}>
      <header className="mb-8 text-center">
        <h1 className="font-gothic mb-2 text-white animate-glow tracking-wider"
            style={{ fontSize: fontSizes.heading }}>
          Fikri's Haunted Basement
        </h1>
        <p className="ghost-text text-gray-300">Find the way out before time expires</p>
      </header>

      {!gameState || !gameState.isActive ? (
        <WaitingScreen fontSize={gameState?.displaySettings?.fontSize} />
      ) : (
        <div className="flex-grow flex flex-col">
          <div className="mb-8 flex justify-center">
            <GameTimer large />
          </div>
          
          <div className="max-w-5xl mx-auto w-full">
            <CluesList hintSize={gameState?.displaySettings?.hintSize} />
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

      {/* Audio elements */}
      <audio ref={gameEndAudioRef} src="/sounds/game-over.mp3" preload="auto" />
    </div>
  );
};

const WaitingScreen: React.FC<{fontSize?: number}> = ({ fontSize }) => {
  const fontSizes = calculateFontSize(fontSize);
  
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center">
      <div className="haunted-panel p-8 rounded-lg max-w-md animate-float" style={{ fontSize: fontSizes.base }}>
        <h2 className="font-gothic mb-4" style={{ fontSize: `${((fontSize || 100) * 1.5 / 100).toFixed(2)}rem` }}>
          Awaiting Game Start
        </h2>
        <p className="mb-6 text-gray-300">
          The game has not yet begun. Please wait for the Game Master to start your experience.
        </p>
        <div className="spinner"></div>
      </div>
    </div>
  );
};

const GameOverScreen: React.FC<{fontSize?: number}> = ({ fontSize }) => {
  const fontSizes = calculateFontSize(fontSize);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-haunted bg-haunted-texture bg-blend-overlay text-white p-4"
         style={{ fontSize: fontSizes.base }}>
      <div className="max-w-2xl text-center">
        <h1 className="font-gothic mb-6 animate-glow text-haunted-accent"
            style={{ fontSize: `${((fontSize || 100) * 3 / 100).toFixed(2)}rem` }}>
          GAME OVER
        </h1>
        <div className="haunted-panel p-8 rounded-lg mb-8">
          <p className="mb-4 ghost-text" style={{ fontSize: `${((fontSize || 100) * 1.25 / 100).toFixed(2)}rem` }}>
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
};

export default PlayerView;
