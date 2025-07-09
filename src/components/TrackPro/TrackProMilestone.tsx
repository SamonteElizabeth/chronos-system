import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Target, 
  ChevronDown, 
  ChevronRight, 
  Triangle as ExclamationTriangle,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  ChevronLeft,
  Play,
  Pause,
  MapPin
} from 'lucide-react';
import { User as UserType, Project, Task } from '../../types';

interface TrackProMilestoneProps {
  currentUser: UserType;
}

interface EngineerProgress {
  id: string;
  name: string;
  department: 'ITSD' | 'DIG' | 'BSD' | 'TSD';
  tasks: TaskProgress[];
  totalHours: number;
  efficiency: number;
  completedTasks: number;
  ongoingTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

interface TaskProgress {
  id: string;
  title: string;
  projectName: string;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  startPosition: number; // Position on timeline (percentage)
  duration: number; // Duration on timeline (percentage)
  isOverdue: boolean;
  daysOverdue?: number;
}

interface CalendarTask {
  id: string;
  title: string;
  projectName: string;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  isOverdue: boolean;
  daysOverdue?: number;
  isStartDate?: boolean;
  isDueDate?: boolean;
  isSpanning?: boolean;
}

const TrackProMilestone: React.FC<TrackProMilestoneProps> = ({ currentUser }) => {
  const [selectedEngineer, setSelectedEngineer] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [sortBy, setSortBy] = useState<'name' | 'department' | 'date' | 'progress'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Sample Engineers with Departments
  const sampleEngineers = [
    { id: '20', name: 'John Cruz', department: 'ITSD' as const },
    { id: '21', name: 'Maria Santos', department: 'DIG' as const },
    { id: '22', name: 'Allan Reyes', department: 'BSD' as const },
    { id: '23', name: 'Kim De Vera', department: 'TSD' as const },
    { id: '24', name: 'Joseph Mendoza', department: 'DIG' as const },
    { id: '25', name: 'Ella Navarro', department: 'BSD' as const },
    { id: '26', name: 'Danilo Garcia', department: 'ITSD' as const },
    { id: '27', name: 'Erika Lim', department: 'TSD' as const },
    { id: '28', name: 'Nico Alvarez', department: 'DIG' as const },
    { id: '29', name: 'Faith Domingo', department: 'BSD' as const }
  ];

  const departments = ['ITSD', 'DIG', 'BSD', 'TSD'];
  const projects = ['E-commerce Platform', 'Mobile App Redesign', 'API Integration', 'Security Audit'];

  const isEngineerView = currentUser.role === 'ENGINEER';
  const canViewAllEngineers = ['TASS', 'PMO', 'TM', 'PM', 'PM_DEPT_HEAD', 'TM_DEPT_HEAD'].includes(currentUser.role);

  // Check if task is overdue
  const isTaskOverdue = (dueDate: string, status: string): boolean => {
    if (status === 'COMPLETED') return false;
    return new Date(dueDate) < new Date();
  };

  // Calculate days overdue
  const getDaysOverdue = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Generate mock engineer tasks for calendar
  const generateEngineerTasks = (): CalendarTask[] => {
    const engineerId = isEngineerView ? currentUser.id : '20'; // Default to first engineer for demo
    
    return [
      {
        id: `${engineerId}-1`,
        title: 'User Authentication System',
        projectName: 'E-commerce Platform',
        status: 'ONGOING',
        priority: 'HIGH',
        startDate: '2024-12-15',
        dueDate: '2024-12-28',
        estimatedHours: 40,
        actualHours: 28,
        progress: 70,
        isOverdue: false
      },
      {
        id: `${engineerId}-2`,
        title: 'Payment Gateway Integration',
        projectName: 'E-commerce Platform',
        status: 'PENDING',
        priority: 'CRITICAL',
        startDate: '2024-12-20',
        dueDate: '2025-01-05',
        estimatedHours: 32,
        actualHours: 0,
        progress: 0,
        isOverdue: false
      },
      {
        id: `${engineerId}-3`,
        title: 'Mobile UI Components',
        projectName: 'Mobile App Redesign',
        status: 'COMPLETED',
        priority: 'MEDIUM',
        startDate: '2024-12-01',
        dueDate: '2024-12-12',
        estimatedHours: 24,
        actualHours: 26,
        progress: 100,
        isOverdue: false
      },
      {
        id: `${engineerId}-4`,
        title: 'API Documentation',
        projectName: 'Mobile App Redesign',
        status: 'ONGOING',
        priority: 'LOW',
        startDate: '2024-12-10',
        dueDate: '2024-12-18',
        estimatedHours: 16,
        actualHours: 8,
        progress: 50,
        isOverdue: isTaskOverdue('2024-12-18', 'ONGOING'),
        daysOverdue: isTaskOverdue('2024-12-18', 'ONGOING') ? getDaysOverdue('2024-12-18') : undefined
      },
      {
        id: `${engineerId}-5`,
        title: 'Database Migration',
        projectName: 'API Integration',
        status: 'PENDING',
        priority: 'HIGH',
        startDate: '2025-01-02',
        dueDate: '2025-01-15',
        estimatedHours: 35,
        actualHours: 0,
        progress: 0,
        isOverdue: false
      }
    ].map(task => ({
      ...task,
      isOverdue: isTaskOverdue(task.dueDate, task.status),
      daysOverdue: isTaskOverdue(task.dueDate, task.status) ? getDaysOverdue(task.dueDate) : undefined
    }));
  };

  const engineerTasks = generateEngineerTasks();

  // Calendar helper functions
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

  const getTasksForDate = (day: number): CalendarTask[] => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return engineerTasks.filter(task => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.dueDate);
      const currentDateObj = new Date(dateStr);
      
      return currentDateObj >= taskStart && currentDateObj <= taskEnd;
    }).map(task => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.dueDate);
      const currentDateObj = new Date(dateStr);
      
      return {
        ...task,
        isStartDate: taskStart.toDateString() === currentDateObj.toDateString(),
        isDueDate: taskEnd.toDateString() === currentDateObj.toDateString(),
        isSpanning: currentDateObj > taskStart && currentDateObj < taskEnd
      };
    });
  };

  const getStatusColor = (status: string, isOverdue: boolean = false) => {
    if (isOverdue) {
      return 'bg-red-500 text-white border-red-600';
    }
    
    switch (status) {
      case 'COMPLETED': return 'bg-green-500 text-white border-green-600';
      case 'ONGOING': return 'bg-blue-500 text-white border-blue-600';
      case 'PENDING': return 'bg-purple-500 text-white border-purple-600';
      default: return 'bg-gray-400 text-white border-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'border-l-4 border-l-red-600';
      case 'HIGH': return 'border-l-4 border-l-orange-500';
      case 'MEDIUM': return 'border-l-4 border-l-yellow-500';
      case 'LOW': return 'border-l-4 border-l-green-500';
      default: return 'border-l-4 border-l-gray-400';
    }
  };

  const getTaskIcon = (task: CalendarTask) => {
    if (task.isStartDate && task.isDueDate) {
      return <Target className="w-3 h-3" />; // Single day task
    } else if (task.isStartDate) {
      return <Play className="w-3 h-3" />; // Start date
    } else if (task.isDueDate) {
      return <Target className="w-3 h-3" />; // Due date
    } else {
      return <Clock className="w-3 h-3" />; // Spanning task
    }
  };

  const getTaskLabel = (task: CalendarTask) => {
    if (task.isStartDate && task.isDueDate) {
      return 'START & DUE';
    } else if (task.isStartDate) {
      return 'START';
    } else if (task.isDueDate) {
      return 'DUE';
    } else {
      return 'ONGOING';
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-32 bg-gray-50 border border-gray-200"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const tasksForDay = getTasksForDate(day);
      const isCurrentDay = isToday(day);

      days.push(
        <div 
          key={day} 
          className={`h-32 border border-gray-200 p-1 overflow-y-auto ${
            isCurrentDay ? 'bg-blue-50 border-blue-300' : 'bg-white'
          }`}
        >
          <div className={`text-sm font-semibold mb-1 ${
            isCurrentDay ? 'text-blue-700' : 'text-gray-700'
          }`}>
            {day}
            {isCurrentDay && (
              <span className="ml-1 text-xs bg-blue-500 text-white px-1 rounded">TODAY</span>
            )}
          </div>
          
          <div className="space-y-1">
            {tasksForDay.slice(0, 3).map((task, index) => (
              <div
                key={`${task.id}-${day}`}
                className={`text-xs p-1 rounded-sm cursor-pointer hover:opacity-80 transition-opacity ${
                  getStatusColor(task.status, task.isOverdue)
                } ${getPriorityColor(task.priority)}`}
                title={`${task.title} - ${task.projectName}\nStatus: ${task.status}\nPriority: ${task.priority}\nProgress: ${task.progress}%${
                  task.isOverdue ? `\nOverdue by ${task.daysOverdue} days` : ''
                }`}
              >
                <div className="flex items-center space-x-1">
                  {getTaskIcon(task)}
                  <span className="font-medium text-xs">{getTaskLabel(task)}</span>
                  {task.isOverdue && <ExclamationTriangle className="w-3 h-3 animate-pulse" />}
                </div>
                <div className="truncate font-medium">{task.title}</div>
                <div className="truncate text-xs opacity-90">{task.projectName}</div>
                <div className="text-xs opacity-90">{task.progress}% complete</div>
              </div>
            ))}
            
            {tasksForDay.length > 3 && (
              <div className="text-xs text-gray-500 font-medium">
                +{tasksForDay.length - 3} more tasks
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const getOverallStats = () => {
    const totalTasks = engineerTasks.length;
    const completedTasks = engineerTasks.filter(t => t.status === 'COMPLETED').length;
    const ongoingTasks = engineerTasks.filter(t => t.status === 'ONGOING').length;
    const pendingTasks = engineerTasks.filter(t => t.status === 'PENDING').length;
    const overdueTasks = engineerTasks.filter(t => t.isOverdue).length;
    const totalHours = engineerTasks.reduce((sum, t) => sum + t.actualHours, 0);

    return {
      totalTasks,
      completedTasks,
      ongoingTasks,
      pendingTasks,
      overdueTasks,
      totalHours
    };
  };

  const stats = getOverallStats();

  // If engineer view, show calendar
  if (isEngineerView) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TRACKPRO MILESTONE</h1>
            <p className="text-gray-600">
              Your task calendar - Track your assignments with start dates and deadlines
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalTasks}</div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
            <div className="text-sm text-gray-600">Finished</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-blue-600">{stats.ongoingTasks}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">{stats.pendingTasks}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-red-600">{stats.overdueTasks}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-indigo-600">{stats.totalHours}h</div>
            <div className="text-sm text-gray-600">Hours Logged</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Calendar Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">{getMonthName(currentDate)}</h2>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Task Calendar View</span>
              </div>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-200">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {generateCalendarDays()}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Status Legend */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Task Status & Icons</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 bg-purple-500 text-white px-2 py-1 rounded text-xs">
                    <Clock className="w-3 h-3" />
                    <span>ONGOING</span>
                  </div>
                  <span className="text-purple-600 font-medium">Task in progress</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                    <Play className="w-3 h-3" />
                    <span>START</span>
                  </div>
                  <span className="text-blue-600 font-medium">Task start date</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded text-xs">
                    <Target className="w-3 h-3" />
                    <span>DUE</span>
                  </div>
                  <span className="text-green-600 font-medium">Task due date</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded text-xs animate-pulse">
                    <ExclamationTriangle className="w-3 h-3" />
                    <span>OVERDUE</span>
                  </div>
                  <span className="text-red-600 font-medium">Task is overdue</span>
                </div>
              </div>
            </div>

            {/* Priority Legend */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Priority Indicators</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 border-l-4 border-l-red-600 bg-gray-100"></div>
                  <span className="text-red-600 font-medium">Critical Priority</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 border-l-4 border-l-orange-500 bg-gray-100"></div>
                  <span className="text-orange-600 font-medium">High Priority</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 border-l-4 border-l-yellow-500 bg-gray-100"></div>
                  <span className="text-yellow-600 font-medium">Medium Priority</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 border-l-4 border-l-green-500 bg-gray-100"></div>
                  <span className="text-green-600 font-medium">Low Priority</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-1">Calendar Navigation</div>
                <div>
                  Click the arrow buttons to navigate between months. Today's date is highlighted in blue. 
                  Hover over any task to see detailed information including progress and deadlines.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For non-engineer users, show the original Gantt chart view
  const generateEngineerProgress = (): EngineerProgress[] => {
    const engineersToShow = sampleEngineers.filter(eng => {
      const matchesEngineer = selectedEngineer === 'all' || eng.id === selectedEngineer;
      const matchesDepartment = selectedDepartment === 'all' || eng.department === selectedDepartment;
      const matchesSearch = searchTerm === '' || eng.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesEngineer && matchesDepartment && matchesSearch;
    });

    return engineersToShow.map(engineer => {
      // Generate multiple tasks per engineer
      const engineerTasks = [
        {
          id: `${engineer.id}-1`,
          title: 'Security Implementation',
          projectName: 'E-commerce Platform',
          status: 'ONGOING' as const,
          priority: 'CRITICAL' as const,
          startDate: '2024-06-17',
          dueDate: '2024-06-30',
          estimatedHours: 40,
          actualHours: 28,
          progress: 70,
          engineerId: engineer.id,
          department: engineer.department
        },
        {
          id: `${engineer.id}-2`,
          title: 'Admin Panel Development',
          projectName: 'Mobile App Redesign',
          status: 'COMPLETED' as const,
          priority: 'HIGH' as const,
          startDate: '2024-06-01',
          dueDate: '2024-07-15',
          estimatedHours: 60,
          actualHours: 58,
          progress: 100,
          engineerId: engineer.id,
          department: engineer.department
        },
        {
          id: `${engineer.id}-3`,
          title: 'Database Migration',
          projectName: 'API Integration',
          status: 'PENDING' as const,
          priority: 'MEDIUM' as const,
          startDate: '2024-07-01',
          dueDate: '2024-07-20',
          estimatedHours: 32,
          actualHours: 0,
          progress: 0,
          engineerId: engineer.id,
          department: engineer.department
        }
      ];

      // Filter tasks based on project filter
      const filteredTasks = engineerTasks.filter(task => {
        const matchesProject = selectedProject === 'all' || task.projectName.includes(selectedProject);
        return matchesProject;
      });

      const tasks: TaskProgress[] = filteredTasks.map(task => {
        const { startPosition, duration } = calculateGanttPosition(task.startDate, task.dueDate);
        const isOverdue = isTaskOverdue(task.dueDate, task.status);
        const daysOverdue = isOverdue ? getDaysOverdue(task.dueDate) : undefined;
        
        return {
          id: task.id,
          title: task.title,
          projectName: task.projectName,
          status: task.status,
          priority: task.priority,
          startDate: task.startDate,
          dueDate: task.dueDate,
          estimatedHours: task.estimatedHours,
          actualHours: task.actualHours,
          progress: task.progress,
          startPosition,
          duration,
          isOverdue,
          daysOverdue
        };
      });

      const totalHours = tasks.reduce((sum, task) => sum + task.actualHours, 0);
      const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
      const ongoingTasks = tasks.filter(task => task.status === 'ONGOING').length;
      const pendingTasks = tasks.filter(task => task.status === 'PENDING').length;
      const overdueTasks = tasks.filter(task => task.isOverdue).length;
      const estimatedHours = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
      const efficiency = estimatedHours > 0 ? (totalHours / estimatedHours) * 100 : 0;

      return {
        id: engineer.id,
        name: engineer.name,
        department: engineer.department,
        tasks,
        totalHours,
        efficiency: Math.round(efficiency),
        completedTasks,
        ongoingTasks,
        pendingTasks,
        overdueTasks
      };
    });
  };

  // Calculate timeline boundaries (60 days from today - 30 before, 30 after)
  const getTimelineBounds = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30); // 30 days before today
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30); // 30 days after today
    return { startDate, endDate };
  };

  // Calculate position and duration for Gantt chart
  const calculateGanttPosition = (taskStartDate: string, taskDueDate: string) => {
    const { startDate: timelineStart, endDate: timelineEnd } = getTimelineBounds();
    const taskStart = new Date(taskStartDate);
    const taskEnd = new Date(taskDueDate);
    
    const timelineTotal = timelineEnd.getTime() - timelineStart.getTime();
    const taskStartOffset = taskStart.getTime() - timelineStart.getTime();
    const taskDuration = taskEnd.getTime() - taskStart.getTime();
    
    const startPosition = Math.max(0, (taskStartOffset / timelineTotal) * 100);
    const duration = Math.min(100 - startPosition, (taskDuration / timelineTotal) * 100);
    
    return { startPosition, duration };
  };

  const engineerProgressData = generateEngineerProgress();

  const getStatusLabel = (status: string, isOverdue: boolean = false, daysOverdue?: number) => {
    if (isOverdue) {
      const overdueText = daysOverdue ? ` (${daysOverdue}d overdue)` : ' (overdue)';
      return status === 'ONGOING' ? `● In Progress${overdueText}` : `● Pending${overdueText}`;
    }
    
    switch (status) {
      case 'COMPLETED': return '● Finished';
      case 'ONGOING': return '● In Progress';
      case 'PENDING': return '● Pending';
      default: return '● Unknown';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'ITSD': return 'bg-blue-100 text-blue-800';
      case 'DIG': return 'bg-green-100 text-green-800';
      case 'BSD': return 'bg-purple-100 text-purple-800';
      case 'TSD': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Generate daily timeline headers
  const generateDailyHeaders = () => {
    const { startDate, endDate } = getTimelineBounds();
    const headers = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const isToday = currentDate.toDateString() === new Date().toDateString();
      const dayNumber = currentDate.getDate();
      const dayName = currentDate.toLocaleDateString('en', { weekday: 'short' });
      
      headers.push(
        <div 
          key={currentDate.getTime()} 
          className={`flex-shrink-0 w-12 text-center text-xs font-medium border-r border-gray-300 py-2 ${
            isToday ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-bold">{dayNumber}</div>
          <div className="text-xs opacity-75">{dayName}</div>
        </div>
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return headers;
  };

  // Generate month headers
  const generateMonthHeaders = () => {
    const { startDate, endDate } = getTimelineBounds();
    const months = [];
    const currentDate = new Date(startDate);
    let currentMonth = currentDate.getMonth();
    let monthStart = new Date(currentDate);
    
    while (currentDate <= endDate) {
      if (currentDate.getMonth() !== currentMonth || currentDate.getTime() === endDate.getTime()) {
        const monthEnd = currentDate.getMonth() !== currentMonth ? 
          new Date(currentDate.getFullYear(), currentDate.getMonth(), 0) : 
          new Date(currentDate);
        
        const daysInMonth = Math.ceil((monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const monthName = monthStart.toLocaleDateString('en', { month: 'long' }).toUpperCase();
        
        // Alternate colors for months
        const monthColor = monthStart.getMonth() % 2 === 0 ? 'bg-blue-500' : 'bg-red-500';
        
        months.push(
          <div 
            key={monthStart.getTime()}
            className={`text-center text-sm font-bold py-3 border-r border-gray-400 text-white ${monthColor}`}
            style={{ width: `${daysInMonth * 48}px` }}
          >
            {monthName}
          </div>
        );
        
        if (currentDate.getMonth() !== currentMonth) {
          currentMonth = currentDate.getMonth();
          monthStart = new Date(currentDate);
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return months;
  };

  const getOverallStatsForManagers = () => {
    const totalEngineers = engineerProgressData.length;
    const totalTasks = engineerProgressData.reduce((sum, eng) => sum + eng.tasks.length, 0);
    const totalCompleted = engineerProgressData.reduce((sum, eng) => sum + eng.completedTasks, 0);
    const totalOngoing = engineerProgressData.reduce((sum, eng) => sum + eng.ongoingTasks, 0);
    const totalPending = engineerProgressData.reduce((sum, eng) => sum + eng.pendingTasks, 0);
    const totalOverdue = engineerProgressData.reduce((sum, eng) => sum + eng.overdueTasks, 0);

    return {
      totalEngineers,
      totalTasks,
      totalCompleted,
      totalOngoing,
      totalPending,
      totalOverdue
    };
  };

  const managerStats = getOverallStatsForManagers();

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">TRACKPRO MILESTONE</h1>
          <p className="text-gray-600">
            Monitor engineer progress with daily Gantt chart and advanced filtering
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{managerStats.totalEngineers}</div>
              <div className="text-sm text-gray-600">Engineers</div>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{managerStats.totalTasks}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{managerStats.totalCompleted}</div>
          <div className="text-sm text-gray-600">Finished</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{managerStats.totalOngoing}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-purple-600">{managerStats.totalPending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-red-600">{managerStats.totalOverdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
      </div>

      {/* Enhanced Filters and Sorting */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search engineers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Engineer Filter */}
          <select
            value={selectedEngineer}
            onChange={(e) => setSelectedEngineer(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Engineers</option>
            {sampleEngineers.map(engineer => (
              <option key={engineer.id} value={engineer.id}>{engineer.name}</option>
            ))}
          </select>

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Time Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Time:</span>
            <div className="flex space-x-1">
              {(['day', 'week', 'month', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeFilter(period)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    timeFilter === period
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <div className="flex space-x-1">
              {([
                { key: 'name', label: 'Name' },
                { key: 'department', label: 'Department' },
                { key: 'date', label: 'Date' },
                { key: 'progress', label: 'Progress' }
              ] as const).map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleSort(option.key)}
                  className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-lg transition-colors ${
                    sortBy === option.key
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{option.label}</span>
                  {sortBy === option.key && (
                    sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gantt Chart with Engineer Names and Task Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 text-center">TRACKPRO MILESTONE GANTT CHART</h3>
          <p className="text-sm text-gray-600 text-center mt-1">
            Engineer progress tracking with task status visualization
          </p>
        </div>

        <div className="overflow-x-auto">
          {/* Month Headers */}
          <div className="flex border-b-2 border-gray-400">
            <div className="w-48 flex-shrink-0 bg-gray-200 border-r-2 border-gray-400"></div>
            <div className="flex">
              {generateMonthHeaders()}
            </div>
          </div>

          {/* Daily Date Headers */}
          <div className="flex border-b border-gray-300">
            <div className="w-48 flex-shrink-0 bg-gray-100 border-r border-gray-300"></div>
            <div className="flex">
              {generateDailyHeaders()}
            </div>
          </div>

          {/* Engineer Progress Rows */}
          <div className="min-h-[400px] bg-gray-50">
            {engineerProgressData.map((engineer, engineerIndex) => {
              return engineer.tasks.map((task, taskIndex) => {
                const backgroundColor = engineerIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                const isFirstTaskForEngineer = taskIndex === 0;
                
                return (
                  <div key={`${engineer.id}-${task.id}`} className={`flex border-b border-gray-200 ${backgroundColor} min-h-[50px]`}>
                    {/* Engineer Name Column */}
                    <div className="w-48 flex-shrink-0 border-r border-gray-300 p-3 flex items-center">
                      {isFirstTaskForEngineer ? (
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium text-gray-900">
                            <div className="flex items-center space-x-2">
                              <span>{engineer.name}</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDepartmentColor(engineer.department)}`}>
                                {engineer.department}
                              </span>
                            </div>
                            {engineer.overdueTasks > 0 && (
                              <div className="flex items-center space-x-1 mt-1">
                                <ExclamationTriangle className="w-3 h-3 text-red-500" />
                                <span className="text-xs text-red-600 font-medium">
                                  {engineer.overdueTasks} overdue
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">
                          {/* Empty for subsequent tasks */}
                        </div>
                      )}
                    </div>
                    
                    {/* Timeline Column */}
                    <div className="relative p-3 flex items-center" style={{ width: `${60 * 48}px` }}>
                      {/* Task Bar */}
                      <div className="relative h-8 w-full">
                        <div
                          className={`absolute h-6 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm ${
                            getStatusColor(task.status, task.isOverdue)
                          } ${task.isOverdue ? 'animate-pulse border-2 border-red-700' : ''}`}
                          style={{
                            left: `${task.startPosition}%`,
                            width: `${Math.max(task.duration, 15)}%`,
                            minWidth: '120px'
                          }}
                          title={`${task.title}: ${new Date(task.startDate).toLocaleDateString()} - ${new Date(task.dueDate).toLocaleDateString()}${
                            task.isOverdue ? ` (${task.daysOverdue} days overdue)` : ''
                          }`}
                        >
                          <span className="truncate px-2">
                            {getStatusLabel(task.status, task.isOverdue, task.daysOverdue)}
                          </span>
                        </div>
                        
                        {/* Task Label */}
                        <div 
                          className="absolute text-sm font-medium whitespace-nowrap text-gray-700 flex items-center"
                          style={{
                            left: `${task.startPosition + Math.max(task.duration, 15) + 2}%`,
                            top: '50%',
                            transform: 'translateY(-50%)'
                          }}
                        >
                          {task.title}
                          {task.isOverdue && (
                            <ExclamationTriangle className="w-4 h-4 text-red-500 ml-2" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Status Legend */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Task Status</h4>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-purple-600 font-medium">● Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-blue-600 font-medium">● In Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">● Finished</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-600 font-medium">● Overdue (Top 4 Critical)</span>
              </div>
              <div className="flex items-center space-x-2">
                <ExclamationTriangle className="w-4 h-4 text-red-500" />
                <span className="text-red-600 font-medium">Requires Immediate Attention</span>
              </div>
            </div>
          </div>

          {/* Department Legend */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Departments</h4>
            <div className="flex flex-wrap gap-3">
              {departments.map(dept => (
                <div key={dept} className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDepartmentColor(dept)}`}>
                    {dept}
                  </span>
                  <span className="text-xs text-gray-600">
                    {dept === 'ITSD' && 'IT Services'}
                    {dept === 'DIG' && 'Digital Innovation'}
                    {dept === 'BSD' && 'Business Solutions'}
                    {dept === 'TSD' && 'Technical Support'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackProMilestone;