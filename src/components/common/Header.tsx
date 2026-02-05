import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

interface HeaderProps {
  title?: string;
  type?: 'guest' | 'authenticated'; // Differentiate header for public vs logged-in
}

const Header: React.FC<HeaderProps> = ({ type = 'guest' }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-brand-navy via-brand-navy-alt to-brand-navy-light border-b-4 border-b-brand-teal shadow-lg py-4 px-6 flex justify-between items-center z-40 relative">
      <Link to={isAuthenticated && user ? (user.role === 'admin' ? '/admin/dashboard' : '/barangay/dashboard') : '/guest/home'} className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full overflow-hidden bg-white/95 flex items-center justify-center p-1 shadow-md ring-2 ring-brand-teal">
          <img src="/images/RESQTECH.png" alt="ResQTech" className="h-full w-full object-contain" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight drop-shadow">ResQTech</h1>
          <div className="text-sm text-brand-white drop-shadow">Disaster Management System</div>
        </div>
      </Link>

      <nav>
        {type === 'guest' && !isAuthenticated && (
          <ul className="flex items-center space-x-6">
            <li><Link to="/guest/home" className="text-brand-white/90 hover:text-brand-yellow transition-colors duration-200 font-medium">Home</Link></li>
            <li><Link to="/guest/report" className="text-brand-white/90 hover:text-brand-yellow transition-colors duration-200 font-medium">Report Incident</Link></li>
            <li><Link to="/guest/news" className="text-brand-white/90 hover:text-brand-yellow transition-colors duration-200 font-medium">News & Updates</Link></li>
            <li><Link to="/guest/verified-reports" className="text-brand-white/90 hover:text-brand-yellow transition-colors duration-200 font-medium">Verified Reports</Link></li>
            <li><Link to="/login" className="hidden md:inline-block"><Button variant="accent" size="sm">Login</Button></Link></li>
          </ul>
        )}

        {isAuthenticated && user && (
          <div className="flex items-center space-x-4">
            <span className="text-brand-white/90 text-sm hidden md:block">Welcome, <span className="font-semibold text-brand-yellow">{user.username || 'User'}</span> <span className="text-xs text-brand-white/70">({user.role})</span></span>
            <Button variant="accent" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;