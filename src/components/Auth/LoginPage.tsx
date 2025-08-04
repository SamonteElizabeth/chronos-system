import React, { useState } from 'react';
import { 
  Clock, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { User } from '../../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  // Mock users for demo login
  const demoUsers: User[] = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah@chronos.com', role: 'TASS' },
    { id: '2', name: 'Mike Chen', email: 'mike@chronos.com', role: 'PMO' },
    { id: '3', name: 'Lisa Rodriguez', email: 'lisa@chronos.com', role: 'PM' },
    { id: '4', name: 'David Kim', email: 'david@chronos.com', role: 'TM' },
    { id: '5', name: 'Alex Thompson', email: 'alex@chronos.com', role: 'ENGINEER' },
    // New Department Head roles
    { id: '18', name: 'Robert Martinez', email: 'robert@chronos.com', role: 'PM_DEPT_HEAD' },
    { id: '19', name: 'Jennifer Lee', email: 'jennifer@chronos.com', role: 'TM_DEPT_HEAD' },
    // Sample Engineers with Departments
    { id: '20', name: 'John Cruz', email: 'john.cruz@chronos.com', role: 'ENGINEER', department: 'ITSD' },
    { id: '21', name: 'Maria Santos', email: 'maria.santos@chronos.com', role: 'ENGINEER', department: 'DIG' },
    { id: '22', name: 'Allan Reyes', email: 'allan.reyes@chronos.com', role: 'ENGINEER', department: 'BSD' },
    { id: '23', name: 'Kim De Vera', email: 'kim.devera@chronos.com', role: 'ENGINEER', department: 'TSD' },
    { id: '24', name: 'Joseph Mendoza', email: 'joseph.mendoza@chronos.com', role: 'ENGINEER', department: 'DIG' },
    { id: '25', name: 'Ella Navarro', email: 'ella.navarro@chronos.com', role: 'ENGINEER', department: 'BSD' },
    { id: '26', name: 'Danilo Garcia', email: 'danilo.garcia@chronos.com', role: 'ENGINEER', department: 'ITSD' },
    { id: '27', name: 'Erika Lim', email: 'erika.lim@chronos.com', role: 'ENGINEER', department: 'TSD' },
    { id: '28', name: 'Nico Alvarez', email: 'nico.alvarez@chronos.com', role: 'ENGINEER', department: 'DIG' },
    { id: '29', name: 'Faith Domingo', email: 'faith.domingo@chronos.com', role: 'ENGINEER', department: 'BSD' },
    { id: '30', name: 'Patricia Williams', email: 'patricia@chronos.com', role: 'EEM' },
  ];

  const handleInputChange = (field: keyof LoginForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Find user by email
      const user = demoUsers.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
      
      if (user) {
        // Simulate successful login
        onLogin(user);
      } else {
        setErrors({ email: 'Invalid email or password' });
      }
    } catch (error) {
      setErrors({ email: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (user: User) => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin(user);
    }, 1000);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TASS': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'PMO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PM': return 'bg-green-100 text-green-800 border-green-200';
      case 'TM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ENGINEER': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'PM_DEPT_HEAD': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'TM_DEPT_HEAD': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'PM_DEPT_HEAD': return 'PM Dept Head';
      case 'TM_DEPT_HEAD': return 'TM Dept Head';
      case 'EEM': return 'EEM';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Logo & Brand - Centered at top */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Chronos</h1>
            <p className="text-blue-200 text-lg">Time Tracking System</p>
          </div>
        </div>

        {/* Main Login Container - Horizontal Layout */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            
            {/* Left Side - Login Form */}
            <div className="p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                  <p className="text-gray-600">Sign in to access your dashboard</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter your password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={isLoading}
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      disabled={isLoading}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Credentials Info */}
                <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Demo Credentials</p>
                      <p className="text-blue-700">
                        Use any demo user email with password: <code className="bg-blue-100 px-1 rounded">demo123</code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Demo Access */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex flex-col justify-center border-l border-gray-200 max-h-[600px] overflow-y-auto">
              <div className="max-w-md mx-auto w-full">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Demo Access</h3>
                  <p className="text-gray-600">Try different user roles instantly</p>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {demoUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleDemoLogin(user)}
                      disabled={isLoading}
                      className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-blue-300 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                            <div className="text-xs text-gray-600">{user.email}</div>
                            {user.department && (
                              <div className="text-xs text-gray-500">{user.department}</div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}>
                              {getRoleDisplayName(user.role)}
                            </span>
                            <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white">
          <p className="text-sm text-blue-200">
            © 2024 Chronos. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-2 text-xs text-blue-300">
            <button className="hover:text-white transition-colors">Privacy Policy</button>
            <span>•</span>
            <button className="hover:text-white transition-colors">Terms of Service</button>
            <span>•</span>
            <button className="hover:text-white transition-colors">Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;