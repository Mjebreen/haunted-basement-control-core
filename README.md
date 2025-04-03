# Haunted Basement Control Core

A real-time multiplayer experience where a Game Master controls the haunted basement experience from their device, while players try to escape using their own devices.

## Features

- **Multi-device gameplay**: One device acts as the Game Master (master), while other devices can join as players
- **Real-time communication**: All actions and game state changes are instantly synchronized across all connected devices
- **Game control system**: Start, pause, and control the game timer, send clues, and track puzzle progress
- **Atmospheric UI**: Dark, haunted theme perfect for escape room scenarios

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Network where all devices can communicate (same WiFi network)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourname/haunted-basement-control-core.git
   cd haunted-basement-control-core
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Start the server:
   ```bash
   npm run server
   ```

   Alternatively, you can build and start the server in one command:
   ```bash
   npm start
   ```

5. The application will be available at `http://YOUR_SERVER_IP:8080`

### Connecting Devices

1. **Find your server IP address**:
   - On Mac/Linux: Open terminal and type `ifconfig` or `ip addr show`
   - On Windows: Open command prompt and type `ipconfig`
   - Look for your local network IP address (usually starts with 192.168.x.x or 10.0.x.x)

2. **Connect the Master device (phone)**:
   - Open a browser on your phone and navigate to `http://YOUR_SERVER_IP:8080/master`
   - Log in with the master credentials
   - Now your phone is the Game Master controller

3. **Connect Player devices (Firestick)**:
   - Open a browser on the Firestick and navigate to `http://YOUR_SERVER_IP:8080`
   - This will load the player view automatically
   - The player view will show "Awaiting Game Start" until the Game Master starts the game

### Using the Application

#### Game Master Controls (Phone)
- **Start Game**: Set the game duration and start the timer
- **Send Clues**: Send hints to the players
- **Puzzles**: Mark puzzles as completed as players progress
- **Game Controls**: Pause, resume, add time, or end the game

#### Player View (Firestick)
- Shows a countdown timer
- Displays received clues
- Shows puzzle completion progress
- Displays success or failure screen at the end of the game

## Troubleshooting

If devices can't connect:
1. Make sure all devices are on the same network
2. Check firewall settings to ensure port 8080 is open
3. Try restarting the server
4. Verify you're using the correct IP address

## Development

To run the application in development mode:

```bash
npm run dev
```

## License

[MIT License](LICENSE)
