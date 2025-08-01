import React, { useState } from 'react';
import { X, Calendar, Users, AlertTriangle, CheckSquare, Plus, Trash2 } from 'lucide-react';
import { TaskFormData, SubTaskFormData } from '../../types';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  projectId?: string;
  userRole?: string;
  availableProjects?: Array<{id: string, name: string}>;
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  projectId, 
  userRole,
  availableProjects = []
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    taskName: '',
    subTask: '',
    startDate: '',
    dueDate: '',
    priority: 'MEDIUM',
    assignedEngineers: [],
    estimatedHours: 0,
    description: '',
    projectId: projectId || '',
    subTasks: []
  });

  const [errors, setErrors] = useState<Partial<TaskFormData>>({});
  const [customTaskName, setCustomTaskName] = useState('');
  const [isCustomTask, setIsCustomTask] = useState(false);

  // Predefined tasks for both PM and TM dropdown
  const predefinedTasks = [
    'Requirements Analysis',
    'System Design',
    'Database Design',
    'Frontend Development',
    'Backend Development',
    'API Development',
    'Testing & QA',
    'Code Review',
    'Documentation',
    'Deployment',
    'Bug Fixes',
    'Performance Optimization',
    'Security Implementation',
    'Integration Testing',
    'User Acceptance Testing',
    'Project Planning',
    'Resource Allocation',
    'Risk Assessment',
    'Stakeholder Management',
    'Quality Assurance',
    'System Architecture',
    'Technical Specification',
    'User Interface Design',
    'Database Migration',
    'Third-party Integration'
  ];

  const availableEngineers = [
    { id: '5', name: 'Alex Thompson', skills: ['React', 'Node.js', 'Python'] },
    { id: '6', name: 'Emma Wilson', skills: ['Vue.js', 'PHP', 'MySQL'] },
    { id: '7', name: 'James Miller', skills: ['Angular', 'Java', 'Spring'] },
    { id: '8', name: 'Sophia Davis', skills: ['React Native', 'Flutter', 'Firebase'] },
    { id: '9', name: 'William Garcia', skills: ['Python', 'Django', 'PostgreSQL'] },
    { id: '10', name: 'Olivia Martinez', skills: ['JavaScript', 'Express', 'MongoDB'] },
    { id: '11', name: 'Benjamin Lee', skills: ['C#', '.NET', 'SQL Server'] },
    { id: '12', name: 'Charlotte Brown', skills: ['Ruby', 'Rails', 'Redis'] },
    // Sample Engineers
    { id: '20', name: 'John Cruz', skills: ['React', 'Node.js'] },
    { id: '21', name: 'Maria Santos', skills: ['Vue.js', 'Python'] },
    { id: '22', name: 'Allan Reyes', skills: ['Angular', 'Java'] },
    { id: '23', name: 'Kim De Vera', skills: ['React Native', 'Flutter'] },
    { id: '24', name: 'Joseph Mendoza', skills: ['Python', 'Django'] },
    { id: '25', name: 'Ella Navarro', skills: ['JavaScript', 'Express'] },
    { id: '26', name: 'Danilo Garcia', skills: ['C#', '.NET'] },
    { id: '27', name: 'Erika Lim', skills: ['Ruby', 'Rails'] },
    { id: '28', name: 'Nico Alvarez', skills: ['React', 'Python'] },
    { id: '29', name: 'Faith Domingo', skills: ['Vue.js', 'Node.js'] }
  ];

  const priorityOptions = [
    { value: 'LOW', label: 'Low', color: 'text-green-600 bg-green-50' },
    { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'HIGH', label: 'High', color: 'text-orange-600 bg-orange-50' },
    { value: 'CRITICAL', label: 'Critical', color: 'text-red-600 bg-red-50' }
  ];

  const handleInputChange = (field: keyof TaskFormData, value: string | number | string[] | SubTaskFormData[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleEngineerToggle = (engineerId: string) => {
    const updatedEngineers = formData.assignedEngineers.includes(engineerId)
      ? formData.assignedEngineers.filter(id => id !== engineerId)
      : [...formData.assignedEngineers, engineerId];
    
    handleInputChange('assignedEngineers', updatedEngineers);
  };

  const handleTaskNameChange = (value: string) => {
    if (value === 'CUSTOM') {
      setIsCustomTask(true);
      setFormData(prev => ({ ...prev, taskName: '' }));
    } else {
      setIsCustomTask(false);
      setFormData(prev => ({ ...prev, taskName: value }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};

    const taskName = isCustomTask ? customTaskName : formData.taskName;
    if (!taskName.trim()) newErrors.taskName = 'Task Name is required';
    
    // For both PM and TM, sub task is required
    if ((userRole === 'TM' || userRole === 'PM') && !formData.subTask.trim()) {
      newErrors.subTask = 'Sub Task is required';
    }
    
    if (!formData.startDate) newErrors.startDate = 'Start Date is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due Date is required';
    
    // Project selection is required if multiple projects available
    if (availableProjects.length > 0 && !formData.projectId) {
      newErrors.projectId = 'Project selection is required';
    }
    
    if (formData.assignedEngineers.length === 0) newErrors.assignedEngineers = 'At least one engineer must be assigned';

    if (formData.startDate && formData.dueDate && new Date(formData.startDate) >= new Date(formData.dueDate)) {
      newErrors.dueDate = 'Due Date must be after Start Date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const finalTaskName = isCustomTask ? customTaskName : formData.taskName;
      onSubmit({
        ...formData,
        taskName: finalTaskName
      });
      
      // Reset form
      setFormData({
        taskName: '',
        subTask: '',
        startDate: '',
        dueDate: '',
        priority: 'MEDIUM',
        assignedEngineers: [],
        estimatedHours: 0,
        description: '',
        projectId: projectId || '',
        subTasks: []
      });
      setCustomTaskName('');
      setIsCustomTask(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
              <p className="text-sm text-gray-600">Define task details and assign engineers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Selection - Only show if multiple projects available */}
            {availableProjects.length > 0 && (
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project *
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => handleInputChange('projectId', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.projectId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a project</option>
                  {availableProjects.map((project) => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                {errors.projectId && (
                  <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>
                )}
              </div>
            )}

            {/* Task Name - Both PM and TM get dropdown with predefined tasks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Name *
              </label>
              
              {(userRole === 'TM' || userRole === 'PM') ? (
                <div className="space-y-2">
                  <select
                    value={isCustomTask ? 'CUSTOM' : formData.taskName}
                    onChange={(e) => handleTaskNameChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.taskName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select task name</option>
                    {predefinedTasks.map((task) => (
                      <option key={task} value={task}>{task}</option>
                    ))}
                    <option value="CUSTOM">+ Create Custom Task</option>
                  </select>
                  
                  {isCustomTask && (
                    <input
                      type="text"
                      value={customTaskName}
                      onChange={(e) => setCustomTaskName(e.target.value)}
                      placeholder="Enter custom task name"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.taskName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  )}
                </div>
              ) : (
                // Other roles - Free text input
                <input
                  type="text"
                  value={formData.taskName}
                  onChange={(e) => handleInputChange('taskName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.taskName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter task name"
                />
              )}
              
              {errors.taskName && (
                <p className="mt-1 text-sm text-red-600">{errors.taskName}</p>
              )}
            </div>

            {/* Sub Task - For both PM and TM */}
            {(userRole === 'TM' || userRole === 'PM') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Task *
                </label>
                <input
                  type="text"
                  value={formData.subTask}
                  onChange={(e) => handleInputChange('subTask', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.subTask ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter sub task details"
                />
                {errors.subTask && (
                  <p className="mt-1 text-sm text-red-600">{errors.subTask}</p>
                )}
              </div>
            )}

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.dueDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as TaskFormData['priority'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Estimated Hours - Now Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Hours (Optional)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.estimatedHours || ''}
                onChange={(e) => handleInputChange('estimatedHours', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter estimated hours (optional)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Engineers can estimate based on task complexity and due date
              </p>
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter task description (optional)"
              />
            </div>

            {/* Assigned Engineers */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Engineers *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {/* Self Assignment Option */}
                <div
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.assignedEngineers.includes('self')
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleEngineerToggle('self')}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={formData.assignedEngineers.includes('self')}
                      onChange={() => handleEngineerToggle('self')}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">Assign to myself</span>
                  </div>
                  <div className="text-xs text-blue-600 font-medium">Self Assignment</div>
                </div>

                {availableEngineers.map((engineer) => (
                  <div
                    key={engineer.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.assignedEngineers.includes(engineer.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleEngineerToggle(engineer.id)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        checked={formData.assignedEngineers.includes(engineer.id)}
                        onChange={() => handleEngineerToggle(engineer.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-900">{engineer.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {engineer.skills.slice(0, 2).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {engineer.skills.length > 2 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          +{engineer.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {errors.assignedEngineers && (
                <p className="mt-1 text-sm text-red-600">{errors.assignedEngineers}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;