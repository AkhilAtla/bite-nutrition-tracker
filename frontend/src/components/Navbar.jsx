import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, LogOut, Utensils, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-4xl h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          bite.
        </Link>
        
        <div className="flex items-center gap-6">
          <button onClick={toggleTheme} className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {user && (
            <>
              <Link 
                to="/" 
                className={`flex items-center gap-2 font-medium transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary'}`}
              >
                <LayoutDashboard size={18} /> <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link 
                to="/tracker" 
                className={`flex items-center gap-2 font-medium transition-colors ${location.pathname === '/tracker' ? 'text-primary' : 'text-slate-600 dark:text-slate-300 hover:text-primary'}`}
              >
                <Utensils size={18} /> <span className="hidden sm:inline">Track Food</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors ml-2"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
