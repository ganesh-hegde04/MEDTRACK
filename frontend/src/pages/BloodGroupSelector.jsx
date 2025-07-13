import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiDroplet } from "react-icons/fi";
import { FaHeartbeat } from "react-icons/fa";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.5,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0px 5px 15px rgba(220, 38, 38, 0.4)",
    transition: {
      duration: 0.3,
      yoyo: Infinity,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.95,
  },
};

export default function BloodGroupSelectionPage() {
  const navigate = useNavigate();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-50 via-white to-red-50 px-4 py-12"
    >
      <motion.section
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-red-200 rounded-full opacity-20"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-10">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-4"
            >
              <FaHeartbeat className="text-5xl text-red-600" />
            </motion.div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center tracking-tight">
              Find Blood Banks
            </h1>
            <p className="text-gray-600 text-center max-w-md">
              Select your blood group to find nearby blood banks with available stock
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {bloodGroups.map((group) => (
              <motion.button
                key={group}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => navigate(`/bloodbank/${group}`)}
                className={`flex flex-col items-center justify-center rounded-xl py-4 px-2 font-bold text-white text-xl shadow-md
                            transition-all duration-300 relative overflow-hidden group
                            ${group.includes('+') ? 'bg-gradient-to-br from-red-600 to-red-500' : 'bg-gradient-to-br from-red-700 to-red-600'}`}
                aria-label={`Select blood group ${group}`}
                type="button"
              >
                {/* Animated droplet icon */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-1"
                >
                  <FiDroplet className="text-2xl" />
                </motion.div>
                {group}
                
                {/* Ripple effect background */}
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              </motion.button>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-sm text-gray-500"
          >
            <p>Your selection could help save a life today</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Floating droplets decoration */}
      <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-red-200 opacity-30"></div>
      <div className="absolute top-1/4 right-20 w-6 h-6 rounded-full bg-red-300 opacity-40"></div>
      <div className="absolute bottom-20 left-1/4 w-10 h-10 rounded-full bg-red-100 opacity-20"></div>
      <div className="absolute bottom-1/3 right-10 w-12 h-12 rounded-full bg-red-200 opacity-30"></div>
    </motion.main>
  );
}