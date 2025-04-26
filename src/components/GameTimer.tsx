import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Clock } from 'lucide-react';

interface GameTimerProps {
  large?: boolean;
  showControls?: boolean;
}

// Calculate styles based on numeric font size
const calculateTimerFontSize = (sizePercentage: number | undefined, large: boolean) => {
  // Default to 100% if undefined
  const size = sizePercentage || 100;
  
  // Base font size in px (using rem)
  const baseFontSize = large ? 3 : 1.5; // 3rem (48px) for large, 1.5rem (24px) for normal
  
  // Scale according to percentage
  const scaledSize = (baseFontSize * size) / 100;
  
  // Return as rem value
  return `${scaledSize.toFixed(2)}rem`;
};

// Calculate clock icon size based on numeric font size
const calculateClockIconSize = (sizePercentage: number | undefined, large: boolean) => {
  // Default to 100% if undefined
  const size = sizePercentage || 100;
  
  // Base icon size in px
  const baseIconSize = large ? 32 : 20; // 32px for large, 20px for normal
  
  // Scale according to percentage
  const scaledSize = (baseIconSize * size) / 100;
  
  // Return as px value
  return `${Math.round(scaledSize)}px`;
};

const GameTimer: React.FC<GameTimerProps> = ({ large = false, showControls = false }) => {
  const { gameState, pauseGame, resumeGame, addTime } = useSocket();
  const [displayTime, setDisplayTime] = useState('60:00');
  const [isRunning, setIsRunning] = useState(false);
  const [hasPlayedWarning, setHasPlayedWarning] = useState(false);
  const warningAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!gameState) return;
    
    setIsRunning(gameState.isActive);
    
    // Format the time
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = Math.floor(gameState.timeRemaining % 60);
    setDisplayTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    
    // Check for 5-minute warning
    if (gameState.isActive && gameState.timeRemaining <= 300 && gameState.timeRemaining > 295 && !hasPlayedWarning) {
      // Play warning sound
      if (warningAudioRef.current) {
        warningAudioRef.current.play().catch(e => console.error('Failed to play sound:', e));
        setHasPlayedWarning(true);
      }
    }
    
    // Reset warning flag if time goes back above 5 minutes
    if (gameState.timeRemaining > 300) {
      setHasPlayedWarning(false);
    }
    
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
  }, [gameState, hasPlayedWarning]);

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

  // Calculate font size and icon size based on percentage in gameState
  const fontSize = calculateTimerFontSize(gameState.displaySettings?.fontSize, large);
  const clockIconSize = calculateClockIconSize(gameState.displaySettings?.fontSize, large);

  return (
    <div className={`flex flex-col items-center ${large ? 'space-y-4' : 'space-y-2'}`}>
      <div className="flex items-center justify-center space-x-2">
        <Clock 
          className={`${getTimerStyle()}`} 
          style={{ width: clockIconSize, height: clockIconSize }}
        />
        <span 
          className={`font-mono font-bold ${getTimerStyle()}`}
          style={{ fontSize }}
        >
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
      
      {/* Audio elements */}
      <audio ref={warningAudioRef} src="/sounds/five-minute-warning.mp3" preload="auto" />
    </div>
  );
};

export default GameTimer;
