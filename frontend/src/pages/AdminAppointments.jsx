import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosAlert, IoIosCalendar, IoIosSearch, IoIosClose, IoIosCheckmarkCircle } from "react-icons/io";
import { FaUserInjured, FaUserMd, FaClock, FaPhoneAlt } from "react-icons/fa";
import { HiOutlineClipboardCheck } from "react-icons/hi";

export default function AdminAppointments() {
  const [hospitalId, setHospitalId] = useState("");
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "pending", "checked"

  const showNotification = (message, isSuccess) => {
    setNotification({ message, isSuccess });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchAppointments = async () => {
    if (!hospitalId || !department || !date) {
      showNotification("Please fill all fields", false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/appointments/filter?hospitalId=${hospitalId}&department=${department}&date=${date}`
      );

      if (res.ok) {
        const data = await res.json();

        // Sort by time ascending 
        const sorted = data.sort(
          (a, b) =>
            new Date(`1970-01-01T${a.appointmentTime}`) -
            new Date(`1970-01-01T${b.appointmentTime}`)
        );

        setAppointments(sorted);
        setFilteredAppointments(sorted);
        showNotification(`${sorted.length} appointments loaded`, true);
      } else {
        const text = await res.text();
        showNotification(`Failed to fetch: ${text}`, false);
      }
    } catch (err) {
      console.error(err);
      showNotification("Network error", false);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId, patientName) => {
    if (!window.confirm(`Cancel appointment for ${patientName}?`)) return;
    
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/appointments/cancel-by-hospital/${appointmentId}?reason=Doctor%20is%20unavailable`,
        {
          method: "POST"
        }
      );

      if (res.ok) {
        showNotification("Appointment cancelled successfully", true);
        const updatedAppointments = appointments.filter((a) => a.appointmentId !== appointmentId);
        setAppointments(updatedAppointments);
        setFilteredAppointments(updatedAppointments);
      } else {
        const text = await res.text();
        showNotification(`Cancel failed: ${text}`, false);
      }
    } catch (err) {
      console.error(err);
      showNotification("Network error", false);
    }
  };

  const markChecked = async (appointmentId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/appointments/mark-checked/${appointmentId}`,
        {
          method: "PUT"
        }
      );

      if (res.ok) {
        const updatedAppointments = appointments.map((appt) =>
          appt.appointmentId === appointmentId
            ? { ...appt, checked: true }
            : appt
        );
        
        setAppointments(updatedAppointments);
        setFilteredAppointments(updatedAppointments);
        showNotification("Patient marked as checked ✅", true);
      } else {
        const text = await res.text();
        showNotification(`Check failed: ${text}`, false);
      }
    } catch (err) {
      console.error(err);
      showNotification("Network error", false);
    }
  };

  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    if (filter === "all") {
      setFilteredAppointments(appointments);
    } else if (filter === "pending") {
      setFilteredAppointments(appointments.filter(a => !a.checked));
    } else if (filter === "checked") {
      setFilteredAppointments(appointments.filter(a => a.checked));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 p-4 md:p-6">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-transparent to-indigo-50/10 dark:from-blue-900/5 dark:to-indigo-900/5" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    y: [0, -3, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity 
                  }}
                  className="relative"
                >
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <IoIosCalendar className="text-white text-2xl" />
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Appointment Management</h1>
                  <p className="text-indigo-100 mt-1 text-sm md:text-base">View and manage scheduled appointments</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Filters */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <IoIosSearch /> Search Filters
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hospital ID
                  </label>
                  <input
                    type="text"
                    placeholder="Enter hospital identifier"
                    value={hospitalId}
                    onChange={(e) => setHospitalId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Cardiology, Neurology"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <motion.button
                  onClick={fetchAppointments}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <IoIosSearch />
                      Fetch Appointments
                    </>
                  )}
                </motion.button>
              </div>

              {/* Status Filter */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Filter by Status</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "All", color: "gray" },
                    { id: "pending", label: "Pending", color: "amber" },
                    { id: "checked", label: "Checked", color: "emerald" }
                  ].map((filter) => (
                    <motion.button
                      key={filter.id}
                      onClick={() => handleFilterChange(filter.id)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        statusFilter === filter.id
                          ? `bg-${filter.color}-100 dark:bg-${filter.color}-900/30 text-${filter.color}-700 dark:text-${filter.color}-300 border border-${filter.color}-200 dark:border-${filter.color}-800`
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      {filter.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl">
                <h4 className="font-medium text-gray-800 dark:text-white mb-3">Today's Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{appointments.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {appointments.filter(a => !a.checked).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {appointments.filter(a => a.checked).length}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Appointments List */}
          <div className="lg:col-span-2">
            <AnimatePresence>
              {appointments.length === 0 ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 md:p-12 text-center"
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mb-6">
                    <IoIosCalendar className="text-gray-500 dark:text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Appointments</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Enter search criteria and click "Fetch Appointments" to view scheduled appointments
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <IoIosAlert className="text-amber-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">All fields are required</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="appointments-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        Scheduled Appointments
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Showing {filteredAppointments.length} of {appointments.length} appointments
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Sorted by time
                    </div>
                  </div>

                  {/* Appointments Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredAppointments.map((appt) => (
                      <motion.div
                        key={appt.appointmentId}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${
                          appt.checked 
                            ? 'border-emerald-200 dark:border-emerald-800/50' 
                            : 'border-gray-200 dark:border-gray-700'
                        } overflow-hidden group`}
                      >
                        {/* Appointment Header */}
                        <div className={`p-4 ${
                          appt.checked 
                            ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-b border-emerald-100 dark:border-emerald-800/30' 
                            : 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                appt.checked 
                                  ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                                  : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                              }`}>
                                <FaUserMd className="text-white text-sm" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800 dark:text-white">
                                  {appt.doctorName}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {appt.department}
                                </div>
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              appt.checked 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' 
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                            }`}>
                              {appt.checked ? 'Checked' : 'Pending'}
                            </div>
                          </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="p-4">
                          <div className="space-y-4">
                            {/* Patient Info */}
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                <FaUserInjured className="text-white text-xs" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-800 dark:text-white">
                                  {appt.patientName}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  ID: {appt.appointmentId}
                                </div>
                              </div>
                            </div>

                            {/* Time Slot */}
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                                <FaClock className="text-white text-xs" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-800 dark:text-white">
                                  {appt.appointmentTime}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Appointment Time
                                </div>
                              </div>
                            </div>

                            {/* Contact */}
                            {appt.phoneNumber && (
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                  <FaPhoneAlt className="text-white text-xs" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800 dark:text-white">
                                    {appt.phoneNumber}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Contact Number
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                              {!appt.checked ? (
                                <>
                                  <motion.button
                                    onClick={() => markChecked(appt.appointmentId)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-medium rounded-lg transition-all duration-300"
                                  >
                                    <IoIosCheckmarkCircle />
                                    Mark Checked
                                  </motion.button>
                                  <motion.button
                                    onClick={() => cancelAppointment(appt.appointmentId, appt.patientName)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-medium rounded-lg transition-all duration-300"
                                  >
                                    <IoIosClose />
                                    Cancel
                                  </motion.button>
                                </>
                              ) : (
                                <div className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg font-medium flex items-center justify-center gap-2">
                                  <HiOutlineClipboardCheck />
                                  Appointment Completed
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg ${
              notification.isSuccess 
                ? "bg-gradient-to-r from-emerald-500 to-green-600" 
                : "bg-gradient-to-r from-rose-500 to-pink-600"
            } text-white max-w-md backdrop-blur-sm border border-white/20`}>
              <div className={`w-2 h-2 rounded-full ${notification.isSuccess ? 'bg-white' : 'bg-white'} animate-pulse`} />
              <span className="font-medium">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}