import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Calendar,
  Activity,
  Target,
  Award,
  PieChart,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { User } from '../../types';

interface UnifiedAnalyticsProps {
  currentUser: User;
}

const UnifiedAnalytics: React.FC<UnifiedAnalyticsProps> = ({ currentUser }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('utilization');

  // Mock data for different roles
  const mockData = {
    engineerAllocation: [
      { name: 'Alex Thompson', projects: 3, utilization: 94, efficiency: 87, hoursLogged: 168, hourlyRate: 45 },
      { name: 'Emma Wilson', projects: 2, utilization: 89, efficiency: 92, hoursLogged: 155, hourlyRate: 42 },
      { name: 'James Miller', projects: 4, utilization: 76, efficiency: 85, hoursLogged: 148, hourlyRate: 40 },
      { name: 'Sophia Davis', projects: 2, utilization: 98, efficiency: 90, hoursLogged: 162, hourlyRate: 48 },
      { name: 'William Garcia', projects: 3, utilization: 82, efficiency: 88, hoursLogged: 140, hourlyRate: 43 },
      { name: 'Olivia Martinez', projects: 2, utilization: 91, efficiency: 94, hoursLogged: 158, hourlyRate: 46 },
      { name: 'Benjamin Lee', projects: 3, utilization: 87, efficiency: 89, hoursLogged: 152, hourlyRate: 44 },
      { name: 'Charlotte Brown', projects: 2, utilization: 93, efficiency: 91, hoursLogged: 165, hourlyRate: 47 },
      { name: 'Daniel Wilson', projects: 4, utilization: 79, efficiency: 86, hoursLogged: 145, hourlyRate: 41 },
      { name: 'Isabella Taylor', projects: 3, utilization: 96, efficiency: 93, hoursLogged: 170, hourlyRate: 49 }
    ],
    projectDelivery: [
      { pm: 'Lisa Rodriguez', projects: 5, onTime: 4, delayed: 1, efficiency: 92 },
      { pm: 'David Kim', projects: 3, onTime: 3, delayed: 0, efficiency: 95 },
      { pm: 'Mike Chen', projects: 4, onTime: 3, delayed: 1, efficiency: 88 },
    ],
    taskCompletion: {
      thisWeek: 24,
      lastWeek: 18,
      velocity: 33,
      avgCompletionTime: 2.4
    },
    resourceUtilization: {
      overAllocated: 2,
      optimal: 6,
      underUtilized: 2,
      totalEngineers: 10
    }
  };

  const isEngineerView = currentUser.role === 'ENGINEER';
  
  // Filter data based on role
  const filteredEngineers = isEngineerView 
    ? mockData.engineerAllocation.filter(eng => eng.name === currentUser.name)
    : mockData.engineerAllocation;

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 95) return 'text-red-600 bg-red-50';
    if (utilization > 85) return 'text-green-600 bg-green-50';
    if (utilization > 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'bg-green-500';
    if (efficiency >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateTotalSalary = () => {
    return filteredEngineers.reduce((total, engineer) => {
      return total + (engineer.hoursLogged * engineer.hourlyRate);
    }, 0);
  };

  const calculateAverageHourlyRate = () => {
    const totalRate = filteredEngineers.reduce((sum, eng) => sum + eng.hourlyRate, 0);
    return totalRate / filteredEngineers.length;
  };

  const renderRoleSpecificMetrics = () => {
    switch (currentUser.role) {
      case 'TASS':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+5%</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-600">Total Engineers</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+12%</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-600">Active Projects</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+8%</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">87%</p>
                <p className="text-sm text-gray-600">System Efficiency</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+15%</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-600">Finished Projects </p>
              </div>
            </div>
          </div>
        );

      case 'PMO':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+2</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Active Engineers</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+5%</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">18</p>
                <p className="text-sm text-gray-600">Projects Assigned</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-red-600">-1</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-600">Pending Assignments</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+4%</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">89%</p>
                <p className="text-sm text-gray-600">Efficiency Rate</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+8%</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">32</p>
                <p className="text-sm text-gray-600">Active Tasks</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-600">0%</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-600">Team Members</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+2</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-600">Pending Approvals</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+12%</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">94%</p>
                <p className="text-sm text-gray-600">Task Completion</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Resource-centric insights and performance metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Role-specific Key Metrics */}
      {renderRoleSpecificMetrics()}

      {/* Resource Utilization Heatmap */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Engineer Allocation</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {filteredEngineers.map((engineer, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {engineer.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{engineer.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getUtilizationColor(engineer.utilization)}`}>
                        {engineer.utilization}%
                      </span>
                      <span className="text-xs text-gray-500">{engineer.projects} projects</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getEfficiencyColor(engineer.efficiency)}`}
                        style={{ width: `${engineer.efficiency}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{engineer.efficiency}% efficiency</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Completion Velocity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Task Completion Velocity</h3>
            <Zap className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{mockData.taskCompletion.thisWeek}</div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{mockData.taskCompletion.lastWeek}</div>
              <div className="text-sm text-gray-600">Last Week</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Velocity Increase</span>
              <span className="text-lg font-semibold text-green-600">+{mockData.taskCompletion.velocity}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Completion Time</span>
              <span className="text-lg font-semibold text-gray-900">{mockData.taskCompletion.avgCompletionTime} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* PM/TM Performance (for TASS and PMO) */}
      {(currentUser.role === 'TASS' || currentUser.role === 'PMO') && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">PM and TM Performance</h3>
            <p className="text-sm text-gray-600">Project delivery performance and efficiency metrics</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    On Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delayed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Efficiency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockData.projectDelivery.map((pm, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {pm.pm.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{pm.pm}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pm.projects}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {pm.onTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {pm.delayed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{pm.efficiency}%</div>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getEfficiencyColor(pm.efficiency)}`}
                            style={{ width: `${pm.efficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        pm.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                        pm.efficiency >= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {pm.efficiency >= 90 ? 'Excellent' : pm.efficiency >= 80 ? 'Good' : 'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Engineer Salary Analytics - Only for TASS, PMO, PM, TM */}
      {!isEngineerView && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Engineer Analytics</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ${calculateTotalSalary().toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Estimated Total Expenses</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ${calculateAverageHourlyRate().toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Avg Hourly Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {filteredEngineers.reduce((sum, eng) => sum + eng.hoursLogged, 0)}h
              </div>
              <div className="text-sm text-gray-600">Total Hours</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {filteredEngineers.length}
              </div>
              <div className="text-sm text-gray-600">Engineers</div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredEngineers.map((engineer, index) => {
              const totalEarnings = engineer.hoursLogged * engineer.hourlyRate;
              const maxEarnings = Math.max(...filteredEngineers.map(e => e.hoursLogged * e.hourlyRate));
              const earningsPercentage = (totalEarnings / maxEarnings) * 100;
              
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {engineer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{engineer.name}</span>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">${engineer.hourlyRate}/hr</span>
                        <span className="text-gray-600">{engineer.hoursLogged}h</span>
                        <span className="font-semibold text-green-600">${totalEarnings.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${earningsPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-12">
                        {Math.round(earningsPercentage)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resource Utilization Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Resource Utilization Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{mockData.resourceUtilization.overAllocated}</div>
            <div className="text-sm text-gray-600">Over-allocated</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{mockData.resourceUtilization.optimal}</div>
            <div className="text-sm text-gray-600">Optimal</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{mockData.resourceUtilization.underUtilized}</div>
            <div className="text-sm text-gray-600">Under-utilized</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{mockData.resourceUtilization.totalEngineers}</div>
            <div className="text-sm text-gray-600">Total Engineers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAnalytics;