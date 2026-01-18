import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaPhoneAlt, FaEnvelope, FaHeartbeat, FaClinicMedical, FaArrowRight } from "react-icons/fa";
import { MdOutlineBloodtype, MdLocalHospital } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { RiFlaskLine, RiStethoscopeLine } from "react-icons/ri";
import { GiMedicines } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";

export default function Home() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [activeFeature, setActiveFeature] = useState(null);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const quotes = [
    "“Health is not valued until sickness comes.” – Thomas Fuller",
    "“The groundwork for all happiness is good health.” – Leigh Hunt",
    "“Take care of your body. It's the only place you have to live.” – Jim Rohn",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  

  const features = [
    {
      id: "antivenom",
      title: "Antivenom Locator",
      description: "Find immediate treatment for venomous bites",
      icon: <RiFlaskLine />,
      color: "from-emerald-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "bloodbank",
      title: "Blood Bank Network",
      description: "Connect with donors and blood banks",
      icon: <MdOutlineBloodtype />,
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20",
      borderColor: "border-rose-200 dark:border-rose-800",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
    {
      id: "appointment",
      title: "Book Appointment",
      description: "Schedule consultations with healthcare providers",
      icon: <FaUserCircle />,
      color: "from-violet-500 to-indigo-500",
      bgColor: "bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20",
      borderColor: "border-violet-200 dark:border-violet-800",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
  ];


  const stats = [
    { value: "100+", label: "Partner Hospitals", icon: <MdLocalHospital /> },
    { value: "24/7", label: "Emergency Support", icon: <FaClinicMedical /> },
    { value: "1K+", label: "Lives Saved", icon: <FaHeartbeat /> },
    { value: "98%", label: "Satisfaction Rate", icon: <RiStethoscopeLine /> },
  ];

  const reviews = [
    {
      name: "Dr. Anjali Rao",
      role: "Chief Surgeon",
      feedback: "MedTrack has revolutionized how we handle emergencies. The response time improvement is remarkable.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.Anjali"
    },
    {
      name: "Ravi Kumar",
      role: "Blood Donor",
      feedback: "The blood bank network helped me saving lives more efficiently than ever before.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi.Kumar"
    },
    {
      name: "Sneha Mehta",
      role: "Patient",
      feedback: "During an emergency, MedTrack connected me to the nearest hospital with the required antivenom in minutes.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha.Mehta"
    },
  ];

  const handleJoinNetwork = () => navigate("/admin/register");

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10"></div>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              y: Math.random() * 100 + 100,
              x: Math.random() * 100
            }}
            animate={{ 
              opacity: [0, 0.1, 0],
              y: [0, -window.innerHeight],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            className="absolute text-blue-400/20 dark:text-blue-500/10"
            style={{
              fontSize: `${24 + Math.random() * 24}px`,
              left: `${Math.random() * 100}%`,
            }}
          >
            {i % 4 === 0 ? <FaHeartbeat /> : i % 4 === 1 ? <MdLocalHospital /> : i % 4 === 2 ? <RiStethoscopeLine /> : <GiMedicines />}
          </motion.div>
        ))}
      </div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: ["0%", "5%", "0%"],
            y: ["0%", "5%", "0%"],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-200/30 to-cyan-200/30 dark:from-blue-500/10 dark:to-cyan-500/10 blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: ["0%", "-5%", "0%"],
            y: ["0%", "-5%", "0%"],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-violet-200/30 to-purple-200/30 dark:from-violet-500/10 dark:to-purple-500/10 blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Enhanced Navbar */}
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50 transition-all duration-300 ${
            scrolled 
              ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-gray-800" 
              : "bg-transparent"
          }`}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <FaHeartbeat className="text-white text-lg" />
              </div>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity
                }}
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 blur-md -z-10"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                MedTrack
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Healthcare Portal</span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {features.map(feature => (
              <motion.button
                key={feature.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
  if (feature.id === "appointment") {
    navigate("/login");
  } else {
    navigate(`/${feature.id}`);
  }
}}

                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {feature.title}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(59, 130, 246, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin")}
              className="ml-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
            >
              Hospital Admin
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            {mobileMenuOpen ? <IoMdClose size={24} /> : "☰"}
          </motion.button>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full left-0 right-0 mt-2 mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden md:hidden"
              >
                <div className="p-4">
                  {features.map(feature => (
                    <motion.button
                      key={feature.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate(`/${feature.id}`);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 mb-2 last:mb-0 flex items-center gap-3"
                    >
                      <span className={feature.iconColor}>{feature.icon}</span>
                      <div>
                        <div className="font-medium">{feature.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</div>
                      </div>
                    </motion.button>
                  ))}
                  <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigate("/admin");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg"
                  >
                    Hospital Admin
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <section className="relative mb-24">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-cyan-600/5" />
              
              <div className="relative px-8 py-16 sm:px-12 sm:py-20 md:px-16 md:py-24">
                <div className="max-w-3xl mx-auto text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-xl mb-8"
                  >
                    <FaHeartbeat className="text-white text-3xl" />
                  </motion.div>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                      MEDTRACK -    
                    </span>{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400">
                       HEALTHCARE PORTAL
                    </span>
                  </motion.h1>
                  
                  <motion.div
                    key={currentQuote}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 italic mb-8 h-12 flex items-center justify-center"
                  >
                    {quotes[currentQuote]}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-4 justify-center"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 16px 40px rgba(59, 130, 246, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/login")}
                      className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                    >
                    Sign In
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/user-register")}
                      className="px-8 py-3.5 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                    >
                      Create Account
                    </motion.button>
                  </motion.div>
                </div>
              </div>
              
              {/* Stats Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-800"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 dark:divide-gray-800">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="px-6 py-8 text-center group cursor-pointer"
                    >
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-gray-900 shadow-lg mb-4 group-hover:shadow-xl transition-shadow">
                        <div className="text-blue-600 dark:text-blue-400 text-xl">
                          {stat.icon}
                        </div>
                      </div>
                      <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4"
              >
                <RiStethoscopeLine /> Our Services
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              >
                Critical Healthcare
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
                  Solutions
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              >
                Access life-saving resources instantly with our integrated healthcare platform
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)"
                  }}
                  onClick={() => {
  if (feature.id === "appointment") {
    navigate("/login");
  } else {
    navigate(`/${feature.id}`);
  }
}}

                  className={`relative rounded-2xl ${feature.bgColor} border ${feature.borderColor} p-8 cursor-pointer transition-all duration-300 group overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 from-white/50 to-transparent dark:from-gray-900/50" />
                  
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white dark:bg-gray-900 shadow-lg mb-6 ${feature.iconColor}`}
                    >
                      <div className="text-2xl">{feature.icon}</div>
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {feature.description}
                    </p>
                    
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <span className={feature.iconColor}>Explore feature</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="ml-2"
                      >
                        <FaArrowRight className={feature.iconColor} />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4"
              >
                <FaUserCircle /> Testimonials
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              >
                Trusted by
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400">
                  Thousands
                </span>
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <img 
                        src={review.avatar} 
                        alt={review.name}
                        className="w-14 h-14 rounded-full"
                      />
                      <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
                    </div>
                    <div>
                      <h4 className="font-bold">{review.name}</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{review.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic">"{review.feedback}"</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative mb-24">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600 p-1">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=2070')] bg-cover bg-center opacity-10" />
              
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-12">
                <div className="max-w-3xl mx-auto text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-8"
                  >
                    <MdLocalHospital className="text-white text-3xl" />
                  </motion.div>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-3xl sm:text-4xl font-bold mb-4"
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                      Join Our Network
                    </span>
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-gray-600 dark:text-gray-400 mb-8"
                  >
                    Connect your healthcare facility to our platform and help save more lives with efficient resource management
                  </motion.p>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 60px rgba(59, 130, 246, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleJoinNetwork}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/40 transition-all duration-300"
                  >
                    <MdLocalHospital />
                    Register Your Hospital
                  </motion.button>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="text-center">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600"
            >
              24/7 Emergency Support
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto"
            >
              <motion.a
                whileHover={{ scale: 1.05, boxShadow: "0 16px 40px rgba(59, 130, 246, 0.2)" }}
                href="tel:+919876543210"
                className="flex-1 flex items-center justify-center gap-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 px-8 py-6 rounded-2xl border border-blue-100 dark:border-gray-800 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <FaPhoneAlt className="text-white text-lg" />
                </div>
                <div className="text-left">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Emergency Call</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">+91 98765 43210</div>
                </div>
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.05, boxShadow: "0 16px 40px rgba(147, 51, 234, 0.2)" }}
                href="mailto:support@medtrack.com"
                className="flex-1 flex items-center justify-center gap-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 px-8 py-6 rounded-2xl border border-violet-100 dark:border-gray-800 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <FaEnvelope className="text-white text-lg" />
                </div>
                <div className="text-left">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Email Support</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">support@medtrack.com</div>
                </div>
              </motion.a>
            </motion.div>
          </section>
        </main>

        {/* Enhanced Footer */}
        <footer className="mt-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FaHeartbeat className="text-white text-xl" />
                </div>
                <div>
                  <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                    MedTrack
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Healthcare Innovation</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-6">
                {["Features", "About", "Contact", "Privacy"].map((item, index) => (
                  <motion.a
                    key={index}
                    whileHover={{ y: -2, color: "#3b82f6" }}
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm"
            >
              © {new Date().getFullYear()} MedTrack. All rights reserved.
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  );
}