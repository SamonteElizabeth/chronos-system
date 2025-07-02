import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  User,
  AlertTriangle,
  FileText,
  Eye,
  MessageSquare,
  X,
  Plus
} from 'lucide-react';
import { User as UserType, TimeRequest, RequestFormData } from '../../types';
import RequestForm from '../Forms/RequestForm';

interface ApprovalsProps {
  currentUser: UserType;
}

const Approvals: React.FC<ApprovalsProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState<TimeRequest | null>(null);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);

  // Mock timesheet requests data for approval based on user role
  const getRequestsForUser = (): TimeRequest[] => {
    const allRequests: TimeRequest[] = [
      // Engineer requests for PM/TM approval
      {
        id: '1',
        type: 'OVERTIME',
        taskId: '1',
        userId: '5', // Alex Thompson (Engineer)
        status: 'PENDING',
        requestedHours: 8,
        reason: 'Critical bug fix required before deployment',
        submittedAt: '2024-01-20T10:30:00Z',
        currentHours: 40,
        proposedHours: 48,
        justification: 'A critical security vulnerability was discovered that needs immediate attention. The fix requires extensive testing and cannot be delayed.',
        urgency: 'CRITICAL',
        expectedImpact: 'Prevents potential security breach and ensures on-time deployment',
        submittedTo: 'PM' // Submitted to PM for approval
      },
      {
        id: '2',
        type: 'EXTENSION',
        taskId: '2',
        userId: '6', // Emma Wilson (Engineer)
        status: 'PENDING',
        reason: 'Additional requirements discovered during development',
        submittedAt: '2024-01-19T14:15:00Z',
        justification: 'Client requested additional features that were not in the original scope. These features are critical for the project success.',
        urgency: 'HIGH',
        expectedImpact: 'Ensures project meets all client requirements and maintains quality standards',
        submittedTo: 'TM' // Submitted to TM for approval
      },
      {
        id: '3',
        type: 'CORRECTION',
        taskId: '3',
        userId: '7', // James Miller (Engineer)
        status: 'APPROVED',
        requestedHours: 2,
        reason: 'Forgot to log time for debugging session',
        submittedAt: '2024-01-18T16:45:00Z',
        reviewedAt: '2024-01-19T09:00:00Z',
        reviewedBy: currentUser.id,
        currentHours: 24,
        proposedHours: 26,
        justification: 'I forgot to start the timer during a 2-hour debugging session on January 16th.',
        urgency: 'LOW',
        expectedImpact: 'Accurate time tracking for project billing and resource planning',
        submittedTo: 'PM'
      },
      // PM requests for PMO approval
      {
        id: '4',
        type: 'OVERTIME',
        taskId: '4',
        userId: '3', // Lisa Rodriguez (PM)
        status: 'PENDING',
        requestedHours: 6,
        reason: 'Project management overtime for critical deadline',
        submittedAt: '2024-01-20T08:00:00Z',
        currentHours: 45,
        proposedHours: 51,
        justification: 'Need to coordinate with multiple teams over the weekend to ensure project delivery on Monday.',
        urgency: 'HIGH',
        expectedImpact: 'Ensures project delivery on schedule and maintains team coordination',
        submittedTo: 'PMO' // PM submitting to PMO
      },
      {
        id: '5',
        type: 'EXTENSION',
        taskId: '5',
        userId: '4', // David Kim (TM)
        status: 'PENDING',
        reason: 'Technical complexity requires additional time',
        submittedAt: '2024-01-19T12:00:00Z',
        justification: 'The technical implementation is more complex than initially estimated. Need additional time to ensure quality delivery.',
        urgency: 'MEDIUM',
        expectedImpact: 'Better code quality and fewer bugs in production',
        submittedTo: 'PMO' // TM submitting to PMO
      },
      // TM requests for TASS approval
      {
        id: '6',
        type: 'OVERTIME',
        taskId: '6',
        userId: '4', // David Kim (TM)
        status: 'PENDING',
        requestedHours: 4,
        reason: 'Architecture review and technical guidance needed',
        submittedAt: '2024-01-20T15:30:00Z',
        currentHours: 42,
        proposedHours: 46,
        justification: 'Need to provide technical guidance to the team during critical implementation phase.',
        urgency: 'HIGH',
        expectedImpact: 'Ensures technical quality and prevents architectural issues',
        submittedTo: 'TASS' // TM submitting to TASS
      },
      {
        id: '7',
        type: 'CORRECTION',
        taskId: '7',
        userId: '14', // Amanda Chen (TM)
        status: 'APPROVED',
        requestedHours: 3,
        reason: 'Missed logging time for weekend technical review',
        submittedAt: '2024-01-18T10:00:00Z',
        reviewedAt: '2024-01-18T14:30:00Z',
        reviewedBy: '1', // Approved by TASS
        currentHours: 38,
        proposedHours: 41,
        justification: 'Conducted technical review over the weekend but forgot to log the time.',
        urgency: 'LOW',
        expectedImpact: 'Accurate time tracking for technical management activities',
        submittedTo: 'TASS'
      }
    ];

    // Filter requests based on user role and approval hierarchy
    switch (currentUser.role) {
      case 'PM':
      case 'TM':
        // PM/TM can see engineer requests submitted to them
        return allRequests.filter(req => 
          req.submittedTo === currentUser.role && 
          ['5', '6', '7', '8', '9', '10'].includes(req.userId) // Engineer IDs
        );
      case 'PMO':
        // PMO can see PM requests submitted to them
        return allRequests.filter(req => 
          req.submittedTo === 'PMO' && 
          ['3', '4'].includes(req.userId) // PM IDs
        );
      case 'TASS':
        // TASS can see TM requests submitted to them
        return allRequests.filter(req => 
          req.submittedTo === 'TASS' && 
          ['4', '14', '15', '16', '17'].includes(req.userId) // TM IDs
        );
      default:
        return [];
    }
  };

  const mockRequests = getRequestsForUser();

  // Mock task and user data
  const mockTasks = [
    { id: '1', title: 'User Authentication System', projectName: 'E-commerce Platform' },
    { id: '2', title: 'Payment Gateway Integration', projectName: 'E-commerce Platform' },
    { id: '3', title: 'Mobile UI Components', projectName: 'Mobile App Redesign' },
    { id: '4', title: 'API Documentation', projectName: 'Mobile App Redesign' },
    { id: '5', title: 'Database Migration', projectName: 'E-commerce Platform' },
    { id: '6', title: 'Technical Architecture Review', projectName: 'System Architecture' },
    { id: '7', title: 'Code Quality Assessment', projectName: 'Quality Assurance' }
  ];

  const mockUsers = [
    { id: '3', name: 'Lisa Rodriguez', role: 'PM' },
    { id: '4', name: 'David Kim', role: 'TM' },
    { id: '5', name: 'Alex Thompson', role: 'ENGINEER' },
    { id: '6', name: 'Emma Wilson', role: 'ENGINEER' },
    { id: '7', name: 'James Miller', role: 'ENGINEER' },
    { id: '8', name: 'Sophia Davis', role: 'ENGINEER' },
    { id: '9', name: 'William Garcia', role: 'ENGINEER' },
    { id: '10', name: 'Olivia Martinez', role: 'ENGINEER' },
    { id: '14', name: 'Amanda Chen', role: 'TM' },
    { id: '15', name: 'Carlos Martinez', role: 'TM' },
    { id: '16', name: 'Sophie Taylor', role: 'TM' },
    { id: '17', name: 'Ryan Johnson', role: 'TM' }
  ];

  const canApprove = ['PM', 'TM', 'PMO', 'TASS'].includes(currentUser.role);
  const canSubmitRequest = ['PM', 'TM'].includes(currentUser.role);

  const getTaskInfo = (taskId: string) => {
    return mockTasks.find(task => task.id === taskId) || { title: 'Unknown Task', projectName: 'Unknown Project' };
  };

  const getUserInfo = (userId: string) => {
    return mockUsers.find(user => user.id === userId) || { name: 'Unknown User', role: 'UNKNOWN' };
  };

  const filteredRequests = mockRequests.filter(request => {
    const taskInfo = getTaskInfo(request.taskId);
    const userInfo = getUserInfo(request.userId);
    
    const matchesSearch = taskInfo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || request.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || request.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

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
      case 'PENDING': return <Clock className="w-4 h-4" />;
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

  const handleApprove = (requestId: string) => {
    alert(`Request ${requestId} approved successfully!`);
    // In real app, this would update the backend
  };

  const handleReject = (requestId: string) => {
    alert(`Request ${requestId} rejected successfully!`);
    // In real app, this would update the backend
  };

  const handleRequestSubmit = (data: RequestFormData) => {
    console.log('Request submitted:', data);
    alert(`${data.type} request submitted successfully!`);
  };

  const getRequestCounts = () => {
    return {
      ALL: mockRequests.length,
      PENDING: mockRequests.filter(r => r.status === 'PENDING').length,
      APPROVED: mockRequests.filter(r => r.status === 'APPROVED').length,
      REJECTED: mockRequests.filter(r => r.status === 'REJECTED').length,
    };
  };

  const requestCounts = getRequestCounts();

  const getApprovalTitle = () => {
    switch (currentUser.role) {
      case 'PM':
      case 'TM':
        return 'Engineer Request Approvals';
      case 'PMO':
        return 'PM Request Approvals';
      case 'TASS':
        return 'TM Request Approvals';
      default:
        return 'Approvals';
    }
  };

  const getApprovalDescription = () => {
    switch (currentUser.role) {
      case 'PM':
      case 'TM':
        return 'Review and approve engineer timesheet requests';
      case 'PMO':
        return 'Review and approve Project Manager timesheet requests';
      case 'TASS':
        return 'Review and approve Technical Manager timesheet requests';
      default:
        return 'Review and approve timesheet requests';
    }
  };

  if (!canApprove) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <CheckCircle className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600">
          Only PM, TM, PMO, and TASS users can access the Approvals module.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getApprovalTitle()}</h1>
          <p className="text-gray-600">{getApprovalDescription()}</p>
        </div>
        
        {canSubmitRequest && (
          <button 
            onClick={() => setIsRequestFormOpen(true)}
            className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Request</span>
          </button>
        )}
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
          <div className="text-sm text-gray-600">Pending Review</div>
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

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const taskInfo = getTaskInfo(request.taskId);
            const userInfo = getUserInfo(request.userId);
            
            return (
              <div key={request.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(request.type)}`}>
                        {request.type.replace('_', ' ')}
                      </span>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="text-xs font-medium">{request.status}</span>
                      </div>
                      <span className={`text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency} Priority
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{taskInfo.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{taskInfo.projectName}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{userInfo.name} ({userInfo.role})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{request.reason}</p>
                  </div>
                  
                  {request.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Review</span>
                      </button>
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Request Details */}
                {(request.type === 'OVERTIME' || request.type === 'CORRECTION') && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Current Hours:</span>
                        <span className="ml-2 text-sm text-gray-900">{request.currentHours}h</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Requested Hours:</span>
                        <span className="ml-2 text-sm text-gray-900">{request.proposedHours}h</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status-specific information */}
                {request.status === 'APPROVED' && request.reviewedAt && (
                  <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <span>Approved on {new Date(request.reviewedAt).toLocaleDateString()}</span>
                  </div>
                )}

                {request.status === 'REJECTED' && request.reviewedAt && (
                  <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    <XCircle className="w-4 h-4" />
                    <span>Rejected on {new Date(request.reviewedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 mb-4">
            <FileText className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL'
              ? 'Try adjusting your filters to see more requests.'
              : 'No timesheet requests have been submitted yet.'
            }
          </p>
        </div>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
              {/* Request Info */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Request Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2">{selectedRequest.type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Urgency:</span>
                    <span className={`ml-2 ${getUrgencyColor(selectedRequest.urgency)}`}>
                      {selectedRequest.urgency}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Task:</span>
                    <span className="ml-2">{getTaskInfo(selectedRequest.taskId).title}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Submitted by:</span>
                    <span className="ml-2">{getUserInfo(selectedRequest.userId).name} ({getUserInfo(selectedRequest.userId).role})</span>
                  </div>
                </div>
              </div>

              {/* Justification */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Justification</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {selectedRequest.justification}
                </p>
              </div>

              {/* Expected Impact */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Expected Impact</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {selectedRequest.expectedImpact}
                </p>
              </div>

              {/* Actions */}
              {selectedRequest.status === 'PENDING' && (
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleReject(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request Form Modal for PM/TM */}
      {canSubmitRequest && (
        <RequestForm
          isOpen={isRequestFormOpen}
          onClose={() => setIsRequestFormOpen(false)}
          onSubmit={handleRequestSubmit}
          availableTasks={[]} // PM/TM would have their own tasks
        />
      )}
    </div>
  );
};

export default Approvals;