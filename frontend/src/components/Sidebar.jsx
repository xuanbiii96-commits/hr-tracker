import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiCalendar, FiClock, FiLogOut, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import useAuthStore from '../store/authStore';

function Sidebar({ isOpen, setIsOpen }) {
  const logout = useAuthStore(state => state.logout);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: FiHome },
    { name: 'Leave', path: '/leave', icon: FiCalendar },
    { name: 'Shifts', path: '/shifts', icon: FiClock },
    { name: 'Calendar', path: '/calendar', icon: FiCalendar },
    { name: 'Attendance', path: '/attendance', icon: FiClock },
  ];

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} flex flex-col`}>
      <div className="p-4 flex items-center justify-between">
        {isOpen && <h1 className="text-2xl font-bold">HR Tracker</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-800 rounded-lg"
        >
          {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-4">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-4 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Icon size={20} />
              {isOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center space-x-4 w-full px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <FiLogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
