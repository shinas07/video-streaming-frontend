import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaPlay, 
  FaEnvelope, 
  FaLock, 
  FaGoogle, 
  FaGithub, 
  FaArrowRight, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add client-side validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in both email and password fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUser(formData.email, formData.password);
      
      if (response.success) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        // Preserve form data on error
        setFormData(prev => ({ ...prev }));
        toast.error(response.error || 'Invalid credentials');
      }
    } catch (error) {
    console.log(error)
      // Handle API errors properly
      const errorMessage = error.response?.data?.non_field_errors?.[0] || 
                          error.response?.data?.detail || 
                          'An error occurred. Please try again.';
      toast.error(errorMessage);
      
      // Preserve form data on error
      setFormData(prev => ({ ...prev }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Panel - Video Streaming Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-black to-gray-900 
                      p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6">
              Stream Your World
            </h1>
            <p className="text-xl text-gray-300">
              Join our platform for unlimited access to high-quality video streaming
            </p>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-blue-900/30 to-black/50" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        
        {/* Feature List */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-white mb-4">Key Features</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <FaPlay className="mr-2 text-blue-400" /> 4K Video Quality
              </li>
              <li className="flex items-center">
                <FaPlay className="mr-2 text-blue-400" /> Multi-Device Streaming
              </li>
              <li className="flex items-center">
                <FaPlay className="mr-2 text-blue-400" /> Cloud Storage
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full"
        >
          {/* Login Form */}
          <div className="bg-gray-900/30 p-8 rounded-2xl backdrop-blur-xl border border-gray-800 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">
                Sign in to continue streaming
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg
                             bg-gray-800/50 text-white placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg
                             bg-gray-800/50 text-white placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             transition-all duration-300"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {/* <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                  /> */}
                  {/* <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label> */}
                </div>
                <Link to="" className="text-sm text-blue-500 hover:text-blue-400">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg text-white text-lg font-semibold
                         bg-gradient-to-r from-blue-500 to-blue-600
                         hover:from-blue-600 hover:to-blue-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         transform hover:scale-105 transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg shadow-blue-500/30"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
            <div className="mt-2 text-center">
            <span className="text-sm text-gray-400">Don't have an account? </span>
            <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up 
            </Link>
          </div>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link 
              to="/" 
              className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-2"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;