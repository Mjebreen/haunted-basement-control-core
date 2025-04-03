
import React, { useEffect, useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import GameTimer from '@/components/GameTimer';
import CluesList from '@/components/CluesList';
import PuzzleTracker from '@/components/PuzzleTracker';
import { Link } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';

const PlayerView: React.FC = () => {
  const { gameState } = useSocket();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  
  // Check for game completion
  useEffect(() => {
    if (!gameState) return;
    
    // If the game is not active and we have an end time, the game is over
    if (!gameState.isActive && gameState.endTime) {
      // Check if all puzzles completed (success) or not (failure)
      const allCompleted = gameState.puzzles.every(p => p.isCompleted);
      
      if (allCompleted) {
        setShowSuccess(true);
        setShowFailure(false);
      } else {
        setShowSuccess(false);
        setShowFailure(true);
      }
    } else {
      // Game is still active
      setShowSuccess(false);
      setShowFailure(false);
    }
  }, [gameState]);

  if (showSuccess) {
    return <SuccessScreen />;
  }
  
  if (showFailure) {
    return <FailureScreen />;
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">
            <CluesList />
            <PuzzleTracker />
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

const SuccessScreen: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-haunted bg-haunted-texture bg-blend-overlay text-white p-4">
    <div className="max-w-2xl text-center">
      <h1 className="text-5xl font-gothic mb-6 animate-glow text-green-400">ESCAPED!</h1>
      <div className="haunted-panel p-8 rounded-lg mb-8">
        <p className="text-xl mb-4 ghost-text">
          You have successfully escaped Fikri's Haunted Basement!
        </p>
        <p className="text-gray-300 mb-6">
          The spirits have been appeased, and you have found your way back to the world of the living.
          Your courage and wit have served you well in overcoming the challenges that stood in your path.
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

const FailureScreen: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-haunted bg-haunted-texture bg-blend-overlay text-white p-4">
    <div className="max-w-2xl text-center">
      <h1 className="text-5xl font-gothic mb-6 animate-flicker text-haunted-danger">TRAPPED!</h1>
      <div className="haunted-panel border-haunted-danger/30 p-8 rounded-lg mb-8">
        <p className="text-xl mb-4 ghost-text">
          You have failed to escape Fikri's Haunted Basement in time.
        </p>
        <p className="text-gray-300 mb-6">
          The darkness has claimed you, and you are now bound to this place forever.
          Your souls will join the many others who were not quick enough or clever enough
          to solve the mysteries that could have saved them.
        </p>
        <div className="flex justify-center">
          <Link to="/" className="danger-button">
            Try Again... If You Dare
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default PlayerView;
