import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Image, 
  Paperclip, 
  CheckCircle,
  Camera,
  Trash2,
  Eye
} from 'lucide-react';
import { Task } from '../../types';

interface TaskCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskCompletionData) => void;
  task: Task | null;
}

interface TaskCompletionData {
  taskId: string;
  remarks: string;
  attachments: File[];
  completionDate: string;
}

interface AttachmentPreview {
  file: File;
  preview?: string;
  type: 'image' | 'document' | 'other';
}

const TaskCompletionModal: React.FC<TaskCompletionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  task 
}) => {
  const [formData, setFormData] = useState<TaskCompletionData>({
    taskId: task?.id || '',
    remarks: '',
    attachments: [],
    completionDate: new Date().toISOString().split('T')[0],
  });

  const [attachmentPreviews, setAttachmentPreviews] = useState<AttachmentPreview[]>([]);
  const [errors, setErrors] = useState<Partial<TaskCompletionData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof TaskCompletionData, value: string | number | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getFileType = (file: File): 'image' | 'document' | 'other' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) return 'document';
    return 'other';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Validate file size (max 10MB per file)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create previews for new files
    const newPreviews: AttachmentPreview[] = validFiles.map(file => {
      const preview: AttachmentPreview = {
        file,
        type: getFileType(file)
      };

      // Create preview URL for images
      if (preview.type === 'image') {
        preview.preview = URL.createObjectURL(file);
      }

      return preview;
    });

    setAttachmentPreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({ 
      ...prev, 
      attachments: [...prev.attachments, ...validFiles] 
    }));

    // Clear the input
    event.target.value = '';
  };

  const removeAttachment = (index: number) => {
    const preview = attachmentPreviews[index];
    
    // Revoke object URL to prevent memory leaks
    if (preview.preview) {
      URL.revokeObjectURL(preview.preview);
    }

    setAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskCompletionData> = {};

    if (!formData.remarks.trim()) {
      newErrors.remarks = 'Completion remarks are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      onSubmit(formData);
      
      // Clean up object URLs
      attachmentPreviews.forEach(preview => {
        if (preview.preview) {
          URL.revokeObjectURL(preview.preview);
        }
      });

      // Reset form
      setFormData({
        taskId: task?.id || '',
        remarks: '',
        attachments: [],
        completionDate: new Date().toISOString().split('T')[0],
      });
      setAttachmentPreviews([]);
      setErrors({});
      
      onClose();
    } catch (error) {
      alert('Failed to submit task completion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;

    const hasUnsavedChanges = formData.remarks || formData.attachments.length > 0;
    
    if (hasUnsavedChanges) {
      const confirmClose = confirm('You have unsaved changes. Are you sure you want to close without saving?');
      if (!confirmClose) return;
    }

    // Clean up object URLs
    attachmentPreviews.forEach(preview => {
      if (preview.preview) {
        URL.revokeObjectURL(preview.preview);
      }
    });

    setAttachmentPreviews([]);
    onClose();
  };

  const getFileIcon = (type: 'image' | 'document' | 'other') => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <Paperclip className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Complete Task</h2>
              <p className="text-sm text-gray-600">Add completion remarks and attachments</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Task Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Priority: <span className={`font-medium ${
                task.priority === 'CRITICAL' ? 'text-red-600' :
                task.priority === 'HIGH' ? 'text-orange-600' :
                task.priority === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
              }`}>{task.priority}</span></span>
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Completion Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Completion Remarks *
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                errors.remarks ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Describe what you completed, any issues encountered, or important notes..."
            />
            {errors.remarks && (
              <p className="mt-1 text-sm text-red-600">{errors.remarks}</p>
            )}
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Attachments
            </label>
            <div className="space-y-4">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={isSubmitting}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload" 
                  className={`cursor-pointer ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-2">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <Camera className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-xs text-gray-500">
                      Images, PDFs, Documents (Max 10MB per file)
                    </div>
                  </div>
                </label>
              </div>

              {/* Attachment Previews */}
              {attachmentPreviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {attachmentPreviews.map((attachment, index) => (
                    <div key={index} className="relative bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-start space-x-3">
                        {/* Preview */}
                        <div className="flex-shrink-0">
                          {attachment.type === 'image' && attachment.preview ? (
                            <img 
                              src={attachment.preview} 
                              alt={attachment.file.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              {getFileIcon(attachment.type)}
                            </div>
                          )}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {attachment.file.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(attachment.file.size)}
                          </div>
                          <div className="text-xs text-gray-400 capitalize">
                            {attachment.file.type || 'Unknown type'}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1">
                          {attachment.type === 'image' && attachment.preview && (
                            <button
                              onClick={() => window.open(attachment.preview, '_blank')}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => removeAttachment(index)}
                            disabled={isSubmitting}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {isSubmitting && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                <span>Completing task...</span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Completing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Task</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCompletionModal;