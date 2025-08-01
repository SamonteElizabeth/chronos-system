import React, { useState } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  Calendar, 
  User, 
  AlertCircle,
  CheckCircle,
  Timer,
  FileText
} from 'lucide-react';
import { Task } from '../../types';
import { useTimer } from '../../hooks/useTimer';
import TaskCompletionModal from './TaskCompletionModal';

interface TaskCardProps {
  task: Task;
  isEngineerView?: boolean;
  onRequestClick?: (taskId: string, type: 'CORRECTION' | 'OVERTIME' | 'HOLIDAY' | 'EXTENSION') => void;
  onTaskComplete?: (taskId: string) => void;
}

interface TaskCompletionData {
  taskId: string;
  remarks: string;
  attachments: File[];
  completionDate: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  isEngineerView = false, 
  onRequestClick,
  onTaskComplete 
}) => {
  const { activeTimer, elapsedTime, startTimer, stopTimer, formatTime, isActive } = useTimer();
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const isCurrentTaskActive = isActive && activeTimer?.taskId === task.id;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-50';
      case 'ONGOING': return 'text-blue-600 bg-blue-50';
      case 'PENDING': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleTimerToggle = () => {
    if (isCurrentTaskActive) {
      stopTimer();
    } else {
      startTimer(task.id, task.title);
    }
  };

  const handleMarkCompleteClick = () => {
    setIsCompletionModalOpen(true);
  };

  const handleTaskCompletionSubmit = (data: TaskCompletionData) => {
    // In real app, this would update the task with completion data
    console.log('Task completion data:', data);
    
    if (onTaskComplete) {
      onTaskComplete(task.id);
    }
    
    alert(`✅ Task "${task.title}" has been completed successfully!\n\n📋 Completion remarks and attachments have been saved.`);
  };

  const progress = task.estimatedHours > 0 ? (task.actualHours / task.estimatedHours) * 100 : 0;
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  return (
    <>
      <div className={`bg-white rounded-xl p-6 shadow-sm border transition-all hover:shadow-md ${
        isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-100'
      } ${isCurrentTaskActive ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {task.priority}
              </span>
              {isOverdue && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
            {task.subTask && (
              <p className="text-xs text-gray-500 mt-1">Sub-task: {task.subTask}</p>
            )}
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                progress > 100 ? 'bg-red-500' : progress > 80 ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Time Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Estimated</div>
            <div className="text-sm font-semibold text-gray-900">{task.estimatedHours}h</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Actual</div>
            <div className={`text-sm font-semibold ${
              task.actualHours > task.estimatedHours ? 'text-red-600' : 'text-gray-900'
            }`}>
              {task.actualHours}h
            </div>
          </div>
        </div>

        {/* Timer Display */}
        {isCurrentTaskActive && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center space-x-2">
              <Timer className="w-4 h-4 text-blue-600" />
              <span className="text-lg font-mono font-bold text-blue-900">
                {formatTime(elapsedTime)}
              </span>
            </div>
          </div>
        )}

        {/* Due Date */}
        <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        {task.status !== 'COMPLETED' && (
          <div className="space-y-2 mb-3">
            {/* Timer and Complete buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleTimerToggle}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isCurrentTaskActive
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isCurrentTaskActive ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Stop Timer</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start Timer</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleMarkCompleteClick}
                className="flex items-center justify-center space-x-2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Finished</span>
              </button>
            </div>
          </div>
        )}

        {/* Request Actions for Engineers */}
        {isEngineerView && (
          <div className="flex flex-wrap gap-2 text-xs">
            <button 
              onClick={() => onRequestClick?.(task.id, 'EXTENSION')}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
            >
              <Calendar className="w-3 h-3" />
              <span>Request Extension</span>
            </button>
            <button 
              onClick={() => onRequestClick?.(task.id, 'OVERTIME')}
              className="flex items-center space-x-1 text-orange-600 hover:text-orange-800 font-medium bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded transition-colors"
            >
              <Clock className="w-3 h-3" />
              <span>Report Overtime</span>
            </button>
            <button 
              onClick={() => onRequestClick?.(task.id, 'CORRECTION')}
              className="flex items-center space-x-1 text-purple-600 hover:text-purple-800 font-medium bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded transition-colors"
            >
              <FileText className="w-3 h-3" />
              <span>Time Correction</span>
            </button>
          </div>
        )}
      </div>

      {/* Task Completion Modal */}
      <TaskCompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        onSubmit={handleTaskCompletionSubmit}
        task={task}
      />
    </>
  );
};

export default TaskCard;