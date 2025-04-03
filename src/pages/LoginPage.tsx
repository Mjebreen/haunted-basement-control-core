
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, User } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    
    try {
      await login(username, password);
      navigate('/master');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-haunted bg-haunted-texture bg-blend-overlay">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-gothic text-white mb-2 animate-glow">
            Fikri's Haunted Basement
          </h1>
          <p className="text-gray-300 ghost-text">Game Master Access</p>
        </div>
        
        <div className="haunted-panel rounded-lg p-8">
          <h2 className="text-2xl font-gothic text-center text-white mb-6">
            Enter the Basement
          </h2>
          
          {error && (
            <div className="bg-haunted-danger/20 border border-haunted-danger/40 text-white p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="ghost-input pl-10 w-full"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockKeyhole className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ghost-input pl-10 w-full"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Default login: fikri / haunted123
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isLoggingIn}
              className="haunted-button w-full py-3 flex items-center justify-center"
            >
              {isLoggingIn ? (
                <>
                  <span className="spinner mr-2"></span>
                  Entering...
                </>
              ) : (
                'Access Control Room'
              )}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-4">
          <a href="/" className="text-haunted-accent hover:text-haunted-highlight text-sm">
            Return to Player View
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
