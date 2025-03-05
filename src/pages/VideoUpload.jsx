import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiX, FiVideo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import FloatingNav from '../components/navbar/floating-navbar';
import api from '../services/api';
import { encryptToken } from '../components/utils/tokenUtils';

const VideoUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const onDrop = useCallback(acceptedFiles => {
    const videoFile = acceptedFiles[0];
    if (videoFile) {
      if (videoFile.size > 524288000) { // 500MB
        toast.error('File size too large. Maximum size is 500MB');
        return;
      }
      setFile(videoFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !formData.title) {
      toast.error('Please provide a video file and title');
      return;
    }

    setIsUploading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('file_path', file);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);

    try {
        const decryptedAccessToken = localStorage.getItem('access_token')
        const token = encryptToken(decryptedAccessToken)
      const response = await api.post('api/videos/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (response.status === 201) {
        toast.success('Video uploaded successfully!');
        navigate('/videos');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || 'Upload failed. Please try again.';
      toast.error(errorMessage);
      
      // Reset progress on error
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Add cleanup function for component unmount
  useEffect(() => {
    return () => {
      // Clean up any resources if needed
      if (file) {
        URL.revokeObjectURL(file);
      }
    };
  }, [file]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
        <FloatingNav/>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl mt-12 font-bold mb-8">Upload Video</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Video Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
                       transition-colors duration-300 ${
                         isDragActive
                           ? 'border-blue-500 bg-blue-500/10'
                           : 'border-gray-700 hover:border-gray-500'
                       }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex items-center justify-center space-x-4">
                <FiVideo className="w-8 h-8 text-blue-500" />
                <span className="text-lg">{file.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="p-1 rounded-full hover:bg-gray-800"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <FiUploadCloud className="w-12 h-12 mx-auto text-gray-400" />
                <div className="text-xl">
                  {isDragActive ? (
                    <p>Drop your video here</p>
                  ) : (
                    <p>
                      Drag & drop your video or{' '}
                      <span className="text-blue-500">browse</span>
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  MP4, AVI, MOV or MKV (max. 500MB)
                </p>
              </div>
            )}
          </div>

          {/* Video Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Video Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700
                         focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter video title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700
                         focus:outline-none focus:border-blue-500 transition-colors
                         min-h-[120px]"
                placeholder="Enter video description"
              />
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-blue-500"
                />
              </div>
              <p className="text-sm text-gray-400 text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading || !file || !formData.title}
            className="w-full py-3 px-4 rounded-lg text-white text-lg font-semibold
                     bg-gradient-to-r from-blue-500 to-blue-600
                     hover:from-blue-600 hover:to-blue-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transform hover:scale-[1.02] transition-all duration-300
                     shadow-lg shadow-blue-500/30"
          >
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default VideoUpload;
