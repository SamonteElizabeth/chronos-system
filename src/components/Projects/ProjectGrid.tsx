import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  TrendingUp,
  Clock,
  AlertTriangle,
  ChevronRight,
  CheckSquare,
  ArrowLeft,
  UserCheck,
  User
} from 'lucide-react';
import { Project, User as UserType, ProjectFormData, TaskFormData } from '../../types';
import ProjectForm from '../Forms/ProjectForm';
import TaskForm from '../Forms/TaskForm';

interface ProjectGridProps {
  currentUser: UserType;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX',
      status: 'ACTIVE',
      createdBy: '1', // TASS
      assignedPM: '3', // PM - Lisa Rodriguez
      assignedTM: '4', // Technical Manager - David Kim
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
      description: 'Redesign mobile application with improved user experience and performance',
      status: 'ACTIVE',
      createdBy: '1',
      assignedPM: '3', // PM - Lisa Rodriguez
      assignedTM: '4', // Technical Manager - David Kim
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
      assignedPM: '3', // PM - Lisa Rodriguez
      assignedTM: '4', // Technical Manager - David Kim
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
    },
    {
      id: '4',
      name: 'Security Audit',
      description: 'Comprehensive security audit and implementation of security measures',
      status: 'COMPLETED',
      createdBy: '1',
      assignedPM: '3', // PM - Lisa Rodriguez
      assignedTM: '4', // Technical Manager - David Kim
      startDate: '2023-11-01',
      endDate: '2024-01-31',
      progress: 100,
      budget: 120000,
      spentBudget: 115000,
      salesOrderNo: 'SO-2023-045',
      clientCompanyName: 'Enterprise Systems Co.',
      accountManager: 'Sarah Wilson',
      sowMandays: 60,
      solution: 'Security Audit'
    }
  ]);

  // Mock tasks for the selected project
  const [projectTasks, setProjectTasks] = useState([
    {
      id: '1',
      projectId: '1',
      title: 'User Authentication System',
      description: 'Implement secure user authentication with JWT tokens',
      assignedTo: '5',
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
      assignedTo: '6',
      status: 'PENDING',
      priority: 'CRITICAL',
      estimatedHours: 32,
      actualHours: 0,
      startDate: '2024-02-01',
      dueDate: '2024-02-28',
      dependencies: ['1'],
      taskName: 'Payment Gateway Integration',
      subTask: 'Stripe Setup',
      assignedEngineers: ['6']
    },
    {
      id: '3',
      projectId: '2',
      title: 'Mobile UI Components',
      description: 'Create reusable UI components for the mobile application',
      assignedTo: '7',
      status: 'COMPLETED',
      priority: 'MEDIUM',
      estimatedHours: 24,
      actualHours: 26,
      startDate: '2024-01-01',
      dueDate: '2024-01-31',
      dependencies: [],
      taskName: 'Mobile UI Components',
      subTask: 'Component Library',
      assignedEngineers: ['7']
    },
    {
      id: '4',
      projectId: '2',
      title: 'API Documentation',
      description: 'Document all API endpoints with examples and testing guidelines',
      assignedTo: '8',
      status: 'ONGOING',
      priority: 'LOW',
      estimatedHours: 16,
      actualHours: 8,
      startDate: '2024-02-05',
      dueDate: '2024-02-20',
      dependencies: [],
      taskName: 'API Documentation',
      subTask: 'Endpoint Documentation',
      assignedEngineers: ['8']
    }
  ]);

  // Mock user data for display
  const mockUsers = [
    { id: '2', name: 'Mike Chen', role: 'PMO' },
    { id: '3', name: 'Lisa Rodriguez', role: 'PM' },
    { id: '4', name: 'David Kim', role: 'TM' },
    { id: '11', name: 'Rachel Martinez', role: 'PMO' },
    { id: '12', name: 'Kevin Thompson', role: 'PMO' },
    { id: '13', name: 'Diana Foster', role: 'PMO' },
    { id: '14', name: 'Amanda Chen', role: 'Technical Manager' },
    { id: '15', name: 'Carlos Martinez', role: 'Technical Manager' },
    { id: '16', name: 'Sophie Taylor', role: 'Technical Manager' },
    { id: '17', name: 'Ryan Johnson', role: 'Technical Manager' }
  ];

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
  };

  const getUserRole = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.role : '';
  };

  const handleProjectSubmit = (data: ProjectFormData) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: data.projectName,
      description: `${data.solution} project for ${data.clientCompanyName}`,
      status: 'PLANNING',
      createdBy: currentUser.id,
      assignedPM: data.assignedPM || undefined,
      assignedTM: data.assignedTM || undefined,
      startDate: data.startDate,
      endDate: data.endDate,
      progress: 0,
      budget: data.sowMandays * 1000, // Rough calculation
      spentBudget: 0,
      salesOrderNo: data.salesOrderNo,
      clientCompanyName: data.clientCompanyName,
      accountManager: data.accountManager,
      sowMandays: data.sowMandays,
      solution: data.solution
    };

    setProjects(prev => [newProject, ...prev]);
    alert(`Project "${data.projectName}" created successfully!`);
  };

  const handleTaskSubmit = (data: TaskFormData) => {
    const newTask = {
      id: Date.now().toString(),
      projectId: data.projectId || selectedProject?.id || '',
      title: data.taskName,
      description: data.description || data.subTask,
      assignedTo: data.assignedEngineers[0] || currentUser.id,
      status: 'PENDING' as const,
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

    setProjectTasks(prev => [newTask, ...prev]);
    alert(`Task "${data.taskName}" created successfully!`);
  };

  const handleProjectClick = (project: Project) => {
    // Check if user can access this project based on role and assignments
    const canAccess = 
      currentUser.role === 'TASS' || 
      currentUser.role === 'PMO' ||
      (currentUser.role === 'PM' && project.assignedPM === currentUser.id) ||
      (currentUser.role === 'TM' && project.assignedTM === currentUser.id);
    
    if (canAccess) {
      setSelectedProject(project);
    } else {
      alert('You do not have access to this project.');
    }
  };

  // Get user's assigned projects for PM/TM
  const getUserProjects = () => {
    if (currentUser.role === 'PM') {
      return projects.filter(p => p.assignedPM === currentUser.id);
    } else if (currentUser.role === 'TM') {
      return projects.filter(p => p.assignedTM === currentUser.id);
    }
    return projects;
  };

  const filteredProjects = getUserProjects().filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PLANNING': return 'bg-yellow-100 text-yellow-800';
      case 'ON_HOLD': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canCreateProject = currentUser.role === 'TASS';
  const canCreateTasks = (currentUser.role === 'PM' || currentUser.role === 'TM') && selectedProject;

  // If a project is selected, show project details and tasks
  if (selectedProject) {
    const projectTasksFiltered = projectTasks.filter(task => task.projectId === selectedProject.id);
    
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
        </div>

        {/* Project Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.name}</h1>
              <p className="text-gray-600 mb-4">{selectedProject.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <span className="font-medium text-gray-700">Client:</span>
                  <span className="ml-2 text-gray-900">{selectedProject.clientCompanyName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Sales Order:</span>
                  <span className="ml-2 text-gray-900">{selectedProject.salesOrderNo}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Solution:</span>
                  <span className="ml-2 text-gray-900">{selectedProject.solution}</span>
                </div>
              </div>

              {/* Team Assignment Display */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-gray-700">PM:</span>
                  <span className="text-gray-900">
                    {selectedProject.assignedPM ? getUserName(selectedProject.assignedPM) : 'Not Assigned'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Technical Manager:</span>
                  <span className="text-gray-900">
                    {selectedProject.assignedTM ? getUserName(selectedProject.assignedTM) : 'Not Assigned'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProject.status)}`}>
                {selectedProject.status}
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

          {/* Progress Only */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Project Progress</span>
              <span>{selectedProject.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${selectedProject.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
              <div className="text-sm text-gray-600">
                {projectTasksFiltered.length} tasks
              </div>
            </div>
          </div>

          {projectTasksFiltered.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {projectTasksFiltered.map((task) => {
                const progress = task.estimatedHours > 0 ? (task.actualHours / task.estimatedHours) * 100 : 0;
                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';
                
                return (
                  <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            task.status === 'ONGOING' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            task.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                            task.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                          {isOverdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        {task.subTask && (
                          <p className="text-xs text-gray-500">Sub-task: {task.subTask}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Assigned To:</span>
                        <div className="text-gray-900">Engineer #{task.assignedTo}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Progress:</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                progress > 100 ? 'bg-red-500' : progress > 80 ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-600">{Math.round(progress)}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Hours:</span>
                        <div className="text-gray-900">
                          {task.actualHours}h {task.estimatedHours > 0 && `/ ${task.estimatedHours}h`}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Due Date:</span>
                        <div className={`${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-600 mb-4">Start by creating your first task for this project.</p>
              {canCreateTasks && (
                <button
                  onClick={() => setIsTaskFormOpen(true)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Task</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Task Form Modal */}
        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          onSubmit={handleTaskSubmit}
          projectId={selectedProject.id}
          userRole={currentUser.role}
        />
      </div>
    );
  }

  // Main project grid view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">
            {canCreateProject 
              ? 'Create and manage all system projects'
              : currentUser.role === 'PMO'
                ? 'Assign projects to Project Managers and monitor progress'
                : 'View and track your assigned projects'
            }
          </p>
        </div>
        
        {canCreateProject && (
          <button 
            onClick={() => setIsProjectFormOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {filteredProjects.filter(p => p.status === 'ACTIVE').length}
            </p>
            <p className="text-sm text-gray-600">Active Projects</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {filteredProjects.filter(p => p.status === 'COMPLETED').length}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {filteredProjects.filter(p => p.status === 'PLANNING').length}
            </p>
            <p className="text-sm text-gray-600">Planning</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {filteredProjects.reduce((sum, p) => sum + p.sowMandays, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Mandays</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-2">
            {['ALL', 'ACTIVE', 'PLANNING', 'ON_HOLD', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const isOverdue = new Date(project.endDate) < new Date() && project.status !== 'COMPLETED';
            const canAccess = 
              currentUser.role === 'TASS' || 
              currentUser.role === 'PMO' ||
              (currentUser.role === 'PM' && project.assignedPM === currentUser.id) ||
              (currentUser.role === 'TM' && project.assignedTM === currentUser.id);
            
            return (
              <div 
                key={project.id} 
                onClick={() => canAccess && handleProjectClick(project)}
                className={`bg-white rounded-xl p-6 shadow-sm border transition-all ${
                  isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-100'
                } ${canAccess ? 'hover:shadow-md cursor-pointer' : 'opacity-75'}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>SO: {project.salesOrderNo}</span>
                      <span>•</span>
                      <span>{project.clientCompanyName}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </div>
                    {canAccess && <ChevronRight className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>

                {/* Team Assignment */}
                <div className="flex items-center space-x-4 mb-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <UserCheck className="w-3 h-3 text-purple-600" />
                    <span className="text-gray-600">PM:</span>
                    <span className="font-medium text-gray-900">
                      {project.assignedPM ? getUserName(project.assignedPM) : 'Not Assigned'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3 text-blue-600" />
                    <span className="text-gray-600">TM:</span>
                    <span className="font-medium text-gray-900">
                      {project.assignedTM ? getUserName(project.assignedTM) : 'Not Assigned'}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        project.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(project.startDate).toLocaleDateString()}</span>
                    <span>-</span>
                    <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                      {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>SOW: {project.sowMandays} mandays</span>
                    <span>{project.solution}</span>
                  </div>
                </div>

                {isOverdue && (
                  <div className="mt-3 flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Project Overdue</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'ALL' 
              ? 'Try adjusting your filters to see more projects.'
              : 'No projects have been created yet.'
            }
          </p>
        </div>
      )}

      {/* Project Form Modal */}
      <ProjectForm
        isOpen={isProjectFormOpen}
        onClose={() => setIsProjectFormOpen(false)}
        onSubmit={handleProjectSubmit}
      />
    </div>
  );
};

export default ProjectGrid;