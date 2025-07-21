import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  FileText
} from 'lucide-react';
import { User as UserType, Task } from '../../types';

interface TaskLogsProps {
  currentUser: UserType;
}

interface TaskLog {
  id: string;
  taskId: string;
  taskTitle: string;
  projectName: string;
  engineerId: string;
  engineerName: string;
  date: string;
  hoursLogged: number;
  status: 'COMPLETED' | 'ONGOING' | 'PENDING';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  location?: string;
}

const TaskLogs: React.FC<TaskLogsProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [engineerFilter, setEngineerFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('week');

  // Mock task logs data
  const mockTaskLogs: TaskLog[] = [
    {
      id: '1',
      taskId: '1',
      taskTitle: 'User Authentication System',
      projectName: 'E-commerce Platform',
      engineerId: '5',
      engineerName: 'Alex Thompson',
      date: '2024-01-20',
      hoursLogged: 8.5,
      status: 'ONGOING',
      priority: 'HIGH',
      description: 'Implemented JWT token validation and refresh mechanism',
      location: 'Office - Floor 3'
    },
    {
      id: '2',
      taskId: '2',
      taskTitle: 'Payment Gateway Integration',
      projectName: 'E-commerce Platform',
      engineerId: '6',
      engineerName: 'Emma Wilson',
      date: '2024-01-20',
      hoursLogged: 6.0,
      status: 'PENDING',
      priority: 'CRITICAL',
      description: 'Research and setup Stripe API integration',
      location: 'Remote'
    },
    {
      id: '3',
      taskTitle: 'Mobile UI Components',
      projectName: 'Mobile App Redesign',
      engineerId: '7',
      engineerName: 'James Miller',
      date: '2024-01-19',
      hoursLogged: 7.5,
      status: 'COMPLETED',
      priority: 'MEDIUM',
      description: 'Created reusable button and form components',
      location: 'Office - Floor 2'
    },
    {
      id: '4',
      taskId: '4',
      taskTitle: 'API Documentation',
      projectName: 'Mobile App Redesign',
      engineerId: '8',
      engineerName: 'Sophia Davis',
      date: '2024-01-19',
      hoursLogged: 4.0,
      status: 'ONGOING',
      priority: 'LOW',
      description: 'Documented user authentication endpoints',
      location: 'Remote'
    },
    {
      id: '5',
      taskId: '5',
      taskTitle: 'Database Migration',
      projectName: 'E-commerce Platform',
      engineerId: '9',
      engineerName: 'William Garcia',
      date: '2024-01-18',
      hoursLogged: 9.0,
      status: 'ONGOING',
      priority: 'HIGH',
      description: 'Migrated user tables to new schema',
      location: 'Office - Floor 3'
    },
    {
      id: '6',
      taskId: '6',
      taskTitle: 'Third-party API Setup',
      projectName: 'API Integration',
      engineerId: '10',
      engineerName: 'Olivia Martinez',
      date: '2024-01-18',
      hoursLogged: 5.5,
      status: 'PENDING',
      priority: 'MEDIUM',
      description: 'Configured external weather API connections',
      location: 'Remote'
    }
  ];

  const mockEngineers = [
    { id: '5', name: 'Alex Thompson' },
    { id: '6', name: 'Emma Wilson' },
    { id: '7', name: 'James Miller' },
    { id: '8', name: 'Sophia Davis' },
    { id: '9', name: 'William Garcia' },
    { id: '10', name: 'Olivia Martinez' }
  ];

  const mockProjects = [
    'E-commerce Platform',
    'Mobile App Redesign',
    'API Integration'
  ];

  const filteredLogs = mockTaskLogs.filter(log => {
    const matchesSearch = log.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.engineerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEngineer = engineerFilter === 'ALL' || log.engineerId === engineerFilter;
    const matchesProject = projectFilter === 'ALL' || log.projectName === projectFilter;
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    
    return matchesSearch && matchesEngineer && matchesProject && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'ONGOING': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-600';
      case 'HIGH': return 'text-orange-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'ONGOING': return <Play className="w-4 h-4 text-blue-600" />;
      case 'PENDING': return <Pause className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getLogStats = () => {
    const totalHours = filteredLogs.reduce((sum, log) => sum + log.hoursLogged, 0);
    const totalTasks = filteredLogs.length;
    const completedTasks = filteredLogs.filter(log => log.status === 'COMPLETED').length;
    const ongoingTasks = filteredLogs.filter(log => log.status === 'ONGOING').length;
    const avgHoursPerTask = totalTasks > 0 ? totalHours / totalTasks : 0;
    const activeEngineers = new Set(filteredLogs.map(log => log.engineerId)).size;

    return {
      totalHours: Math.round(totalHours * 10) / 10,
      totalTasks,
      completedTasks,
      ongoingTasks,
      avgHoursPerTask: Math.round(avgHoursPerTask * 10) / 10,
      activeEngineers
    };
  };

  const stats = getLogStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Task Logs</h1>
        <p className="text-gray-600">
          Monitor all engineer task progress and time logging across projects
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalHours}h</div>
              <div className="text-sm text-gray-600">Total  Hours</div>
              </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{stats.totalTasks}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{stats.ongoingTasks}</div>
          <div className="text-sm text-gray-600">Ongoing</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-purple-600">{stats.avgHoursPerTask}h</div>
          <div className="text-sm text-gray-600">Avg/Task</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-indigo-600">{stats.activeEngineers}</div>
          <div className="text-sm text-gray-600">Active Engineers</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks, engineers, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Engineer Filter */}
          <select
            value={engineerFilter}
            onChange={(e) => setEngineerFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Engineers</option>
            {mockEngineers.map(engineer => (
              <option key={engineer.id} value={engineer.id}>{engineer.name}</option>
            ))}
          </select>

          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Projects</option>
            {mockProjects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="ONGOING">Ongoing</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {/* Task Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Task Activity</h3>
          <p className="text-sm text-gray-600">Detailed view of all engineer task progress and time entries</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task & Engineer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours Logged
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{log.taskTitle}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {log.engineerName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">{log.engineerName}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{log.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.projectName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(log.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getPriorityColor(log.priority)}`}>
                      {log.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{log.hoursLogged}h</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.location || 'Not specified'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 mb-4">
            <FileText className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No task logs found</h3>
          <p className="text-gray-600">
            {searchTerm || engineerFilter !== 'ALL' || projectFilter !== 'ALL' || statusFilter !== 'ALL'
              ? 'Try adjusting your filters to see more task logs.'
              : 'No task activity has been logged yet.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskLogs;