
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-haunted text-white">
      <div className="text-center">
        <h1 className="text-4xl font-gothic mb-4">Fikri's Haunted Basement</h1>
        <p className="text-xl text-gray-300 mb-6">Loading experience...</p>
        <div className="spinner mx-auto"></div>
      </div>
    </div>
  );
};

export default Index;
