import React, { useState } from 'react';
import { Clock, Users, Code, Smartphone, ArrowRight, ChevronLeft } from 'lucide-react';
import { User } from '../types';
import EngineerApp from './EngineerApp';
import PMApp from './PMApp';
import TMApp from './TMApp';

interface MobileAppSelectorProps {
  currentUser: User;
  onLogout: () => void;
  onBackToDesktop: () => void;
}

const MobileAppSelector: React.FC<MobileAppSelectorProps> = ({ 
  currentUser, 
  onLogout, 
  onBackToDesktop 
}) => {
  const [selectedApp, setSelectedApp] = useState<'engineer' | 'pm' | 'tm' | null>(null);

  // Determine available apps based on user role
  const getAvailableApps = () => {
    const apps = [];
    
    if (currentUser.role === 'ENGINEER') {
      apps.push({
        id: 'engineer' as const,
        name: 'Engineer Mobile',
        description: 'Task execution, time tracking, and calendar view',
        icon: Code,
        color: 'from-blue-500 to-indigo-600',
        features: ['Task Management', 'Time Tracking', 'Calendar View', 'Timesheet Requests']
      });
    }
    
    if (currentUser.role === 'PM' || currentUser.role === 'PM_DEPT_HEAD') {
      apps.push({
        id: 'pm' as const,
        name: 'PM Mobile',
        description: 'Project management and team coordination',
        icon: Users,
        color: 'from-green-500 to-blue-600',
        features: ['Project Overview', 'Task Management', 'Team Management', 'Approvals']
      });
    }
    
    if (currentUser.role === 'TM' || currentUser.role === 'TM_DEPT_HEAD') {
      apps.push({
        id: 'tm' as const,
        name: 'TM Mobile',
        description: 'Technical leadership and architecture oversight',
        icon: Code,
        color: 'from-purple-500 to-blue-600',
        features: ['Technical Projects', 'Architecture Tasks', 'Engineering Team', 'Technical Reviews']
      });
    }
    
    return apps;
  };

  const availableApps = getAvailableApps();

  // If user has selected an app, render it
  if (selectedApp === 'engineer') {
    return <EngineerApp currentUser={currentUser} onLogout={onLogout} />;
  }
  
  if (selectedApp === 'pm') {
    return <PMApp currentUser={currentUser} onLogout={onLogout} />;
  }
  
  if (selectedApp === 'tm') {
    return <TMApp currentUser={currentUser} onLogout={onLogout} />;
  }

  // Show app selector
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm border-b border-white border-opacity-20 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToDesktop}
            className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back to Desktop</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Chronos Mobile</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome, {currentUser.name}</h2>
          <p className="text-blue-200">Choose your mobile application to get started</p>
        </div>

        {/* Available Apps */}
        <div className="space-y-4">
          {availableApps.map((app) => {
            const IconComponent = app.icon;
            
            return (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app.id)}
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${app.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{app.name}</h3>
                    <p className="text-sm text-blue-200">{app.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white opacity-60" />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {app.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-blue-100">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Apps Available */}
        {availableApps.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-white opacity-60" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Mobile Apps Available</h3>
            <p className="text-blue-200 mb-6">
              Your role ({currentUser.role}) doesn't have access to mobile applications.
            </p>
            <button
              onClick={onBackToDesktop}
              className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-30 transition-colors"
            >
              Return to Desktop
            </button>
          </div>
        )}

        {/* User Info */}
        <div className="mt-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">{currentUser.name}</p>
              <p className="text-sm text-blue-200">{currentUser.role} • {currentUser.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="text-blue-200 hover:text-white transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppSelector;