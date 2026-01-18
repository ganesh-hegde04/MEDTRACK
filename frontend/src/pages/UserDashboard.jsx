import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const UserDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pulse, setPulse] = useState(false);
  const navigate = useNavigate();

  const userToken = localStorage.getItem("userToken");
  const userPhone = localStorage.getItem("userPhone");

  useEffect(() => {
    if (!userToken || !userPhone) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    Promise.all([
      fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${userPhone}/appointments`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      ),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([res]) => res.json())
      .then((data) => {
        setAppointments(data.appointments || []);
        setNotifications(data.notifications || []);
      })
      .catch((err) => console.error("Failed to fetch user data:", err))
      .finally(() => {
        setIsLoading(false);
        setPulse(true);
      });
  }, [userToken, userPhone, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userPhone");
    navigate("/");
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/appointments/cancel/${appointmentId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      if (res.ok) {
        setAppointments((prev) =>
          prev.filter((a) => a.appointmentId !== appointmentId)
        );
        setNotifications((prev) => [
          {
            message: "Appointment cancelled successfully",
            type: "success",
            id: Date.now(),
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-20 h-20 border-4 border-teal-400 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white"
          >
            Loading Your Health Data
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-blue-200 mt-2"
          >
            Securely accessing your medical records...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 p-4 md:p-8 relative overflow-hidden">
      {/* Heart Pulse Background Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: -100,
              x: Math.random() * window.innerWidth,
              opacity: 0,
              scale: 0.5
            }}
            animate={{
              y: window.innerHeight + 100,
              opacity: [0, 0.3, 0],
              scale: [0.5, 1.2, 0.8]
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
            className="absolute text-pink-400"
            style={{
              fontSize: `${20 + Math.random() * 30}px`,
              left: `${Math.random() * 100}%`,
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      {/* Pulse Animation */}
      <AnimatePresence>
        {pulse && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 40, opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 w-4 h-4 bg-pink-500 rounded-full pointer-events-none"
              style={{ originX: 0.5, originY: 0.5 }}
              onAnimationComplete={() => setPulse(false)}
            />
            <motion.div
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: 30, opacity: 0 }}
              transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }}
              className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full pointer-events-none"
              style={{ originX: 0.5, originY: 0.5 }}
            />
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto relative z-10"
      >
        {/* Logout Button - Top Right */}
        <div className="flex justify-end mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-full font-semibold shadow-md hover:bg-red-700 transition-all flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Expanded to take more space */}
          <div className="lg:col-span-2 space-y-8">
            {/* Appointments - Enhanced Design */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white border-opacity-10 hover:border-opacity-20 transition-all"
            >
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 relative overflow-hidden">
                <motion.div 
                  animate={{ 
                    x: [0, 100, 0],
                    opacity: [0.1, 0.3, 0.1]
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full text-blue-500 opacity-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </motion.div>
                <div className="flex justify-between items-center relative z-10">
                  <h2 className="text-2xl font-semibold text-white flex items-center">
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="inline-block mr-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </motion.span>
                    Your Appointments
                  </h2>
                  
                  {/* New Appointment Button - Top Right */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/appointment")}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    New Appointment
                  </motion.button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-32 h-32 mx-auto mb-6 relative"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-full w-full text-blue-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </motion.div>
                    <h3 className="text-xl text-white mb-2">No Appointments Scheduled</h3>
                    <p className="text-blue-200 mb-6">
                      You don't have any upcoming medical appointments
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/appointment")}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      Schedule New Appointment
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-5">
                      {appointments.map((appointment) => (
                        <motion.div
                          key={appointment.appointmentId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          whileHover={{ y: -5 }}
                          className="flex justify-between items-center bg-white bg-opacity-10 rounded-xl p-5 border border-white border-opacity-10 hover:border-opacity-20 transition-all relative overflow-hidden"
                        >
                          {/* Status indicator */}
                          <div className={`absolute top-0 left-0 h-full w-1 ${
                            appointment.status === "CONFIRMED" 
                              ? "bg-green-500" 
                              : appointment.status === "CANCELLED" 
                                ? "bg-red-500" 
                                : "bg-gray-500"
                          }`} />
                          
                          <div className="flex items-center space-x-4 pl-4">
                            <motion.div 
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 3, repeat: Infinity }}
                              className="bg-blue-800 bg-opacity-50 p-3 rounded-xl"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-blue-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </motion.div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {appointment.doctorName}
                              </h3>
                              <p className="text-blue-200">{appointment.hospitalName}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-3 py-1 bg-blue-900 bg-opacity-50 text-blue-100 rounded-full text-sm flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  {appointment.date}
                                </span>
                                <span className="px-3 py-1 bg-blue-900 bg-opacity-50 text-blue-100 rounded-full text-sm flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  {appointment.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          {appointment.status === "CONFIRMED" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => cancelAppointment(appointment.appointmentId)}
                              className="px-5 py-2 bg-red-900 bg-opacity-50 text-red-200 rounded-lg hover:bg-opacity-70 transition-all flex items-center justify-center border border-red-800"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1"
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
                              Cancel
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* New Appointment Button - Bottom (for when appointments exist) */}
                    <div className="pt-6 border-t border-white border-opacity-10 mt-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/appointment")}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Book Another Appointment
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.section>
          </div>

          {/* Sidebar - Enhanced Design */}
          <div className="space-y-8">
            {/* Notifications - Enhanced Design */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white border-opacity-10 hover:border-opacity-20 transition-all"
            >
              <div className="bg-gradient-to-r from-green-700 to-emerald-800 p-6 relative overflow-hidden">
                <motion.div 
                  animate={{ 
                    x: [0, 100, 0],
                    opacity: [0.1, 0.3, 0.1]
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full text-green-500 opacity-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </motion.div>
                <h2 className="text-2xl font-semibold text-white flex items-center relative z-10">
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-block mr-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </motion.span>
                  Notifications
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-32 h-32 mx-auto mb-6 relative"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-full w-full text-green-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </motion.div>
                    <h3 className="text-xl text-white mb-2">No Notifications</h3>
                    <p className="text-green-200">
                      You don't have any notifications yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-4 rounded-lg ${
                          notification.type === "success"
                            ? "bg-green-900 bg-opacity-50 border-green-700"
                            : "bg-blue-900 bg-opacity-50 border-blue-700"
                        } border border-opacity-30`}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full mr-3 ${
                            notification.type === "success"
                              ? "bg-green-700 bg-opacity-70"
                              : "bg-blue-700 bg-opacity-70"
                          }`}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-white">{notification.message}</p>
                            <p className="text-xs text-green-200 mt-1">
                              {new Date(notification.id).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.section>

            {/* Medical Records - Enhanced Design */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, type: "spring" }}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white border-opacity-10 hover:border-opacity-20 transition-all"
            >
              <div className="bg-gradient-to-r from-indigo-700 to-blue-800 p-6 relative overflow-hidden">
                <motion.div 
                  animate={{ 
                    x: [0, 100, 0],
                    opacity: [0.1, 0.3, 0.1]
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full text-indigo-500 opacity-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </motion.div>
                <h2 className="text-2xl font-semibold text-white flex items-center relative z-10">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-block mr-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </motion.span>
                  Medical Records
                </h2>
              </div>
              <div className="p-6 text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-32 h-32 mx-auto mb-6 relative"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full text-indigo-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  className="text-blue-200 mb-6"
                >
                  View and manage your past health records securely.
                </motion.p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/records")}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Access Records
                </motion.button>
              </div>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;