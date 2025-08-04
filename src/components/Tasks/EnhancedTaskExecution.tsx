import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Plus, 
  Clock, 
  Calendar, 
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle,
  Timer,
  ChevronRight
} from 'lucide-react';
import { User, Project, Task, RequestFormData } from '../../types';
import { useTimer } from '../../hooks/useTimer';
import TaskForm from '../Forms/TaskForm';
import RequestForm from '../Forms/RequestForm';
import TaskCompletionModal from './TaskCompletionModal';

interface EnhancedTaskExecutionProps {
  currentUser: User;
}

interface TaskCompletionData {
  taskId: string;
  remarks: string;
  attachments: File[];
  completionDate: string;
}

const EnhancedTaskExecution: React.FC<EnhancedTaskExecutionProps> = ({ currentUser }) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [selectedTaskForRequest, setSelectedTaskForRequest] = useState<string>('');
  const [selectedTaskForCompletion, setSelectedTaskForCompletion] = useState<Task | null>(null);
  const [requestType, setRequestType] = useState<RequestFormData['type']>('OVERTIME');
  const [tasks, setTasks] = useState<Task[]>([
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
      startDate: '2024-01-15',
      dueDate: '2024-02-15',
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
      startDate: '2024-02-01',
      dueDate: '2024-02-28',
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
      startDate: '2024-01-01',
      dueDate: '2024-01-31',
      dependencies: [],
      taskName: 'Mobile UI Components',
      subTask: 'Component Library',
      assignedEngineers: [currentUser.id]
    }
  ]);
  
  const { activeTimer, elapsedTime, startTimer, stopTimer, formatTime, isActive } = useTimer();

  // Mock data - in real app, this would come from props or API
  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Complete overhaul of the existing e-commerce platform',
      status: 'ACTIVE',
      createdBy: '1',
      assignedPM: '3',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      progress: 75,
      budget: 250000,
      spentBudget: 187500,
      salesOrderNo: 'SO-2024-001',
      clientCompanyName: 'TechFlow Solutions',
      accountManager: 'John Smith',
      sowMandays: 120,
      solution: 'E-commerce Platform',
    },
    {
      id: '2',
      name: 'Mobile App Redesign',
      description: 'Redesign mobile application with improved user experience',
      status: 'ACTIVE',
      createdBy: '1',
      assignedTM: '4',
      startDate: '2024-02-01',
      endDate: '2024-08-15',
      progress: 45,
      budget: 150000,
      spentBudget: 67500,
      salesOrderNo: 'SO-2024-002',
      clientCompanyName: 'Digital Ventures Ltd.',
      accountManager: 'Emily Davis',
      sowMandays: 80,
      solution: 'Mobile App Development',
    }
  ];

  // Filter projects based on user role
  const getUserProjects = () => {
    if (currentUser.role === 'ENGINEER') {
      // Engineers see projects where they have assigned tasks
      return mockProjects.filter(project => 
        tasks.some(task => task.projectId === project.id && task.assignedTo === currentUser.id)
      );
    } else if (currentUser.role === 'PM') {
      // PMs see their assigned projects
      return mockProjects.filter(p => p.assignedPM === currentUser.id);
    } else if (currentUser.role === 'TM') {
      // TMs see their assigned projects
      return mockProjects.filter(p => p.assignedTM === currentUser.id);
    }
    return mockProjects;
  };

  const projectsWithTasks = getUserProjects();

  const getTasksForProject = (projectId: string) => {
    if (currentUser.role === 'ENGINEER') {
      return tasks.filter(task => task.projectId === projectId && task.assignedTo === currentUser.id);
    } else {
      // PM/TM can see all tasks in their projects
      return tasks.filter(task => task.projectId === projectId);
    }
  };

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

  const handleRequestClick = (taskId: string, type: RequestFormData['type']) => {
    setSelectedTaskForRequest(taskId);
    setRequestType(type);
    setIsRequestFormOpen(true);
  };

  const handleTaskSubmit = (data: any) => {
    // In real app, this would create a new task
    console.log('New task created:', data);
    alert(`Task "${data.taskName}" created successfully!`);
  };

  const handleRequestSubmit = (data: RequestFormData) => {
    // In real app, this would submit the request
    console.log('Request submitted:', data);
    alert(`${data.type} request submitted successfully!`);
  };

  const handleTaskCompleteClick = (task: Task) => {
    setSelectedTaskForCompletion(task);
    setIsCompletionModalOpen(true);
  };

  const handleTaskCompletionSubmit = (data: TaskCompletionData) => {
    // Update the task status and actual hours
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === data.taskId 
          ? { 
              ...task, 
              status: 'COMPLETED' as const, 
              actualHours: task.actualHours + 1 // Simple increment for demo
            }
          : task
      )
    );

    // In real app, this would save to backend with attachments
    console.log('Task completion data:', {
      ...data,
      attachmentCount: data.attachments.length,
      attachmentNames: data.attachments.map(f => f.name)
    });

    alert(`✅ Task "${selectedTaskForCompletion?.title}" has been completed successfully!\n\n📋 Completion remarks and attachments have been saved.`);
  };

  if (selectedProject) {
    const project = mockProjects.find(p => p.id === selectedProject);
    const projectTasks = getTasksForProject(selectedProject);

    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedProject(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
            <p className="text-gray-600">Your assigned tasks in this project</p>
          </div>
        </div>

        {/* Active Timer Display */}
        {isActive && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Timer className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Timer Active</h3>
                  <p className="text-sm text-blue-700">
                    {tasks.find(t => t.id === activeTimer?.taskId)?.title}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-blue-900">
                  {formatTime(elapsedTime)}
                </div>
                <div className="text-sm text-blue-700">Elapsed Time</div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projectTasks.map(task => {
            const progress = task.estimatedHours > 0 ? (task.actualHours / task.estimatedHours) * 100 : 0;
            const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';
            const isCurrentTaskActive = isActive && activeTimer?.taskId === task.id;

            return (
              <div 
                key={task.id} 
                className={`bg-white rounded-xl p-6 shadow-sm border transition-all ${
                  isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-100'
                } ${isCurrentTaskActive ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
              >
                {/* Task Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {task.priority}
                      </span>
                      {isOverdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        progress > 100 ? 'bg-red-500' : progress > 80 ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Time Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Estimated</div>
                    <div className="text-sm font-semibold text-gray-900">{task.estimatedHours}h</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Actual</div>
                    <div className={`text-sm font-semibold ${
                      task.actualHours > task.estimatedHours ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {task.actualHours}h
                    </div>
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>

                {/* Timer and Complete Buttons */}
                {task.status !== 'COMPLETED' && (
                  <div className="flex space-x-2 mb-3">
                    <button
                      onClick={() => handleTimerToggle(task.id, task.title)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                        isCurrentTaskActive
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isCurrentTaskActive ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Stop Timer</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Start Timer</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleTaskCompleteClick(task)}
                      className="flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Finished</span>
                    </button>
                  </div>
                )}

                {/* Request Actions - Only for Engineers */}
                {currentUser.role === 'ENGINEER' && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button 
                      onClick={() => handleRequestClick(task.id, 'EXTENSION')}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Extension</span>
                    </button>
                    <button 
                      onClick={() => handleRequestClick(task.id, 'OVERTIME')}
                      className="flex items-center space-x-1 text-orange-600 hover:text-orange-800 font-medium bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded transition-colors"
                    >
                      <Clock className="w-3 h-3" />
                      <span>Overtime</span>
                    </button>
                    <button 
                      onClick={() => handleRequestClick(task.id, 'HOLIDAY')}
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-800 font-medium bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded transition-colors"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Holiday Work</span>
                    </button>
                    <button 
                      onClick={() => handleRequestClick(task.id, 'CORRECTION')}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-800 font-medium bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Time Correction</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Create Task Button - Only for PM/TM */}
        {(currentUser.role === 'PM' || currentUser.role === 'TM') && (
          <div className="flex justify-center">
            <button
              onClick={() => setIsTaskFormOpen(true)}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Task</span>
            </button>
          </div>
        )}

        {/* Forms */}
        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          onSubmit={handleTaskSubmit}
          projectId={selectedProject}
          userRole={currentUser.role}
        />

        <RequestForm
          isOpen={isRequestFormOpen}
          onClose={() => setIsRequestFormOpen(false)}
          onSubmit={handleRequestSubmit}
          availableTasks={projectTasks}
          preselectedTaskId={selectedTaskForRequest}
          preselectedType={requestType}
        />

        <TaskCompletionModal
          isOpen={isCompletionModalOpen}
          onClose={() => setIsCompletionModalOpen(false)}
          onSubmit={handleTaskCompletionSubmit}
          task={selectedTaskForCompletion}
        />
      </div>
    );
  }

  // Project List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Task Execution</h1>
        <p className="text-gray-600">
          {currentUser.role === 'ENGINEER' 
            ? 'Select a project to view and manage your assigned tasks'
            : 'Select a project to execute and manage tasks'
          }
        </p>
      </div>

      {/* Active Timer Display */}
      {isActive && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Timer className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Timer Active</h3>
                <p className="text-sm text-blue-700">
                  {tasks.find(t => t.id === activeTimer?.taskId)?.title}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-blue-900">
                {formatTime(elapsedTime)}
              </div>
              <div className="text-sm text-blue-700">Elapsed Time</div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsWithTasks.map(project => {
          const projectTasks = getTasksForProject(project.id);
          const completedTasks = projectTasks.filter(t => t.status === 'COMPLETED').length;
          const ongoingTasks = projectTasks.filter(t => t.status === 'ONGOING').length;
          const pendingTasks = projectTasks.filter(t => t.status === 'PENDING').length;

          return (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {currentUser.role === 'ENGINEER' ? 'Your Tasks' : 'Total Tasks'}
                  </span>
                  <span className="font-medium">{projectTasks.length}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-semibold text-green-600">{completedTasks}</div>
                    <div className="text-green-600">Done</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-semibold text-blue-600">{ongoingTasks}</div>
                    <div className="text-blue-600">Active</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-semibold text-gray-600">{pendingTasks}</div>
                    <div className="text-gray-600">Pending</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {projectsWithTasks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 mb-4">
            <CheckCircle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assigned tasks</h3>
          <p className="text-gray-600">
            {currentUser.role === 'ENGINEER' 
              ? "You don't have any tasks assigned to you at the moment."
              : "No projects with tasks available for execution."
            }
          </p>
        </div>
      )}

      {/* Task Completion Modal */}
      <TaskCompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        onSubmit={handleTaskCompletionSubmit}
        task={selectedTaskForCompletion}
      />
    </div>
  );
};

export default EnhancedTaskExecution;