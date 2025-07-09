import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  FolderOpen, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Briefcase,
  TrendingUp,
  UserCheck,
  ArrowRight,
  X,
  Save
} from 'lucide-react';
import { User as UserType, Project } from '../../types';

interface PMAssignmentsProps {
  currentUser: UserType;
}

interface Assignment {
  id: string;
  projectId: string;
  projectName: string;
  pmId: string;
  pmName: string;
  assignedDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING';
  workload: number; // percentage
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  clientName: string;
  deadline: string;
  progress: number;
}

interface AssignmentForm {
  projectId: string;
  pmId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  notes: string;
}

const PMAssignments: React.FC<PMAssignmentsProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [pmFilter, setPmFilter] = useState('ALL');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState<AssignmentForm>({
    projectId: '',
    pmId: '',
    priority: 'MEDIUM',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<AssignmentForm>>({});

  // Mock assignments data
  const [mockAssignments, setMockAssignments] = useState<Assignment[]>([
    {
      id: '1',
      projectId: '1',
      projectName: 'E-commerce Platform',
      pmId: '3',
      pmName: 'Lisa Rodriguez',
      assignedDate: '2024-01-15',
      status: 'ACTIVE',
      workload: 85,
      priority: 'HIGH',
      clientName: 'TechFlow Solutions',
      deadline: '2024-06-30',
      progress: 75
    },
    {
      id: '2',
      projectId: '2',
      projectName: 'Mobile App Redesign',
      pmId: '4',
      pmName: 'David Kim',
      assignedDate: '2024-02-01',
      status: 'ACTIVE',
      workload: 60,
      priority: 'MEDIUM',
      clientName: 'Digital Ventures Ltd.',
      deadline: '2024-08-15',
      progress: 45
    },
    {
      id: '3',
      projectId: '3',
      projectName: 'API Integration',
      pmId: '3',
      pmName: 'Lisa Rodriguez',
      assignedDate: '2024-03-01',
      status: 'PENDING',
      workload: 40,
      priority: 'LOW',
      clientName: 'Innovation Labs',
      deadline: '2024-05-30',
      progress: 15
    },
    {
      id: '4',
      projectId: '4',
      projectName: 'Security Audit',
      pmId: '4',
      pmName: 'David Kim',
      assignedDate: '2023-11-01',
      status: 'COMPLETED',
      workload: 100,
      priority: 'CRITICAL',
      clientName: 'Enterprise Systems Co.',
      deadline: '2024-01-31',
      progress: 100
    }
  ]);

  const mockPMs = [
    { id: '3', name: 'Lisa Rodriguez', role: 'PM', currentProjects: 3, efficiency: 92 },
    { id: '4', name: 'David Kim', role: 'PM', currentProjects: 2, efficiency: 88 },
    { id: '11', name: 'Michael Brown', role: 'PM', currentProjects: 4, efficiency: 85 },
    { id: '12', name: 'Sarah Wilson', role: 'PM', currentProjects: 1, efficiency: 95 }
  ];

  // Mock unassigned projects (created by TASS but not assigned to PM yet)
  const [mockUnassignedProjects, setMockUnassignedProjects] = useState<Project[]>([
    { 
      id: '6', 
      name: 'Cloud Migration', 
      description: 'Migrate legacy systems to cloud infrastructure',
      status: 'PLANNING',
      createdBy: '1',
      startDate: '2024-04-01',
      endDate: '2024-07-30',
      progress: 0,
      budget: 180000, // in peso
      spentBudget: 0,
      salesOrderNo: 'SO-2024-006',
      clientCompanyName: 'StartupCorp',
      accountManager: 'Jennifer Taylor',
      sowMandays: 90,
      solution: 'Cloud Migration'
    },
    { 
      id: '7', 
      name: 'AI Integration', 
      description: 'Integrate AI capabilities into existing platform',
      status: 'PLANNING',
      createdBy: '1',
      startDate: '2024-05-01',
      endDate: '2024-09-15',
      progress: 0,
      budget: 220000, // in peso
      spentBudget: 0,
      salesOrderNo: 'SO-2024-007',
      clientCompanyName: 'FutureTech',
      accountManager: 'Robert Brown',
      sowMandays: 110,
      solution: 'AI Integration'
    },
    { 
      id: '8', 
      name: 'Legacy System Update', 
      description: 'Modernize legacy banking system',
      status: 'PLANNING',
      createdBy: '1',
      startDate: '2024-03-15',
      endDate: '2024-06-20',
      progress: 0,
      budget: 150000, // in peso
      spentBudget: 0,
      salesOrderNo: 'SO-2024-008',
      clientCompanyName: 'OldCorp Banking',
      accountManager: 'Lisa Anderson',
      sowMandays: 75,
      solution: 'System Modernization'
    }
  ]);

  const canManageAssignments = currentUser.role === 'PMO';

  const filteredAssignments = mockAssignments.filter(assignment => {
    const matchesSearch = assignment.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.pmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || assignment.status === statusFilter;
    const matchesPM = pmFilter === 'ALL' || assignment.pmId === pmFilter;
    
    return matchesSearch && matchesStatus && matchesPM;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
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

  const getWorkloadColor = (workload: number) => {
    if (workload > 90) return 'text-red-600 bg-red-50';
    if (workload > 70) return 'text-orange-600 bg-orange-50';
    if (workload > 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getAssignmentStats = () => {
    const totalAssignments = mockAssignments.length;
    const activeAssignments = mockAssignments.filter(a => a.status === 'ACTIVE').length;
    const completedAssignments = mockAssignments.filter(a => a.status === 'COMPLETED').length;
    const pendingAssignments = mockAssignments.filter(a => a.status === 'PENDING').length;
    const overloadedPMs = mockPMs.filter(pm => {
      const pmAssignments = mockAssignments.filter(a => a.pmId === pm.id && a.status === 'ACTIVE');
      const totalWorkload = pmAssignments.reduce((sum, a) => sum + a.workload, 0);
      return totalWorkload > 100;
    }).length;
    const unassignedProjects = mockUnassignedProjects.length;

    return {
      totalAssignments,
      activeAssignments,
      completedAssignments,
      pendingAssignments,
      overloadedPMs,
      unassignedProjects
    };
  };

  const stats = getAssignmentStats();

  const getPMWorkload = (pmId: string) => {
    const pmAssignments = mockAssignments.filter(a => a.pmId === pmId && a.status === 'ACTIVE');
    return pmAssignments.reduce((sum, a) => sum + a.workload, 0);
  };

  const validateForm = (): boolean => {
    const errors: Partial<AssignmentForm> = {};
    
    if (!assignmentForm.projectId) {
      errors.projectId = 'Please select a project';
    }
    
    if (!assignmentForm.pmId) {
      errors.pmId = 'Please select a Project Manager';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setAssignmentForm({
      projectId: '',
      pmId: '',
      priority: 'MEDIUM',
      notes: ''
    });
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return; // Prevent closing while submitting
    
    // Check if form has unsaved changes
    const hasChanges = assignmentForm.projectId || assignmentForm.pmId || assignmentForm.notes;
    
    if (hasChanges) {
      const confirmClose = confirm('You have unsaved changes. Are you sure you want to close without saving?');
      if (!confirmClose) return;
    }
    
    resetForm();
    setIsAssignModalOpen(false);
  };

  const handleAssignProject = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const project = mockUnassignedProjects.find(p => p.id === assignmentForm.projectId);
      const pm = mockPMs.find(p => p.id === assignmentForm.pmId);
      
      if (project && pm) {
        // Create new assignment
        const newAssignment: Assignment = {
          id: Date.now().toString(),
          projectId: project.id,
          projectName: project.name,
          pmId: pm.id,
          pmName: pm.name,
          assignedDate: new Date().toISOString().split('T')[0],
          status: 'ACTIVE',
          workload: Math.floor(Math.random() * 40) + 40, // Random workload 40-80%
          priority: assignmentForm.priority,
          clientName: project.clientCompanyName,
          deadline: project.endDate,
          progress: 0
        };
        
        // Add to assignments
        setMockAssignments(prev => [newAssignment, ...prev]);
        
        // Remove from unassigned projects
        setMockUnassignedProjects(prev => prev.filter(p => p.id !== project.id));
        
        // Show success message
        alert(`✅ Project "${project.name}" has been successfully assigned to ${pm.name}!`);
        
        // Reset and close modal
        resetForm();
        setIsAssignModalOpen(false);
      }
    } catch (error) {
      alert('❌ Failed to assign project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAssignModal = (projectId?: string) => {
    resetForm();
    if (projectId) {
      setAssignmentForm(prev => ({ ...prev, projectId }));
    }
    setIsAssignModalOpen(true);
  };

  if (!canManageAssignments) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Users className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600">
          Only PMO users can access the PM Assignments module.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PM Assignments</h1>
          <p className="text-gray-600">Assign projects to Project Managers and monitor workload distribution</p>
        </div>
        
        <button 
          onClick={() => openAssignModal()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Project</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalAssignments}</div>
              <div className="text-sm text-gray-600">Total Assignments</div>
            </div>
            <Briefcase className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{stats.activeAssignments}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{stats.completedAssignments}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingAssignments}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-red-600">{stats.overloadedPMs}</div>
          <div className="text-sm text-gray-600">Overloaded PMs</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-orange-600">{stats.unassignedProjects}</div>
          <div className="text-sm text-gray-600">Unassigned</div>
        </div>
      </div>

      {/* PM Workload Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">PM Workload Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockPMs.map(pm => {
            const workload = getPMWorkload(pm.id);
            const activeProjects = mockAssignments.filter(a => a.pmId === pm.id && a.status === 'ACTIVE').length;
            
            return (
              <div key={pm.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {pm.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{pm.name}</div>
                    <div className="text-sm text-gray-600">{pm.role}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Workload</span>
                    <span className={`font-medium px-2 py-1 rounded ${getWorkloadColor(workload)}`}>
                      {workload}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        workload > 100 ? 'bg-red-500' : workload > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(workload, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{activeProjects} active projects</span>
                    <span>{pm.efficiency}% efficiency</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unassigned Projects */}
      {mockUnassignedProjects.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Unassigned Projects</h3>
            <span className="text-sm text-orange-600 font-medium">
              {mockUnassignedProjects.length} projects awaiting PM assignment
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockUnassignedProjects.map(project => (
              <div key={project.id} className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{project.clientCompanyName}</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>SO: {project.salesOrderNo}</div>
                      <div>Mandays: {project.sowMandays}</div>
                      <div>Deadline: {new Date(project.endDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                </div>
                <button 
                  onClick={() => openAssignModal(project.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Assign PM</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, PMs, or clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
          </select>

          {/* PM Filter */}
          <select
            value={pmFilter}
            onChange={(e) => setPmFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All PMs</option>
            {mockPMs.map(pm => (
              <option key={pm.id} value={pm.id}>{pm.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Project Assignments</h3>
          <p className="text-sm text-gray-600">Current project assignments and their status</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project & Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned PM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workload
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.map((assignment) => {
                const isOverdue = new Date(assignment.deadline) < new Date() && assignment.status !== 'COMPLETED';
                
                return (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{assignment.projectName}</div>
                        <div className="text-sm text-gray-500">{assignment.clientName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {assignment.pmName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{assignment.pmName}</div>
                          <div className="text-xs text-gray-500">
                            Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getPriorityColor(assignment.priority)}`}>
                        {assignment.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium px-2 py-1 rounded ${getWorkloadColor(assignment.workload)}`}>
                          {assignment.workload}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${assignment.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{assignment.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                          {new Date(assignment.deadline).toLocaleDateString()}
                        </span>
                        {isOverdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 mb-4">
            <Users className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'ALL' || pmFilter !== 'ALL'
              ? 'Try adjusting your filters to see more assignments.'
              : 'No project assignments have been made yet.'
            }
          </p>
        </div>
      )}

      {/* Enhanced Assignment Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Assign Project to PM</h3>
                  <p className="text-sm text-gray-600">Select a project and assign it to a Project Manager</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Project Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Project *
                </label>
                <select
                  value={assignmentForm.projectId}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, projectId: e.target.value }))}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    formErrors.projectId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">Choose a project to assign</option>
                  {mockUnassignedProjects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name} - {project.clientCompanyName}
                    </option>
                  ))}
                </select>
                {formErrors.projectId && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.projectId}</p>
                )}
                
                {/* Project Details */}
                {assignmentForm.projectId && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    {(() => {
                      const selectedProject = mockUnassignedProjects.find(p => p.id === assignmentForm.projectId);
                      return selectedProject ? (
                        <div className="text-sm space-y-1">
                          <div><strong>Client:</strong> {selectedProject.clientCompanyName}</div>
                          <div><strong>Solution:</strong> {selectedProject.solution}</div>
                          <div><strong>Mandays:</strong> {selectedProject.sowMandays}</div>
                          <div><strong>Deadline:</strong> {new Date(selectedProject.endDate).toLocaleDateString()}</div>
                          <div><strong>Budget:</strong> ₱{selectedProject.budget.toLocaleString()}</div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>

              {/* PM Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Project Manager *
                </label>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {mockPMs.map(pm => {
                    const workload = getPMWorkload(pm.id);
                    const isOverloaded = workload > 90;
                    
                    return (
                      <div
                        key={pm.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          assignmentForm.pmId === pm.id
                            ? 'border-blue-500 bg-blue-50'
                            : isOverloaded
                              ? 'border-red-200 bg-red-50'
                              : 'border-gray-200 hover:border-blue-300'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => !isSubmitting && setAssignmentForm(prev => ({ ...prev, pmId: pm.id }))}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="pm-selection"
                            checked={assignmentForm.pmId === pm.id}
                            onChange={() => !isSubmitting && setAssignmentForm(prev => ({ ...prev, pmId: pm.id }))}
                            disabled={isSubmitting}
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {pm.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-semibold text-gray-900">{pm.name}</h5>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getWorkloadColor(workload)}`}>
                                  {workload}% workload
                                </span>
                                {isOverloaded && (
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{pm.currentProjects} active projects</span>
                              <span>{pm.efficiency}% efficiency</span>
                            </div>
                            {isOverloaded && (
                              <div className="text-xs text-red-600 mt-1">
                                ⚠️ High workload - consider redistributing projects
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {formErrors.pmId && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.pmId}</p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Priority *
                </label>
                <select
                  value={assignmentForm.priority}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, priority: e.target.value as any }))}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                  <option value="CRITICAL">Critical Priority</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Notes
                </label>
                <textarea
                  value={assignmentForm.notes}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, notes: e.target.value }))}
                  disabled={isSubmitting}
                  rows={3}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  placeholder="Add any special instructions or notes for this assignment..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
                {isSubmitting && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Assigning project...</span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignProject}
                  disabled={!assignmentForm.projectId || !assignmentForm.pmId || isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Assigning...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Assign Project</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PMAssignments;