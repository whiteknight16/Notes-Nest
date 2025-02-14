"use client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full text-black bg-white  dark:bg-gray-900 dark:text-white">
      <motion.div
        className="flex items-center space-x-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        <span className="text-2xl font-semibold">Loading...</span>
      </motion.div>
    </div>
  );
};

export default LoadingPage;
