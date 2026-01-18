import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSave, FaHospital, FaFlask, FaTint, FaCalendarAlt, FaFileMedical, FaDatabase, FaUserMd, FaBriefcaseMedical, FaGraduationCap, FaBuilding, FaClock } from "react-icons/fa";
import { IoIosAlert } from "react-icons/io";
import { HiOutlineInformationCircle } from "react-icons/hi";

export default function AdminDashboard() {
  const [hospitalId, setHospitalId] = useState("");
  const [animalName, setAnimalName] = useState("");
  const [antivenomQuantity, setAntivenomQuantity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [bloodQuantity, setBloodQuantity] = useState("");
  const [notification, setNotification] = useState(null);
  const [activeSection, setActiveSection] = useState("antivenom");
  
  // Doctor form states - updated to match backend schema
  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [department, setDepartment] = useState("");
  const [experience, setExperience] = useState("");
  // Note: hospitalId is already captured above (used for both doctor and inventory)

  const navigate = useNavigate();

  const showNotification = (message, isSuccess) => {
    setNotification({ message, isSuccess });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateAntivenom = async () => {
    if (!hospitalId || !animalName || antivenomQuantity === "") {
      showNotification("Please fill all antivenom fields", false);
      return;
    }
    const body = new URLSearchParams({
      hospitalId,
      animalName,
      quantity: antivenomQuantity,
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/antivenom/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (response.ok) {
        showNotification("Antivenom stock updated successfully!", true);
        setAnimalName("");
        setAntivenomQuantity("");
      } else {
        const text = await response.text();
        showNotification(`Failed to update: ${text}`, false);
      }
    } catch (error) {
      showNotification("Network error occurred", false);
      console.error(error);
    }
  };

  const handleUpdateBlood = async () => {
    if (!hospitalId || !bloodGroup || bloodQuantity === "") {
      showNotification("Please fill all blood stock fields", false);
      return;
    }

    const body = new URLSearchParams({
      hospitalId,
      bloodGroup,
      quantity: bloodQuantity,
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/blood/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (response.ok) {
        showNotification("Blood stock updated successfully!", true);
        setBloodGroup("");
        setBloodQuantity("");
      } else {
        const text = await response.text();
        showNotification(`Failed to update: ${text}`, false);
      }
    } catch (error) {
      showNotification("Network error occurred", false);
      console.error(error);
    }
  };

  // Updated Add Doctor Function to match backend schema
  const handleAddDoctor = async () => {
    // Validate all fields
    if (!doctorName || !specialization || !department || !experience || !hospitalId) {
      showNotification("Please fill all doctor information fields", false);
      return;
    }

    // Validate experience is a positive number
    const experienceNum = parseInt(experience);
    if (isNaN(experienceNum) || experienceNum < 0 || experienceNum > 50) {
      showNotification("Please enter a valid experience (0-50 years)", false);
      return;
    }

    // Validate hospitalId is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(hospitalId)) {
      showNotification("Please enter a valid Hospital ID (UUID format)", false);
      return;
    }

    const doctorData = {
      name: doctorName,
      specialization: specialization,
      department: department,
      experience: experienceNum,
      hospitalId: hospitalId // Must be valid UUID string
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
      });

      if (response.ok) {
        showNotification("Doctor added successfully!", true);
        // Clear form
        setDoctorName("");
        setSpecialization("");
        setDepartment("");
        setExperience("");
      } else if (response.status === 400) {
        const errorText = await response.text();
        showNotification(`Validation error: ${errorText}`, false);
      } else if (response.status === 404) {
        showNotification("Hospital not found. Please check the Hospital ID", false);
      } else {
        showNotification("Failed to add doctor. Please try again.", false);
      }
    } catch (error) {
      showNotification("Network error occurred while adding doctor", false);
      console.error("Doctor addition error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 p-4 md:p-8">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-indigo-50/20 dark:from-blue-900/5 dark:to-indigo-900/5" />
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-blue-200/10 to-transparent dark:from-blue-900/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-indigo-200/10 to-transparent dark:from-indigo-900/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 md:p-8">
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
                    <FaHospital className="text-white text-2xl" />
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Hospital Inventory Management</h1>
                  <p className="text-blue-100 mt-1 text-sm md:text-base">Update critical medical supplies in real-time</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 cursor-pointer self-start md:self-auto"
              >
                <span className="text-white text-sm font-medium flex items-center gap-2">
                  ← Return Home
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - Hospital ID & Doctor Form */}
          <div className="lg:w-1/3 space-y-6">
            {/* Hospital ID Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <FaDatabase className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800 dark:text-white">Hospital Identification</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Required for all operations</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hospital ID (UUID)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={hospitalId}
                      onChange={(e) => setHospitalId(e.target.value)}
                      placeholder="Enter hospital UUID"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaHospital className="text-gray-400 text-sm" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <HiOutlineInformationCircle className="text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Enter your hospital's unique UUID identifier
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Add Doctor Section - Updated for new schema */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                  <FaUserMd className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800 dark:text-white">Add New Doctor</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Register medical professionals</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Doctor Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Doctor Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaUserMd className="text-gray-400 text-sm" />
                    </div>
                  </div>
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specialization
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="e.g., Cardiology, Neurology"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaBriefcaseMedical className="text-gray-400 text-sm" />
                    </div>
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g., Emergency, ICU, Surgery"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaBuilding className="text-gray-400 text-sm" />
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience (Years)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="Enter years of experience"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaClock className="text-gray-400 text-sm" />
                    </div>
                  </div>
                </div>

                {/* Information Box */}
                <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <HiOutlineInformationCircle className="text-teal-500 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Doctor will be associated with the entered Hospital ID
                    </p>
                  </div>
                </div>

                {/* Add Doctor Button */}
                <motion.button
                  onClick={handleAddDoctor}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(20, 184, 166, 0.9)" }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!hospitalId}
                  className={`w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-teal-600 to-emerald-700 text-white font-semibold rounded-xl shadow transition-all duration-300 ${
                    !hospitalId ? "opacity-50 cursor-not-allowed" : "hover:from-teal-500 hover:to-emerald-600"
                  }`}
                >
                  <FaUserMd />
                  Add Doctor
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/admin/appointments")}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 hover:from-blue-50 hover:to-blue-50 dark:hover:from-blue-900/30 dark:hover:to-blue-900/30 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <FaCalendarAlt className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-800 dark:text-white">Appointments</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">View scheduled consultations</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500 text-sm">→</span>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/admin/upload-report")}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 hover:from-emerald-50 hover:to-emerald-50 dark:hover:from-emerald-900/30 dark:hover:to-emerald-900/30 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <FaFileMedical className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-800 dark:text-white">Patient Reports</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Upload medical documents</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500 text-sm">→</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Inventory Forms */}
          <div className="lg:w-2/3">
            {/* Form Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex space-x-2 mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1.5"
            >
              {[
                { id: "antivenom", label: "Antivenom Stock", icon: <FaFlask className="text-sm" /> },
                { id: "blood", label: "Blood Bank", icon: <FaTint className="text-sm" /> }
              ].map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {section.icon}
                  {section.label}
                </motion.button>
              ))}
            </motion.div>

            {/* Form Content */}
            <AnimatePresence mode="wait">
              {activeSection === "antivenom" && (
                <motion.div
                  key="antivenom"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-6 md:p-8">
                    {/* Form Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                          <FaFlask className="text-white text-xl" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Antivenom Inventory</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Update snake bite treatment stock levels</p>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Animal Species
                          </label>
                          <input
                            type="text"
                            value={animalName}
                            onChange={(e) => setAnimalName(e.target.value)}
                            placeholder="e.g., King Cobra, Russell's Viper"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Available Vials
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={antivenomQuantity}
                            onChange={(e) => setAntivenomQuantity(e.target.value)}
                            placeholder="Enter quantity"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                        <div className="flex items-start gap-3">
                          <IoIosAlert className="text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700 dark:text-gray-400">
                            Ensure accurate species names and vial counts to maintain reliable emergency response data.
                          </p>
                        </div>
                      </div>

                      <motion.button
                        onClick={handleUpdateAntivenom}
                        whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl shadow transition-all duration-300"
                      >
                        <FaSave />
                        Update Antivenom Stock
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === "blood" && (
                <motion.div
                  key="blood"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-6 md:p-8">
                    {/* Form Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                          <FaTint className="text-white text-xl" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Blood Bank Inventory</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Update blood unit availability</p>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Blood Type
                          </label>
                          <input
                            type="text"
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            placeholder="e.g., O+, AB-, A+"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Available Units
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={bloodQuantity}
                            onChange={(e) => setBloodQuantity(e.target.value)}
                            placeholder="Enter quantity"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      
                      <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800/50">
                        <div className="flex items-start gap-3">
                          <IoIosAlert className="text-rose-500 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700 dark:text-gray-400">
                            Accurate blood type and unit counts are critical for emergency transfusion planning.
                          </p>
                        </div>
                      </div>

                      <motion.button
                        onClick={handleUpdateBlood}
                        whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(244, 63, 94, 0.15)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold rounded-xl shadow transition-all duration-300"
                      >
                        <FaSave />
                        Update Blood Inventory
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Guidelines Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                <HiOutlineInformationCircle className="text-white text-lg" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Update Guidelines</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enter the exact hospital ID (UUID format)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Update inventory immediately after receiving or using supplies</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Double-check all entries before submission</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Contact support for bulk updates or corrections</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
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