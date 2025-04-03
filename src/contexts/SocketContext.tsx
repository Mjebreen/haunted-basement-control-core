
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';

// Game state types
export interface GameState {
  isActive: boolean;
  timeRemaining: number; // in seconds
  startTime: number | null; // timestamp
  endTime: number | null; // timestamp
  puzzles: Puzzle[];
  clues: Clue[];
}

export interface Puzzle {
  id: string;
  name: string;
  isCompleted: boolean;
  completedAt: number | null;
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
  completePuzzle: (puzzleId: string) => void;
  resetGame: () => void;
  endGame: (success: boolean) => void;
}

// Default game state
const defaultGameState: GameState = {
  isActive: false,
  timeRemaining: 3600, // 60 minutes
  startTime: null,
  endTime: null,
  puzzles: [
    { id: 'puzzle1', name: 'Find the key', isCompleted: false, completedAt: null },
    { id: 'puzzle2', name: 'Decode the cipher', isCompleted: false, completedAt: null },
    { id: 'puzzle3', name: 'Unlock the chest', isCompleted: false, completedAt: null },
    { id: 'puzzle4', name: 'Discover the ritual', isCompleted: false, completedAt: null },
    { id: 'puzzle5', name: 'Escape the basement', isCompleted: false, completedAt: null },
  ],
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
  completePuzzle: () => {},
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

// For development, use a mocked socket for local testing
// In production, this would connect to the actual server
const createMockSocket = () => {
  // This is a simplified mock for development purposes
  const mockSocket = {
    id: 'mock-socket-id',
    connected: true,
    on: (event: string, callback: any) => {
      console.log(`Registered event: ${event}`);
      if (event === 'connect') {
        setTimeout(() => callback(), 500);
      }
      if (event === 'gameState') {
        setTimeout(() => callback(defaultGameState), 1000);
      }
    },
    emit: (event: string, ...args: any[]) => {
      console.log(`Emitted event: ${event}`, args);
    },
    connect: () => {
      console.log('Mock socket connecting');
      mockSocket.connected = true;
    },
    disconnect: () => {
      console.log('Mock socket disconnecting');
      mockSocket.connected = false;
    },
  } as unknown as Socket;

  return mockSocket;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // For development, use a mocked socket to simulate connection
    // In production, you'd connect to your actual Socket.IO server using the dynamic URL
    
    // Uncomment this line to use a real socket in production
    // const newSocket = io(getSocketUrl());
    
    // Using mock socket for demonstration
    const newSocket = createMockSocket();
    
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
    
    // In a real implementation, this would emit to the server
    // socket.emit('sendClue', { message });
    
    // For mock implementation update local state
    const newClue = {
      id: Date.now().toString(),
      message,
      sentAt: Date.now(),
      isRead: false,
    };
    
    if (gameState) {
      setGameState({
        ...gameState,
        clues: [...gameState.clues, newClue]
      });
      
      toast({
        title: "Clue sent",
        description: `"${message.substring(0, 30)}${message.length > 30 ? '...' : ''}"`,
      });
    }
  };

  const startGame = (duration: number) => {
    if (!socket || !isConnected) return;
    
    // In a real implementation, this would emit to the server
    // socket.emit('startGame', { duration });
    
    // For mock implementation update local state
    const now = Date.now();
    setGameState({
      ...defaultGameState,
      isActive: true,
      timeRemaining: duration,
      startTime: now,
      endTime: now + (duration * 1000),
      clues: [],
    });
    
    toast({
      title: "Game started",
      description: `Time set to ${Math.floor(duration / 60)} minutes`,
    });
  };

  const pauseGame = () => {
    if (!socket || !isConnected || !gameState) return;
    
    // In a real implementation, this would emit to the server
    // socket.emit('pauseGame');
    
    // For mock implementation update local state
    setGameState({
      ...gameState,
      isActive: false,
    });
    
    toast({
      title: "Game paused",
      description: `Time remaining: ${formatTime(gameState.timeRemaining)}`,
    });
  };

  const resumeGame = () => {
    if (!socket || !isConnected || !gameState) return;
    
    // In a real implementation, this would emit to the server
    // socket.emit('resumeGame');
    
    // For mock implementation update local state
    setGameState({
      ...gameState,
      isActive: true,
    });
    
    toast({
      title: "Game resumed",
      description: `Time remaining: ${formatTime(gameState.timeRemaining)}`,
    });
  };

  const addTime = (seconds: number) => {
    if (!socket || !isConnected || !gameState) return;
    
    // In a real implementation, this would emit to the server
    // socket.emit('addTime', { seconds });
    
    // For mock implementation update local state
    const newTimeRemaining = gameState.timeRemaining + seconds;
    setGameState({
      ...gameState,
      timeRemaining: newTimeRemaining,
      endTime: gameState.startTime ? gameState.startTime + (newTimeRemaining * 1000) : null,
    });
    
    toast({
      title: seconds > 0 ? "Time added" : "Time subtracted",
      description: `${Math.abs(seconds / 60)} minutes ${seconds > 0 ? 'added' : 'subtracted'}`,
    });
  };

  const completePuzzle = (puzzleId: string) => {
    if (!socket || !isConnected || !gameState) return;
    
    // In a real implementation, this would emit to the server
    // socket.emit('completePuzzle', { puzzleId });
    
    // For mock implementation update local state
    const updatedPuzzles = gameState.puzzles.map(puzzle => 
      puzzle.id === puzzleId 
        ? { ...puzzle, isCompleted: true, completedAt: Date.now() } 
        : puzzle
    );
    
    setGameState({
      ...gameState,
      puzzles: updatedPuzzles,
    });
    
    const puzzleName = gameState.puzzles.find(p => p.id === puzzleId)?.name || 'Unknown puzzle';
    
    toast({
      title: "Puzzle completed",
      description: puzzleName,
    });
  };

  const resetGame = () => {
    if (!socket || !isConnected) return;
    
    // In a real implementation, this would emit to the server
    // socket.emit('resetGame');
    
    // For mock implementation update local state
    setGameState(defaultGameState);
    
    toast({
      title: "Game reset",
      description: "All progress has been reset",
    });
  };

  const endGame = (success: boolean) => {
    if (!socket || !isConnected || !gameState) return;
    
    // In a real implementation, this would emit to the server
    // socket.emit('endGame', { success });
    
    // For mock implementation update local state
    setGameState({
      ...gameState,
      isActive: false,
      endTime: Date.now(),
    });
    
    toast({
      title: success ? "Game completed successfully" : "Game failed",
      description: success ? "Players have escaped!" : "The players didn't make it out in time",
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
        completePuzzle,
        resetGame,
        endGame,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
