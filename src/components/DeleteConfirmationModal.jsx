import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, videoTitle }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl"
        >
          {/* Warning Icon */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-500/10 p-3 rounded-full">
              <FiAlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          {/* Content */}
          <h3 className="text-xl font-semibold text-center mb-2">
            Delete Video?
          </h3>
          <p className="text-gray-400 text-center mb-6">
            Are you sure you want to delete "{videoTitle}"? This action cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-600
                       hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600
                       transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal; 