import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';

// Game state types
export interface GameState {
  isActive: boolean;
  timeRemaining: number; // in seconds
  startTime: number | null; // timestamp
  endTime: number | null; // timestamp
  clues: Clue[];
}

export interface Clue {
  id: string;
  message: string;
  sentAt: number;
  isRead: boolean;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  gameState: GameState | null;
  error: string | null;
  sendClue: (message: string) => void;
  startGame: (duration: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  addTime: (seconds: number) => void;
  resetGame: () => void;
  endGame: (success: boolean) => void;
}

// Default game state
const defaultGameState: GameState = {
  isActive: false,
  timeRemaining: 3600, // 60 minutes
  startTime: null,
  endTime: null,
  clues: [],
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  gameState: null,
  error: null,
  sendClue: () => {},
  startGame: () => {},
  pauseGame: () => {},
  resumeGame: () => {},
  addTime: () => {},
  resetGame: () => {},
  endGame: () => {},
});

// Determine the socket URL based on the current environment
const getSocketUrl = () => {
  // In production, we'll use the current hostname
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : '';
  
  return `${protocol}//${host}${port}`;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Create a real socket connection - this enables multi-device communication
    const newSocket = io(getSocketUrl());
    
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      toast({
        title: "Connected to game server",
        description: "You are now connected to the Haunted Basement",
      });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      toast({
        title: "Disconnected from game server",
        description: "Connection lost to the Haunted Basement",
        variant: "destructive"
      });
    });

    newSocket.on('connect_error', (err) => {
      setError(`Connection error: ${err.message}`);
      toast({
        title: "Connection error",
        description: `Failed to connect: ${err.message}`,
        variant: "destructive"
      });
    });

    newSocket.on('gameState', (newGameState: GameState) => {
      setGameState(newGameState);
    });

    // Clean up socket connection on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [toast]);

  // Game control functions
  const sendClue = (message: string) => {
    if (!socket || !isConnected) return;
    
    // Emit the clue to the server so all connected clients receive it
    socket.emit('sendClue', { message });
    
    toast({
      title: "Clue sent",
      description: `"${message.substring(0, 30)}${message.length > 30 ? '...' : ''}"`,
    });
  };

  const startGame = (duration: number) => {
    if (!socket || !isConnected) return;
    
    // Emit start game event to the server
    socket.emit('startGame', { duration });
    
    toast({
      title: "Game started",
      description: `Time set to ${Math.floor(duration / 60)} minutes`,
    });
  };

  const pauseGame = () => {
    if (!socket || !isConnected || !gameState) return;
    
    // Emit pause game event to the server
    socket.emit('pauseGame');
    
    toast({
      title: "Game paused",
      description: `Time remaining: ${formatTime(gameState.timeRemaining)}`,
    });
  };

  const resumeGame = () => {
    if (!socket || !isConnected || !gameState) return;
    
    // Emit resume game event to the server
    socket.emit('resumeGame');
    
    toast({
      title: "Game resumed",
      description: `Time remaining: ${formatTime(gameState.timeRemaining)}`,
    });
  };

  const addTime = (seconds: number) => {
    if (!socket || !isConnected || !gameState) return;
    
    // Emit add time event to the server
    socket.emit('addTime', { seconds });
    
    toast({
      title: "Time added",
      description: `Added ${seconds} seconds to the clock`,
    });
  };

  const resetGame = () => {
    if (!socket || !isConnected) return;
    
    // Emit reset game event to the server
    socket.emit('resetGame');
    
    toast({
      title: "Game reset",
      description: "Game has been reset to initial state",
    });
  };

  const endGame = (success: boolean) => {
    if (!socket || !isConnected) return;
    
    // Emit end game event to the server
    socket.emit('endGame', { success });
    
    toast({
      title: success ? "Game Completed Successfully" : "Game Failed",
      description: success 
        ? "Players have successfully escaped!" 
        : "Players failed to escape in time",
      variant: success ? "default" : "destructive",
    });
  };

  // Utility function to format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        gameState,
        error,
        sendClue,
        startGame,
        pauseGame,
        resumeGame,
        addTime,
        resetGame,
        endGame,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
