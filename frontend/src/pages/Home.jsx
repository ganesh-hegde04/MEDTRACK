import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaPhoneAlt, FaEnvelope, FaHeartbeat, FaHandHoldingWater } from "react-icons/fa";
import { MdDarkMode, MdLightMode, MdOutlineBloodtype } from "react-icons/md";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { FiDroplet, FiArrowRight } from "react-icons/fi";
import { RiFlaskLine } from "react-icons/ri";

export default function Home() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const controls = useAnimation();
  const [activeFeature, setActiveFeature] = useState(null);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark", !darkMode);
    controls.start({
      backgroundColor: darkMode ? "rgba(243, 244, 246, 1)" : "rgba(17, 24, 39, 1)",
      transition: { duration: 0.5 }
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const quotes = [
    "“Health is not valued until sickness comes.” – Thomas Fuller",
    "“The groundwork for all happiness is good health.” – Leigh Hunt",
    "“Take care of your body. It's the only place you have to live.” – Jim Rohn",
  ];

  const features = [
    {
      id: "antivenom",
      title: "Antivenom Locator",
      description: "Find immediate treatment for venomous bites",
      icon: <RiFlaskLine className="text-3xl" />,
      color: "from-purple-500 to-indigo-600",
      darkColor: "from-purple-600 to-indigo-700"
    },
    {
      id: "bloodbank",
      title: "Blood Bank Network",
      description: "Connect with donors and blood banks",
      icon: <MdOutlineBloodtype className="text-3xl" />,
      color: "from-red-500 to-pink-600",
      darkColor: "from-red-600 to-pink-700"
    }
  ];

  const reviews = [
    {
      name: "Anjali Rao",
      feedback: "MedTrack helped me find the right hospital in minutes. Truly a lifesaver!",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      name: "Ravi Kumar",
      feedback: "The antivenom feature is brilliant and extremely easy to use.",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
      name: "Sneha Mehta",
      feedback: "Clean interface and very helpful during emergencies. Highly recommend!",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
  ];

  const handleJoinNetwork = async () => {
    try {
      // Redirect to registration page or call API directly
      navigate("/admin/register");
      // Alternatively, you could call the API directly:
      // const response = await fetch("http://localhost:8080/api/admin/register", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(registrationData)
      // });
      // const data = await response.json();
      // Handle response
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <motion.div
      animate={controls}
      className={`min-h-screen font-sans transition-colors duration-500 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gradient-to-b from-blue-50 to-white text-gray-800"
      }`}
    >
      {/* Animated background elements */}
      <AnimatePresence>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
              y: [0, -200],
              x: Math.random() * 100 - 50
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${10 + Math.random() * 30}px`,
              height: `${10 + Math.random() * 30}px`,
              background: darkMode 
                ? `rgba(79, 70, 229, ${0.1 + Math.random() * 0.2})` 
                : `rgba(99, 102, 241, ${0.1 + Math.random() * 0.2})`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
          />
        ))}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-blue-600 dark:text-blue-400 text-3xl"
          >
            <FaHeartbeat />
          </motion.div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            MedTrack
          </span>
        </motion.div>

        <div className="flex items-center gap-6">
          {/* Hospital Admin Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin")}
            className="hidden sm:inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-5 py-2.5 rounded-full shadow-lg transition-all"
          >
            Hospital Admin
          </motion.button>

          {/* Dark Mode Toggle */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 shadow-sm"
            title="Toggle Theme"
          >
            {darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
          </motion.button>

          {/* User Profile Dropdown */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative" 
            ref={profileRef}
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-full"
            >
              <FaUserCircle size={20} />
              <span className="hidden sm:inline font-medium">User</span>
            </motion.button>
            
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-xl shadow-xl z-50 overflow-hidden border border-gray-200 dark:border-gray-600"
                >
                  <ul className="text-sm">
                    <li className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center gap-2">
                      <FaUserCircle /> Profile
                    </li>
                    <li className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </li>
                    <li className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center gap-2 text-red-500 dark:text-red-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </nav>

      {/* Hero & Feature Buttons */}
      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-4xl w-full mx-auto text-center border border-gray-200 dark:border-gray-700"
        >
          <motion.div
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-6"
          >
            <FaHeartbeat className="text-5xl text-blue-600 dark:text-blue-400" />
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Your Health Companion
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 italic mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {quotes[Math.floor(Math.random() * quotes.length)]}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + features.indexOf(feature) * 0.1 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: darkMode 
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                    : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                onHoverStart={() => setActiveFeature(feature.id)}
                onHoverEnd={() => setActiveFeature(null)}
                onClick={() => navigate(`/${feature.id}`)}
                className={`bg-gradient-to-br ${feature.color} dark:${feature.darkColor} text-white p-8 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 relative overflow-hidden group`}
              >
                <div className="relative z-10">
                  <div className="flex justify-center mb-4">
                    <motion.div
                      animate={{
                        scale: activeFeature === feature.id ? [1, 1.2, 1] : 1,
                        rotate: activeFeature === feature.id ? [0, 10, -10, 0] : 0
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      {feature.icon}
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm opacity-90">{feature.description}</p>
                </div>
                
                {/* Hover effect layer */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Animated arrow on hover */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: activeFeature === feature.id ? 1 : 0,
                    x: activeFeature === feature.id ? 0 : -10
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2"
                >
                  <FiArrowRight className="text-xl" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto mt-28 px-4"
        >
          <motion.h3 
            className="text-2xl md:text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Trusted by Healthcare Professionals
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.03 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={review.avatar} 
                    alt={review.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div>
                    <h4 className="font-bold">{review.name}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="italic text-gray-600 dark:text-gray-300">"{review.feedback}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mt-28 px-4"
        >
          <motion.h3 
            className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Revolutionizing Emergency Healthcare
          </motion.h3>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                  <FaHandHoldingWater className="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
                <h4 className="font-bold text-lg">Our Mission</h4>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                To bridge the gap between patients and life-saving medical resources through innovative technology, 
                reducing critical response times in emergencies.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full">
                  <FiDroplet className="text-purple-600 dark:text-purple-400 text-xl" />
                </div>
                <h4 className="font-bold text-lg">How It Works</h4>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Our platform aggregates real-time data from hospitals and blood banks nationwide, 
                providing instant access to critical medical resources when seconds count.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-28 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={handleJoinNetwork}
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-bold py-4 px-8 rounded-full shadow-lg cursor-pointer transition-all"
          >
            Join Our Network of Hospitals
          </motion.button>
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h4 className="text-xl font-semibold mb-6">Need Help? Contact Our Team</h4>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="tel:+919876543210"
              className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-6 py-3 rounded-full transition-all"
            >
              <FaPhoneAlt /> <span>+91 98765 43210</span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="mailto:support@medtrack.com"
              className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-6 py-3 rounded-full transition-all"
            >
              <FaEnvelope /> <span>support@medtrack.com</span>
            </motion.a>
          </div>
        </motion.div>
      </main>

      {/* Floating emergency button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full shadow-xl transition-all"
        >
          <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Emergency Contact
        </motion.button>
      </motion.div>
    </motion.div>
  );
}