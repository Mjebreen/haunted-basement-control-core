
import React, { useEffect, useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Clock } from 'lucide-react';

interface GameTimerProps {
  large?: boolean;
  showControls?: boolean;
}

const GameTimer: React.FC<GameTimerProps> = ({ large = false, showControls = false }) => {
  const { gameState, pauseGame, resumeGame, addTime } = useSocket();
  const [displayTime, setDisplayTime] = useState('60:00');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!gameState) return;
    
    setIsRunning(gameState.isActive);
    
    // Format the time
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = Math.floor(gameState.timeRemaining % 60);
    setDisplayTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    
    // Set up the timer
    let interval: NodeJS.Timeout | null = null;
    
    if (gameState.isActive) {
      interval = setInterval(() => {
        setDisplayTime(prev => {
          const [mins, secs] = prev.split(':').map(Number);
          let newSecs = secs - 1;
          let newMins = mins;
          
          if (newSecs < 0) {
            newSecs = 59;
            newMins--;
          }
          
          if (newMins < 0) {
            clearInterval(interval!);
            return '0:00';
          }
          
          return `${newMins}:${newSecs.toString().padStart(2, '0')}`;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState]);

  // Determine timer status styles and classes
  const getTimerStyle = () => {
    if (!gameState) return 'text-gray-400';
    
    // Under 5 minutes - red and flashing
    if (gameState.timeRemaining < 300) {
      return 'text-haunted-danger animate-pulse-subtle';
    }
    // Under 15 minutes - yellow
    if (gameState.timeRemaining < 900) {
      return 'text-yellow-500';
    }
    // Default - white
    return 'text-white';
  };

  if (!gameState) {
    return (
      <div className="flex items-center justify-center space-x-2 text-gray-400">
        <Clock className="h-5 w-5" />
        <span className="font-mono">--:--</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${large ? 'space-y-4' : 'space-y-2'}`}>
      <div className="flex items-center justify-center space-x-2">
        <Clock className={`${large ? 'h-8 w-8' : 'h-5 w-5'} ${getTimerStyle()}`} />
        <span className={`font-mono font-bold ${large ? 'text-5xl' : 'text-2xl'} ${getTimerStyle()}`}>
          {displayTime}
        </span>
      </div>
      
      {showControls && (
        <div className="flex space-x-2">
          {isRunning ? (
            <button 
              onClick={pauseGame} 
              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-md"
            >
              Pause
            </button>
          ) : (
            <button 
              onClick={resumeGame} 
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md"
            >
              Resume
            </button>
          )}
          
          <button 
            onClick={() => addTime(60)} 
            className="px-3 py-1 bg-haunted-secondary hover:bg-haunted-accent text-white text-sm rounded-md"
          >
            +1m
          </button>
          
          <button 
            onClick={() => addTime(300)} 
            className="px-3 py-1 bg-haunted-secondary hover:bg-haunted-accent text-white text-sm rounded-md"
          >
            +5m
          </button>
          
          <button 
            onClick={() => addTime(-60)} 
            className="px-3 py-1 bg-haunted-danger/70 hover:bg-haunted-danger text-white text-sm rounded-md"
          >
            -1m
          </button>
        </div>
      )}
    </div>
  );
};

export default GameTimer;
