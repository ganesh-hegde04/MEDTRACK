import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUpload, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { IoIosAlert } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function UploadPatientReport() {
  const [patientEmail, setPatientEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStep, setUploadStep] = useState(1); // 1=email, 2=verify, 3=upload
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const showNotification = (message, isSuccess) => {
    setNotification({ message, isSuccess });
    setTimeout(() => setNotification(null), 3000);
  };

  const sendCodeToEmail = async () => {
    if (!patientEmail) {
      showNotification("Please enter patient's email", false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/hospital/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: patientEmail }),
      });
      if (res.ok) {
        showNotification("Verification code sent to patient's email", true);
        setUploadStep(2);
      } else {
        const txt = await res.text();
        showNotification(`Failed to send code: ${txt}`, false);
      }
    } catch (err) {
      showNotification("Network error", false);
    }
  };

  const verifyCodeAndEnableUpload = async () => {
    if (!verificationCode) {
      showNotification("Please enter verification code", false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/hospital/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: patientEmail, code: verificationCode }),
      });
      if (res.ok) {
        showNotification("Code verified. You can now upload the report.", true);
        setUploadStep(3);
      } else {
        const txt = await res.text();
        showNotification(`Verification failed: ${txt}`, false);
      }
    } catch (err) {
      showNotification("Network error", false);
    }
  };

  const uploadReport = async () => {
    if (!file) {
      showNotification("Please choose a report file to upload", false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", patientEmail);
    formData.append("code", verificationCode);

    try {
      const res = await fetch(`${BACKEND_URL}/api/hospital/upload`, {
        method: "POST",
        body: formData,
      });
      const msg = await res.text();
      if (res.ok) {
        showNotification("Report uploaded successfully!", true);
        // Reset form
        setUploadStep(1);
        setPatientEmail("");
        setVerificationCode("");
        setFile(null);
      } else {
        showNotification(`Upload failed: ${msg}`, false);
      }
    } catch (err) {
      showNotification("Upload error occurred", false);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto mt-8"
      >
        {/* Header */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden mb-8"
        >
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-4"
            >
              <FaUpload className="text-white text-4xl" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white">Upload Patient Report</h2>
            <p className="text-green-100 mt-2">Secure medical report upload</p>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden p-8"
        >
          {/* Back button */}
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
          >
            <FaArrowLeft /> Back to Dashboard
          </motion.button>

          {/* Step 1: Enter email */}
          {uploadStep === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Patient's Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full px-5 py-3 border-0 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                </div>
              </div>

              <motion.button
                onClick={sendCodeToEmail}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Send Verification Code
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Verify code */}
          {uploadStep === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-5 py-3 border-0 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setUploadStep(1)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Back
                </motion.button>
                <motion.button
                  onClick={verifyCodeAndEnableUpload}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Verify Code
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Upload file */}
          {uploadStep === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Medical Report
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaUpload className="text-gray-500 dark:text-gray-400 text-2xl mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {file ? (
                          <span className="font-medium">{file.name}</span>
                        ) : (
                          <>
                            <span className="font-medium">Click to upload</span> or drag and drop
                          </>
                        )}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setUploadStep(2)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Back
                </motion.button>
                <motion.button
                  onClick={uploadReport}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!file}
                  className={`flex-1 px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all ${
                    !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-green-600'
                  }`}
                >
                  Upload Report
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Notifications */}
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
