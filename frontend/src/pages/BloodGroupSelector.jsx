import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiDroplet, FiMapPin, FiSearch, FiGlobe, FiNavigation, FiLoader } from "react-icons/fi";
import { FaHeartbeat, FaChevronLeft } from "react-icons/fa";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Predefined cities with their coordinates
const PREDEFINED_CITIES = [
  { name: "Bangalore", lat: 12.9716, lon: 77.5946, state: "Karnataka" },
  { name: "Mumbai", lat: 19.0760, lon: 72.8777, state: "Maharashtra" },
  { name: "Delhi", lat: 28.7041, lon: 77.1025, state: "Delhi" },
  { name: "Chennai", lat: 13.0827, lon: 80.2707, state: "Tamil Nadu" },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639, state: "West Bengal" },
  { name: "Hyderabad", lat: 17.3850, lon: 78.4867, state: "Telangana" },
  { name: "Pune", lat: 18.5204, lon: 73.8567, state: "Maharashtra" },
  { name: "Ahmedabad", lat: 23.0225, lon: 72.5714, state: "Gujarat" },
  { name: "Jaipur", lat: 26.9124, lon: 75.7873, state: "Rajasthan" },
  { name: "Lucknow", lat: 26.8467, lon: 80.9462, state: "Uttar Pradesh" },
  { name: "Chandigarh", lat: 30.7333, lon: 76.7794, state: "Chandigarh" },
  { name: "Bhopal", lat: 23.2599, lon: 77.4126, state: "Madhya Pradesh" },
  { name: "Guwahati", lat: 26.1445, lon: 91.7362, state: "Assam" },
  { name: "Bhubaneswar", lat: 20.2961, lon: 85.8245, state: "Odisha" },
  { name: "Patna", lat: 25.5941, lon: 85.1376, state: "Bihar" },
  { name: "Thiruvananthapuram", lat: 8.5241, lon: 76.9366, state: "Kerala" },
  { name: "Dehradun", lat: 30.3165, lon: 78.0322, state: "Uttarakhand" },
  { name: "Shimla", lat: 31.1048, lon: 77.1734, state: "Himachal Pradesh" },
  { name: "Ranchi", lat: 23.3441, lon: 85.3096, state: "Jharkhand" },
  { name: "Raipur", lat: 21.2514, lon: 81.6296, state: "Chhattisgarh" },
];

// Haversine distance calculation function
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

const ManualLocationModal = ({ bloodGroup, onClose, onSelectCity }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState(PREDEFINED_CITIES);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCities(PREDEFINED_CITIES);
    } else {
      const filtered = PREDEFINED_CITIES.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchQuery]);

  const handleSelectCity = (city) => {
    onSelectCity(city);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaHeartbeat className="text-2xl" />
              <h2 className="text-2xl font-bold">Select Your Location</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="mt-2 opacity-90">
            Choose your city to find blood banks with <span className="font-semibold">{bloodGroup}</span> blood group
          </p>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your city or state..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto p-2">
            <AnimatePresence>
              {filteredCities.length > 0 ? (
                filteredCities.map((city, index) => (
                  <motion.button
                    key={`${city.name}-${city.state}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => handleSelectCity(city)}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-red-300 transition-all duration-200 text-left group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-red-600">
                          {city.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {city.state}
                        </p>
                      </div>
                      <div className="p-2 bg-red-100 rounded-lg">
                        <FiMapPin size={16} className="text-red-600" />
                      </div>
                    </div>
                  </motion.button>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiSearch size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No cities found
                  </h3>
                  <p className="text-gray-500">
                    Try searching with a different term
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="p-2 bg-red-50 rounded-lg">
                <FiDroplet className="text-red-500" />
              </div>
              <p>
                <span className="font-semibold">Note:</span> Your location helps us show the nearest blood banks for faster access during emergencies.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LocationPermissionModal = ({ 
  bloodGroup, 
  onGrantPermission, 
  onUseManual, 
  isLoading, 
  onClose 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
      >
        <div className="p-8">
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <FaHeartbeat size={64} className="text-red-500" />
              <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30"></div>
            </div>
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Location Access Required
          </h2>
          
          <p className="text-gray-600 mb-6 text-center">
            To find blood banks with <span className="font-semibold text-red-600">{bloodGroup}</span> blood group near you, 
            we need your location permission.
          </p>
          
          <div className="space-y-3">
            <motion.button
              onClick={onGrantPermission}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <FiLoader size={20} className="animate-spin" />
                  Requesting Permission...
                </>
              ) : (
                <>
                  <FiNavigation size={20} />
                  Allow Location Access
                </>
              )}
            </motion.button>
            
            <motion.button
              onClick={onUseManual}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 rounded-xl shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiGlobe size={20} />
              Enter Location Manually
            </motion.button>
            
            <button
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Why location access?
            </h3>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Shows blood banks closest to you for immediate help</li>
              <li>• Provides accurate distance and travel time</li>
              <li>• Emergency situations require immediate location</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function BloodGroupSelectionPage() {
  const navigate = useNavigate();
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  const handleBloodGroupSelect = (group) => {
    setSelectedBloodGroup(group);
    setShowLocationModal(true);
  };

  const handleGrantPermission = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setShowLocationModal(false);
      return;
    }

    setIsRequestingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsRequestingLocation(false);
        setShowLocationModal(false);
        const location = { 
          lat: pos.coords.latitude, 
          lon: pos.coords.longitude 
        };
        // Store location and navigate
        localStorage.setItem('lastLocation', JSON.stringify(location));
        localStorage.setItem('locationSource', 'gps');
        navigate(`/bloodbank/${selectedBloodGroup}?lat=${location.lat}&lon=${location.lon}`);
      },
      (err) => {
        setIsRequestingLocation(false);
        let errorMessage = "Location access denied. ";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += "Please enable location permissions in your browser settings or use manual location.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
        }
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 8000
      }
    );
  };

  const handleManualLocation = () => {
    setShowLocationModal(false);
    setShowManualLocation(true);
  };

  const handleSelectCity = (city) => {
    // Store location and navigate
    localStorage.setItem('lastLocation', JSON.stringify({ lat: city.lat, lon: city.lon }));
    localStorage.setItem('locationSource', 'manual');
    navigate(`/bloodbank/${selectedBloodGroup}?lat=${city.lat}&lon=${city.lon}`);
  };

  const closeLocationModal = () => {
    setShowLocationModal(false);
    setSelectedBloodGroup(null);
  };

  const closeManualModal = () => {
    setShowManualLocation(false);
    setSelectedBloodGroup(null);
  };

  return (
    <>
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
                  onClick={() => handleBloodGroupSelect(group)}
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

      {/* Location Permission Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <LocationPermissionModal
            bloodGroup={selectedBloodGroup}
            onGrantPermission={handleGrantPermission}
            onUseManual={handleManualLocation}
            isLoading={isRequestingLocation}
            onClose={closeLocationModal}
          />
        )}
      </AnimatePresence>

      {/* Manual Location Selection Modal */}
      <AnimatePresence>
        {showManualLocation && (
          <ManualLocationModal
            bloodGroup={selectedBloodGroup}
            onClose={closeManualModal}
            onSelectCity={handleSelectCity}
          />
        )}
      </AnimatePresence>
    </>
  );
}