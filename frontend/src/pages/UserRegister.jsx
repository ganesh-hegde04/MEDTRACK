// pages/UserRegister.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function UserRegister() {
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
  
  const navigate = useNavigate();

  // Reset codeSent if email changes
  useEffect(() => {
    setCodeSent(false);
    setIsEmailVerified(false);
    setVerificationCode("");
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const sendVerificationCode = async () => {
    if (!formData.email) {
      setMessage("❌ Please enter a valid email address first.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/verify/send?email=${encodeURIComponent(formData.email)}`,
        { method: "POST" }
      );

      const text = await res.text();
      if (res.ok) {
        setMessage("📧 Verification code sent to your email!");
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
        `${import.meta.env.VITE_BACKEND_URL}/api/verify/check?email=${encodeURIComponent(formData.email)}&code=${encodeURIComponent(verificationCode)}`,
        { method: "POST" }
      );

      const text = await res.text();
      if (res.ok) {
        setIsEmailVerified(true);
        setMessage("✅ Email verified successfully!");
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
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Registration successful! Redirecting to login...");
        
        // Wait 2 seconds then go to login
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(`❌ ${data.message || "Registration failed."}`);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setMessage("❌ Error during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Register to access medical services
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
        >
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Email Verification Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  disabled={codeSent}
                  className="px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                  {codeSent ? "Sent" : "Verify"}
                </button>
              </div>
            </div>

            {/* Verification Code Input */}
            {codeSent && !isEmailVerified && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg"
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={checkVerificationCode}
                  disabled={!verificationCode}
                  className="px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                >
                  Confirm
                </button>
              </div>
            )}

            {/* Form Fields */}
            {[
              { name: "name", placeholder: "Full Name", type: "text" },
              { name: "phone", placeholder: "Phone Number", type: "tel" },
              { name: "bloodGroup", placeholder: "Blood Group", type: "text" },
              { name: "emergencyContactName", placeholder: "Emergency Contact Name", type: "text" },
              { name: "emergencyContactPhone", placeholder: "Emergency Contact Phone", type: "tel" },
              { name: "username", placeholder: "Username", type: "text" },
              { name: "password", placeholder: "Password", type: "password" }
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.placeholder} *
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            ))}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isEmailVerified}
              className="w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl disabled:opacity-50 transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Registering...
                </span>
              ) : (
                "Register Account"
              )}
            </button>

            {/* Message Display */}
            {message && (
              <div className={`p-3 rounded-lg text-center ${
                message.includes("✅") || message.includes("📧")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {message}
              </div>
            )}

            {/* Login Link */}
            <div className="text-center pt-4 border-t">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}