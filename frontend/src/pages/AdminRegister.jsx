import HospitalRegistrationForm from "../pages/HospitalRegistrationForm"; // ✅ Correct import

export default function AdminRegister() {
  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center"></h2>
      <HospitalRegistrationForm /> {/* ✅ Correct component used */}
    </div>
  );
}
