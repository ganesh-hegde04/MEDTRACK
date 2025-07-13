import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSave, FaHospital, FaFlask, FaTint } from "react-icons/fa";
import { IoIosAlert } from "react-icons/io";

export default function AdminDashboard() {
  const [hospitalId, setHospitalId] = useState("");
  const [animalName, setAnimalName] = useState("");
  const [antivenomQuantity, setAntivenomQuantity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [bloodQuantity, setBloodQuantity] = useState("");
  const [notification, setNotification] = useState(null);

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
      const response = await fetch("http://localhost:8080/api/admin/antivenom/update", {
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
      const response = await fetch("http://localhost:8080/api/admin/blood/update", {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto mt-8"
      >
        {/* Header */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block mb-4"
            >
              <FaHospital className="text-white text-4xl" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white">Hospital Stock Management</h2>
            <p className="text-blue-100 mt-2">Update critical medical supplies</p>
          </div>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden p-8"
        >
          {/* Hospital ID */}
          <motion.div 
            className="mb-8"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="hospitalId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hospital Identifier
            </label>
            <div className="relative">
              <input
                id="hospitalId"
                type="text"
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                placeholder="Enter hospital UUID"
                className="w-full px-5 py-3 border-0 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaHospital className="text-gray-400" />
              </div>
            </div>
          </motion.div>

          {/* Antivenom Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-10 p-6 bg-blue-50 dark:bg-gray-700 rounded-xl border-l-4 border-blue-500"
          >
            <div className="flex items-center mb-4">
              <FaFlask className="text-blue-600 dark:text-blue-400 text-2xl mr-3" />
              <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Antivenom Stock Update</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="animalName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Animal Species
                </label>
                <input
                  id="animalName"
                  type="text"
                  value={animalName}
                  onChange={(e) => setAnimalName(e.target.value)}
                  placeholder="e.g., King Cobra"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-600 border-0 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="antivenomQuantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vials Available
                </label>
                <input
                  id="antivenomQuantity"
                  type="number"
                  min="0"
                  value={antivenomQuantity}
                  onChange={(e) => setAntivenomQuantity(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-600 border-0 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <motion.button
              onClick={handleUpdateAntivenom}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <FaSave /> Update Antivenom Inventory
            </motion.button>
          </motion.div>

          {/* Blood Bank Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-6 bg-red-50 dark:bg-gray-700 rounded-xl border-l-4 border-red-500"
          >
            <div className="flex items-center mb-4">
              <FaTint className="text-red-600 dark:text-red-400 text-2xl mr-3" />
              <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">Blood Bank Update</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Blood Type
                </label>
                <input
                  id="bloodGroup"
                  type="text"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  placeholder="e.g., O-"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-600 border-0 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="bloodQuantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Units Available
                </label>
                <input
                  id="bloodQuantity"
                  type="number"
                  min="0"
                  value={bloodQuantity}
                  onChange={(e) => setBloodQuantity(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-600 border-0 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <motion.button
              onClick={handleUpdateBlood}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <FaSave /> Update Blood Inventory
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Notification System */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-2xl flex items-center ${
              notification.isSuccess ? "bg-green-500" : "bg-red-500"
            } text-white max-w-md`}
          >
            <IoIosAlert className="text-2xl mr-3" />
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}