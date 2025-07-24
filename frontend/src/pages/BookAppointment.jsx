import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function BookAppointment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userPhone: "",
    hospitalName: "",
    department: "",
    doctorName: "",
    appointmentDate: "",
    appointmentTime: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hospitalQuery, setHospitalQuery] = useState("");
  const [hospitalSuggestions, setHospitalSuggestions] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Fetch hospitals on typing with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (hospitalQuery.length > 1) {
        fetch(`/api/appointments/search-hospitals?search=${hospitalQuery}`)
          .then(res => {
            if (!res.ok) throw new Error("Server error");
            return res.json();
          })
          .then(data => setHospitalSuggestions(data))
          .catch(err => {
            console.error("Error fetching hospitals:", err);
            setHospitalSuggestions([]); // fallback to empty
          });
      } else {
        setHospitalSuggestions([]); // clear suggestions if input < 2 chars
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [hospitalQuery]);

  // Set departments from selected hospital
  useEffect(() => {
    if (selectedHospital) {
      setDepartments(selectedHospital.departments || []);
    } else {
      setDepartments([]);
    }
  }, [selectedHospital]);

  // Fetch doctors once hospital and department are selected
  useEffect(() => {
    if (formData.hospitalName && formData.department) {
      fetch(
        `/api/appointments/by-department?hospitalName=${encodeURIComponent(
          formData.hospitalName
        )}&department=${encodeURIComponent(formData.department)}`
      )
        .then(res => {
          if (!res.ok) throw new Error("Error fetching doctors");
          return res.json();
        })
        .then(data => setDoctors(data))
        .catch(err => {
          console.error(err);
          setDoctors([]);
        });
    } else {
      setDoctors([]);
    }
  }, [formData.hospitalName, formData.department]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ Appointment booked with Dr. ${data.doctorName} at ${data.hospitalName}`);
        setFormData({
          userPhone: "",
          hospitalName: "",
          department: "",
          doctorName: "",
          appointmentDate: "",
          appointmentTime: ""
        });
        setHospitalQuery("");
        setHospitalSuggestions([]);
        setSelectedHospital(null);
        setDepartments([]);
        setDoctors([]);
      } else {
        setMessage(`❌ ${data.message || data}`);
      }
    } catch (error) {
      setMessage("❌ Error booking appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white px-6 py-12"
    >
      <div className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-300 dark:border-gray-700 rounded-2xl p-10 shadow-xl">
        <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-8">
          Book an Appointment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Your Phone Number</label>
            <input
              type="text"
              name="userPhone"
              value={formData.userPhone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Hospital</label>
            <input
              type="text"
              value={hospitalQuery}
              onChange={(e) => {
                setHospitalQuery(e.target.value);
                setSelectedHospital(null);
                setFormData({ ...formData, hospitalName: "", department: "", doctorName: "" });
              }}
              placeholder="Start typing hospital name..."
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
            />
            {hospitalSuggestions.length > 0 && (
              <ul className="bg-white dark:bg-gray-700 border mt-1 rounded-lg shadow-md max-h-40 overflow-y-auto">
                {hospitalSuggestions.map((hosp) => (
                  <li
                    key={hosp.id}
                    className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 cursor-pointer"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        hospitalName: hosp.name,
                        department: "",
                        doctorName: ""
                      });
                      setHospitalQuery(hosp.name);
                      setHospitalSuggestions([]);
                      setSelectedHospital(hosp);
                    }}
                  >
                    {hosp.name} - {hosp.location}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value, doctorName: "" })
              }
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              disabled={!departments.length}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Doctor</label>
            <select
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              disabled={!doctors.length}
            >
              <option value="">Select Doctor</option>
              {doctors.map((docName) => (
                <option key={docName} value={docName}>
                  {docName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Appointment Date</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Appointment Time</label>
            <input
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? "Booking..." : "Confirm Appointment"}
          </motion.button>
        </form>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-sm font-medium"
          >
            {message}
          </motion.p>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </motion.div>
  );
}
