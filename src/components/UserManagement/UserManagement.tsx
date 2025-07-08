import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Users, 
  Mail,
  Shield,
  Calendar,
  MoreVertical,
  X,
  CheckCircle,
  AlertTriangle,
  Clock,
  Building,
  UserPlus,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { User } from '../../types';

interface UserManagementProps {
  currentUser: User;
}

interface ExtendedUser extends User {
  joinDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  lastLogin: string;
  projectsAssigned: number;
}

interface NewUserForm {
  name: string;
  email: string;
  role: 'TASS' | 'PMO' | 'PM' | 'TM' | 'ENGINEER' | 'PM_DEPT_HEAD' | 'TM_DEPT_HEAD' | 'EEM';
  department?: 'ITSD' | 'DIG' | 'BSD' | 'TSD';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  salaryLevel?: 1 | 2 | 3 | 4 | 5;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    name: '',
    email: '',
    role: 'ENGINEER',
    department: undefined,
    status: 'ACTIVE'
  });
  const [formErrors, setFormErrors] = useState<Partial<NewUserForm>>({});

  // Mock extended user data including new roles and sample engineers
  const [mockUsers, setMockUsers] = useState<ExtendedUser[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@chronos.com',
      role: 'TASS',
      joinDate: '2023-01-15',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T10:30:00Z',
      projectsAssigned: 0
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@chronos.com',
      role: 'PMO',
      joinDate: '2023-02-01',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T09:15:00Z',
      projectsAssigned: 12
    },
    {
      id: '18',
      name: 'Robert Martinez',
      email: 'robert@chronos.com',
      role: 'PM_DEPT_HEAD',
      joinDate: '2023-01-20',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T08:45:00Z',
      projectsAssigned: 25
    },
    {
      id: '19',
      name: 'Jennifer Lee',
      email: 'jennifer@chronos.com',
      role: 'TM_DEPT_HEAD',
      joinDate: '2023-01-25',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T09:30:00Z',
      projectsAssigned: 18
    },
    {
      id: '3',
      name: 'Lisa Rodriguez',
      email: 'lisa@chronos.com',
      role: 'PM',
      joinDate: '2023-03-10',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T11:45:00Z',
      projectsAssigned: 5
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david@chronos.com',
      role: 'TM',
      joinDate: '2023-04-05',
      status: 'ACTIVE',
      lastLogin: '2024-01-19T16:20:00Z',
      projectsAssigned: 3
    },
    {
      id: '11',
      name: 'Michael Brown',
      email: 'michael.brown@chronos.com',
      role: 'PM',
      joinDate: '2023-05-20',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T07:30:00Z',
      projectsAssigned: 4
    },
    {
      id: '12',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@chronos.com',
      role: 'PM',
      joinDate: '2023-06-10',
      status: 'ACTIVE',
      lastLogin: '2024-01-19T18:15:00Z',
      projectsAssigned: 3
    },
    {
      id: '13',
      name: 'Kevin Johnson',
      email: 'kevin.johnson@chronos.com',
      role: 'PM',
      joinDate: '2023-07-01',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T12:00:00Z',
      projectsAssigned: 6
    },
    {
      id: '14',
      name: 'Amanda Chen',
      email: 'amanda.chen@chronos.com',
      role: 'TM',
      joinDate: '2023-05-15',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T08:20:00Z',
      projectsAssigned: 4
    },
    {
      id: '15',
      name: 'Carlos Martinez',
      email: 'carlos.martinez@chronos.com',
      role: 'TM',
      joinDate: '2023-06-20',
      status: 'ACTIVE',
      lastLogin: '2024-01-19T17:45:00Z',
      projectsAssigned: 2
    },
    {
      id: '16',
      name: 'Sophie Taylor',
      email: 'sophie.taylor@chronos.com',
      role: 'TM',
      joinDate: '2023-07-15',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T09:50:00Z',
      projectsAssigned: 3
    },
    {
      id: '17',
      name: 'Ryan Johnson',
      email: 'ryan.johnson@chronos.com',
      role: 'TM',
      joinDate: '2023-08-01',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T11:30:00Z',
      projectsAssigned: 1
    },
    // Sample Engineers with Departments
    {
      id: '20',
      name: 'John Cruz',
      email: 'john.cruz@chronos.com',
      role: 'ENGINEER',
      department: 'ITSD',
      joinDate: '2023-05-01',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T08:15:00Z',
      projectsAssigned: 2
    },
    {
      id: '21',
      name: 'Maria Santos',
      email: 'maria.santos@chronos.com',
      role: 'ENGINEER',
      department: 'DIG',
      joinDate: '2023-05-15',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T09:30:00Z',
      projectsAssigned: 3
    },
    {
      id: '22',
      name: 'Allan Reyes',
      email: 'allan.reyes@chronos.com',
      role: 'ENGINEER',
      department: 'BSD',
      joinDate: '2023-06-01',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T07:45:00Z',
      projectsAssigned: 2
    },
    {
      id: '23',
      name: 'Kim De Vera',
      email: 'kim.devera@chronos.com',
      role: 'ENGINEER',
      department: 'TSD',
      joinDate: '2023-06-15',
      status: 'ACTIVE',
      lastLogin: '2024-01-19T16:30:00Z',
      projectsAssigned: 1
    },
    {
      id: '24',
      name: 'Joseph Mendoza',
      email: 'joseph.mendoza@chronos.com',
      role: 'ENGINEER',
      department: 'DIG',
      joinDate: '2023-07-01',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T10:15:00Z',
      projectsAssigned: 2
    },
    {
      id: '25',
      name: 'Ella Navarro',
      email: 'ella.navarro@chronos.com',
      role: 'ENGINEER',
      department: 'BSD',
      joinDate: '2023-07-15',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T11:00:00Z',
      projectsAssigned: 3
    },
    {
      id: '26',
      name: 'Danilo Garcia',
      email: 'danilo.garcia@chronos.com',
      role: 'ENGINEER',
      department: 'ITSD',
      joinDate: '2023-08-01',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T08:30:00Z',
      projectsAssigned: 2
    },
    {
      id: '27',
      name: 'Erika Lim',
      email: 'erika.lim@chronos.com',
      role: 'ENGINEER',
      department: 'TSD',
      joinDate: '2023-08-15',
      status: 'ACTIVE',
      lastLogin: '2024-01-19T15:45:00Z',
      projectsAssigned: 1
    },
    {
      id: '28',
      name: 'Nico Alvarez',
      email: 'nico.alvarez@chronos.com',
      role: 'ENGINEER',
      department: 'DIG',
      joinDate: '2023-09-01',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T09:00:00Z',
      projectsAssigned: 2
    },
    {
      id: '29',
      name: 'Faith Domingo',
      email: 'faith.domingo@chronos.com',
      role: 'ENGINEER',
      department: 'BSD',
      joinDate: '2023-09-15',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T10:45:00Z',
      projectsAssigned: 3
    },
    // Additional Engineers
    {
      id: '30',
      name: 'Mark Santos',
      email: 'mark.santos@chronos.com',
      role: 'ENGINEER',
      department: 'ITSD',
      joinDate: '2023-10-01',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T08:00:00Z',
      projectsAssigned: 1
    },
    {
      id: '31',
      name: 'Anna Rodriguez',
      email: 'anna.rodriguez@chronos.com',
      role: 'ENGINEER',
      department: 'DIG',
      joinDate: '2023-10-15',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T09:45:00Z',
      projectsAssigned: 2
    },
    {
      id: '32',
      name: 'Luis Fernandez',
      email: 'luis.fernandez@chronos.com',
      role: 'ENGINEER',
      department: 'BSD',
      joinDate: '2023-11-01',
      status: 'ACTIVE',
      lastLogin: '2024-01-19T17:30:00Z',
      projectsAssigned: 1
    },
    {
      id: '33',
      name: 'Grace Tan',
      email: 'grace.tan@chronos.com',
      role: 'ENGINEER',
      department: 'TSD',
      joinDate: '2023-11-15',
      status: 'ACTIVE',
      lastLogin: '2024-01-20T10:20:00Z',
      projectsAssigned: 2
    },
    {
      id: '34',
      name: 'Carlos Dela Cruz',
      email: 'carlos.delacruz@chronos.com',
      role: 'ENGINEER',
      department: 'ITSD',
      joinDate: '2023-12-01',
      status: 'PENDING',
      lastLogin: '2024-01-18T14:00:00Z',
      projectsAssigned: 0
    },
    {
      id: '35',
      name: 'Maya Patel',
      email: 'maya.patel@chronos.com',
      role: 'ENGINEER',
      department: 'DIG',
      joinDate: '2023-12-15',
      status: 'PENDING',
      lastLogin: '2024-01-19T16:00:00Z',
      projectsAssigned: 0
    }
  ]);

  const canManageUsers = ['TASS', 'PM_DEPT_HEAD', 'TM_DEPT_HEAD', 'EEM'].includes(currentUser.role);
  const canManageSalaryLevels = currentUser.role === 'EEM';

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
    const matchesDepartment = departmentFilter === 'ALL' || user.department === departmentFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const getUserStats = () => {
    return {
      total: mockUsers.length,
      active: mockUsers.filter(u => u.status === 'ACTIVE').length,
      inactive: mockUsers.filter(u => u.status === 'INACTIVE').length,
      pending: mockUsers.filter(u => u.status === 'PENDING').length,
      engineers: mockUsers.filter(u => u.role === 'ENGINEER').length,
      managers: mockUsers.filter(u => ['PM', 'TM', 'PMO', 'PM_DEPT_HEAD', 'TM_DEPT_HEAD'].includes(u.role)).length
    };
  };

  const stats = getUserStats();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TASS': return 'bg-purple-100 text-purple-800';
      case 'PMO': return 'bg-blue-100 text-blue-800';
      case 'PM_DEPT_HEAD': return 'bg-emerald-100 text-emerald-800';
      case 'TM_DEPT_HEAD': return 'bg-amber-100 text-amber-800';
      case 'PM': return 'bg-green-100 text-green-800';
      case 'TM': return 'bg-yellow-100 text-yellow-800';
      case 'ENGINEER': return 'bg-gray-100 text-gray-800';
      case 'EEM': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-50 border-green-200';
      case 'INACTIVE': return 'text-red-600 bg-red-50 border-red-200';
      case 'PENDING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="w-4 h-4" />;
      case 'INACTIVE': return <X className="w-4 h-4" />;
      case 'PENDING': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getDepartmentColor = (department?: string) => {
    if (!department) return 'bg-gray-100 text-gray-600';
    
    switch (department) {
      case 'ITSD': return 'bg-blue-100 text-blue-800';
      case 'DIG': return 'bg-green-100 text-green-800';
      case 'BSD': return 'bg-purple-100 text-purple-800';
      case 'TSD': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'PM_DEPT_HEAD': return 'PM Dept Head';
      case 'TM_DEPT_HEAD': return 'TM Dept Head';
      case 'EEM': return 'EEM';
      default: return role;
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<NewUserForm> = {};
    
    if (!newUserForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!newUserForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserForm.email)) {
      errors.email = 'Please enter a valid email address';
    } else if (mockUsers.some(u => u.email.toLowerCase() === newUserForm.email.toLowerCase() && u.id !== selectedUser?.id)) {
      errors.email = 'Email already exists';
    }
    
    if (newUserForm.role === 'ENGINEER' && !newUserForm.department) {
      errors.department = 'Department is required for engineers';
    }
    
    if (newUserForm.role === 'ENGINEER' && canManageSalaryLevels && !newUserForm.salaryLevel) {
      errors.salaryLevel = 'Salary level is required for engineers';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setNewUserForm({
      name: '',
      email: '',
      role: 'ENGINEER',
      department: undefined,
      status: 'ACTIVE',
      salaryLevel: undefined
    });
    setFormErrors({});
    setSelectedUser(null);
    setIsSubmitting(false);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    
    const hasChanges = newUserForm.name || newUserForm.email;
    
    if (hasChanges) {
      const confirmClose = confirm('You have unsaved changes. Are you sure you want to close without saving?');
      if (!confirmClose) return;
    }
    
    resetForm();
    setIsAddUserModalOpen(false);
    setIsEditUserModalOpen(false);
  };

  const handleAddUser = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: ExtendedUser = {
        id: Date.now().toString(),
        name: newUserForm.name,
        email: newUserForm.email,
        role: newUserForm.role,
        department: newUserForm.department,
        joinDate: new Date().toISOString().split('T')[0],
        status: newUserForm.status,
        salaryLevel: newUserForm.salaryLevel,
        lastLogin: new Date().toISOString(),
        projectsAssigned: 0
      };
      
      setMockUsers(prev => [newUser, ...prev]);
      alert(`✅ User "${newUserForm.name}" has been successfully added!`);
      
      resetForm();
      setIsAddUserModalOpen(false);
    } catch (error) {
      alert('❌ Failed to add user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async () => {
    if (!validateForm() || !selectedUser) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMockUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? {
              ...user,
              name: newUserForm.name,
              email: newUserForm.email,
              role: newUserForm.role,
              department: newUserForm.department,
              status: newUserForm.status,
              salaryLevel: newUserForm.salaryLevel
            }
          : user
      ));
      
      alert(`✅ User "${newUserForm.name}" has been successfully updated!`);
      
      resetForm();
      setIsEditUserModalOpen(false);
    } catch (error) {
      alert('❌ Failed to update user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (user: ExtendedUser) => {
    setSelectedUser(user);
    setNewUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
      salaryLevel: user.salaryLevel
    });
    setIsEditUserModalOpen(true);
  };

  const handleDeleteUser = (user: ExtendedUser) => {
    const confirmDelete = confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`);
    
    if (confirmDelete) {
      setMockUsers(prev => prev.filter(u => u.id !== user.id));
      alert(`✅ User "${user.name}" has been successfully deleted.`);
    }
  };

  const handleStatusToggle = (user: ExtendedUser) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? 'activate' : 'deactivate';
    
    const confirmToggle = confirm(`Are you sure you want to ${action} user "${user.name}"?`);
    
    if (confirmToggle) {
      setMockUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, status: newStatus } : u
      ));
      alert(`✅ User "${user.name}" has been ${action}d successfully.`);
    }
  };

  if (!canManageUsers) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Users className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600">
          Only TASS, PM Dept Head, TM Dept Head, and EEM users can access the User Management module.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {canManageSalaryLevels ? 'Engineer Salary Levels' : 'User Management'}
          </h1>
          <p className="text-gray-600">
            {canManageSalaryLevels 
              ? 'Manage engineer salary levels and hourly rates'
              : 'Manage system users, roles, and permissions'
            }
          </p>
        </div>
        
        {!canManageSalaryLevels && (
          <button 
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          <div className="text-sm text-gray-600">Inactive</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-purple-600">{stats.engineers}</div>
          <div className="text-sm text-gray-600">Engineers</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-indigo-600">{stats.managers}</div>
          <div className="text-sm text-gray-600">Managers</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Roles</option>
            <option value="TASS">TASS</option>
            <option value="PMO">PMO</option>
            <option value="PM_DEPT_HEAD">PM Dept Head</option>
            <option value="TM_DEPT_HEAD">TM Dept Head</option>
            <option value="PM">PM</option>
            <option value="TM">TM</option>
            <option value="ENGINEER">Engineer</option>
            <option value="EEM">EEM</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
          </select>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Departments</option>
            <option value="ITSD">ITSD</option>
            <option value="DIG">DIG</option>
            <option value="BSD">BSD</option>
            <option value="TSD">TSD</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('ALL');
              setStatusFilter('ALL');
              setDepartmentFilter('ALL');
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            {canManageSalaryLevels ? 'Engineer Salary Management' : 'System Users'}
          </h3>
          <p className="text-sm text-gray-600">
            {canManageSalaryLevels 
              ? 'Set and manage engineer salary levels and hourly rates'
              : 'Manage user accounts, roles, and access permissions'
            }
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Department
                </th>
                {canManageSalaryLevels && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary Level
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                {!canManageSalaryLevels && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.filter(user => canManageSalaryLevels ? user.role === 'ENGINEER' : true).map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                      {user.department && (
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDepartmentColor(user.department)}`}>
                            {user.department}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  {canManageSalaryLevels && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'ENGINEER' ? (
                        <div className="space-y-1">
                          <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.salaryLevel === 5 ? 'bg-purple-100 text-purple-800' :
                            user.salaryLevel === 4 ? 'bg-blue-100 text-blue-800' :
                            user.salaryLevel === 3 ? 'bg-green-100 text-green-800' :
                            user.salaryLevel === 2 ? 'bg-yellow-100 text-yellow-800' :
                            user.salaryLevel === 1 ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            Level {user.salaryLevel || 'Not Set'}
                          </div>
                          {user.salaryLevel && (
                            <div className="text-xs text-gray-500">
                              {user.salaryLevel === 1 && '$800-1000'}
                              {user.salaryLevel === 2 && '$1000-2000'}
                              {user.salaryLevel === 3 && '$2000-3000'}
                              {user.salaryLevel === 4 && '$3000-4000'}
                              {user.salaryLevel === 5 && '$4000+'}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getStatusColor(user.status)}`}>
                      {getStatusIcon(user.status)}
                      <span className="text-xs font-medium">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.projectsAssigned}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{new Date(user.lastLogin).toLocaleDateString()}</div>
                    <div className="text-xs">{new Date(user.lastLogin).toLocaleTimeString()}</div>
                  </td>
                  {!canManageSalaryLevels && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title={canManageSalaryLevels ? "Edit Salary Level" : "Edit User"}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {!canManageSalaryLevels && (
                        <>
                          <button
                            onClick={() => handleStatusToggle(user)}
                            className={`transition-colors ${
                              user.status === 'ACTIVE' 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={user.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                          >
                            {user.status === 'ACTIVE' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 mb-4">
            <Users className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">
            {searchTerm || roleFilter !== 'ALL' || statusFilter !== 'ALL' || departmentFilter !== 'ALL'
              ? 'Try adjusting your filters to see more users.'
              : 'No users have been added to the system yet.'
            }
          </p>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
                  <p className="text-sm text-gray-600">Create a new user account with role and permissions</p>
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
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Enter full name"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Enter email address"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm(prev => ({ 
                      ...prev, 
                      role: e.target.value as NewUserForm['role'],
                      department: e.target.value === 'ENGINEER' ? prev.department : undefined
                    }))}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="ENGINEER">Engineer</option>
                    <option value="TM">Technical Manager</option>
                    <option value="PM">Project Manager</option>
                    <option value="PMO">PMO</option>
                    <option value="TM_DEPT_HEAD">TM Dept Head</option>
                    <option value="PM_DEPT_HEAD">PM Dept Head</option>
                    <option value="TASS">TASS</option>
                    <option value="EEM">EEM</option>
                  </select>
                </div>

                {/* Department - Only for Engineers */}
                {newUserForm.role === 'ENGINEER' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      value={newUserForm.department || ''}
                      onChange={(e) => setNewUserForm(prev => ({ 
                        ...prev, 
                        department: e.target.value as NewUserForm['department']
                      }))}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        formErrors.department ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Select Department</option>
                      <option value="ITSD">ITSD - IT Services</option>
                      <option value="DIG">DIG - Digital Innovation</option>
                      <option value="BSD">BSD - Business Solutions</option>
                      <option value="TSD">TSD - Technical Support</option>
                    </select>
                    {formErrors.department && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>
                    )}
                  </div>
                )}

                {/* Salary Level - Only for Engineers when EEM is managing */}
                {newUserForm.role === 'ENGINEER' && canManageSalaryLevels && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Level *
                    </label>
                    <select
                      value={newUserForm.salaryLevel || ''}
                      onChange={(e) => setNewUserForm(prev => ({ 
                        ...prev, 
                        salaryLevel: parseInt(e.target.value) as NewUserForm['salaryLevel']
                      }))}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        formErrors.salaryLevel ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Select Salary Level</option>
                      <option value="1">Level 1 ($800-1000)</option>
                      <option value="2">Level 2 ($1000-2000)</option>
                      <option value="3">Level 3 ($2000-3000)</option>
                      <option value="4">Level 4 ($3000-4000)</option>
                      <option value="5">Level 5 ($4000+)</option>
                    </select>
                    {formErrors.salaryLevel && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.salaryLevel}</p>
                    )}
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={newUserForm.status}
                    onChange={(e) => setNewUserForm(prev => ({ 
                      ...prev, 
                      status: e.target.value as NewUserForm['status']
                    }))}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
                {isSubmitting && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Creating user...</span>
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
                  onClick={handleAddUser}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Create User</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditUserModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Edit className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
                  <p className="text-sm text-gray-600">Update user information and permissions</p>
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
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Enter full name"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Enter email address"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm(prev => ({ 
                      ...prev, 
                      role: e.target.value as NewUserForm['role'],
                      department: e.target.value === 'ENGINEER' ? prev.department : undefined
                    }))}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="ENGINEER">Engineer</option>
                    <option value="TM">Technical Manager</option>
                    <option value="PM">Project Manager</option>
                    <option value="PMO">PMO</option>
                    <option value="TM_DEPT_HEAD">TM Dept Head</option>
                    <option value="PM_DEPT_HEAD">PM Dept Head</option>
                    <option value="TASS">TASS</option>
                    <option value="EEM">EEM</option>
                  </select>
                </div>

                {/* Department - Only for Engineers */}
                {newUserForm.role === 'ENGINEER' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      value={newUserForm.department || ''}
                      onChange={(e) => setNewUserForm(prev => ({ 
                        ...prev, 
                        department: e.target.value as NewUserForm['department']
                      }))}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        formErrors.department ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Select Department</option>
                      <option value="ITSD">ITSD - IT Services</option>
                      <option value="DIG">DIG - Digital Innovation</option>
                      <option value="BSD">BSD - Business Solutions</option>
                      <option value="TSD">TSD - Technical Support</option>
                    </select>
                    {formErrors.department && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>
                    )}
                  </div>
                )}

                {/* Salary Level - Only for Engineers when EEM is managing */}
                {newUserForm.role === 'ENGINEER' && canManageSalaryLevels && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Level *
                    </label>
                    <select
                      value={newUserForm.salaryLevel || ''}
                      onChange={(e) => setNewUserForm(prev => ({ 
                        ...prev, 
                        salaryLevel: parseInt(e.target.value) as NewUserForm['salaryLevel']
                      }))}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        formErrors.salaryLevel ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Select Salary Level</option>
                      <option value="1">Level 1 ($800-1000)</option>
                      <option value="2">Level 2 ($1000-2000)</option>
                      <option value="3">Level 3 ($2000-3000)</option>
                      <option value="4">Level 4 ($3000-4000)</option>
                      <option value="5">Level 5 ($4000+)</option>
                    </select>
                    {formErrors.salaryLevel && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.salaryLevel}</p>
                    )}
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={newUserForm.status}
                    onChange={(e) => setNewUserForm(prev => ({ 
                      ...prev, 
                      status: e.target.value as NewUserForm['status']
                    }))}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
                {isSubmitting && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    <span>Updating user...</span>
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
                  onClick={handleEditUser}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Update User</span>
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

export default UserManagement;