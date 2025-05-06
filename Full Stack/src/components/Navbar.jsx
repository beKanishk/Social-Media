import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/Auth/Action';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // redirect after logout
  };
  

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold">
            <Link to="/home">SocialApp</Link>
          </div>

          {/* Hamburger (Mobile) */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="text-2xl">&#9776;</span>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6">
            <Link to="/post" className="hover:text-yellow-400">Post</Link>
            <Link to="/chat" className="hover:text-yellow-400">Chat</Link>
            <Link to="/profile" className="hover:text-yellow-400">Profile</Link>
            <button onClick={handleLogout} className="block hover:text-yellow-400">
              Logout
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden" id="mobile-menu">
          <div className="px-4 pb-4 space-y-2">
            <Link to="/home" className="block hover:text-yellow-400">Home</Link>
            <Link to="/chat" className="block hover:text-yellow-400">Chat</Link>
            <Link to="/profile" className="block hover:text-yellow-400">Profile</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
