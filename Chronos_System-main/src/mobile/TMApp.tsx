import React, { useState } from 'react';
import { 
  Plus, 
  Users, 
  FolderOpen, 
  CheckCircle, 
  Clock, 
  Calendar, 
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Filter,
  ChevronRight,
  AlertTriangle,
  Target,
  TrendingUp,
  FileText,
  User,
  Code,
  Cpu,
  Database
} from 'lucide-react';
import { User as UserType, Project, Task } from '../types';

interface TMAppProps {
  currentUser: UserType;
  onLogout: () => void;
}

const TMApp: React.FC<TMAppProps> = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'tasks' | 'team' | 'approvals'>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Mock data for TM
  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Technical architecture and backend development',
      status: 'ACTIVE',
      createdBy: '1',
      assignedPM: '3',
      assignedTM: currentUser.id,
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
      id: '3',
      name: 'API Integration',
      description: 'Third-party API integration and microservices',
      status: 'ACTIVE',
      createdBy: '1',
      assignedPM: '3',
      assignedTM: currentUser.id,
      startDate: '2024-03-01',
      endDate: '2024-05-30',
      progress: 60,
      budget: 80000,
      spentBudget: 48000,
      salesOrderNo: 'SO-2024-003',
      clientCompanyName: 'Innovation Labs',
      accountManager: 'Michael Johnson',
      sowMandays: 45,
      solution: 'API Integration'
    }
  ];

  const mockTasks: Task[] = [
    {
      id: '1',
      projectId: '1',
      title: 'Database Architecture Design',
      description: 'Design scalable database schema and optimization',
      assignedTo: '5',
      status: 'ONGOING',
      priority: 'HIGH',
      estimatedHours: 40,
      actualHours: 28,
      startDate: '2024-01-15',
      dueDate: '2024-02-15',
      dependencies: [],
      taskName: 'Database Architecture Design',
      subTask: 'Schema Design',
      assignedEngineers: ['5']
    },
    {
      id: '2',
      projectId: '1',
      title: 'API Security Implementation',
      description: 'Implement OAuth2 and JWT security measures',
      assignedTo: '6',
      status: 'PENDING',
      priority: 'CRITICAL',
      estimatedHours: 32,
      actualHours: 0,
      startDate: '2024-02-01',
      dueDate: '2024-02-28',
      dependencies: ['1'],
      taskName: 'API Security Implementation',
      subTask: 'OAuth2 Setup',
      assignedEngineers: ['6']
    },
    {
      id: '3',
      projectId: '3',
      title: 'Microservices Architecture',
      description: 'Design and implement microservices pattern',
      assignedTo: '7',
      status: 'ONGOING',
      priority: 'HIGH',
      estimatedHours: 60,
      actualHours: 35,
      startDate: '2024-03-01',
      dueDate: '2024-04-15',
      dependencies: [],
      taskName: 'Microservices Architecture',
      subTask: 'Service Design',
      assignedEngineers: ['7']
    }
  ];

  const mockTeamMembers = [
    { id: '5', name: 'Alex Thompson', role: 'SENIOR ENGINEER', status: 'ACTIVE', tasksCount: 3, specialization: 'Backend' },
    { id: '6', name: 'Emma Wilson', role: 'ENGINEER', status: 'ACTIVE', tasksCount: 2, specialization: 'Security' },
    { id: '7', name: 'James Miller', role: 'ENGINEER', status: 'ACTIVE', tasksCount: 4, specialization: 'DevOps' },
    { id: '8', name: 'Sophia Davis', role: 'ENGINEER', status: 'ACTIVE', tasksCount: 2, specialization: 'Frontend' },
  ];

  const mockApprovals = [
    {
      id: '1',
      type: 'OVERTIME',
      engineer: 'Alex Thompson',
      task: 'Database Architecture Design',
      hours: '8',
      reason: 'Complex optimization requirements',
      status: 'PENDING',
      submittedAt: '2024-01-20'
    },
    {
      id: '2',
      type: 'EXTENSION',
      engineer: 'James Miller',
      task: 'Microservices Architecture',
      reason: 'Additional service discovery implementation needed',
      status: 'PENDING',
      submittedAt: '2024-01-19'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PLANNING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'ONGOING': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getSpecializationIcon = (specialization: string) => {
    switch (specialization) {
      case 'Backend': return <Database className="w-4 h-4" />;
      case 'Frontend': return <Code className="w-4 h-4" />;
      case 'DevOps': return <Cpu className="w-4 h-4" />;
      case 'Security': return <Target className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{mockProjects.length}</div>
              <div className="text-sm text-gray-600">Technical Projects</div>
            </div>
            <Database className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{mockTasks.length}</div>
          <div className="text-sm text-gray-600">Technical Tasks</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{mockTeamMembers.length}</div>
          <div className="text-sm text-gray-600">Engineers</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">{mockApprovals.filter(a => a.status === 'PENDING').length}</div>
          <div className="text-sm text-gray-600">Pending Reviews</div>
        </div>
      </div>

      {/* Technical Overview */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Technical Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Code className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-blue-900">Architecture</div>
            <div className="text-xs text-blue-700">2 Active Designs</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Database className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-green-900">Database</div>
            <div className="text-xs text-green-700">3 Optimizations</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Cpu className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-purple-900">DevOps</div>
            <div className="text-xs text-purple-700">1 Pipeline</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Target className="w-6 h-6 text-orange-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-orange-900">Security</div>
            <div className="text-xs text-orange-700">2 Audits</div>
          </div>
        </div>
      </div>

      {/* Recent Technical Tasks */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Recent Technical Tasks</h3>
        <div className="space-y-3">
          {mockTasks.slice(0, 2).map(task => (
            <div key={task.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Assigned: Engineer #{task.assignedTo}</span>
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Technical Reviews */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Pending Technical Reviews</h3>
        <div className="space-y-3">
          {mockApprovals.filter(a => a.status === 'PENDING').map(approval => (
            <div key={approval.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{approval.type}</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">PENDING</span>
              </div>
              <p className="text-sm text-gray-600">{approval.engineer} - {approval.task}</p>
              <p className="text-sm text-gray-500">{approval.reason}</p>
              <div className="flex space-x-2 mt-2">
                <button className="flex-1 bg-green-600 text-white py-1 px-3 rounded text-sm">
                  Approve
                </button>
                <button className="flex-1 bg-red-600 text-white py-1 px-3 rounded text-sm">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Technical Projects</h2>
        <button className="bg-blue-600 text-white p-2 rounded-lg">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {mockProjects.map(project => (
          <div key={project.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                <div className="text-xs text-gray-500">
                  Client: {project.clientCompanyName} • Solution: {project.solution}
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Technical Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>Budget: ₱{project.budget.toLocaleString()}</span>
              <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>
            </div>

            <button 
              onClick={() => setSelectedProject(project)}
              className="w-full mt-3 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium"
            >
              View Technical Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Technical Tasks</h2>
        <button className="bg-green-600 text-white p-2 rounded-lg">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {mockTasks.map(task => {
          const progress = task.estimatedHours > 0 ? (task.actualHours / task.estimatedHours) * 100 : 0;
          const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

          return (
            <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
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
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Technical Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      progress > 100 ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <span>Engineer: #{task.assignedTo}</span>
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Engineering Team</h2>

      <div className="space-y-3">
        {mockTeamMembers.map(member => (
          <div key={member.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    {getSpecializationIcon(member.specialization)}
                    <span>{member.specialization}</span>
                  </div>
                  <span>{member.tasksCount} tasks</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApprovals = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Technical Reviews</h2>

      <div className="space-y-3">
        {mockApprovals.map(approval => (
          <div key={approval.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-900">{approval.type} Request</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                {approval.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div><strong>Engineer:</strong> {approval.engineer}</div>
              <div><strong>Technical Task:</strong> {approval.task}</div>
              {approval.hours && <div><strong>Additional Hours:</strong> {approval.hours}</div>}
              <div><strong>Technical Reason:</strong> {approval.reason}</div>
              <div className="text-gray-500">Submitted: {new Date(approval.submittedAt).toLocaleDateString()}</div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium">
                Approve
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Chronos TM</h1>
              <p className="text-xs text-gray-600">Technical Manager</p>
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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
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
                onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100"
              >
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => { setActiveTab('projects'); setIsMenuOpen(false); }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100"
              >
                <FolderOpen className="w-5 h-5 text-gray-600" />
                <span>Projects</span>
              </button>
              <button 
                onClick={() => { setActiveTab('tasks'); setIsMenuOpen(false); }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100"
              >
                <CheckCircle className="w-5 h-5 text-gray-600" />
                <span>Tasks</span>
              </button>
              <button 
                onClick={() => { setActiveTab('team'); setIsMenuOpen(false); }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100"
              >
                <Users className="w-5 h-5 text-gray-600" />
                <span>Team</span>
              </button>
              <button 
                onClick={() => { setActiveTab('approvals'); setIsMenuOpen(false); }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100"
              >
                <Clock className="w-5 h-5 text-gray-600" />
                <span>Reviews</span>
              </button>
              <button 
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-red-50 text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 pb-20">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'team' && renderTeam()}
        {activeTab === 'approvals' && renderApprovals()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center py-2 px-1 ${
              activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-xs">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex flex-col items-center py-2 px-1 ${
              activeTab === 'projects' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <FolderOpen className="w-5 h-5 mb-1" />
            <span className="text-xs">Projects</span>
          </button>
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
            onClick={() => setActiveTab('team')}
            className={`flex flex-col items-center py-2 px-1 ${
              activeTab === 'team' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Users className="w-5 h-5 mb-1" />
            <span className="text-xs">Team</span>
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex flex-col items-center py-2 px-1 ${
              activeTab === 'approvals' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Clock className="w-5 h-5 mb-1" />
            <span className="text-xs">Reviews</span>
          </button>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Technical Project Details</h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{selectedProject.name}</h4>
                <p className="text-sm text-gray-600">{selectedProject.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Client:</span>
                  <div className="font-medium">{selectedProject.clientCompanyName}</div>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <div className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Budget:</span>
                  <div className="font-medium">₱{selectedProject.budget.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Progress:</span>
                  <div className="font-medium">{selectedProject.progress}%</div>
                </div>
              </div>

              <div>
                <span className="text-gray-600 text-sm">Technical Timeline:</span>
                <div className="text-sm font-medium">
                  {new Date(selectedProject.startDate).toLocaleDateString()} - {new Date(selectedProject.endDate).toLocaleDateString()}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TMApp;