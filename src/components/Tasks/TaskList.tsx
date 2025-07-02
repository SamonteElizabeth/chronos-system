import React, { useState } from 'react';
import { Search, Filter, Plus, SortAsc, ChevronRight, ArrowLeft } from 'lucide-react';
import { Task, User, TaskFormData, RequestFormData, Project } from '../../types';
import TaskCard from './TaskCard';
import TaskForm from '../Forms/TaskForm';
import RequestForm from '../Forms/RequestForm';

interface TaskListProps {
  currentUser: User;
  tasks: Task[];
  isEngineerView?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ currentUser, tasks, isEngineerView = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [taskList, setTaskList] = useState<Task[]>(tasks);

  // Mock projects for PM/TM
  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Complete overhaul of the existing e-commerce platform',
      status: 'ACTIVE',
      createdBy: '1',
      assignedPM: '3',
      assignedTM: '4',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      progress: 75,
      budget: 250000,
      spentBudget: 187500,
      salesOrderNo: 'SO-2024-001',
      clientCompanyName: 'TechFlow Solutions',
      accountManager: 'John Smith',
      sowMandays: 120,
      solution: 'E-commerce Platform'
    },
    {
      id: '2',
      name: 'Mobile App Redesign',
      description: 'Redesign mobile application with improved user experience',
      status: 'ACTIVE',
      createdBy: '1',
      assignedPM: '3',
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
      solution: 'Mobile App Development'
    },
    {
      id: '3',
      name: 'API Integration',
      description: 'Integrate third-party APIs for enhanced functionality',
      status: 'PLANNING',
      createdBy: '1',
      assignedPM: '3',
      assignedTM: '4',
      startDate: '2024-03-01',
      endDate: '2024-05-30',
      progress: 15,
      budget: 80000,
      spentBudget: 12000,
      salesOrderNo: 'SO-2024-003',
      clientCompanyName: 'Innovation Labs',
      accountManager: 'Michael Johnson',
      sowMandays: 45,
      solution: 'API Integration'
    }
  ];

  // Get user's assigned projects
  const getUserProjects = () => {
    if (currentUser.role === 'PM') {
      return mockProjects.filter(p => p.assignedPM === currentUser.id);
    } else if (currentUser.role === 'TM') {
      return mockProjects.filter(p => p.assignedTM === currentUser.id);
    }
    return mockProjects;
  };

  const userProjects = getUserProjects();

  const handleTaskSubmit = (data: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      projectId: data.projectId || selectedProject?.id || '1',
      title: data.taskName,
      description: data.description || data.subTask,
      assignedTo: data.assignedEngineers[0] || currentUser.id,
      status: 'PENDING',
      priority: data.priority,
      estimatedHours: data.estimatedHours,
      actualHours: 0,
      startDate: data.startDate,
      dueDate: data.dueDate,
      dependencies: [],
      taskName: data.taskName,
      subTask: data.subTask,
      assignedEngineers: data.assignedEngineers
    };

    setTaskList(prev => [newTask, ...prev]);
    alert(`Task "${data.taskName}" created successfully!`);
  };

  const handleRequestSubmit = (data: RequestFormData) => {
    // In a real app, this would be sent to the backend
    console.log('Request submitted:', data);
    alert(`${data.type} request submitted successfully!`);
  };

  const handleTaskComplete = (taskId: string) => {
    setTaskList(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: 'COMPLETED' as const, actualHours: task.actualHours || task.estimatedHours }
          : task
      )
    );
    alert('Task marked as completed!');
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const filteredTasks = taskList.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    const matchesProject = projectFilter === 'ALL' || task.projectId === projectFilter;
    
    // If a project is selected, only show tasks for that project
    if (selectedProject) {
      return task.projectId === selectedProject.id && matchesSearch && matchesStatus && matchesPriority;
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const getTaskCountsByStatus = () => {
    const relevantTasks = selectedProject 
      ? taskList.filter(t => t.projectId === selectedProject.id)
      : taskList;
      
    return {
      ALL: relevantTasks.length,
      PENDING: relevantTasks.filter(t => t.status === 'PENDING').length,
      ONGOING: relevantTasks.filter(t => t.status === 'ONGOING').length,
      COMPLETED: relevantTasks.filter(t => t.status === 'COMPLETED').length,
    };
  };

  const statusCounts = getTaskCountsByStatus();
  const canCreateTasks = currentUser.role === 'PM' || currentUser.role === 'TM';

  // If viewing a specific project's tasks
  if (selectedProject) {
    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Projects</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedProject.name} - Tasks</h1>
            <p className="text-gray-600">Manage tasks for this project</p>
          </div>
        </div>

        {/* Project Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedProject.name}</h3>
              <p className="text-sm text-gray-600">{selectedProject.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                Client: {selectedProject.clientCompanyName} • Due: {new Date(selectedProject.endDate).toLocaleDateString()}
              </div>
            </div>
            {canCreateTasks && (
              <button 
                onClick={() => setIsTaskFormOpen(true)}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
            )}
          </div>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{statusCounts.ALL}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.ONGOING}</div>
            <div className="text-sm text-gray-600">Active Tasks</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600">{statusCounts.COMPLETED}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-orange-600">{statusCounts.PENDING}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex space-x-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {status} ({count})
                </button>
              ))}
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Task Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                isEngineerView={isEngineerView}
                onTaskComplete={handleTaskComplete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL' 
                ? 'Try adjusting your filters to see more tasks.'
                : 'No tasks have been assigned to this project yet.'
              }
            </p>
          </div>
        )}

        {/* Task Form Modal */}
        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          onSubmit={handleTaskSubmit}
          projectId={selectedProject.id}
          userRole={currentUser.role}
        />

        {/* Request Form Modal */}
        <RequestForm
          isOpen={isRequestFormOpen}
          onClose={() => setIsRequestFormOpen(false)}
          onSubmit={handleRequestSubmit}
          availableTasks={filteredTasks.filter(task => task.assignedTo === currentUser.id)}
        />
      </div>
    );
  }

  // Main view - show projects for PM/TM, or all tasks for others
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEngineerView ? 'My Tasks' : 'Task Management'}
          </h1>
          <p className="text-gray-600">
            {isEngineerView 
              ? 'Track your assigned tasks and log your time'
              : canCreateTasks
                ? 'Select a project to manage its tasks'
                : 'View and manage tasks across all projects'
            }
          </p>
        </div>
        
        <div className="flex space-x-3">
          {isEngineerView && (
            <button 
              onClick={() => setIsRequestFormOpen(true)}
              className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Request</span>
            </button>
          )}
          
          {canCreateTasks && !selectedProject && (
            <button 
              onClick={() => setIsTaskFormOpen(true)}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Show Projects for PM/TM */}
      {canCreateTasks && !isEngineerView ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Projects</h3>
            <p className="text-sm text-gray-600 mb-6">Click on a project to view and manage its tasks</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProjects.map((project) => {
                const projectTasks = taskList.filter(t => t.projectId === project.id);
                const completedTasks = projectTasks.filter(t => t.status === 'COMPLETED').length;
                const ongoingTasks = projectTasks.filter(t => t.status === 'ONGOING').length;
                const pendingTasks = projectTasks.filter(t => t.status === 'PENDING').length;

                return (
                  <div
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{project.name}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                      <div className="text-center p-2 bg-green-100 rounded">
                        <div className="font-semibold text-green-600">{completedTasks}</div>
                        <div className="text-green-600">Done</div>
                      </div>
                      <div className="text-center p-2 bg-blue-100 rounded">
                        <div className="font-semibold text-blue-600">{ongoingTasks}</div>
                        <div className="text-blue-600">Active</div>
                      </div>
                      <div className="text-center p-2 bg-gray-100 rounded">
                        <div className="font-semibold text-gray-600">{pendingTasks}</div>
                        <div className="text-gray-600">Pending</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{projectTasks.length} total tasks</span>
                      <span className={`px-2 py-1 rounded-full ${
                        project.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        // Show all tasks for non-PM/TM users or engineers
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex space-x-2">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {status} ({count})
                  </button>
                ))}
              </div>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              {/* Project Filter */}
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Projects</option>
                {userProjects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.ONGOING}</div>
              <div className="text-sm text-gray-600">Active Tasks</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{statusCounts.COMPLETED}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-orange-600">{statusCounts.PENDING}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>

          {/* Task Grid */}
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  isEngineerView={isEngineerView}
                  onTaskComplete={handleTaskComplete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL' 
                  ? 'Try adjusting your filters to see more tasks.'
                  : 'No tasks have been assigned yet.'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Task Form Modal - Pass available projects */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleTaskSubmit}
        projectId={selectedProject?.id}
        userRole={currentUser.role}
        availableProjects={userProjects.map(p => ({ id: p.id, name: p.name }))}
      />

      {/* Request Form Modal */}
      <RequestForm
        isOpen={isRequestFormOpen}
        onClose={() => setIsRequestFormOpen(false)}
        onSubmit={handleRequestSubmit}
        availableTasks={taskList.filter(task => task.assignedTo === currentUser.id)}
      />
    </div>
  );
};

export default TaskList;