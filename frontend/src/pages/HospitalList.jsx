import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, AlertCircle, Loader2, Navigation, Globe, Search, ChevronLeft } from "lucide-react";
import axios from "axios";

// Environment variable for Vite
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

const LocationPermissionPrompt = ({ onGrantPermission, onUseManual, isLoading, animalName }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-6"
    >
      <div className="max-w-md w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-8">
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <AlertCircle size={72} className="text-blue-500" />
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30"></div>
          </div>
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Find Hospitals Nearby
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          To find hospitals with <span className="font-semibold">{decodeURIComponent(animalName)}</span> antivenom near you, 
          we need your location permission.
        </p>
        
        <div className="space-y-4">
          <motion.button
            onClick={onGrantPermission}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Requesting Permission...
              </>
            ) : (
              <>
                <Navigation size={20} />
                Allow Location Access
              </>
            )}
          </motion.button>
          
          <motion.button
            onClick={onUseManual}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-800 dark:text-white rounded-xl shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Globe size={20} />
            Enter Location Manually
          </motion.button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Why location access?
          </h3>
          <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <li>• Shows hospitals closest to you for faster treatment</li>
            <li>• Provides accurate distance and travel time</li>
            <li>• Emergency situations require immediate location</li>
            <li>• Ensures antivenom availability in your area</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

const ErrorMessage = ({ error, onRetry, onManual, animalName }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-6"
    >
      <div className="max-w-md w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-8">
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex justify-center mb-6"
        >
          <AlertCircle size={72} className="text-red-500" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Location Error
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          {error}
        </p>
        
        <div className="space-y-4">
          <motion.button
            onClick={onRetry}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Retry Location Access
          </motion.button>
          
          <motion.button
            onClick={onManual}
            className="w-full px-6 py-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-800 dark:text-white rounded-xl shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Enter Location Manually
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const NoResultsMessage = ({ animalName, onRetry }) => {
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
          onClick={onRetry}
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

const ManualLocation = ({ animalName, onSelectLocation, onBack }) => {
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
    onSelectLocation({ lat: city.lat, lon: city.lon });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-6 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mb-8"
          whileHover={{ x: -5 }}
        >
          <ChevronLeft size={20} />
          Back
        </motion.button>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">Location</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Choose your city to find hospitals with <span className="font-semibold">{animalName}</span> antivenom nearby
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your city or state..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 text-left group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {city.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {city.state}
                        </p>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg"
                      >
                        <MapPin size={16} className="text-blue-600 dark:text-blue-400" />
                      </motion.div>
                    </div>
                  </motion.button>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No cities found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Try searching with a different term
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-blue-900 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <AlertCircle size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Emergency Tip
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                In case of an emergency, always choose the nearest hospital first. 
                If antivenom is not available, they can arrange for transportation to a facility that has it.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function HospitalList() {
  const { animalName } = useParams();
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(true);
  const [showManualLocation, setShowManualLocation] = useState(false);

  // Initialize - Don't request location automatically
  useEffect(() => {
    // Check if we have cached location permission
    const hasLocationPermission = localStorage.getItem('hasLocationPermission') === 'true';
    
    if (hasLocationPermission) {
      // If previously granted, try to get location
      getUserLocation();
    } else {
      // Show permission prompt
      setShowPermissionPrompt(true);
      setLoading(false);
    }
  }, []);

  // Get user's location with explicit permission
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    setShowPermissionPrompt(false);
    setIsRequestingLocation(true);
    setError(null);
    
    const timeout = setTimeout(() => {
      setIsRequestingLocation(false);
      setError("Location request timed out. Please try again.");
    }, 10000); // 10 second timeout

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timeout);
        setIsRequestingLocation(false);
        const location = { 
          lat: pos.coords.latitude, 
          lon: pos.coords.longitude 
        };
        setUserLocation(location);
        setPermissionRequested(true);
        localStorage.setItem('hasLocationPermission', 'true');
        localStorage.setItem('lastLocation', JSON.stringify(location));
      },
      (err) => {
        clearTimeout(timeout);
        setIsRequestingLocation(false);
        setPermissionRequested(true);
        
        let errorMessage = "Location access denied. ";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += "Please enable location permissions in your browser settings.";
            localStorage.setItem('hasLocationPermission', 'false');
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage += "Location request timed out. Please try again.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
        }
        setError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000, // 30 seconds
        timeout: 8000 // 8 seconds
      }
    );
  };

  // Handle manual location selection
  const handleManualLocationSelect = (location) => {
    setUserLocation(location);
    setShowManualLocation(false);
    setPermissionRequested(true);
    localStorage.setItem('hasLocationPermission', 'true');
    localStorage.setItem('lastLocation', JSON.stringify(location));
    localStorage.setItem('isManualLocation', 'true');
  };

  // Show manual location selector
  const showManualLocationSelector = () => {
    setShowPermissionPrompt(false);
    setShowManualLocation(true);
    setError(null);
  };

  // Go back from manual location
  const handleBackFromManual = () => {
    setShowManualLocation(false);
    setShowPermissionPrompt(true);
  };

  // Fetch hospitals when location is available
  useEffect(() => {
    if (!userLocation) return;

    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BACKEND_URL}/api/antivenom/hospitals?animal=${encodeURIComponent(
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

  const handleRetry = () => {
    setError(null);
    getUserLocation();
  };

  // Show manual location selection
  if (showManualLocation) {
    return (
      <ManualLocation 
        animalName={animalName}
        onSelectLocation={handleManualLocationSelect}
        onBack={handleBackFromManual}
      />
    );
  }

  // Show permission prompt
  if (showPermissionPrompt && !permissionRequested && !userLocation) {
    return (
      <LocationPermissionPrompt 
        onGrantPermission={getUserLocation}
        onUseManual={showManualLocationSelector}
        isLoading={isRequestingLocation}
        animalName={animalName}
      />
    );
  }

  // UI Loading State
  if (loading || isRequestingLocation) {
    return <LoadingSkeleton />;
  }

  // UI Error State
  if (error) {
    return (
      <ErrorMessage 
        error={error} 
        onRetry={handleRetry}
        onManual={showManualLocationSelector}
        animalName={animalName}
      />
    );
  }

  // No hospitals found
  if (hospitals.length === 0 && userLocation) {
    return (
      <NoResultsMessage 
        animalName={animalName} 
        onRetry={() => {
          setError(null);
          getUserLocation();
        }}
      />
    );
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
        <div className="flex items-center justify-center gap-3 mb-3">
          {localStorage.getItem('isManualLocation') === 'true' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
            >
              Manual Location
            </motion.div>
          )}
        </div>
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