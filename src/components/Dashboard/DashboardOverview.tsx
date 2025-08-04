import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Calendar,
  BarChart3,
  Activity
} from 'lucide-react';
import { User } from '../../types';

interface DashboardOverviewProps {
  currentUser: User;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ currentUser }) => {
  const getStatsForRole = (role: string) => {
    switch (role) {
      case 'TASS':
        return [
          { label: 'Active Projects', value: '24', change: '+12%', icon: TrendingUp, color: 'blue' },
          { label: 'Total Engineers', value: '156', change: '+3%', icon: Users, color: 'green' },
          { label: 'System Uptime', value: '99.9%', change: '0%', icon: Activity, color: 'indigo' },
          { label: 'Monthly Budget', value: '$2.4M', change: '+8%', icon: BarChart3, color: 'purple' },
        ];
      case 'PMO':
        return [
          { label: 'Projects Assigned', value: '18', change: '+5%', icon: TrendingUp, color: 'blue' },
          { label: 'PMs Active', value: '12', change: '+2%', icon: Users, color: 'green' },
          { label: 'Pending Assignments', value: '3', change: '-1', icon: AlertTriangle, color: 'orange' },
          { label: 'Completion Rate', value: '87%', change: '+4%', icon: CheckCircle, color: 'green' },
        ];
      case 'PM':
      case 'TM':
        return [
          { label: 'Active Tasks', value: '32', change: '+8%', icon: CheckCircle, color: 'blue' },
          { label: 'Team Members', value: '8', change: '0%', icon: Users, color: 'green' },
          { label: 'Pending Approvals', value: '5', change: '+2', icon: Clock, color: 'orange' },
          { label: 'Project Progress', value: '74%', change: '+12%', icon: TrendingUp, color: 'purple' },
        ];
      case 'ENGINEER':
        return [
          { label: 'My Tasks', value: '6', change: '+1', icon: CheckCircle, color: 'blue' },
          { label: 'Hours This Week', value: '32.5', change: '+4.2', icon: Clock, color: 'green' },
          { label: 'Pending Requests', value: '2', change: '0', icon: AlertTriangle, color: 'orange' },
          { label: 'Completion Rate', value: '94%', change: '+2%', icon: TrendingUp, color: 'purple' },
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole(currentUser.role);

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500 text-blue-100',
      green: 'bg-green-500 text-green-100',
      orange: 'bg-orange-500 text-orange-100',
      purple: 'bg-purple-500 text-purple-100',
      indigo: 'bg-indigo-500 text-indigo-100',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getRecentActivity = (role: string) => {
    switch (role) {
      case 'TASS':
        return [
          { action: 'Created project "Mobile App Redesign"', time: '2 hours ago', type: 'create' },
          { action: 'Assigned PM to "E-commerce Platform"', time: '4 hours ago', type: 'assign' },
          { action: 'System backup completed', time: '6 hours ago', type: 'system' },
        ];
      case 'PMO':
        return [
          { action: 'Assigned Lisa Rodriguez to "Web Portal"', time: '1 hour ago', type: 'assign' },
          { action: 'Reviewed project scope for "API Integration"', time: '3 hours ago', type: 'review' },
          { action: 'Updated resource allocation', time: '5 hours ago', type: 'update' },
        ];
      case 'PM':
      case 'TM':
        return [
          { action: 'Approved overtime request from Alex', time: '30 min ago', type: 'approve' },
          { action: 'Created task "Database Migration"', time: '2 hours ago', type: 'create' },
          { action: 'Updated project timeline', time: '4 hours ago', type: 'update' },
        ];
      case 'ENGINEER':
        return [
          { action: 'Completed task "User Authentication"', time: '1 hour ago', type: 'complete' },
          { action: 'Submitted overtime request', time: '3 hours ago', type: 'request' },
          { action: 'Started timer for "API Testing"', time: '5 hours ago', type: 'start' },
        ];
      default:
        return [];
    }
  };

  const recentActivity = getRecentActivity(currentUser.role);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {currentUser.name}!
        </h1>
        <p className="text-blue-100">
          {currentUser.role === 'ENGINEER' 
            ? "Ready to tackle today's tasks? Your current workload and progress are looking great."
            : "Here's your command center for managing projects and teams efficiently."
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${getColorClasses(stat.color)} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') 
                    ? 'text-green-600' 
                    : stat.change.startsWith('-') 
                      ? 'text-red-600' 
                      : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {currentUser.role === 'ENGINEER' ? (
              <>
                <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Start Timer</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Submit Request</span>
                </button>
              </>
            ) : (
              <>
                <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Create Project</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Assign Resources</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;