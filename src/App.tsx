
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SocketProvider, useSocket } from "@/contexts/SocketContext";
import PlayerView from "./pages/PlayerView";
import GameMasterConsole from "./pages/GameMasterConsole";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-haunted">
      <div className="spinner"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Connection status component
const ConnectionStatus = ({ children }: { children: React.ReactNode }) => {
  const { isConnected, error } = useSocket();
  
  if (error) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-haunted-danger/80 text-white p-4 rounded-lg shadow-lg">
        <p className="font-bold">Connection Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  
  if (!isConnected) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-haunted-overlay/80 text-white p-4 rounded-lg shadow-lg">
        <p className="font-bold">Connecting to game server...</p>
        <div className="spinner mt-2"></div>
      </div>
    );
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <ConnectionStatus>
              <Routes>
                <Route path="/" element={<PlayerView />} />
                <Route path="/login" element={<LoginPage />} />
                <Route 
                  path="/master" 
                  element={
                    <ProtectedRoute>
                      <GameMasterConsole />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ConnectionStatus>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
