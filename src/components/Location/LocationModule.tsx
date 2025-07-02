import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  Users, 
  Filter,
  Search,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Map,
  List,
  Eye,
  X,
  Maximize2
} from 'lucide-react';
import { User } from '../../types';

interface LocationModuleProps {
  currentUser: User;
}

interface EngineerLocation {
  id: string;
  name: string;
  taskTitle: string;
  projectName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'ACTIVE' | 'IDLE' | 'OFFLINE';
  lastUpdate: string;
  workingHours: number;
  efficiency: number;
  avatar?: string;
}

const LocationModule: React.FC<LocationModuleProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedEngineer, setSelectedEngineer] = useState<EngineerLocation | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Mock location data for engineers based on user role
  const getEngineersForUser = (): EngineerLocation[] => {
    const allEngineers: EngineerLocation[] = [
      {
        id: '5',
        name: 'Alex Thompson',
        taskTitle: 'User Authentication System',
        projectName: 'E-commerce Platform',
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: 'WeWork, 1460 Broadway, New York, NY 10036'
        },
        status: 'ACTIVE',
        lastUpdate: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        workingHours: 6.5,
        efficiency: 94
      },
      {
        id: '6',
        name: 'Emma Wilson',
        taskTitle: 'Payment Gateway Integration',
        projectName: 'E-commerce Platform',
        location: {
          lat: 40.7589,
          lng: -73.9851,
          address: 'Home Office, 123 Main St, New York, NY 10001'
        },
        status: 'ACTIVE',
        lastUpdate: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        workingHours: 7.2,
        efficiency: 89
      },
      {
        id: '7',
        name: 'James Miller',
        taskTitle: 'Mobile UI Components',
        projectName: 'Mobile App Redesign',
        location: {
          lat: 40.7505,
          lng: -73.9934,
          address: 'Starbucks, 456 Park Ave, New York, NY 10016'
        },
        status: 'IDLE',
        lastUpdate: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        workingHours: 4.8,
        efficiency: 87
      },
      {
        id: '8',
        name: 'Sophia Davis',
        taskTitle: 'API Documentation',
        projectName: 'Mobile App Redesign',
        location: {
          lat: 40.7614,
          lng: -73.9776,
          address: 'Central Park Library, 789 5th Ave, New York, NY 10065'
        },
        status: 'ACTIVE',
        lastUpdate: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
        workingHours: 5.3,
        efficiency: 92
      },
      {
        id: '9',
        name: 'William Garcia',
        taskTitle: 'Database Migration',
        projectName: 'E-commerce Platform',
        location: {
          lat: 40.7282,
          lng: -74.0776,
          address: 'Last known: Office Building, 321 Hudson St, New York, NY 10013'
        },
        status: 'OFFLINE',
        lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        workingHours: 8.0,
        efficiency: 85
      },
      {
        id: '10',
        name: 'Olivia Martinez',
        taskTitle: 'Security Implementation',
        projectName: 'API Integration',
        location: {
          lat: 40.7549,
          lng: -73.9840,
          address: 'Coffee Shop, 567 Madison Ave, New York, NY 10022'
        },
        status: 'ACTIVE',
        lastUpdate: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        workingHours: 6.8,
        efficiency: 91
      }
    ];

    // Filter engineers based on user role
    switch (currentUser.role) {
      case 'TASS':
        return allEngineers; // TASS can see all engineers
      case 'PMO':
        return allEngineers; // PMO can see all engineers
      case 'PM':
        // PM can see engineers in their projects
        return allEngineers.filter(eng => 
          ['E-commerce Platform', 'Mobile App Redesign'].includes(eng.projectName)
        );
      case 'TM':
        // TM can see engineers in their specific projects
        return allEngineers.filter(eng => 
          ['E-commerce Platform', 'API Integration'].includes(eng.projectName)
        );
      default:
        return [];
    }
  };

  const mockLocations = getEngineersForUser();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-50 border-green-200';
      case 'IDLE': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'OFFLINE': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="w-4 h-4" />;
      case 'IDLE': return <Clock className="w-4 h-4" />;
      case 'OFFLINE': return <AlertTriangle className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getLastUpdateText = (lastUpdate: string) => {
    const now = new Date();
    const updateTime = new Date(lastUpdate);
    const diffInMinutes = Math.floor((now.getTime() - updateTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredLocations = mockLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || location.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getLocationCounts = () => {
    return {
      ALL: mockLocations.length,
      ACTIVE: mockLocations.filter(l => l.status === 'ACTIVE').length,
      IDLE: mockLocations.filter(l => l.status === 'IDLE').length,
      OFFLINE: mockLocations.filter(l => l.status === 'OFFLINE').length,
    };
  };

  const locationCounts = getLocationCounts();

  const handleViewOnMap = (engineer: EngineerLocation) => {
    setSelectedEngineer(engineer);
    setIsMapModalOpen(true);
  };

  const canAccessLocation = ['TASS', 'PMO', 'PM', 'TM'].includes(currentUser.role);

  if (!canAccessLocation) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <MapPin className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600">
          Only TASS, PMO, PM, and TM users can access the Location module.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Engineer Locations</h1>
          <p className="text-gray-600">
            Monitor real-time work locations of your team members
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{locationCounts.ALL}</div>
          <div className="text-sm text-gray-600">Total Engineers</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{locationCounts.ACTIVE}</div>
          <div className="text-sm text-gray-600">Currently Active</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">{locationCounts.IDLE}</div>
          <div className="text-sm text-gray-600">Idle</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-600">{locationCounts.OFFLINE}</div>
          <div className="text-sm text-gray-600">Offline</div>
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
              placeholder="Search engineers, tasks, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex space-x-2">
            {Object.entries(locationCounts).map(([status, count]) => (
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
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'list' ? (
        /* List View */
        filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLocations.map((location) => (
              <div key={location.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {location.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(location.status)}`}>
                        {getStatusIcon(location.status)}
                        <span>{location.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{location.workingHours}h today</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {location.efficiency}% efficiency
                    </div>
                  </div>
                </div>

                {/* Current Task */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">Current Task:</div>
                  <div className="text-sm text-gray-900">{location.taskTitle}</div>
                  <div className="text-xs text-gray-600">{location.projectName}</div>
                </div>

                {/* Location Info */}
                <div className="mb-4">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{location.location.address}</div>
                      <div className="text-xs text-gray-500">
                        Lat: {location.location.lat.toFixed(4)}, Lng: {location.location.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Last Update and Actions */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Navigation className="w-4 h-4" />
                    <span>Last update: {getLastUpdateText(location.lastUpdate)}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleViewOnMap(location)}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                  >
                    <Map className="w-4 h-4" />
                    <span>View on Map</span>
                  </button>
                </div>

                {/* Status-specific alerts */}
                {location.status === 'IDLE' && (
                  <div className="mt-3 flex items-center space-x-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded-lg">
                    <AlertTriangle className="w-4 h-4" />
                    <span>No activity detected for over 20 minutes</span>
                  </div>
                )}

                {location.status === 'OFFLINE' && (
                  <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Location tracking disabled or offline</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-400 mb-4">
              <MapPin className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'ALL'
                ? 'Try adjusting your filters to see more locations.'
                : 'No engineer locations are currently being tracked.'
              }
            </p>
          </div>
        )
      ) : (
        /* Map View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Engineer Location Map</h3>
            <p className="text-sm text-gray-600">Interactive map showing real-time engineer locations</p>
          </div>
          
          {/* Map Container */}
          <div className="relative h-96 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map View</h3>
              <p className="text-gray-600 mb-4">
                Map integration would show engineer locations with real-time updates
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {filteredLocations.map((location) => (
                  <div key={location.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {location.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{location.name}</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(location.status)}`}>
                          {location.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      <div className="flex items-center space-x-1 mb-1">
                        <MapPin className="w-3 h-3" />
                        <span>{location.location.address}</span>
                      </div>
                      <div>Lat: {location.location.lat.toFixed(4)}, Lng: {location.location.lng.toFixed(4)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {isMapModalOpen && selectedEngineer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {selectedEngineer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedEngineer.name}</h3>
                    <p className="text-sm text-gray-600">Location Details</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMapModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Engineer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Current Activity</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Task:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedEngineer.taskTitle}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Project:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedEngineer.projectName}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <span className={`ml-2 text-sm px-2 py-1 rounded-full ${getStatusColor(selectedEngineer.status)}`}>
                        {selectedEngineer.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Working Hours Today:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedEngineer.workingHours}h</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Efficiency:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedEngineer.efficiency}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Location Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Address:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedEngineer.location.address}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Coordinates:</span>
                      <span className="ml-2 text-sm text-gray-900">
                        {selectedEngineer.location.lat.toFixed(6)}, {selectedEngineer.location.lng.toFixed(6)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Last Update:</span>
                      <span className="ml-2 text-sm text-gray-900">{getLastUpdateText(selectedEngineer.lastUpdate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <Map className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Detailed Map View</h4>
                  <p className="text-sm text-gray-600">
                    Interactive map showing precise location of {selectedEngineer.name}
                  </p>
                  <div className="mt-4 text-xs text-gray-500">
                    Coordinates: {selectedEngineer.location.lat.toFixed(6)}, {selectedEngineer.location.lng.toFixed(6)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">Privacy Notice</div>
            <div>
              Location tracking is only active during work hours and when engineers have started a task timer. 
              All location data is encrypted and used solely for project management purposes. 
              Engineers can disable location sharing at any time through their settings.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModule;