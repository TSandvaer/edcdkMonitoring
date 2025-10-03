import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-dark-purple-900 h-screen fixed left-0 top-0 flex flex-col p-6">
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-vibrant-cyan text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-2">
        <Link
          to="/"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
            isActive('/')
              ? 'bg-dark-purple-700 text-white'
              : 'text-gray-400 hover:bg-dark-purple-700 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span>Overview</span>
        </Link>

        <a
          href="#"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-purple-700 hover:text-white transition"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          <span>Analytics</span>
        </a>

        <a
          href="#"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-purple-700 hover:text-white transition"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span>Settings</span>
        </a>
      </nav>

      {/* Monitoring Section */}
      <div className="mt-10">
        <h3 className="text-gray-500 text-xs uppercase font-semibold mb-3">Monitoring</h3>
        <div className="flex flex-col space-y-2">
          <Link to="/frontpage" className="text-gray-400 hover:text-white text-sm px-4 py-2">
            Frontpage (1)
          </Link>
          <Link to="/index-pages" className="text-gray-400 hover:text-white text-sm px-4 py-2">
            Bolig Pages (10)
          </Link>
        </div>
      </div>
    </div>
  );
};
