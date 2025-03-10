import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { IoMdArrowBack } from "react-icons/io";
import { FaPlay, FaPause } from "react-icons/fa";
import { decryptToken } from '../components/utils/tokenUtils';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const imgRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const startStream = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (imgRef.current && isPlaying) {
          imgRef.current.src = `${api.defaults.baseURL}/api/videos/${videoId}/stream/`;
          imgRef.current.onload = () => {
            if (mounted) setIsLoading(false);
          };
          imgRef.current.onerror = () => {
            if (mounted) {
              setError('Failed to load video stream');
              setIsLoading(false);
            }
          };
        }
      } catch (err) {
        if (mounted) {
          console.error('Streaming error:', err);
          setError('Failed to start video stream');
          setIsLoading(false);
        }
      }
    };

    if (isPlaying) {
      startStream();
    }

    return () => {
      mounted = false;
      const encryptedAccess = localStorage.getItem('access_token')
      const token = decryptToken(encryptedAccess)
      // Stop the stream when component unmounts or when navigating away
      fetch(`${api.defaults.baseURL}/api/videos/${videoId}/stop-stream/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }).catch(console.error);
    };
  }, [videoId, isPlaying]);

  const handleBack = () => {
    const encryptedAccess = localStorage.getItem('access_token');
    const token = decryptToken(encryptedAccess);
    // Stop stream before navigating back
    fetch(`${api.defaults.baseURL}/api/videos/${videoId}/stop-stream/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token})}`,
      },
    }).then(() => {
      navigate(-1);
    }).catch(console.error);
  };
  const togglePlay = async () => {
    const encryptedAccess = localStorage.getItem('access_token');
    const token = decryptToken(encryptedAccess);
  
    if (isPlaying) {
      // Stop the stream
      await fetch(`${api.defaults.baseURL}/api/videos/${videoId}/stop-stream/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }).catch(console.error);
    } else {
      // Restart the stream properly
      await fetch(`${api.defaults.baseURL}/api/videos/${videoId}/start-stream/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }).catch(console.error);
  
      // Update the video source after starting the stream
      if (imgRef.current) {
        imgRef.current.src = `${api.defaults.baseURL}/api/videos/${videoId}/stream/?t=${new Date().getTime()}`;
      }
    }
  
    setIsPlaying(!isPlaying);
  };
  

  // const togglePlay = () => {
  //   if (isPlaying) {
  //     // Stop stream
  //     const encryptedAccess = localStorage.getItem('access_token');
  //     const token = decryptToken(encryptedAccess)
  //     fetch(`${api.defaults.baseURL}api/videos/${videoId}/stop-stream/`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     }).catch(console.error);
  //   }else{
  //     // imgRef.current.src = `${api.defaults.baseURL}api/videos/${videoId}/stream/`;
  //     setIsPlaying((prev) => {
  //       if (!prev) {
  //         imgRef.current.src = `${api.defaults.baseURL}api/videos/${videoId}/stream/`;
  //       }
  //       return !prev;
  //     });
  //   }
  //   setIsPlaying(!isPlaying);
  // };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-4">
          <button
            onClick={handleBack}
            className="flex items-center text-white hover:text-blue-500 transition-colors"
          >
            <IoMdArrowBack className="text-2xl mr-2" />
            <span>Back</span>
          </button>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setIsPlaying(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Video Stream */}
          <img
            ref={imgRef}
            className="w-full h-full object-contain"
            alt="Video stream"
          />

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <button
                onClick={togglePlay}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                {isPlaying ? (
                  <>
                    <FaPause className="text-white" />
                    <span className="text-white">Pause</span>
                  </>
                ) : (
                  <>
                    <FaPlay className="text-white" />
                    <span className="text-white">Play</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;