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

  const [mockUsers, setMockUsers] = useState<ExtendedUser[]>([/* ...existing user list... */]);

  const canManageUsers = ['TASS', 'PM_DEPT_HEAD', 'TM_DEPT_HEAD'].includes(currentUser.role);

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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <ul className="space-y-2">
        {filteredUsers.map(user => (
          <li key={user.id} className="border p-4 rounded shadow">
            <div className="font-semibold">{user.name}</div>
            <div>Email: {user.email}</div>
            <div>Role: {user.role}</div>
            <div>Status: {user.status}</div>
            <div>Department: {user.department || 'N/A'}</div>
            <div>Projects Assigned: {user.projectsAssigned}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
