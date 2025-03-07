import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  PlayCircleIcon, 
  FilmIcon, 
  VideoCameraIcon,
  ArrowRightIcon,
  CloudArrowUpIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { useState, useRef } from 'react';
import FloatingNav from '../components/navbar/floating-navbar';

function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);



  return (
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Hero Section */}
      <FloatingNav />  
      <section className="relative pt-32 pb-24 overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f6,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#6366f1,transparent_50%)]" />
        </motion.div>
        
        <div className="relative mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <PlayCircleIcon className="w-16 h-16 mx-auto mb-8 text-blue-400" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Stream Without Limits
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Experience seamless video streaming with advanced technology and 
              unparalleled performance. Share your content with the world.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-8 py-4 
                           bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg 
                           overflow-hidden transition-all duration-300 ease-out shadow-lg 
                           hover:shadow-blue-500/40"
                >
                  <span className="relative flex items-center gap-2">
                    Start Streaming
                    <ArrowRightIcon className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div> */}

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/videos"
                  className="group inline-flex items-center justify-center px-8 py-4 
                           border-2 border-gray-600 text-gray-300 rounded-lg 
                           hover:border-gray-500 hover:text-gray-200 transition-all duration-300"
                >
                  Browse Videos
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;