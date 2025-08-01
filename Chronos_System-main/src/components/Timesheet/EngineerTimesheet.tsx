import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  Filter,
  Search,
  Eye,
  X
} from 'lucide-react';
import { User, TimeRequest } from '../../types';

interface EngineerTimesheetProps {
  currentUser: User;
}

const EngineerTimesheet: React.FC<EngineerTimesheetProps> = ({ currentUser }) => {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<TimeRequest | null>(null);

  // Mock timesheet requests data
  const mockRequests: TimeRequest[] = [
    {
      id: '1',
      type: 'OVERTIME',
      taskId: '1',
      userId: currentUser.id,
      status: 'PENDING',
      requestedHours: 8,
      reason: 'Critical bug fix required before deployment',
      submittedAt: '2024-01-20T10:30:00Z',
      currentHours: 40,
      proposedHours: 48,
      justification: 'A critical security vulnerability was discovered that needs immediate attention. The fix requires extensive testing and cannot be delayed.',
      urgency: 'CRITICAL',
      expectedImpact: 'Prevents potential security breach and ensures on-time deployment'
    },
    {
      id: '2',
      type: 'EXTENSION',
      taskId: '2',
      userId: currentUser.id,
      status: 'APPROVED',
      reason: 'Additional requirements discovered during development',
      submittedAt: '2024-01-18T14:15:00Z',
      reviewedAt: '2024-01-19T09:00:00Z',
      reviewedBy: '3',
      justification: 'Client requested additional features that were not in the original scope. These features are critical for the project success.',
      urgency: 'HIGH',
      expectedImpact: 'Ensures project meets all client requirements and maintains quality standards'
    },
    {
      id: '3',
      type: 'CORRECTION',
      taskId: '3',
      userId: currentUser.id,
      status: 'REJECTED',
      requestedHours: 2,
      reason: 'Forgot to log time for debugging session',
      submittedAt: '2024-01-15T16:45:00Z',
      reviewedAt: '2024-01-16T11:30:00Z',
      reviewedBy: '3',
      currentHours: 24,
      proposedHours: 26,
      justification: 'I forgot to start the timer during a 2-hour debugging session on January 14th.',
      urgency: 'LOW',
      expectedImpact: 'Accurate time tracking for project billing and resource planning'
    },
    {
      id: '4',
      type: 'HOLIDAY',
      taskId: '1',
      userId: currentUser.id,
      status: 'APPROVED',
      requestedHours: 4,
      reason: 'Weekend work to meet project deadline',
      submittedAt: '2024-01-12T08:00:00Z',
      reviewedAt: '2024-01-12T10:15:00Z',
      reviewedBy: '4',
      justification: 'Project deadline is Monday and we need to complete final testing over the weekend.',
      urgency: 'HIGH',
      expectedImpact: 'Ensures project delivery on schedule'
    }
  ];

  // Mock task data for display
  const mockTasks = [
    { id: '1', title: 'User Authentication System', projectName: 'E-commerce Platform' },
    { id: '2', title: 'Payment Gateway Integration', projectName: 'E-commerce Platform' },
    { id: '3', title: 'Mobile UI Components', projectName: 'Mobile App Redesign' },
    { id: '4', title: 'API Documentation', projectName: 'Mobile App Redesign' }
  ];

  const getTaskInfo = (taskId: string) => {
    return mockTasks.find(task => task.id === taskId) || { title: 'Unknown Task', projectName: 'Unknown Project' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-green-600 bg-green-50 border-green-200';
      case 'REJECTED': return 'text-red-600 bg-red-50 border-red-200';
      case 'PENDING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <XCircle className="w-4 h-4" />;
      case 'PENDING': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'OVERTIME': return 'bg-orange-100 text-orange-800';
      case 'EXTENSION': return 'bg-blue-100 text-blue-800';
      case 'CORRECTION': return 'bg-purple-100 text-purple-800';
      case 'HOLIDAY': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL': return 'text-red-600';
      case 'HIGH': return 'text-orange-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredRequests = mockRequests.filter(request => {
    const matchesStatus = statusFilter === 'ALL' || request.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || request.type === typeFilter;
    const taskInfo = getTaskInfo(request.taskId);
    const matchesSearch = searchTerm === '' || 
      taskInfo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taskInfo.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const getRequestCounts = () => {
    return {
      ALL: mockRequests.length,
      PENDING: mockRequests.filter(r => r.status === 'PENDING').length,
      APPROVED: mockRequests.filter(r => r.status === 'APPROVED').length,
      REJECTED: mockRequests.filter(r => r.status === 'REJECTED').length,
    };
  };

  const requestCounts = getRequestCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Timesheet Requests</h1>
        <p className="text-gray-600">Track all your submitted timesheet-related requests and their status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{requestCounts.ALL}</div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">{requestCounts.PENDING}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{requestCounts.APPROVED}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-red-600">{requestCounts.REJECTED}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex space-x-2">
            {Object.entries(requestCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status} ({count})
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Types</option>
            <option value="OVERTIME">Overtime</option>
            <option value="EXTENSION">Extension</option>
            <option value="CORRECTION">Time Correction</option>
            <option value="HOLIDAY">Holiday Work</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Request History</h3>
          <p className="text-sm text-gray-600">Click on any request to view detailed information</p>
        </div>
        
        {filteredRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => {
                  const taskInfo = getTaskInfo(request.taskId);
                  
                  return (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{taskInfo.title}</div>
                          <div className="text-sm text-gray-500">{taskInfo.projectName}</div>
                          <div className="text-xs text-gray-400 mt-1">{request.reason}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(request.type)}`}>
                          {request.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="text-xs font-medium">{request.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(request.type === 'OVERTIME' || request.type === 'CORRECTION') ? (
                          <div>
                            <div>{request.currentHours}h → {request.proposedHours}h</div>
                            <div className="text-xs text-gray-500">
                              {request.proposedHours && request.currentHours ? 
                                `+${request.proposedHours - request.currentHours}h` : 
                                request.requestedHours ? `+${request.requestedHours}h` : '-'
                              }
                            </div>
                          </div>
                        ) : (
                          <span>{request.requestedHours ? `${request.requestedHours}h` : '-'}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{new Date(request.submittedAt).toLocaleDateString()}</div>
                        <div className="text-xs">{new Date(request.submittedAt).toLocaleTimeString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL'
                ? 'Try adjusting your filters to see more requests.'
                : 'You haven\'t submitted any timesheet requests yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Request Details</h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Request Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedRequest.type)}`}>
                      {selectedRequest.type.replace('_', ' ')}
                    </span>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getStatusColor(selectedRequest.status)}`}>
                      {getStatusIcon(selectedRequest.status)}
                      <span className="text-sm font-medium">{selectedRequest.status}</span>
                    </div>
                    <span className={`text-sm font-medium ${getUrgencyColor(selectedRequest.urgency)}`}>
                      {selectedRequest.urgency} Priority
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {getTaskInfo(selectedRequest.taskId).title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {getTaskInfo(selectedRequest.taskId).projectName}
                  </p>
                </div>
              </div>

              {/* Request Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Request Information</h5>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Submitted:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(selectedRequest.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    {selectedRequest.reviewedAt && (
                      <div>
                        <span className="text-gray-600">Reviewed:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(selectedRequest.reviewedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {(selectedRequest.type === 'OVERTIME' || selectedRequest.type === 'CORRECTION') && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Time Details</h5>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Current Hours:</span>
                        <span className="ml-2 text-gray-900">{selectedRequest.currentHours}h</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Requested Hours:</span>
                        <span className="ml-2 text-gray-900">{selectedRequest.proposedHours}h</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Additional:</span>
                        <span className="ml-2 font-medium text-blue-600">
                          +{selectedRequest.proposedHours! - selectedRequest.currentHours!}h
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reason */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Reason</h5>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedRequest.reason}
                </p>
              </div>

              {/* Justification */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Detailed Justification</h5>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedRequest.justification}
                </p>
              </div>

              {/* Expected Impact */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Expected Impact</h5>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedRequest.expectedImpact}
                </p>
              </div>

              {/* Status Message */}
              {selectedRequest.status === 'PENDING' && (
                <div className="flex items-center space-x-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <AlertTriangle className="w-4 h-4" />
                  <span>This request is awaiting review by your project manager.</span>
                </div>
              )}

              {selectedRequest.status === 'APPROVED' && (
                <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                  <CheckCircle className="w-4 h-4" />
                  <span>This request has been approved and processed.</span>
                </div>
              )}

              {selectedRequest.status === 'REJECTED' && (
                <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <XCircle className="w-4 h-4" />
                  <span>This request was rejected. Contact your project manager for more details.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngineerTimesheet;