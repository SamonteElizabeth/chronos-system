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
  X
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
  role: 'TASS' | 'PMO' | 'PM' | 'TM' | 'ENGINEER' | 'PM_DEPT_HEAD' | 'TM_DEPT_HEAD';
  department?: 'ITSD' | 'DIG' | 'BSD' | 'TSD';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
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
    }
  ]);

  const canManageUsers = ['TASS', 'PM_DEPT_HEAD', 'TM_DEPT_HEAD'].includes(currentUser.role);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
    const matchesDepartment = departmentFilter === 'ALL' || user.department === departmentFilter;
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TASS': return 'bg-purple-100 text-purple-800';
      case 'PMO': return 'bg-blue-100 text-blue-800';
      case 'PM': return 'bg-green-100 text-green-800';
      case 'TM': return 'bg-yellow-100 text-yellow-800';
      case 'ENGINEER': return 'bg-gray-100 text-gray-800';
      case 'PM_DEPT_HEAD': return 'bg-emerald-100 text-emerald-800';
      case 'TM_DEPT_HEAD': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (department?: string) => {
    if (!department) return '';
    switch (department) {
      case 'ITSD': return 'bg-blue-100 text-blue-800';
      case 'DIG': return 'bg-green-100 text-green-800';
      case 'BSD': return 'bg-purple-100 text-purple-800';
      case 'TSD': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'PM_DEPT_HEAD': return 'PM Dept Head';
      case 'TM_DEPT_HEAD': return 'TM Dept Head';
      default: return role;
    }
  };

  const getLastLoginText = (lastLogin: string) => {
    const now = new Date();
    const loginTime = new Date(lastLogin);
    const diffInHours = Math.floor((now.getTime() - loginTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return loginTime.toLocaleDateString();
  };

  const getUserStats = () => {
    return {
      total: mockUsers.length,
      active: mockUsers.filter(u => u.status === 'ACTIVE').length,
      inactive: mockUsers.filter(u => u.status === 'INACTIVE').length,
      pending: mockUsers.filter(u => u.status === 'PENDING').length,
      engineers: mockUsers.filter(u => u.role === 'ENGINEER').length,
      managers: mockUsers.filter(u => ['PM', 'TM', 'PMO', 'PM_DEPT_HEAD', 'TM_DEPT_HEAD'].includes(u.role)).length,
      itsd: mockUsers.filter(u => u.department === 'ITSD').length,
      dig: mockUsers.filter(u => u.department === 'DIG').length,
      bsd: mockUsers.filter(u => u.department === 'BSD').length,
      tsd: mockUsers.filter(u => u.department === 'TSD').length
    };
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
    } else if (mockUsers.some(user => user.email.toLowerCase() === newUserForm.email.toLowerCase())) {
      errors.email = 'This email is already in use';
    }

    if (newUserForm.role === 'ENGINEER' && !newUserForm.department) {
      errors.department = 'Department is required for engineers';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = () => {
    if (validateForm()) {
      const newUser: ExtendedUser = {
        id: Date.now().toString(),
        name: newUserForm.name,
        email: newUserForm.email,
        role: newUserForm.role,
        department: newUserForm.department,
        status: newUserForm.status,
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString(),
        projectsAssigned: 0
      };
      
      setMockUsers(prev => [newUser, ...prev]);
      setNewUserForm({ name: '', email: '', role: 'ENGINEER', department: undefined, status: 'ACTIVE' });
      setFormErrors({});
      setIsAddUserModalOpen(false);
      alert(`User "${newUser.name}" has been created successfully!`);
    }
  };

  const handleDeleteUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user && confirm(`Are you sure you want to delete ${user.name}?`)) {
      setMockUsers(prev => prev.filter(u => u.id !== userId));
      alert(`User "${user.name}" has been deleted.`);
    }
  };

  const stats = getUserStats();

  if (!canManageUsers) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Shield className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600">
          Only TASS and Department Head users can access the User Management module.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users, roles, departments, and permissions</p>
        </div>
        
        <button 
          onClick={() => setIsAddUserModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
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
          <div className="text-2xl font-bold text-gray-600">{stats.engineers}</div>
          <div className="text-sm text-gray-600">Engineers</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-purple-600">{stats.managers}</div>
          <div className="text-sm text-gray-600">Managers</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{stats.itsd}</div>
          <div className="text-sm text-gray-600">ITSD</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{stats.dig}</div>
          <div className="text-sm text-gray-600">DIG</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-purple-600">{stats.bsd}</div>
          <div className="text-sm text-gray-600">BSD</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-orange-600">{stats.tsd}</div>
          <div className="text-sm text-gray-600">TSD</div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
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
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
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
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.department ? (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(user.department)}`}>
                        {user.department}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.projectsAssigned}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getLastLoginText(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

      {/* Enhanced Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
              <button
                onClick={() => {
                  setIsAddUserModalOpen(false);
                  setNewUserForm({ name: '', email: '', role: 'ENGINEER', department: undefined, status: 'ACTIVE' });
                  setFormErrors({});
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
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
                    role: e.target.value as any,
                    department: e.target.value === 'ENGINEER' ? prev.department : undefined
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ENGINEER">Engineer</option>
                  <option value="TM">Team Manager (TM)</option>
                  <option value="PM">Project Manager (PM)</option>
                  <option value="TM_DEPT_HEAD">TM Department Head</option>
                  <option value="PM_DEPT_HEAD">PM Department Head</option>
                  <option value="PMO">Project Management Office (PMO)</option>
                  <option value="TASS">Technical Architecture & System Specialist (TASS)</option>
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
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, department: e.target.value as any }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.department ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Department</option>
                    <option value="ITSD">Information Technology Services Department (ITSD)</option>
                    <option value="DIG">Digital Innovation Group (DIG)</option>
                    <option value="BSD">Business Solutions Department (BSD)</option>
                    <option value="TSD">Technical Support Department (TSD)</option>
                  </select>
                  {formErrors.department && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>
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
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsAddUserModalOpen(false);
                  setNewUserForm({ name: '', email: '', role: 'ENGINEER', department: undefined, status: 'ACTIVE' });
                  setFormErrors({});
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;