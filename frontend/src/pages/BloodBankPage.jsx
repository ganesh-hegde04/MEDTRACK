import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiPhone, FiDroplet, FiLoader, FiAlertCircle } from "react-icons/fi";

function haversineDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }

  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function BloodBankPage() {
  const { group } = useParams();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (err) => {
        setError("Failed to get your location: " + err.message);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    setLoading(true);

    axios
      .get(
        `http://localhost:8080/api/bloodbanks/hospitals?group=${encodeURIComponent(
          group
        )}&lat=${userLocation.lat}&lon=${userLocation.lon}`
      )
      .then((res) => {
        const hospitalsWithDistance = res.data.map((hospital) => {
          const distance = haversineDistance(
            userLocation.lat,
            userLocation.lon,
            hospital.latitude,
            hospital.longitude
          );
          return { ...hospital, distance };
        });

        const filteredHospitals = hospitalsWithDistance
          .filter((h) => h.distance <= 100)
          .sort((a, b) => a.distance - b.distance);

        setHospitals(filteredHospitals);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching hospitals: " + err.message);
        setLoading(false);
      });
  }, [group, userLocation]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="mb-4"
        >
          <FiLoader className="text-4xl text-blue-600" />
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-semibold text-gray-700"
        >
          Searching for {group} blood banks...
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 mt-2"
        >
          Please wait while we find the nearest locations
        </motion.p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-white p-6 text-center"
      >
        <FiAlertCircle className="text-5xl text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
        <p className="text-gray-700 max-w-md">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all"
          onClick={() => window.location.reload()}
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  if (hospitals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 text-center"
      >
        <FiDroplet className="text-5xl text-blue-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          No {group} blood banks found within 100 km
        </h2>
        <p className="text-gray-600 max-w-md mb-6">
          We couldn't find any hospitals with {group} blood group in your area.
          Please try another blood group or expand your search radius.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
          onClick={() => window.history.back()}
        >
          Go Back
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 sm:px-6"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center bg-blue-100 rounded-full p-3 mb-4">
            <FiDroplet className="text-3xl text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            {group} Blood Banks Nearby
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Found {hospitals.length} hospital{hospitals.length !== 1 ? "s" : ""}{" "}
            with {group} blood group within 100 km
          </p>
        </motion.div>

        <div className="grid gap-6">
          <AnimatePresence>
            {hospitals.map((hospital, index) => (
              <motion.div
                key={hospital.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="bg-red-100 p-3 rounded-lg">
                          <FiDroplet className="text-2xl text-red-500" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">
                            {hospital.name}
                          </h2>
                          <div className="flex items-center text-gray-600 mt-1">
                            <FiMapPin className="mr-1" />
                            <span>{hospital.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center">
                          <span className="w-24 text-gray-500">Distance:</span>
                          <span className="font-medium">
                            {hospital.distance.toFixed(2)} km
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-gray-500">Contact:</span>
                          <span className="font-medium">{hospital.contact}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:w-40">
                      <motion.a
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        href={`https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
                      >
                        <FiMapPin />
                        View Map
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        href={`tel:${hospital.contact}`}
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all"
                      >
                        <FiPhone />
                        Call Now
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}