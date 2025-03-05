import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaPlay, 
  FaEnvelope, 
  FaLock, 
  FaUser, 
  FaGoogle, 
  FaGithub, 
  FaArrowRight, 
  FaSignOutAlt,
  FaCamera
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';


const Register = () => {
  const { register, loading}  = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match!');
      return;
    }

    setIsLoading(true);
    try {
      // Create registration data with password2 field
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.password2  // Send password2 to match backend expectation
      };
      
      const response = await register(registrationData);
      if (response.success) {
        navigate('/signin');
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred. Please try again.');
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
              Join Our Streaming Community
            </h1>
            <p className="text-xl text-gray-300">
              Create your account and start streaming your favorite content today
            </p>
          </motion.div>
        </div>
        
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black"
          animate={{
            background: [
              "radial-gradient(circle at top left, rgba(59,130,246,0.2), transparent 70%)",
              "radial-gradient(circle at top right, rgba(147,51,234,0.2), transparent 70%)",
              "radial-gradient(circle at bottom left, rgba(59,130,246,0.2), transparent 70%)"
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Feature List */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-white mb-4">Member Benefits</h3>
            <ul className="space-y-4">
              {[
                'Create and share your content',
                'Access exclusive features',
                'Join live streaming events',
                'Connect with other creators'
              ].map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center text-gray-300"
                >
                  <FaPlay className="mr-2 text-blue-400" />
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full"
        >
          {/* Signup Form */}
          <div className="bg-gray-900/30 p-8 rounded-2xl backdrop-blur-xl border border-gray-800 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-400">
                Join our video streaming platform
              </p>
            </div>

          

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg
                             bg-gray-800/50 text-white placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             transition-all duration-300"
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    autoComplete="email"
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

              {/* Password Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg
                               bg-gray-800/50 text-white placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               transition-all duration-300"
                      placeholder="Create password"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      value={formData.password2}
                      onChange={(e) => setFormData({...formData, password2: e.target.value})}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg
                               bg-gray-800/50 text-white placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               transition-all duration-300"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
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
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/signin" className="text-blue-500 hover:text-blue-400">
                Sign in
              </Link>
            </p>
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

export default Register;