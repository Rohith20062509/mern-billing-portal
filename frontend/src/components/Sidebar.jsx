import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CreditCard, 
  History, 
  Users, 
  LogOut, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();

  const activeLinkClass = "flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-medium transition-all duration-200";
  const inactiveLinkClass = "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent transition-all duration-200";

  return (
    <aside className="w-64 glass-panel border-r border-white/5 flex flex-col justify-between h-screen sticky top-0">
      <div className="flex flex-col gap-8 p-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-extrabold text-white text-lg">S</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-none">SaaSFlow</h1>
            <span className="text-xs font-medium text-indigo-400">Billing Portal</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-2">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/plans" 
            className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}
          >
            <CreditCard className="h-5 w-5" />
            <span>Plans</span>
          </NavLink>

          <NavLink 
            to="/history" 
            className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}
          >
            <History className="h-5 w-5" />
            <span>Billing History</span>
          </NavLink>

          {/* Admin exclusive routes */}
          {isAdmin && (
            <>
              <div className="h-px bg-white/5 my-2" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-4">Admin Console</span>
              <NavLink 
                to="/users" 
                className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}
              >
                <Users className="h-5 w-5" />
                <span>Manage Users</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* User profile footer */}
      <div className="p-4 border-t border-white/5 bg-black/20 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold uppercase">
            {user?.name?.slice(0, 2)}
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-sm font-semibold text-white truncate leading-tight">{user?.name}</h4>
            <span className="text-[11px] text-gray-400 truncate block mt-0.5">{user?.email}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
            isAdmin 
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
          }`}>
            {isAdmin ? <ShieldCheck className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
            {user?.role}
          </span>
          <button 
            onClick={logout}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
