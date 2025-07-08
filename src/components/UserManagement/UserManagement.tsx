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

  return null; // Placeholder for the actual JSX content
};

export default UserManagement;
