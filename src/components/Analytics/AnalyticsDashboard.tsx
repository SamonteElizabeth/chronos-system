import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Calendar,
  Activity,
  Target,
  Award
} from 'lucide-react';
import { User } from '../../types';

interface AnalyticsDashboardProps {
  currentUser: User;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ currentUser }) => {
  const mockChartData = {
    projectProgress: [
      { name: 'E-commerce Platform', progress: 85, trend: 'up' },
      { name: 'Mobile App Redesign', progress: 62, trend: 'up' },
      { name: 'API Integration', progress: 45, trend: 'down' },
      { name: 'Database Migration', progress: 90, trend: 'up' },
      { name: 'Security Audit', progress: 30, trend: 'neutral' },
    ],
    timeDistribution: [
      { category: 'Development', hours: 120, percentage: 45 },
      { category: 'Testing', hours: 80, percentage: 30 },
      { category: 'Planning', hours: 40, percentage: 15 },
      { category: 'Meetings', hours: 27, percentage: 10 },
    ],
    teamPerformance: [
      { name: 'Alex Thompson', efficiency: 94, hoursLogged: 160, tasksCompleted: 12 },
      { name: 'Sarah Kim', efficiency: 89, hoursLogged: 155, tasksCompleted: 10 },
      { name: 'Mike Rodriguez', efficiency: 87, hoursLogged: 148, tasksCompleted: 11 },
      { name: 'Lisa Chen', efficiency: 92, hoursLogged: 162, tasksCompleted: 14 },
    ]
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Insights into productivity, resource utilization, and project performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+12%</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">87%</p>
            <p className="text-sm text-gray-600">Overall Efficiency</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+8%</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">1,247</p>
            <p className="text-sm text-gray-600">Hours This Month</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+15%</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">94%</p>
            <p className="text-sm text-gray-600">On-Time Delivery</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-red-600">-2%</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">92%</p>
            <p className="text-sm text-gray-600">Resource Utilization</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Project Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {mockChartData.projectProgress.map((project, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{project.name}</span>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(project.trend)}
                      <span className="text-sm font-medium text-gray-600">{project.progress}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Time Distribution</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {mockChartData.timeDistribution.map((item, index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
                    <span className="text-sm font-medium text-gray-900">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{item.hours}h</div>
                    <div className="text-xs text-gray-500">{item.percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
          <p className="text-sm text-gray-600">Individual productivity metrics and task completion rates</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours Logged
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasks Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockChartData.teamPerformance.map((member, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{member.efficiency}%</div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            member.efficiency >= 90 ? 'bg-green-500' : 
                            member.efficiency >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${member.efficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.hoursLogged}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.tasksCompleted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      member.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                      member.efficiency >= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {member.efficiency >= 90 ? 'Excellent' : member.efficiency >= 80 ? 'Good' : 'Needs Attention'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;