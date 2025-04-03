import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow connections from any origin
    methods: ['GET', 'POST']
  }
});

// Serve the built frontend app
app.use(express.static(path.join(__dirname, 'dist')));

// Default game state that will be shared across all clients
const defaultGameState = {
  isActive: false,
  timeRemaining: 3600, // 60 minutes
  startTime: null,
  endTime: null,
  clues: [],
};

// The current game state that will be updated and shared
let gameState = { ...defaultGameState };
let gameTimer = null;

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Send current game state to the newly connected client
  socket.emit('gameState', gameState);
  
  // Handle events from clients
  
  socket.on('startGame', ({ duration }) => {
    const now = Date.now();
    gameState = {
      ...defaultGameState,
      isActive: true,
      timeRemaining: duration,
      startTime: now,
      endTime: now + (duration * 1000),
      clues: [],
    };
    
    // Clear any existing timer
    if (gameTimer) {
      clearInterval(gameTimer);
    }
    
    // Start a timer to update the game state
    gameTimer = setInterval(() => {
      if (gameState.isActive) {
        if (gameState.timeRemaining <= 0) {
          // Time's up, end the game
          clearInterval(gameTimer);
          gameState = {
            ...gameState,
            isActive: false,
            timeRemaining: 0,
            endTime: Date.now(),
          };
        } else {
          // Update the time remaining
          gameState = {
            ...gameState,
            timeRemaining: gameState.timeRemaining - 1,
          };
        }
        // Broadcast updated game state to all clients
        io.emit('gameState', gameState);
      }
    }, 1000); // Update every second
    
    // Broadcast the initial game state to all clients
    io.emit('gameState', gameState);
  });
  
  socket.on('pauseGame', () => {
    gameState = {
      ...gameState,
      isActive: false,
    };
    io.emit('gameState', gameState);
  });
  
  socket.on('resumeGame', () => {
    gameState = {
      ...gameState,
      isActive: true,
    };
    io.emit('gameState', gameState);
  });
  
  socket.on('addTime', ({ seconds }) => {
    const newTimeRemaining = gameState.timeRemaining + seconds;
    gameState = {
      ...gameState,
      timeRemaining: newTimeRemaining,
      endTime: gameState.startTime ? gameState.startTime + (newTimeRemaining * 1000) : null,
    };
    io.emit('gameState', gameState);
  });
  
  socket.on('resetGame', () => {
    if (gameTimer) {
      clearInterval(gameTimer);
    }
    gameState = { ...defaultGameState };
    io.emit('gameState', gameState);
  });
  
  socket.on('endGame', ({ success }) => {
    if (gameTimer) {
      clearInterval(gameTimer);
    }
    gameState = {
      ...gameState,
      isActive: false,
      endTime: Date.now(),
    };
    io.emit('gameState', gameState);
  });
  
  socket.on('sendClue', ({ message }) => {
    const newClue = {
      id: Date.now().toString(),
      message,
      sentAt: Date.now(),
      isRead: false,
    };
    
    gameState = {
      ...gameState,
      clues: [...gameState.clues, newClue]
    };
    
    io.emit('gameState', gameState);
  });
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}); 