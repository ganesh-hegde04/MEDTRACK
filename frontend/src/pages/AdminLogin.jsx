import { motion } from "framer-motion";
import { Lock, User, ArrowRight } from "lucide-react";
import LoginForm from "../components/LoginForm";

export default function AdminLogin() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Decorative header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block mb-4"
            >
              <Lock size={48} className="text-white" />
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Hospital Admin Portal
            </motion.h2>
            <motion.p 
              className="text-blue-100 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Secure access to your management dashboard
            </motion.p>
          </div>

          {/* Form container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-8"
          >
            <LoginForm />
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="px-8 pb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <a 
              href="/forgot-password" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1"
            >
              Forgot password? <ArrowRight size={14} />
            </a>
          </motion.div>
        </motion.div>

        {/* Branding footer */}
        <motion.div
          className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>Hospital Management System v2.0</p>
          <p className="mt-1">© {new Date().getFullYear()} All rights reserved</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}