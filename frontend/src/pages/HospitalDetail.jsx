// src/pages/HospitalDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function HospitalDetail() {
  const { hospitalId } = useParams();
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/hospitals/${hospitalId}`)
      .then((res) => setHospital(res.data))
      .catch((err) => console.error(err));
  }, [hospitalId]);

  if (!hospital) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-4">{hospital.name}</h2>
      <p className="mb-2">📍 {hospital.address}</p>
      <p className="mb-6">📞 {hospital.phone}</p>

      <div className="flex gap-4">
        <a
          href={`tel:${hospital.phone}`}
          className="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700 text-center"
        >
          Call Hospital
        </a>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            hospital.address
          )}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 text-center"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
}
