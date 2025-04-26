import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { MessageCircle, Send, Trash2 } from 'lucide-react';

interface CluesListProps {
  canSend?: boolean;
  hintSize?: number;
}

// Calculate hint font size based on percentage
const calculateHintFontSize = (sizePercentage: number | undefined) => {
  // Default to 100% if undefined
  const size = sizePercentage || 100;
  
  // Base font size in px (using rem)
  const baseFontSize = 1; // 1rem (16px) as base size
  
  // Scale according to percentage
  const scaledSize = (baseFontSize * size) / 100;
  
  // Return as rem value
  return `${scaledSize.toFixed(2)}rem`;
};

const CluesList: React.FC<CluesListProps> = ({ canSend = false, hintSize = 100 }) => {
  const { gameState, sendClue, deleteClue } = useSocket();
  const [newClue, setNewClue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const cluesContainerRef = useRef<HTMLDivElement>(null);

  // Handle new clues animation
  useEffect(() => {
    if (gameState?.clues && gameState.clues.length > 0) {
      const lastClue = gameState.clues[gameState.clues.length - 1];
      
      // If this is a new clue that came in the last 5 seconds
      if (Date.now() - lastClue.sentAt < 5000) {
        setIsAnimating(true);
        
        // Play a sound if available
        const clueSound = document.getElementById('clueSound') as HTMLAudioElement;
        if (clueSound) {
          clueSound.play().catch(e => console.error('Failed to play sound:', e));
        }
        
        // Scroll to top to show newest message
        if (cluesContainerRef.current) {
          cluesContainerRef.current.scrollTop = 0;
        }
        
        // End animation after 3 seconds
        const timer = setTimeout(() => {
          setIsAnimating(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [gameState?.clues]);

  const handleSendClue = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClue.trim() && canSend) {
      sendClue(newClue.trim());
      setNewClue('');
    }
  };

  // Presets for quick clues
  const presetClues = [];

  if (!gameState) {
    return (
      <div className="h-64 glass-card p-4 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Connecting to game server...</p>
      </div>
    );
  }

  // Calculate font size based on percentage in props or gameState
  const fontSize = calculateHintFontSize(hintSize);
  const headerFontSize = calculateHintFontSize(hintSize ? hintSize * 1.1 : 110); // Slightly larger for header

  return (
    <div className="glass-card p-4 rounded-lg flex flex-col min-h-[16rem] max-h-[24rem]">
      <div className="flex items-center mb-4">
        <MessageCircle className="h-5 w-5 mr-2 text-haunted-accent" />
        <h3 className="font-gothic text-white" style={{ fontSize: headerFontSize }}>
          {canSend ? "Send Clues" : "Clues & Hints"}
        </h3>
      </div>

      {/* Clues area */}
      <div 
        ref={cluesContainerRef}
        className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-haunted-accent/30 scrollbar-track-transparent pr-2 space-y-3"
      >
        {gameState.clues.length === 0 ? (
          <p className="text-gray-400 text-center italic py-8" style={{ fontSize }}>
            {canSend ? "No clues sent yet..." : "No clues received yet..."}
          </p>
        ) : (
          <>
            {[...gameState.clues].reverse().map((clue) => (
              <div 
                key={clue.id} 
                className={`p-3 rounded-lg ${
                  isAnimating && clue.id === gameState.clues[gameState.clues.length - 1].id
                    ? 'bg-haunted-accent/30 animate-pulse-subtle'
                    : 'bg-haunted-overlay/40'
                }`}
              >
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-white" style={{ fontSize }}>{clue.message}</p>
                    {canSend && (
                      <button 
                        onClick={() => deleteClue(clue.id)}
                        className="flex items-center bg-haunted-danger/40 hover:bg-haunted-danger px-2 py-1 rounded text-white text-xs ml-2 shrink-0"
                        title="Delete hint"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(clue.sentAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Input area - only for GM console */}
      {canSend && (
        <>
          {presetClues.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {presetClues.map((clue, index) => (
                <button
                  key={index}
                  onClick={() => sendClue(clue)}
                  className="text-xs py-1 px-2 bg-haunted-secondary/50 hover:bg-haunted-secondary text-white rounded truncate text-left"
                  title={clue.toString()}
                >
                  {clue.length > 25 ? `${clue.substring(0, 22)}...` : clue.toString()}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSendClue} className="mt-4 flex">
            <input
              type="text"
              value={newClue}
              onChange={(e) => setNewClue(e.target.value)}
              placeholder="Type a custom clue..."
              className="ghost-input flex-grow"
            />
            <button
              type="submit"
              disabled={!newClue.trim()}
              className="ml-2 px-3 bg-haunted-accent hover:bg-haunted-highlight disabled:bg-gray-700 disabled:opacity-50 text-white rounded-md"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </>
      )}

      {/* Audio for clue notifications */}
      <audio id="clueSound" src="/sounds/new-clue.mp3" preload="auto" />
    </div>
  );
};

export default CluesList;
