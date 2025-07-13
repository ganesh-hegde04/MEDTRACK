import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Hospital, Lock, PlusCircle, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
         {/* Decorative header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center relative">
            <motion.div
              animate={{
                y: [25, 25, 25],
                rotate: [0, 0, -0, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg"
            >
              <Hospital size={32} className="text-blue-600 dark:text-blue-400" />
            </motion.div>
            <motion.h1
              className="text-3xl font-bold text-white mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Hospital Admin Portal
            </motion.h1>
            <motion.p
              className="text-blue-100 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Secure access to your management dashboard
            </motion.p>
          </div>

          {/* Buttons container */}
          <motion.div
            className="p-8 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={() => navigate("/admin/register")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <PlusCircle size={24} />
              <span>New Hospital? Register</span>
              <ArrowRight size={20} className="ml-auto" />
            </motion.button>

            <motion.button
              onClick={() => navigate("/admin/login")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <Lock size={24} />
              <span>Already Registered? Sign In</span>
              <ArrowRight size={20} className="ml-auto" />
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="px-8 pb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <a
              href="/"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1"
            >
              Back to main site <ArrowRight size={14} />
            </a>
          </motion.div>
        </motion.div>

        {/* Branding footer */}
        <motion.div
          className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p>Hospital Management System v2.0</p>
          <p className="mt-1">© {new Date().getFullYear()} All rights reserved</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}