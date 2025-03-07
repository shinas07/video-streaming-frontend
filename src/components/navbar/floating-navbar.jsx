"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  HomeIcon, 
  VideoCameraIcon, 
  UserCircleIcon,
  FilmIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const defaultNavItems = [
  {
    name: "Home",
    path: "/",
    icon: <HomeIcon className="w-4 h-4" />,
  },
  {
    name: "Videos",
    path: "/videos",
    icon: <FilmIcon className="w-4 h-4" />,
  },
  {
    name: "Upload",
    path: "/video/upload/",
    icon: <VideoCameraIcon className="w-4 h-4" />,
  },
];

export const FloatingNav = ({ className = "", customNavItems }) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { logout } = useAuth();
  const navItems = customNavItems || defaultNavItems;

  useEffect(() => {
    // Check localStorage for user data
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []); // Check on mount

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from AuthContext

      setIsLoggedIn(false); // Update state
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current - scrollYProgress.getPrevious();

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={`
          flex max-w-fit fixed top-10 inset-x-0 mx-auto 
          border border-gray-800 rounded-full bg-black 
          backdrop-blur-md shadow-lg z-50 pr-2 pl-8 py-2 
          items-center justify-center space-x-4
          ${className}
        `}
      >
        {navItems.map((navItem, idx) => (
          <button
            key={`nav-item-${idx}`}
            onClick={() => navigate(navItem.path)}
            className="relative text-gray-300 hover:text-white items-center flex 
                     space-x-1 transition-colors duration-200"
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-sm font-medium transition duration-200 group-hover:text-lg">
              {navItem.name}
            </span>
          </button>
        ))}
        
        {/* Login/Register Button */}
        <div className="relative group">
          <motion.div
            className="absolute -inset-0.5 rounded-full 
                     bg-gradient-to-r 
                     opacity-75 group-hover:opacity-100 
                     transition duration-200 blur"
          />
          <button
            onClick={isLoggedIn ? handleLogout : () => navigate('/signin')}
            className="relative px-4 py-2 rounded-full 
                     bg-black text-sm font-medium text-white 
                     border border-gray-800 group-hover:border-gray-700 
                     transition duration-200 hover:text-blue-400"
          >
            {isLoggedIn ? 'Logout' : 'Login'}
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px 
                         bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingNav;
