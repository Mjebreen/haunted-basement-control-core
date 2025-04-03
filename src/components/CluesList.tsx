
import React, { useState, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { MessageCircle, Send } from 'lucide-react';

interface CluesListProps {
  canSend?: boolean;
}

const CluesList: React.FC<CluesListProps> = ({ canSend = false }) => {
  const { gameState, sendClue } = useSocket();
  const [newClue, setNewClue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

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
  const presetClues = [
    "Look more carefully at the bookshelf",
    "Remember to check under objects",
    "The symbols need to be arranged in the correct order",
    "Think about the riddle - what connects all the items?",
    "The key is hidden in plain sight"
  ];

  if (!gameState) {
    return (
      <div className="h-64 glass-card p-4 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Connecting to game server...</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 rounded-lg flex flex-col min-h-[16rem] max-h-[24rem]">
      <div className="flex items-center mb-4">
        <MessageCircle className="h-5 w-5 mr-2 text-haunted-accent" />
        <h3 className="text-lg font-gothic text-white">
          {canSend ? "Send Clues" : "Clues & Hints"}
        </h3>
      </div>

      {/* Clues area */}
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-haunted-accent/30 scrollbar-track-transparent pr-2 space-y-3">
        {gameState.clues.length === 0 ? (
          <p className="text-gray-400 text-center italic py-8">
            {canSend ? "No clues sent yet..." : "No clues received yet..."}
          </p>
        ) : (
          <>
            {gameState.clues.map((clue) => (
              <div 
                key={clue.id} 
                className={`p-3 rounded-lg ${
                  isAnimating && clue === gameState.clues[gameState.clues.length - 1]
                    ? 'bg-haunted-accent/30 animate-pulse-subtle'
                    : 'bg-haunted-overlay/40'
                }`}
              >
                <p className="text-white">{clue.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(clue.sentAt).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Input area - only for GM console */}
      {canSend && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {presetClues.map((clue, index) => (
              <button
                key={index}
                onClick={() => sendClue(clue)}
                className="text-xs py-1 px-2 bg-haunted-secondary/50 hover:bg-haunted-secondary text-white rounded truncate text-left"
                title={clue}
              >
                {clue.length > 25 ? `${clue.substring(0, 22)}...` : clue}
              </button>
            ))}
          </div>

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
