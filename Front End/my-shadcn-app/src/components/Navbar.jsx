import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../redux/Auth/Action';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, MessageCircle, User, LogOut, PlusSquare, Search } from 'lucide-react';

const navItems = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/post', label: 'Post', icon: PlusSquare },
  { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/profile', label: 'Profile', icon: User },
];

const BottomNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navItems = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/post', icon: PlusSquare, label: 'Post' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-between items-center h-14 px-2 sm:hidden">
      {navItems.map(({ to, icon: Icon, label }) => (
        <Link
          key={to}
          to={to}
          className={`flex flex-col items-center justify-center flex-1 h-full text-xs ${location.pathname === to ? 'text-primary' : 'text-muted-foreground'} transition-colors`}
        >
          <Icon className={`w-6 h-6 mb-0.5 ${location.pathname === to ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">{label}</span>
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center justify-center flex-1 h-full text-xs text-muted-foreground transition-colors"
        aria-label="Logout"
        type="button"
      >
        <LogOut className="w-6 h-6 mb-0.5" />
        <span className="text-[10px]">Logout</span>
      </button>
    </nav>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const NavLink = ({ to, label, icon: Icon }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-base font-medium hover:bg-accent hover:text-accent-foreground w-full ${location.pathname === to ? 'bg-accent text-accent-foreground font-semibold' : 'text-muted-foreground'}`}
      onClick={() => setIsOpen(false)}
    >
      <Icon className="w-6 h-6" />
      <span className="hidden md:inline">{label}</span>
    </Link>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col bg-card border-r border-border z-40">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-20 px-6 border-b border-border">
            <Link to="/home" className="text-2xl font-bold text-primary tracking-tight">SocialApp</Link>
          </div>
          {/* Nav Links */}
          <nav className="flex-1 flex flex-col gap-1 py-6 px-2">
            {navItems.map((item) => (
              <NavLink key={item.to} {...item} />
            ))}
          </nav>
          {/* Logout at bottom */}
          <div className="px-4 py-6 border-t border-border">
            <Button variant="outline" className="w-full flex items-center gap-3" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar (no dash/hamburger button) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center px-4 z-50">
        <Link to="/home" className="text-xl font-bold text-primary tracking-tight flex-1">SocialApp</Link>
      </div>
      {/* Add left margin to main content on desktop */}
      <div className="md:ml-64" />
      {/* Instagram-style Bottom NavBar for mobile */}
      <BottomNavBar />
    </>
  );
};

export default Navbar;
