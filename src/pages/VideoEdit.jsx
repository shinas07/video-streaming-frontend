import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSave, FiTrash2, FiX, FiImage } from 'react-icons/fi';
import { toast } from 'sonner';
import api from '../services/api';
import FloatingNav from '../components/navbar/floating-navbar';

const VideoEdit = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: null
  });
  const [preview, setPreview] = useState({
    thumbnail: null
  });

  useEffect(() => {
    fetchVideoDetails();
  }, [videoId]);

  const fetchVideoDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`api/videos/${videoId}/`);
      const { title, description, thumbnail } = response.data;
      setFormData({ title, description });
      setPreview({ thumbnail });
    } catch (error) {
      setError('Failed to fetch video details');
      toast.error('Failed to load video details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Thumbnail size should be less than 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        thumbnail: file
      }));
      setPreview(prev => ({
        ...prev,
        thumbnail: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      if (formData.thumbnail) {
        data.append('thumbnail', formData.thumbnail);
      }

      await api.patch(`api/videos/${videoId}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Video updated successfully');
      navigate(-1);
    } catch (error) {
      toast.error('Failed to update video');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await api.delete(`api/videos/${videoId}/`);
        toast.success('Video deleted successfully');
        navigate('/my-videos');
      } catch (error) {
        toast.error('Failed to delete video');
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/my-videos')}
            className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <FloatingNav />
      
      <div className="max-w-4xl mx-auto pt-32 px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-6 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Edit Video</h1>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 
                       transition-colors flex items-center space-x-2"
            >
              <FiTrash2 />
              <span>Delete Video</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 
                         focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 
                         focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail</label>
              <div className="flex items-start space-x-4">
                <div className="relative aspect-video w-64 bg-gray-800 rounded-lg overflow-hidden">
                  {preview.thumbnail ? (
                    <img
                      src={preview.thumbnail}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FiImage className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="inline-block px-4 py-2 bg-blue-500 rounded-lg 
                             hover:bg-blue-600 transition-colors cursor-pointer"
                  >
                    Choose New Thumbnail
                  </label>
                  <p className="text-sm text-gray-400 mt-2">
                    Recommended size: 1280x720. Max file size: 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/my-videos')}
                className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 
                         transition-colors flex items-center space-x-2"
              >
                <FiX />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 
                         transition-colors flex items-center space-x-2 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave />
                <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoEdit;