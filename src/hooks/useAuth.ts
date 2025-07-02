import { useState, useEffect } from 'react';
import { User } from '../types';

const mockUsers: User[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@chronos.com', role: 'TASS' },
  { id: '2', name: 'Mike Chen', email: 'mike@chronos.com', role: 'PMO' },
  { id: '3', name: 'Lisa Rodriguez', email: 'lisa@chronos.com', role: 'PM' },
  { id: '4', name: 'David Kim', email: 'david@chronos.com', role: 'TM' },
  { id: '5', name: 'Alex Thompson', email: 'alex@chronos.com', role: 'ENGINEER' },
  // New Department Head roles
  { id: '18', name: 'Robert Martinez', email: 'robert@chronos.com', role: 'PM_DEPT_HEAD' },
  { id: '19', name: 'Jennifer Lee', email: 'jennifer@chronos.com', role: 'TM_DEPT_HEAD' },
  // Sample Engineers with Departments
  { id: '20', name: 'John Cruz', email: 'john.cruz@chronos.com', role: 'ENGINEER', department: 'ITSD' },
  { id: '21', name: 'Maria Santos', email: 'maria.santos@chronos.com', role: 'ENGINEER', department: 'DIG' },
  { id: '22', name: 'Allan Reyes', email: 'allan.reyes@chronos.com', role: 'ENGINEER', department: 'BSD' },
  { id: '23', name: 'Kim De Vera', email: 'kim.devera@chronos.com', role: 'ENGINEER', department: 'TSD' },
  { id: '24', name: 'Joseph Mendoza', email: 'joseph.mendoza@chronos.com', role: 'ENGINEER', department: 'DIG' },
  { id: '25', name: 'Ella Navarro', email: 'ella.navarro@chronos.com', role: 'ENGINEER', department: 'BSD' },
  { id: '26', name: 'Danilo Garcia', email: 'danilo.garcia@chronos.com', role: 'ENGINEER', department: 'ITSD' },
  { id: '27', name: 'Erika Lim', email: 'erika.lim@chronos.com', role: 'ENGINEER', department: 'TSD' },
  { id: '28', name: 'Nico Alvarez', email: 'nico.alvarez@chronos.com', role: 'ENGINEER', department: 'DIG' },
  { id: '29', name: 'Faith Domingo', email: 'faith.domingo@chronos.com', role: 'ENGINEER', department: 'BSD' },
];

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUserId = localStorage.getItem('chronos_user_id');
    const savedAuthToken = localStorage.getItem('chronos_auth_token');
    
    if (savedUserId && savedAuthToken) {
      const user = mockUsers.find(u => u.id === savedUserId);
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        // Invalid saved data, clear it
        localStorage.removeItem('chronos_user_id');
        localStorage.removeItem('chronos_auth_token');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    
    // Save session data
    localStorage.setItem('chronos_user_id', user.id);
    localStorage.setItem('chronos_auth_token', `token_${user.id}_${Date.now()}`);
    localStorage.setItem('chronos_login_time', new Date().toISOString());
  };

  const switchUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user && isAuthenticated) {
      setCurrentUser(user);
      localStorage.setItem('chronos_user_id', userId);
      // Keep the same auth token for user switching
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    // Clear session data
    localStorage.removeItem('chronos_user_id');
    localStorage.removeItem('chronos_auth_token');
    localStorage.removeItem('chronos_login_time');
  };

  const getSessionInfo = () => {
    const loginTime = localStorage.getItem('chronos_login_time');
    const authToken = localStorage.getItem('chronos_auth_token');
    
    return {
      loginTime: loginTime ? new Date(loginTime) : null,
      authToken,
      isValid: !!(currentUser && authToken)
    };
  };

  return {
    currentUser,
    isLoading,
    isAuthenticated,
    login,
    switchUser,
    logout,
    getSessionInfo,
    allUsers: mockUsers,
  };
};