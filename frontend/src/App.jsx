import { Routes, Route } from "react-router-dom";

// Page imports
import Home from "./pages/Home";
import AntivenomPage from "./pages/AntivenomPage";
import BloodBankPage from "./pages/BloodBankPage";
import HospitalDetail from "./pages/HospitalDetail";
import HospitalList from "./pages/HospitalList";
import BloodGroupSelector from "./pages/BloodGroupSelector";

// Admin related pages
import BookAppointment from "./pages/BookAppointment";

import AdminRegister from "./pages/AdminRegister";
import AdminLogin from "./pages/AdminLogin";
import AuthPage from "./pages/AuthPage"; // General Admin auth page
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<Home />} />

      {/* Antivenom Page */}
      <Route path="/antivenom" element={<AntivenomPage />} />

      {/* Blood Group Selector */}
      <Route path="/bloodbank" element={<BloodGroupSelector />} />

      {/* Hospitals for selected blood group */}
      <Route path="/bloodbank/:group" element={<BloodBankPage />} />

      {/* Antivenom hospitals list for animal */}
      <Route path="/hospitals/:animalName" element={<HospitalList />} />

      {/* Hospital detail view */}
      <Route path="/hospital/:hospitalId" element={<HospitalDetail />} />

      {/* Admin Authentication */}
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AuthPage />} />

      {/* Admin Dashboard */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* BOOK APPOINTMENT */}
      <Route path="/appointment" element={<BookAppointment />} />
    </Routes>
  );
}
