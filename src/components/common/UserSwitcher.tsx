import React, { useState } from 'react';
import { ChevronDown, User as UserIcon, LogOut } from 'lucide-react';
import { User } from '../../types';

interface UserSwitcherProps {
  currentUser: User;
  allUsers: User[];
  onUserSwitch: (userId: string) => void;
  onLogout?: () => void;
}

const UserSwitcher: React.FC<UserSwitcherProps> = ({ 
  currentUser, 
  allUsers, 
  onUserSwitch,
  onLogout 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TASS': return 'bg-purple-100 text-purple-800';
      case 'PMO': return 'bg-blue-100 text-blue-800';
      case 'PM': return 'bg-green-100 text-green-800';
      case 'TM': return 'bg-yellow-100 text-yellow-800';
      case 'ENGINEER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      const confirmLogout = confirm('Are you sure you want to log out?');
      if (confirmLogout) {
        onLogout();
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
          <p className={`text-xs px-2 py-1 rounded-full inline-block ${getRoleColor(currentUser.role)}`}>
            {currentUser.role}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-2">
              <div className="text-xs text-gray-500 px-3 py-2 font-medium uppercase tracking-wide">
                Switch User (Demo)
              </div>
              {allUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    onUserSwitch(user.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors ${
                    user.id === currentUser.id 
                      ? 'bg-blue-50 text-blue-900' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className={`text-xs px-2 py-1 rounded-full inline-block ${getRoleColor(user.role)}`}>
                      {user.role}
                    </p>
                  </div>
                  {user.id === currentUser.id && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))}
              
              {/* Logout Option */}
              {onLogout && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors hover:bg-red-50 text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserSwitcher;