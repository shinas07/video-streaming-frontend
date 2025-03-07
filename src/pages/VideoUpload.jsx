import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiX, FiVideo, FiImage, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import FloatingNav from '../components/navbar/floating-navbar';
import api from '../services/api';
import { encryptToken } from '../components/utils/tokenUtils';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const VideoUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [myVideos, setMyVideos] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    videoId: null,
    videoTitle: ''
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

  // Fetch user's videos
  useEffect(() => {
    const fetchMyVideos = async () => {
      try {
        const decryptedAccessToken = localStorage.getItem('access_token');
        const token = encryptToken(decryptedAccessToken);
        const response = await api.get('api/videos/my_videos/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMyVideos(response.data);
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error('Failed to load your videos');
      }
    };

    fetchMyVideos();
  }, []);

  // Handle thumbnail selection
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5242880) { // 5MB
        toast.error('Thumbnail size too large. Maximum size is 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

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
    if (thumbnail) {
      formDataToSend.append('thumbnail', thumbnail);
    }

    try {
      const decryptedAccessToken = localStorage.getItem('access_token');
      const token = encryptToken(decryptedAccessToken);
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
        // Refresh the my videos list after successful upload
        const myVideosResponse = await api.get('api/videos/my_videos/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMyVideos(myVideosResponse.data);
        // Reset form
        setFormData({ title: '', description: '' });
        setFile(null);
        setThumbnail(null);
        setThumbnailPreview(null);
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

  // Updated delete handler
  const handleDeleteVideo = async () => {
    if (!deleteModal.videoId) return;
    
    try {
      const decryptedAccessToken = localStorage.getItem('access_token');
      const token = encryptToken(decryptedAccessToken);
      await api.delete(`api/videos/${deleteModal.videoId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMyVideos(myVideos.filter(video => video.id !== deleteModal.videoId));
      toast.success('Video deleted successfully');
    } catch (error) {
      toast.error('Failed to delete video');
    } finally {
      setDeleteModal({ isOpen: false, videoId: null, videoTitle: '' });
    }
  };

  // Open delete modal
  const openDeleteModal = (video) => {
    setDeleteModal({
      isOpen: true,
      videoId: video.id,
      videoTitle: video.title
    });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      videoId: null,
      videoTitle: ''
    });
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
        className="max-w-6xl mx-auto"
      >
         {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
          </motion.div>
        )}
        {/* My Videos Section */}
        <section className="mt-30 mb-6">
          <h2 className="text-3xl font-bold mb-6">My Videos</h2>
          {myVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myVideos.map((video) => (
                <motion.div
                  key={video.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
                >
                  <div className="relative aspect-video">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <FiVideo className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 space-x-2">
                      <button
                        onClick={() => navigate(`/edit-video/${video.id}/`)}
                        className="p-2 bg-blue-500 rounded-full hover:bg-blue-600"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(video)}
                        className="p-2 bg-red-500 rounded-full hover:bg-red-600"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {video.description}
                    </p>
                    <div className="mt-2 text-sm text-gray-500">
                      {new Date(video.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">You haven't uploaded any videos yet.</p>
          )}
        </section>

        {/* Upload New Video Section */}
        <section>
          <h2 className="text-3xl mt-12 font-bold mb-8">Upload New Video</h2>
          
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

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Thumbnail
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative w-40 h-24 bg-gray-900 rounded-lg overflow-hidden">
                  {thumbnailPreview ? (
                    <>
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnail(null);
                          setThumbnailPreview(null);
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-800">
                      <FiImage className="w-6 h-6 mb-2 text-gray-400" />
                      <span className="text-xs text-gray-400">Add thumbnail</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  Recommended: 1280×720px, max 5MB
                </p>
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
        </section>
      </motion.div>

      {/* Add the modal component */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteVideo}
        videoTitle={deleteModal.videoTitle}
      />
    </div>
  );
};

export default VideoUpload;
