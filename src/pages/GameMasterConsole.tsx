import React, { useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import GameTimer from '@/components/GameTimer';
import CluesList from '@/components/CluesList';
import { 
  Clock, 
  LogOut, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  ThumbsUp, 
  Settings,
  User,
  Link as LinkIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GameMasterConsole: React.FC = () => {
  const { gameState, startGame, resetGame, endGame } = useSocket();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [gameDuration, setGameDuration] = useState(60);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartClick = () => {
    setShowStartDialog(true);
  };

  const handleStartGame = () => {
    startGame(gameDuration * 60); // Convert minutes to seconds
    setShowStartDialog(false);
    toast({
      title: "Game Started",
      description: `Timer set for ${gameDuration} minutes`,
    });
  };

  const handleResetGame = () => {
    if (window.confirm("Are you sure you want to reset the game? All progress will be lost.")) {
      resetGame();
    }
  };

  const handleEndGame = (success: boolean) => {
    if (window.confirm(`Are you sure you want to ${success ? 'complete' : 'fail'} the game?`)) {
      endGame(success);
    }
  };

  const handleCopyPlayerLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Player view URL copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-haunted bg-haunted-texture bg-blend-overlay text-white">
      <header className="bg-black/40 p-4 flex justify-between items-center border-b border-haunted-accent/30">
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-gothic text-white mr-4">
            Haunted Basement Control
          </h1>
          <span className="hidden md:flex items-center text-sm bg-haunted-secondary px-2 py-1 rounded">
            <User className="h-4 w-4 mr-1" />
            {user?.username || 'Game Master'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyPlayerLink}
            className="text-gray-300 hover:text-white p-2"
            title="Copy Player View URL"
          >
            <LinkIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-white p-2"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex-grow p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main controls column */}
          <div className="lg:col-span-1">
            <div className="haunted-panel rounded-lg p-4">
              <h2 className="font-gothic text-xl mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-haunted-accent" />
                Game Controls
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={handleStartClick}
                  disabled={gameState?.isActive}
                  className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
                    gameState?.isActive
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-green-700 hover:bg-green-600 text-white'
                  }`}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Game
                </button>
                
                <GameTimer showControls />
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleResetGame}
                    className="py-2 px-4 rounded-md bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reset
                  </button>
                  
                  <button
                    onClick={() => handleEndGame(true)}
                    className="py-2 px-4 rounded-md bg-green-700 hover:bg-green-600 text-white flex items-center justify-center"
                  >
                    <ThumbsUp className="h-5 w-5 mr-2" />
                    End Game
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content columns */}
          <div className="lg:col-span-3">
            <CluesList canSend />
            
            {/* Game status panel */}
            <div className="mt-6 haunted-panel rounded-lg p-4">
              <h2 className="font-gothic text-xl mb-4">Game Status</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-haunted-overlay/40 p-3 rounded-lg">
                  <h3 className="font-gothic text-sm text-gray-300 mb-2">Game State</h3>
                  <p className="text-lg">
                    {!gameState?.startTime ? (
                      <span className="text-gray-400">Not Started</span>
                    ) : gameState?.isActive ? (
                      <span className="text-green-400">In Progress</span>
                    ) : gameState?.endTime ? (
                      <span className="text-red-400">Ended</span>
                    ) : (
                      <span className="text-yellow-400">Paused</span>
                    )}
                  </p>
                </div>
                
                <div className="bg-haunted-overlay/40 p-3 rounded-lg">
                  <h3 className="font-gothic text-sm text-gray-300 mb-2">Start Time</h3>
                  <p className="text-lg">
                    {gameState?.startTime ? (
                      new Date(gameState.startTime).toLocaleTimeString()
                    ) : (
                      <span className="text-gray-400">--:--:--</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Game Dialog */}
      {showStartDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="haunted-panel rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-gothic mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-haunted-accent" />
              Start New Game
            </h2>
            
            <div className="mb-6">
              <label htmlFor="duration" className="block text-gray-300 mb-2">
                Game Duration (minutes)
              </label>
              <input
                id="duration"
                type="number"
                min="1"
                max="120"
                value={gameDuration}
                onChange={(e) => setGameDuration(parseInt(e.target.value) || 60)}
                className="ghost-input w-full"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowStartDialog(false)}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleStartGame}
                className="flex-1 py-2 px-4 bg-green-700 hover:bg-green-600 text-white rounded-md"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameMasterConsole;
