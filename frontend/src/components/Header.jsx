import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar } from 'lucide-react';

const Header = ({ title }) => {
  const { user } = useAuth();
  
  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-[#0b0f19]/40 backdrop-blur-md">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        <p className="text-xs text-gray-400 mt-1">
          Welcome back, <span className="font-semibold text-indigo-400">{user?.name}</span>!
        </p>
      </div>

      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/5 text-gray-300 text-xs font-medium">
        <Calendar className="h-4 w-4 text-indigo-400" />
        <span>{formatDate()}</span>
      </div>
    </header>
  );
};

export default Header;
