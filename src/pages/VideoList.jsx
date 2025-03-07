import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiClock, FiEye, FiVideo, FiFilter, FiX } from 'react-icons/fi';
import api from '../services/api';
import { formatDistance } from 'date-fns';
import FloatingNav from '../components/navbar/floating-navbar';

const VideoList = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchVideos();
  }, [sortBy]);

  const fetchVideos = async (query = '') => {
    try {
      setIsLoading(true);
      const response = await api.get(`api/videos/${query ? `?search=${query}&sort=${sortBy}` : `?sort=${sortBy}`}`);
      setVideos(response.data);
      console.log(response.data)
    } catch (error) {
      setError('Failed to load videos');
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVideos(searchQuery);
  };

  const VideoCard = ({ video }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group bg-gray-900 rounded-xl overflow-hidden shadow-lg cursor-pointer
                 transform transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
      onClick={() => navigate(`/watch-video/${video.id}`)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-800">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 
                     group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <FiVideo className="w-12 h-12 text-gray-600" />
          </div>
        )}
        
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2 
                     group-hover:text-blue-400 transition-colors">
          {video.title}
        </h3>
        
        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
          {video.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FiEye className="w-4 h-4 mr-1" />
              {video.views.toLocaleString()} views
            </div>
            <div className="flex items-center">
              <FiClock className="w-4 h-4 mr-1" />
              {formatDistance(new Date(video.created_at), new Date(), { addSuffix: true })}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-800 flex items-center">
          <span className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
            Created by: {video.username}
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <FloatingNav/>
      
      {/* Hero Section with Search */}
      <div className="relative py-20 px-4 mb-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mt-12 mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Discover Amazing Videos</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full px-6 py-4 pl-12 rounded-xl bg-white/10 backdrop-blur-sm
                       border border-white/20 focus:outline-none focus:border-blue-500 
                       transition-all duration-300 text-white placeholder-gray-400"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 
                              text-gray-400 w-5 h-5" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 
                       px-6 py-2 bg-blue-500 text-white rounded-lg
                       hover:bg-blue-600 transition-all duration-300"
            >
              Search
            </motion.button>
          </form>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg
                     bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <FiFilter className="w-5 h-5" />
            <span>Filters</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700
                     focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 
                         border-b-2 border-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* No Results */}
        {!isLoading && !error && videos.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <FiVideo className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No videos found</h3>
            <p className="text-gray-400">
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : "No videos have been uploaded yet"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VideoList;