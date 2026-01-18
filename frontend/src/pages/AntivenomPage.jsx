import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiArrowRight, FiLoader } from "react-icons/fi";

export default function AntivenomPage() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/antivenom/animals`);
        setAnimals(res.data);
      } catch (err) {
        console.error("Error fetching animals:", err);
        setError("Failed to load venomous animals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Add slight delay to show loading animation
    const timer = setTimeout(() => {
      fetchData();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow"
        >
          <div className="w-full h-52 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="p-5 space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-10"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="mb-6"
        >
          <FiLoader className="text-4xl text-blue-500 dark:text-blue-400" />
        </motion.div>
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-medium text-gray-700 dark:text-gray-300 text-center"
        >
          Loading venomous animals...
        </motion.h1>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-10"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md text-center"
        >
          <div className="flex justify-center mb-4">
            <FiAlertCircle className="text-5xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            Error Loading Data
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setLoading(true);
              setError(null);
              axios
                .get(`${import.meta.env.VITE_BACKEND_URL}/api/antivenom/animals`)
                .then((res) => {
                  setAnimals(res.data);
                  setLoading(false);
                })
                .catch((err) => {
                  console.error("Error fetching animals:", err);
                  setLoading(false);
                });
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
          >
            Retry
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  if (animals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-10"
      >
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            No Venomous Animals Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We couldn't find any venomous animals in our database.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
          >
            Return Home
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 px-4 py-10"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Select the Animal That Bit You
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find hospitals with the right antivenom for your specific situation
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {animals.map((animal, i) => {
            const validPhoto =
              animal.photoUrl?.startsWith("http") && animal.photoUrl.length > 10
                ? animal.photoUrl
                : "https://via.placeholder.com/300x200?text=No+Image";

            return (
              <motion.div
                key={animal.id}
                custom={i}
                variants={cardVariants}
                whileHover="hover"
                onClick={() => setSelectedAnimal(animal)}
                className="group cursor-pointer"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700 h-full">
                  <div className="relative overflow-hidden h-60">
                    <motion.img
                      src={validPhoto}
                      alt={animal.name || "Animal"}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <motion.span
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white text-sm font-medium"
                      >
                        Click for details
                      </motion.span>
                    </div>
                  </div>

                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 line-clamp-2">
                      {animal.name}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/hospitals/${encodeURIComponent(animal.name)}`);
                      }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-6 rounded-full transition-all duration-300 shadow hover:shadow-md flex items-center justify-center space-x-2"
                    >
                      <span>Find Hospitals</span>
                      <FiArrowRight className="inline" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Animal Detail Modal */}
      <AnimatePresence>
        {selectedAnimal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAnimal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 w-full">
                <img
                  src={
                    selectedAnimal.photoUrl?.startsWith("http") &&
                    selectedAnimal.photoUrl.length > 10
                      ? selectedAnimal.photoUrl
                      : "https://via.placeholder.com/800x400?text=No+Image"
                  }
                  alt={selectedAnimal.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/800x400?text=No+Image";
                  }}
                />
                <button
                  onClick={() => setSelectedAnimal(null)}
                  className="absolute top-4 right-4 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 rounded-full p-2 shadow transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-800 dark:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  {selectedAnimal.name}
                </h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Antivenom Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedAnimal.antivenomInfo || "No specific antivenom information available."}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    First Aid Tips
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedAnimal.firstAidTips || "No specific first aid tips available. Seek medical attention immediately."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedAnimal(null);
                      navigate(`/hospitals/${encodeURIComponent(selectedAnimal.name)}`);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-6 rounded-full transition-all duration-300 shadow hover:shadow-md flex items-center justify-center space-x-2"
                  >
                    <span>Find Hospitals with Antivenom</span>
                    <FiArrowRight className="inline" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedAnimal(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 px-6 rounded-full transition-colors duration-300"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}