import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Clock, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  User,
  Settings,
  LogOut,
  Plus,
  Target,
  Timer,
  MapPin,
  Bell,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Upload,
  Camera
} from 'lucide-react';
import { User as UserType, Task } from '../types';
import { useTimer } from '../hooks/useTimer';

interface EngineerAppProps {
  currentUser: UserType;
  onLogout: () => void;
}

interface TaskCompletionData {
  taskId: string;
  remarks: string;
  attachments: File[];
  completionDate: string;
}

const EngineerApp: React.FC<EngineerAppProps> = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'calendar' | 'timesheet' | 'profile'>('tasks');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { activeTimer, elapsedTime, startTimer, stopTimer, formatTime, isActive } = useTimer();

  // Mock tasks data
  const mockTasks: Task[] = [
    {
      id: '1',
      projectId: '1',
      title: 'User Authentication System',
      description: 'Implement secure user authentication with JWT tokens',
      assignedTo: currentUser.id,
      status: 'ONGOING',
      priority: 'HIGH',
      estimatedHours: 40,
      actualHours: 28,
      startDate: '2024-12-15',
      dueDate: '2024-12-28',
      dependencies: [],
      taskName: 'User Authentication System',
      subTask: 'JWT Implementation',
      assignedEngineers: [currentUser.id]
    },
    {
      id: '2',
      projectId: '1',
      title: 'Payment Gateway Integration',
      description: 'Integrate Stripe payment gateway for secure transactions',
      assignedTo: currentUser.id,
      status: 'PENDING',
      priority: 'CRITICAL',
      estimatedHours: 32,
      actualHours: 0,
      startDate: '2024-12-20',
      dueDate: '2025-01-05',
      dependencies: ['1'],
      taskName: 'Payment Gateway Integration',
      subTask: 'Stripe Setup',
      assignedEngineers: [currentUser.id]
    },
    {
      id: '3',
      projectId: '2',
      title: 'Mobile UI Components',
      description: 'Create reusable UI components for the mobile application',
      assignedTo: currentUser.id,
      status: 'COMPLETED',
      priority: 'MEDIUM',
      estimatedHours: 24,
      actualHours: 26,
      startDate: '2024-12-01',
      dueDate: '2024-12-12',
      dependencies: [],
      taskName: 'Mobile UI Components',
      subTask: 'Component Library',
      assignedEngineers: [currentUser.id]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-50';
      case 'ONGOING': return 'text-blue-600 bg-blue-50';
      case 'PENDING': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleTimerToggle = (taskId: string, taskTitle: string) => {
    const isCurrentTaskActive = isActive && activeTimer?.taskId === taskId;
    
    if (isCurrentTaskActive) {
      stopTimer();
    } else {
      startTimer(taskId, taskTitle);
    }
  };

  const handleTaskComplete = (task: Task) => {
    setSelectedTask(task);
    setIsCompletionModalOpen(true);
  };

  const handleTaskCompletionSubmit = (data: TaskCompletionData) => {
    console.log('Task completion data:', data);
    alert(`✅ Task "${selectedTask?.title}" completed successfully!\n\n📋 Completion remarks and attachments have been saved.`);
    setIsCompletionModalOpen(false);
    setSelectedTask(null);
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentDate.getMonth() && 
           today.getFullYear() === currentDate.getFullYear();
  };

  const getTasksForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return mockTasks.filter(task => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.dueDate);
      const currentDateObj = new Date(dateStr);
      
      return currentDateObj >= taskStart && currentDateObj <= taskEnd;
    });
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-16 bg-gray-50"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const tasksForDay = getTasksForDate(day);
      const isCurrentDay = isToday(day);

      days.push(
        <div 
          key={day} 
          className={`h-16 border border-gray-200 p-1 ${
            isCurrentDay ? 'bg-blue-50 border-blue-300' : 'bg-white'
          }`}
        >
          <div className={`text-xs font-semibold ${
            isCurrentDay ? 'text-blue-700' : 'text-gray-700'
          }`}>
            {day}
          </div>
          
          <div className="space-y-1">
            {tasksForDay.slice(0, 2).map((task, index) => (
              <div
                key={`${task.id}-${day}`}
                className={`text-xs p-1 rounded-sm ${
                  task.status === 'COMPLETED' ? 'bg-green-500 text-white' :
                  task.status === 'ONGOING' ? 'bg-blue-500 text-white' :
                  'bg-purple-500 text-white'
                }`}
              >
                <div className="truncate font-medium">{task.title}</div>
              </div>
            ))}
            
            {tasksForDay.length > 2 && (
              <div className="text-xs text-gray-500 font-medium">
                +{tasksForDay.length - 2}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderTasksTab = () => (
    <div className="space-y-4">
      {/* Active Timer Display */}
      {isActive && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Timer className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Timer Active</h3>
                <p className="text-sm text-blue-700">
                  {mockTasks.find(t => t.id === activeTimer?.taskId)?.title}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-mono font-bold text-blue-900">
                {formatTime(elapsedTime)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {mockTasks.map(task => {
        const progress = task.estimatedHours > 0 ? (task.actualHours / task.estimatedHours) * 100 : 0;
        const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';
        const isCurrentTaskActive = isActive && activeTimer?.taskId === task.id;

        return (
          <div 
            key={task.id} 
            className={`bg-white rounded-lg p-4 shadow-sm border ${
              isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
            } ${isCurrentTaskActive ? 'ring-2 ring-blue-500' : ''}`}
          >
            {/* Task Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    {task.priority}
                  </span>
                  {isOverdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status}
              </div>
            </div>

            {/* Progress */}
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    progress > 100 ? 'bg-red-500' : progress > 80 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Time Info */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-xs text-gray-500">Estimated</div>
                <div className="text-sm font-semibold">{task.estimatedHours}h</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-xs text-gray-500">Actual</div>
                <div className={`text-sm font-semibold ${
                  task.actualHours > task.estimatedHours ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {task.actualHours}h
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>

            {/* Actions */}
            {task.status !== 'COMPLETED' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleTimerToggle(task.id, task.title)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium text-sm ${
                    isCurrentTaskActive
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isCurrentTaskActive ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Start</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleTaskComplete(task)}
                  className="flex items-center justify-center space-x-2 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Done</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderCalendarTab = () => (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">{getMonthName(currentDate)}</h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {generateCalendarDays()}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Task Status</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm text-gray-700">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Completed</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimesheetTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">My Timesheet Requests</h3>
        
        {/* Mock timesheet requests */}
        <div className="space-y-3">
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Overtime Request</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">PENDING</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Critical bug fix required</p>
            <div className="text-xs text-gray-500">Submitted: Dec 20, 2024</div>
          </div>

          <div className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Time Correction</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">APPROVED</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Forgot to log debugging session</p>
            <div className="text-xs text-gray-500">Submitted: Dec 18, 2024</div>
          </div>
        </div>

        <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium">
          Submit New Request
        </button>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-semibold">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{currentUser.name}</h3>
            <p className="text-sm text-gray-600">{currentUser.role}</p>
            <p className="text-sm text-gray-500">{currentUser.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Department</span>
            <span className="text-sm font-medium text-gray-900">{currentUser.department || 'Not Set'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Salary Level</span>
            <span className="text-sm font-medium text-gray-900">L{currentUser.salaryLevel || 'Not Set'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Hourly Rate</span>
            <span className="text-sm font-medium text-gray-900">₱{currentUser.hourlyRate || 'Not Set'}/hr</span>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full mt-6 bg-red-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Chronos</h1>
              <p className="text-xs text-gray-600">Engineer Mobile</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white w-64 h-full p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-sm text-gray-600">{currentUser.role}</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              <button 
                onClick={() => { setActiveTab('tasks'); setIsMenuOpen(false); }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100"
              >
                <CheckCircle className="w-5 h-5 text-gray-600" />
                <span>My Tasks</span>
              </button>
              <button 
                onClick={() => { setActiveTab('calendar'); setIsMenuOpen(false); }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100"
              >
                <Calendar className="w-5 h-5 text-gray-600" />
                <span>Calendar</span>
              </button>
              <button 
                onClick={() => { setActiveTab('timesheet'); setIsMenuOpen(false); }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100"
              >
                <FileText className="w-5 h-5 text-gray-600" />
                <span>Timesheet</span>
              </button>
              <button 
                onClick={() => { setActiveTab('profile'); setIsMenuOpen(false); }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100"
              >
                <User className="w-5 h-5 text-gray-600" />
                <span>Profile</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4">
        {activeTab === 'tasks' && renderTasksTab()}
        {activeTab === 'calendar' && renderCalendarTab()}
        {activeTab === 'timesheet' && renderTimesheetTab()}
        {activeTab === 'profile' && renderProfileTab()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center py-2 px-1 ${
              activeTab === 'tasks' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <CheckCircle className="w-5 h-5 mb-1" />
            <span className="text-xs">Tasks</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center py-2 px-1 ${
              activeTab === 'calendar' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs">Calendar</span>
          </button>
          <button
            onClick={() => setActiveTab('timesheet')}
            className={`flex flex-col items-center py-2 px-1 ${
              activeTab === 'timesheet' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-xs">Timesheet</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-2 px-1 ${
              activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>

      {/* Task Completion Modal */}
      {isCompletionModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Complete Task</h3>
                <button
                  onClick={() => setIsCompletionModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{selectedTask.title}</h4>
                <p className="text-sm text-gray-600">{selectedTask.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What did you accomplish?
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe what you completed..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completion Remarks
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional notes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Hours Spent
                </label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue={selectedTask.actualHours}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <div className="flex justify-center space-x-4">
                    <button className="flex items-center space-x-2 text-blue-600">
                      <Upload className="w-5 h-5" />
                      <span className="text-sm">Upload File</span>
                    </button>
                    <button className="flex items-center space-x-2 text-green-600">
                      <Camera className="w-5 h-5" />
                      <span className="text-sm">Take Photo</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsCompletionModalOpen(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleTaskCompletionSubmit({
                    taskId: selectedTask.id,
                    accomplishments: '',
                    remarks: '',
                    attachments: [],
                    completionDate: new Date().toISOString().split('T')[0],
                    actualHoursSpent: selectedTask.actualHours,
                    challenges: '',
                    nextSteps: ''
                  })}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-medium"
                >
                  Complete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngineerApp;