import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
      {/* Icon */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <ExclamationTriangleIcon className="w-14 h-14 text-yellow-400 mb-4" />
      </motion.div>

      {/* 404 Text */}
      <h1 className="text-5xl font-bold text-gray-200">404 - Not Found</h1>
      <p className="text-gray-400 mt-2">The page you’re looking for doesn’t exist.</p>

      {/* Button */}
      <motion.div className="mt-6" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
