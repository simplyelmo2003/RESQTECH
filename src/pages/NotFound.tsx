// src/pages/NotFound.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! The page you are looking for does not exist.</p>
      <Button onClick={() => navigate('/')} variant="primary">
        Go Back Home
      </Button>
    </div>
  );
};

export default NotFound;
