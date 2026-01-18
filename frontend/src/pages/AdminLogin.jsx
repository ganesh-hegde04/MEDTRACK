import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // 🔐 ONLY allow login if backend confirms
      if (res.status === 200 && res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid login response");
      }

    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
    >
      <motion.div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <Lock size={48} className="text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white">
              Hospital Admin Portal
            </h2>
            <p className="text-blue-100 mt-2">
              Secure access to your management dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <a
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-1"
            >
              Forgot password? <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Hospital Management System
        </div>
      </motion.div>
    </motion.div>
  );
}