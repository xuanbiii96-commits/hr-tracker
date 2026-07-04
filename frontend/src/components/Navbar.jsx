import React from 'react';
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';

function Navbar({ onToggleSidebar }) {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <button onClick={onToggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
        <FiMenu size={24} />
      </button>

      <div className="flex items-center space-x-6">
        <button className="p-2 hover:bg-gray-100 rounded-lg relative">
          <FiBell size={20} />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <FiUser size={20} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
