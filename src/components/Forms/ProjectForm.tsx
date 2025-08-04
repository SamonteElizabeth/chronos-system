import React, { useState } from 'react';
import { X, Calendar, Building, User, Clock, Briefcase, Users, UserCheck } from 'lucide-react';
import { ProjectFormData } from '../../types';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    salesOrderNo: '',
    clientCompanyName: '',
    projectName: '',
    accountManager: '',
    startDate: '',
    endDate: '',
    sowMandays: 0,
    solution: '',
    assignedPM: '',
    assignedTM: ''
  });

  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});

  // Mock data for dropdowns
  const clientCompanies = [
    'Acme Corporation',
    'TechFlow Solutions',
    'Global Dynamics Inc.',
    'Innovation Labs',
    'Digital Ventures Ltd.',
    'Enterprise Systems Co.',
    'NextGen Technologies',
    'Strategic Solutions Group'
  ];

  const accountManagers = [
    'John Smith',
    'Emily Davis',
    'Michael Johnson',
    'Sarah Wilson',
    'Robert Brown',
    'Lisa Anderson',
    'David Martinez',
    'Jennifer Taylor'
  ];

  const solutions = [
    'Web Application Development',
    'Mobile App Development',
    'Enterprise Software Solution',
    'Cloud Migration',
    'Data Analytics Platform',
    'E-commerce Platform',
    'API Integration',
    'System Modernization',
    'Digital Transformation',
    'Custom Software Development'
  ];

  // Available PMO Personnel
  const availablePMOs = [
    { id: '2', name: 'Mike Chen', experience: '10 years', currentProjects: 12, specialization: 'Enterprise & Strategic Projects' },
    { id: '11', name: 'Rachel Martinez', experience: '8 years', currentProjects: 8, specialization: 'Digital Transformation' },
    { id: '12', name: 'Kevin Thompson', experience: '7 years', currentProjects: 15, specialization: 'Cloud & Infrastructure' },
    { id: '13', name: 'Diana Foster', experience: '9 years', currentProjects: 10, specialization: 'Process Optimization' }
  ];

  // Available Technical Managers
  const availableTechnicalManagers = [
    { id: '4', name: 'David Kim', experience: '6 years', currentProjects: 3, specialization: 'Frontend & Mobile Development' },
    { id: '14', name: 'Amanda Chen', experience: '5 years', currentProjects: 4, specialization: 'Backend & Database Systems' },
    { id: '15', name: 'Carlos Martinez', experience: '7 years', currentProjects: 2, specialization: 'DevOps & Infrastructure' },
    { id: '16', name: 'Sophie Taylor', experience: '4 years', currentProjects: 3, specialization: 'Testing & Quality Assurance' },
    { id: '17', name: 'Ryan Johnson', experience: '8 years', currentProjects: 1, specialization: 'Security & Compliance' }
  ];

  const handleInputChange = (field: keyof ProjectFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};

    if (!formData.salesOrderNo.trim()) newErrors.salesOrderNo = 'Sales Order No. is required';
    if (!formData.clientCompanyName) newErrors.clientCompanyName = 'Client Company is required';
    if (!formData.projectName.trim()) newErrors.projectName = 'Project Name is required';
    if (!formData.accountManager) newErrors.accountManager = 'Account Manager is required';
    if (!formData.startDate) newErrors.startDate = 'Start Date is required';
    if (!formData.endDate) newErrors.endDate = 'End Date is required';
    if (formData.sowMandays <= 0) newErrors.sowMandays = 'SOW Mandays must be greater than 0';
    if (!formData.solution) newErrors.solution = 'Solution is required';

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End Date must be after Start Date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        salesOrderNo: '',
        clientCompanyName: '',
        projectName: '',
        accountManager: '',
        startDate: '',
        endDate: '',
        sowMandays: 0,
        solution: '',
        assignedPM: '',
        assignedTM: ''
      });
      onClose();
    }
  };

  const getWorkloadColor = (projects: number) => {
    if (projects >= 15) return 'text-red-600 bg-red-50';
    if (projects >= 10) return 'text-orange-600 bg-orange-50';
    if (projects >= 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Create New Project</h2>
              <p className="text-sm text-gray-600">Set up a new project with PMO and Technical Manager assignments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Project Information Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Building className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Project Information</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Order No */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sales Order No. *
                </label>
                <input
                  type="text"
                  value={formData.salesOrderNo}
                  onChange={(e) => handleInputChange('salesOrderNo', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.salesOrderNo ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="SO-2024-001"
                />
                {errors.salesOrderNo && (
                  <p className="mt-1 text-sm text-red-600">{errors.salesOrderNo}</p>
                )}
              </div>

              {/* Client Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Company Name *
                </label>
                <select
                  value={formData.clientCompanyName}
                  onChange={(e) => handleInputChange('clientCompanyName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.clientCompanyName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Client Company</option>
                  {clientCompanies.map((company) => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
                {errors.clientCompanyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.clientCompanyName}</p>
                )}
              </div>

              {/* Project Name */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.projectName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter project name"
                />
                {errors.projectName && (
                  <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>
                )}
              </div>

              {/* Account Manager */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Manager (Sales) *
                </label>
                <select
                  value={formData.accountManager}
                  onChange={(e) => handleInputChange('accountManager', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.accountManager ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Account Manager</option>
                  {accountManagers.map((manager) => (
                    <option key={manager} value={manager}>{manager}</option>
                  ))}
                </select>
                {errors.accountManager && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountManager}</p>
                )}
              </div>

              {/* SOW Mandays */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SOW Mandays *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.sowMandays || ''}
                  onChange={(e) => handleInputChange('sowMandays', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.sowMandays ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter mandays"
                />
                {errors.sowMandays && (
                  <p className="mt-1 text-sm text-red-600">{errors.sowMandays}</p>
                )}
              </div>

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

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>

              {/* Solution */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solution *
                </label>
                <select
                  value={formData.solution}
                  onChange={(e) => handleInputChange('solution', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.solution ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Solution Type</option>
                  {solutions.map((solution) => (
                    <option key={solution} value={solution}>{solution}</option>
                  ))}
                </select>
                {errors.solution && (
                  <p className="mt-1 text-sm text-red-600">{errors.solution}</p>
                )}
              </div>
            </div>
          </div>

          {/* Team Assignment Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Team Assignment</h3>
              <span className="text-sm text-gray-500">(Optional - can be assigned later)</span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* PMO Assignment */}
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center space-x-2 mb-4">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                  <h4 className="text-lg font-semibold text-purple-900">Assign PMO</h4>
                </div>
                <p className="text-sm text-purple-700 mb-4">Project Management Office - Strategic oversight and coordination</p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 mb-3">
                    <input
                      type="radio"
                      id="no-pmo"
                      name="pmo-assignment"
                      checked={!formData.assignedPM}
                      onChange={() => handleInputChange('assignedPM', '')}
                      className="w-4 h-4 text-purple-600"
                    />
                    <label htmlFor="no-pmo" className="text-sm font-medium text-gray-700">
                      Assign Later
                    </label>
                  </div>
                  
                  {availablePMOs.map((pmo) => (
                    <div
                      key={pmo.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.assignedPM === pmo.id
                          ? 'border-purple-500 bg-purple-100'
                          : 'border-gray-200 hover:border-purple-300 bg-white'
                      }`}
                      onClick={() => handleInputChange('assignedPM', pmo.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="pmo-assignment"
                          checked={formData.assignedPM === pmo.id}
                          onChange={() => handleInputChange('assignedPM', pmo.id)}
                          className="w-4 h-4 text-purple-600"
                        />
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {pmo.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-gray-900">{pmo.name}</h5>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getWorkloadColor(pmo.currentProjects)}`}>
                              {pmo.currentProjects} projects
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">{pmo.experience} experience</div>
                          <div className="text-xs text-gray-500">{pmo.specialization}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Manager Assignment */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-blue-900">Assign Technical Manager</h4>
                </div>
                <p className="text-sm text-blue-700 mb-4">Technical leadership and hands-on development management</p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 mb-3">
                    <input
                      type="radio"
                      id="no-tm"
                      name="tm-assignment"
                      checked={!formData.assignedTM}
                      onChange={() => handleInputChange('assignedTM', '')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label htmlFor="no-tm" className="text-sm font-medium text-gray-700">
                      Assign Later
                    </label>
                  </div>
                  
                  {availableTechnicalManagers.map((tm) => (
                    <div
                      key={tm.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.assignedTM === tm.id
                          ? 'border-blue-500 bg-blue-100'
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}
                      onClick={() => handleInputChange('assignedTM', tm.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="tm-assignment"
                          checked={formData.assignedTM === tm.id}
                          onChange={() => handleInputChange('assignedTM', tm.id)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {tm.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-gray-900">{tm.name}</h5>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getWorkloadColor(tm.currentProjects)}`}>
                              {tm.currentProjects} projects
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">{tm.experience} experience</div>
                          <div className="text-xs text-gray-500">{tm.specialization}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center space-x-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;