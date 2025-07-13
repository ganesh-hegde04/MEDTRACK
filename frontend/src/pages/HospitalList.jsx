import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MapPin, Phone, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const HospitalCard = ({ hospital, animalName, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-l-4 border-blue-500 dark:border-blue-400 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-900 opacity-10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-100 dark:bg-green-900 opacity-10 rounded-full -ml-12 -mb-12"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex-1">
            <motion.h2 
              className="text-xl font-bold text-gray-900 dark:text-white mb-1"
              whileHover={{ color: "#3b82f6" }}
              transition={{ duration: 0.2 }}
            >
              {hospital.name}
            </motion.h2>
            <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
              <MapPin size={16} className="text-blue-500" />
              {hospital.location}
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <motion.div 
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                {hospital.distance.toFixed(2)} km away
              </motion.div>
              <motion.div 
                className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                {animalName} antivenom available
              </motion.div>
            </div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3"
                >
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Contact:</span> {hospital.contact}
                  </p>
                  {hospital.additionalInfo && (
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      {hospital.additionalInfo}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <motion.a
              href={`https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MapPin size={18} /> Directions
            </motion.a>
            <motion.a
              href={`tel:${hospital.contact}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={18} /> Call Now
            </motion.a>
          </div>
        </div>
        
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          whileHover={{ x: 3 }}
        >
          {isExpanded ? 'Show less' : 'More details'}
        </motion.button>
      </div>
    </motion.div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-6"
      >
        <Loader2 size={48} className="text-blue-500" />
      </motion.div>
      <div className="space-y-4 w-full max-w-md">
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-gray-200 dark:bg-gray-700 h-24 rounded-xl"
          ></motion.div>
        ))}
      </div>
    </div>
  );
};

const ErrorMessage = ({ error }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <AlertCircle size={64} className="text-red-500 mb-4" />
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-gray-600 dark:text-gray-300 max-w-md">
        {error}
      </p>
      <motion.button
        onClick={() => window.location.reload()}
        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Try Again
      </motion.button>
    </motion.div>
  );
};

const NoResultsMessage = ({ animalName }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
          <MapPin size={48} className="text-blue-500 dark:text-blue-400" />
        </div>
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        No hospitals found nearby
      </h2>
      <p className="text-gray-600 dark:text-gray-300 max-w-md mb-6">
        We couldn't find any hospitals with {animalName} antivenom within 100km of your location.
      </p>
      <div className="flex gap-4">
        <motion.a
          href="/"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Go Home
        </motion.a>
        <motion.button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg shadow-md transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function HospitalsPage() {
  const { animalName } = useParams();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  // Assuming you have a theme context

  // Get user's location with better error handling
  useEffect(() => {
    setLoading(true);
    
    const getLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        setLoading(false);
        return;
      }
      
      const timeout = setTimeout(() => {
        setError("Location request timed out. Please ensure location services are enabled.");
        setLoading(false);
      }, 10000); // 10 second timeout
      
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timeout);
          setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        (err) => {
          clearTimeout(timeout);
          setError(`Location access denied (${err.code}): ${err.message}`);
          setLoading(false);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    };
    
    getLocation();
  }, []);

  // Fetch hospitals with antivenom for the animal
  useEffect(() => {
    if (!userLocation) return;

    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8080/api/antivenom/hospitals?animal=${encodeURIComponent(
            animalName
          )}&lat=${userLocation.lat}&lon=${userLocation.lon}`
        );

        const hospitalsWithDistance = res.data
          .map((hospital) => ({
            ...hospital,
            distance: haversineDistance(
              userLocation.lat,
              userLocation.lon,
              hospital.latitude,
              hospital.longitude
            ),
          }))
          .filter((h) => h.distance <= 100)
          .sort((a, b) => a.distance - b.distance);

        setHospitals(hospitalsWithDistance);
      } catch (err) {
        setError("Error fetching hospitals: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [animalName, userLocation]);

  // UI Loading State
  if (loading) {
    return <LoadingSkeleton />;
  }

  // UI Error State
  if (error) {
    return <ErrorMessage error={error} />;
  }

  // No hospitals found
  if (hospitals.length === 0) {
    return <NoResultsMessage animalName={animalName} />;
  }

  // Render hospitals
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-6 py-12 max-w-5xl mx-auto min-h-screen"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Nearby <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">Hospitals</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Showing hospitals with <span className="font-semibold text-blue-600 dark:text-blue-400">{animalName}</span> antivenom
        </p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 mt-4 mx-auto max-w-xs rounded-full"
        />
      </motion.div>

      <motion.div 
        className="flex flex-col gap-8"
        layout
      >
        <AnimatePresence>
          {hospitals.map((hospital, index) => (
            <HospitalCard 
              key={hospital.id} 
              hospital={hospital} 
              animalName={animalName}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm"
      >
        <p>Showing {hospitals.length} hospitals within 100km of your location</p>
        <p className="mt-1">Last updated: {new Date().toLocaleString()}</p>
      </motion.div>
    </motion.div>
  );
}