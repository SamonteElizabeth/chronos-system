import React from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  Clock, 
  BarChart3, 
  Settings,
  Users,
  Calendar,
  MapPin,
  ChevronDown,
  FileText,
  Target,
  ClipboardList,
  UserCheck,
  Play
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  currentUser: User;
  activeModule: string;
  onModuleChange: (module: string) => void;
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentUser, 
  activeModule, 
  onModuleChange,
  isCollapsed 
}) => {
  const getModulesForRole = (role: string) => {
    switch (role) {
      case 'TASS':
        return [
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'projects', label: 'Projects', icon: FolderOpen },
          { id: 'task-logs', label: 'Task Logs', icon: FileText },
          { id: 'trackpro', label: 'TrackPro Milestone', icon: Target },
          { id: 'users', label: 'User Management', icon: Users }
        ];
      case 'PMO':
        return [
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'projects', label: 'Projects', icon: FolderOpen },
          { id: 'task-logs', label: 'Task Logs', icon: FileText },
          { id: 'trackpro', label: 'TrackPro Milestone', icon: Target },
          { id: 'assignments', label: 'PM Assignments', icon: UserCheck }
        ];
      case 'PM_DEPT_HEAD':
        return [
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'projects', label: 'Projects', icon: FolderOpen },
          { id: 'tasks', label: 'Task Management', icon: CheckSquare },
          { id: 'task-execution', label: 'Task Execution', icon: Play },
          { id: 'task-logs', label: 'Task Logs', icon: FileText },
          { id: 'approvals', label: 'PM Approvals', icon: Clock },
          { id: 'trackpro', label: 'TrackPro Milestone', icon: Target },
          { id: 'location', label: 'Engineer Locations', icon: MapPin },
          { id: 'users', label: 'User Management', icon: Users }
        ];
      case 'TM_DEPT_HEAD':
        return [
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'projects', label: 'Projects', icon: FolderOpen },
          { id: 'tasks', label: 'Task Management', icon: CheckSquare },
          { id: 'task-execution', label: 'Task Execution', icon: Play },
          { id: 'task-logs', label: 'Task Logs', icon: FileText },
          { id: 'approvals', label: 'TM Approvals', icon: Clock },
          { id: 'trackpro', label: 'TrackPro Milestone', icon: Target },
          { id: 'location', label: 'Engineer Locations', icon: MapPin },
          { id: 'users', label: 'User Management', icon: Users }
        ];
      case 'PM':
      case 'TM':
        return [
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'projects', label: 'Projects', icon: FolderOpen },
          { id: 'tasks', label: 'Task Management', icon: CheckSquare },
          { id: 'task-execution', label: 'Task Execution', icon: Play },
          { id: 'task-logs', label: 'Task Logs', icon: FileText },
          { id: 'approvals', label: 'Engineer Approvals', icon: Clock },
          { id: 'trackpro', label: 'TrackPro Milestone', icon: Target },
          { id: 'location', label: 'Engineer Locations', icon: MapPin }
        ];
      case 'ENGINEER':
        return [
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'task-execution', label: 'Task Execution', icon: Play },
          { id: 'trackpro', label: 'TrackPro Milestone', icon: Target },
          { id: 'timesheet', label: 'Timesheet', icon: ClipboardList }
        ];
      case 'EEM':
        return [
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'users', label: 'Engineer Salary Levels', icon: Users }
        ];
      default:
        return [
          { id: 'analytics', label: 'Analytics', icon: BarChart3 }
        ];
    }
  };

  const modules = getModulesForRole(currentUser.role);

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'PM_DEPT_HEAD': return 'PM Dept Head';
      case 'TM_DEPT_HEAD': return 'TM Dept Head';
      case 'EEM': return 'EEM';
      default: return role;
    }
  };

  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col`}>
      {/* Logo */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold">Chronos</h1>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="font-medium text-sm">{currentUser.name}</p>
              <p className="text-xs text-slate-400">{getRoleDisplayName(currentUser.role)}</p>
              {currentUser.department && (
                <p className="text-xs text-slate-500">{currentUser.department}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            
            return (
              <li key={module.id}>
                <button
                  onClick={() => onModuleChange(module.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && <span className="text-sm">{module.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Status */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>System Online</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;