import React, { useState } from 'react';
import { Menu, X, Bell, Settings } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/Auth/LoginPage';
import Sidebar from './components/Layout/Sidebar';
import UnifiedAnalytics from './components/Analytics/UnifiedAnalytics';
import ProjectGrid from './components/Projects/ProjectGrid';
import TaskList from './components/Tasks/TaskList';
import EnhancedTaskExecution from './components/Tasks/EnhancedTaskExecution';
import TrackProMilestone from './components/TrackPro/TrackProMilestone';
import EngineerTimesheet from './components/Timesheet/EngineerTimesheet';
import LocationModule from './components/Location/LocationModule';
import UserManagement from './components/UserManagement/UserManagement';
import TaskLogs from './components/TaskLogs/TaskLogs';
import PMAssignments from './components/PMAssignments/PMAssignments';
import Approvals from './components/Approvals/Approvals';
import UserSwitcher from './components/common/UserSwitcher';
import { Task } from './types';

function App() {
  const { currentUser, isLoading, isAuthenticated, login, switchUser, logout, allUsers } = useAuth();
  const [activeModule, setActiveModule] = useState('analytics');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock task data
  const mockTasks: Task[] = [
    {
      id: '1',
      projectId: '1',
      title: 'User Authentication System',
      description: 'Implement secure user authentication with JWT tokens and multi-factor authentication',
      assignedTo: '5', // Alex Thompson (Engineer)
      status: 'ONGOING',
      priority: 'HIGH',
      estimatedHours: 40,
      actualHours: 28,
      startDate: '2024-01-15',
      dueDate: '2024-02-15',
      dependencies: [],
      taskName: 'User Authentication System',
      subTask: 'JWT Implementation',
      assignedEngineers: ['5']
    },
    {
      id: '2',
      projectId: '1',
      title: 'Payment Gateway Integration',
      description: 'Integrate Stripe payment gateway for secure transactions',
      assignedTo: '5',
      status: 'PENDING',
      priority: 'CRITICAL',
      estimatedHours: 32,
      actualHours: 0,
      startDate: '2024-02-01',
      dueDate: '2024-02-28',
      dependencies: ['1'],
      taskName: 'Payment Gateway Integration',
      subTask: 'Stripe Setup',
      assignedEngineers: ['5']
    },
    {
      id: '3',
      projectId: '2',
      title: 'Mobile UI Components',
      description: 'Create reusable UI components for the mobile application',
      assignedTo: '5',
      status: 'COMPLETED',
      priority: 'MEDIUM',
      estimatedHours: 24,
      actualHours: 26,
      startDate: '2024-01-01',
      dueDate: '2024-01-31',
      dependencies: [],
      taskName: 'Mobile UI Components',
      subTask: 'Component Library',
      assignedEngineers: ['5']
    },
    {
      id: '4',
      projectId: '2',
      title: 'API Documentation',
      description: 'Document all API endpoints with examples and testing guidelines',
      assignedTo: '5',
      status: 'ONGOING',
      priority: 'LOW',
      estimatedHours: 16,
      actualHours: 8,
      startDate: '2024-02-05',
      dueDate: '2024-02-20',
      dependencies: [],
      taskName: 'API Documentation',
      subTask: 'Endpoint Documentation',
      assignedEngineers: ['5']
    }
  ];

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Chronos System...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated || !currentUser) {
    return <LoginPage onLogin={login} />;
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'analytics':
        return <UnifiedAnalytics currentUser={currentUser} />;
      case 'projects':
        return <ProjectGrid currentUser={currentUser} />;
      case 'tasks':
        return <TaskList currentUser={currentUser} tasks={mockTasks} />;
      case 'task-execution':
        return <EnhancedTaskExecution currentUser={currentUser} />;
      case 'trackpro':
        return <TrackProMilestone currentUser={currentUser} />;
      case 'timesheet':
        return <EngineerTimesheet currentUser={currentUser} />;
      case 'location':
        return <LocationModule currentUser={currentUser} />;
      case 'users':
        return <UserManagement currentUser={currentUser} />;
      case 'task-logs':
        return <TaskLogs currentUser={currentUser} />;
      case 'assignments':
        return <PMAssignments currentUser={currentUser} />;
      case 'approvals':
        return <Approvals currentUser={currentUser} />;
      default:
        return <UnifiedAnalytics currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        currentUser={currentUser}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        isCollapsed={sidebarCollapsed}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </button>
              
              <div className="hidden sm:block">
                <h2 className="text-xl font-semibold text-gray-900 capitalize">
                  {activeModule.replace('-', ' ')}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>

              {/* User Switcher */}
              <div className="w-64">
                <UserSwitcher
                  currentUser={currentUser}
                  allUsers={allUsers}
                  onUserSwitch={switchUser}
                  onLogout={logout}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderActiveModule()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {!sidebarCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
}

export default App;