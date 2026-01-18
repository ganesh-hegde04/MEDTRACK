import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AntivenomPage from "./pages/AntivenomPage";
import BloodBankPage from "./pages/BloodBankPage";
import HospitalDetail from "./pages/HospitalDetail";
import HospitalList from "./pages/HospitalList";
import BloodGroupSelector from "./pages/BloodGroupSelector";
import AdminRegister from "./pages/AdminRegister";
import AdminLogin from "./pages/AdminLogin";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAppointments from "./pages/AdminAppointments";
import RegisterOrBook from "./pages/RegisterOrBook"; 
import MedicalReportUpload from "./pages/MedicalReportUpload";
import UserDashboard from "./pages/UserDashboard";
import LoginPage from "./pages/LoginPage";
import UploadPatientReport from "./pages/UploadPatientReport";
import PrivateRoute from "./components/PrivateRoute";
import UserRegister from "./pages/UserRegister";

// Create the component inline in App.jsx temporarily
const ManualLocationPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Manual Location Entry
        </h1>
        <p className="text-gray-600 mb-6 text-lg">
          This feature allows you to enter your location manually when geolocation is not available.
        </p>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/user-register" element={<UserRegister />} />
      <Route path="/appointment" element={<RegisterOrBook />} />
      
      {/* Existing routes */}
      <Route path="/antivenom" element={<AntivenomPage />} />
      <Route path="/bloodbank" element={<BloodGroupSelector />} />
      <Route path="/bloodbank/:group" element={<BloodBankPage />} />
      <Route path="/hospitals/:animalName" element={<HospitalList />} />
      <Route path="/hospital/:hospitalId" element={<HospitalDetail />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AuthPage />} />
      <Route path="/admin/appointments" element={<AdminAppointments />} />
      <Route path="/admin/upload-report" element={<UploadPatientReport />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/hospitals/manual/:animalName" element={<ManualLocationPage />} />

      {/* Protected User Routes */}
      <Route
        path="/user/dashboard"
        element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/book"  
        element={
          <PrivateRoute>
            <RegisterOrBook />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/records"
        element={
          <PrivateRoute>
            <MedicalReportUpload />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}