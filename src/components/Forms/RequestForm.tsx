import React, { useState } from 'react';
import { X, Clock, AlertTriangle, FileText, Calendar } from 'lucide-react';
import { RequestFormData, Task } from '../../types';

interface RequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RequestFormData) => void;
  availableTasks: Task[];
  preselectedTaskId?: string;
  preselectedType?: RequestFormData['type'];
}

const RequestForm: React.FC<RequestFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  availableTasks,
  preselectedTaskId,
  preselectedType 
}) => {
  const [formData, setFormData] = useState<RequestFormData>({
    type: preselectedType || 'OVERTIME',
    taskId: preselectedTaskId || '',
    currentHours: 0,
    proposedHours: 0,
    reason: '',
    justification: '',
    urgency: 'MEDIUM',
    expectedImpact: ''
  });

  const [errors, setErrors] = useState<Partial<RequestFormData>>({});

  const requestTypes = [
    { 
      value: 'CORRECTION', 
      label: 'Time Correction', 
      description: 'Correct previously logged time entries',
      icon: Clock,
      color: 'text-blue-600 bg-blue-50'
    },
    { 
      value: 'OVERTIME', 
      label: 'Overtime Request', 
      description: 'Request approval for overtime work',
      icon: Clock,
      color: 'text-orange-600 bg-orange-50'
    },
    { 
      value: 'HOLIDAY', 
      label: 'Holiday Work', 
      description: 'Request approval for holiday/weekend work',
      icon: Calendar,
      color: 'text-purple-600 bg-purple-50'
    },
    { 
      value: 'EXTENSION', 
      label: 'Deadline Extension', 
      description: 'Request extension for task deadline',
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-50'
    }
  ];

  const urgencyOptions = [
    { value: 'LOW', label: 'Low', color: 'text-green-600 bg-green-50' },
    { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'HIGH', label: 'High', color: 'text-orange-600 bg-orange-50' },
    { value: 'CRITICAL', label: 'Critical', color: 'text-red-600 bg-red-50' }
  ];

  const handleInputChange = (field: keyof RequestFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RequestFormData> = {};

    if (!formData.taskId) newErrors.taskId = 'Task selection is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
    if (!formData.justification.trim()) newErrors.justification = 'Justification is required';
    if (!formData.expectedImpact.trim()) newErrors.expectedImpact = 'Expected impact is required';

    if (formData.type === 'CORRECTION' || formData.type === 'OVERTIME') {
      if (!formData.currentHours || formData.currentHours <= 0) {
        newErrors.currentHours = 'Current hours must be greater than 0';
      }
      if (!formData.proposedHours || formData.proposedHours <= 0) {
        newErrors.proposedHours = 'Proposed hours must be greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        type: 'OVERTIME',
        taskId: '',
        currentHours: 0,
        proposedHours: 0,
        reason: '',
        justification: '',
        urgency: 'MEDIUM',
        expectedImpact: ''
      });
      onClose();
    }
  };

  const selectedRequestType = requestTypes.find(type => type.value === formData.type);
  const selectedTask = availableTasks.find(task => task.id === formData.taskId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Submit Request</h2>
              <p className="text-sm text-gray-600">Request approval for time-related changes</p>
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
          {/* Request Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Request Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {requestTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('type', type.value)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{type.label}</h3>
                        <p className="text-xs text-gray-600">{type.description}</p>
                      </div>
                      <input
                        type="radio"
                        name="requestType"
                        checked={formData.type === type.value}
                        onChange={() => handleInputChange('type', type.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Selection */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related Task *
              </label>
              <select
                value={formData.taskId}
                onChange={(e) => handleInputChange('taskId', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.taskId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select a task</option>
                {availableTasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title} - {task.status}
                  </option>
                ))}
              </select>
              {errors.taskId && (
                <p className="mt-1 text-sm text-red-600">{errors.taskId}</p>
              )}
              {selectedTask && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Current Progress:</strong> {selectedTask.actualHours}h / {selectedTask.estimatedHours}h
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Due Date:</strong> {new Date(selectedTask.dueDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Hours Fields (for CORRECTION and OVERTIME) */}
            {(formData.type === 'CORRECTION' || formData.type === 'OVERTIME') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Hours *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.currentHours || ''}
                    onChange={(e) => handleInputChange('currentHours', parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.currentHours ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter current hours"
                  />
                  {errors.currentHours && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentHours}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.type === 'CORRECTION' ? 'Corrected Hours *' : 'Requested Hours *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.proposedHours || ''}
                    onChange={(e) => handleInputChange('proposedHours', parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.proposedHours ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter proposed hours"
                  />
                  {errors.proposedHours && (
                    <p className="mt-1 text-sm text-red-600">{errors.proposedHours}</p>
                  )}
                </div>
              </>
            )}

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency *
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value as RequestFormData['urgency'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {urgencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <input
                type="text"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.reason ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Brief reason for this request"
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
              )}
            </div>

            {/* Justification */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Justification *
              </label>
              <textarea
                value={formData.justification}
                onChange={(e) => handleInputChange('justification', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.justification ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Provide detailed justification for this request..."
              />
              {errors.justification && (
                <p className="mt-1 text-sm text-red-600">{errors.justification}</p>
              )}
            </div>

            {/* Expected Impact */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Impact *
              </label>
              <textarea
                value={formData.expectedImpact}
                onChange={(e) => handleInputChange('expectedImpact', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.expectedImpact ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Describe the expected impact on project timeline, quality, or deliverables..."
              />
              {errors.expectedImpact && (
                <p className="mt-1 text-sm text-red-600">{errors.expectedImpact}</p>
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
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;