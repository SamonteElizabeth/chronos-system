export interface User {
  id: string;
  name: string;
  email: string;
  role: 'TASS' | 'PMO' | 'PM' | 'TM' | 'ENGINEER' | 'PM_DEPT_HEAD' | 'TM_DEPT_HEAD' | 'EEM';
  avatar?: string;
  department?: 'ITSD' | 'DIG' | 'BSD' | 'TSD';
  salaryLevel?: 1 | 2 | 3 | 4 | 5;
  hourlyRate?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  createdBy: string;
  assignedPM?: string;
  assignedTM?: string;
  startDate: string;
  endDate: string;
  progress: number;
  budget: number;
  spentBudget: number;
  // New fields for TASS project creation
  salesOrderNo: string;
  clientCompanyName: string;
  accountManager: string;
  sowMandays: number;
  solution: string;
}

export interface SubTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedHours: number;
  actualHours: number;
  startDate: string;
  dueDate: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedHours: number;
  actualHours: number;
  startDate: string;
  dueDate: string;
  dependencies: string[];
  // New fields for PM/TM task creation
  taskName: string;
  subTask: string;
  assignedEngineers: string[];
  // Enhanced sub-tasks
  subTasks: SubTask[];
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  date: string;
  hours: number;
  description: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface TimeRequest {
  id: string;
  type: 'CORRECTION' | 'OVERTIME' | 'HOLIDAY' | 'EXTENSION';
  taskId: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedHours?: number;
  reason: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  // Additional fields for request forms
  currentHours?: number;
  proposedHours?: number;
  justification: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  expectedImpact: string;
  // New field for hierarchical approval
  submittedTo?: 'PM' | 'TM' | 'PMO' | 'TASS' | 'PM_DEPT_HEAD' | 'TM_DEPT_HEAD';
}

export interface ActiveTimer {
  taskId: string;
  startTime: string;
  description: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface MilestoneEntry {
  id: string;
  engineerId: string;
  engineerName: string;
  department: 'ITSD' | 'DIG' | 'BSD' | 'TSD';
  taskTitle: string;
  projectName: string;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  date: string;
  hoursLogged: number;
  progress: number;
  milestone: string;
  description: string;
}

// New interfaces for form data
export interface ProjectFormData {
  salesOrderNo: string;
  clientCompanyName: string;
  projectName: string;
  accountManager: string;
  startDate: string;
  endDate: string;
  sowMandays: number;
  solution: string;
  assignedPM: string;
  assignedTM: string;
}

export interface TaskFormData {
  taskName: string;
  subTask: string;
  startDate: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedEngineers: string[];
  estimatedHours: number;
  description: string;
  projectId: string;
  subTasks: SubTaskFormData[];
}

export interface SubTaskFormData {
  title: string;
  description: string;
  assignedTo: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedHours: number;
  startDate: string;
  dueDate: string;
}

export interface RequestFormData {
  type: 'CORRECTION' | 'OVERTIME' | 'HOLIDAY' | 'EXTENSION';
  taskId: string;
  currentHours?: number;
  proposedHours?: number;
  reason: string;
  justification: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  expectedImpact: string;
}