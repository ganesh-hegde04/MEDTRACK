import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookAppointment from "./BookAppointment";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function RegisterOrBook() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    username: "",
    password: ""
  });

  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // Check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Reset codeSent if email changes
  useEffect(() => {
    setCodeSent(false);
    setIsEmailVerified(false);
    setVerificationCode("");
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const sendVerificationCode = async () => {
    if (!formData.email) {
      setMessage("❌ Please enter a valid email address first.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/verify/send?email=${encodeURIComponent(formData.email)}`, {
        method: "POST"
      });

      const text = await res.text();
      if (res.ok) {
        setMessage("📧 " + text);
        setCodeSent(true);
      } else {
        setMessage("❌ " + text);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error sending verification code.");
    }
  };

  const checkVerificationCode = async () => {
    if (!verificationCode) {
      setMessage("❌ Please enter the verification code.");
      return;
    }

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/verify/check?email=${encodeURIComponent(formData.email)}&code=${encodeURIComponent(verificationCode)}`,
        { method: "POST" }
      );

      const text = await res.text();
      if (res.ok) {
        setIsEmailVerified(true);
        setMessage("✅ " + text);
      } else {
        setMessage("❌ " + text);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error verifying code.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isEmailVerified) {
      setMessage("❌ Please verify your email before registering.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const text = await res.text();

      try {
        const json = JSON.parse(text);

        if (res.ok) {
          setMessage("✅ Registration successful. Redirecting to appointment booking...");
          localStorage.setItem("userToken", json.token || "demo-token");
          localStorage.setItem("userEmail", formData.email);
          localStorage.setItem("userPhone", formData.phone);

          setTimeout(() => setIsLoggedIn(true), 1500);
        } else {
          setMessage(`❌ ${json.message || "Registration failed."}`);
        }
      } catch {
        if (res.ok) {
          setMessage("✅ Registration successful. Redirecting to appointment booking...");
          localStorage.setItem("userToken", "demo-token");
          setTimeout(() => setIsLoggedIn(true), 1500);
        } else {
          setMessage("❌ " + text);
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setMessage("❌ Error during registration.");
    } finally {
      setLoading(false);
    }
  };

  // If logged in, show booking
  if (isLoggedIn) return <BookAppointment />;

  // Registration form
  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">
            Welcome to Medtrack
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Register now to book your medical appointments with ease
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
              Create Your Account
            </h2>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Email with Code Button */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="w-full pl-4 pr-32 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  disabled={codeSent}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white rounded-md"
                >
                  {codeSent ? "Code Sent" : "Send Code"}
                </button>
              </div>

              {/* Code input and verify */}
              {codeSent && !isEmailVerified && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={checkVerificationCode}
                    disabled={!verificationCode}
                    className="px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg"
                  >
                    Verify
                  </button>
                </div>
              )}

              {/* Other fields */}
              {[
                { name: "name", placeholder: "Full Name" },
                { name: "phone", placeholder: "Phone" },
                { name: "bloodGroup", placeholder: "Blood Group" },
                { name: "emergencyContactName", placeholder: "Emergency Contact Name" },
                { name: "emergencyContactPhone", placeholder: "Emergency Contact Phone" },
                { name: "username", placeholder: "Username" },
                { name: "password", placeholder: "Password", type: "password" }
              ].map(({ name, placeholder, type = "text" }) => (
                <input
                  key={name}
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  placeholder={placeholder}
                  className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                />
              ))}

              {/* Register Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !isEmailVerified}
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-70 transition-all duration-300 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Register & Continue"
                )}
              </motion.button>

              {/* Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 text-center font-medium rounded-lg ${
                    message.startsWith("✅") || message.startsWith("📧")
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {message}
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}