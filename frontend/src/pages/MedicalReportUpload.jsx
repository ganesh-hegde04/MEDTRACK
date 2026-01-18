import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

if (!BASE_URL) {
  throw new Error('VITE_BACKEND_URL is not defined');
}

const MedicalReportUpload = () => {
  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userEmail, setUserEmail] = useState('');

  /* ================= AUTH HELPERS ================= */

  const getUserData = () => ({
    token: localStorage.getItem('userToken'),
    email: localStorage.getItem('userEmail')
  });

  const isLoggedIn = () => !!getUserData().token;

  /* ================= FETCH REPORTS ================= */

  const fetchReports = async () => {
    const { token, email } = getUserData();
    if (!token) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setUserEmail(email || '');

    try {
      const response = await axios.get(`${BASE_URL}/api/reports/list`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReports(response.data);
      setSuccess(`Loaded ${response.data.length} report(s)`);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else {
        setError('Failed to load reports');
      }
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      fetchReports();
    } else {
      setError('Please login to view reports');
    }
  }, []);

  /* ================= FILE UPLOAD ================= */

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB');
      return;
    }

    setFile(selected);
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const { token } = getUserData();

    if (!file || !token) {
      setError('Please select a file and login');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      await axios.post(`${BASE_URL}/api/reports/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
          // DO NOT set Content-Type manually
        }
      });

      setSuccess('Report uploaded successfully');
      setFile(null);
      document.getElementById('fileInput').value = '';
      fetchReports();
    } catch (err) {
      setError(err.response?.data || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  /* ================= PREVIEW (FIXED) ================= */

  const handlePreview = async (fileName) => {
    const { token } = getUserData();
    if (!token) {
      setError('Please login to preview reports');
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/api/reports/download`,
        {
          params: { fileName },
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );

      const fileURL = window.URL.createObjectURL(response.data);
      window.open(fileURL, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error(err);
      setError('Unable to preview file');
    }
  };

  /* ================= DOWNLOAD ================= */

  const handleDownload = async (fileName) => {
    const { token } = getUserData();
    if (!token) {
      setError('Please login to download reports');
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/api/reports/download`,
        {
          params: { fileName },
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Download failed');
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Medical Reports</h1>
      {userEmail && <p className="text-sm text-gray-500 mb-4">Logged in as {userEmail}</p>}

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700">{success}</div>}

      {/* Upload */}
      <form onSubmit={handleUpload} className="mb-6">
        <input
          id="fileInput"
          type="file"
          onChange={handleFileChange}
          disabled={!isLoggedIn()}
        />
        <button
          type="submit"
          disabled={!file || uploading || !isLoggedIn()}
          className="ml-3 px-4 py-2 bg-blue-600 text-white rounded"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {/* Reports */}
      {loading && <p>Loading reports...</p>}

      {!loading && reports.length === 0 && isLoggedIn() && <p>No reports found</p>}

      {reports.map((report, idx) => (
        <div
          key={idx}
          className="border p-4 mb-3 flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{report.fileName}</p>
            <p className="text-sm text-gray-500">
              {new Date(report.uploadedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePreview(report.fileName)}
              className="px-3 py-1 border border-blue-600 text-blue-600 rounded"
            >
              Preview
            </button>
            <button
              onClick={() => handleDownload(report.fileName)}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Download
            </button>
          </div>
        </div>
      ))}

      <p className="mt-8 text-center text-sm text-gray-500">
        All medical reports are encrypted and decrypted securely on the server
      </p>
    </div>
  );
};

export default MedicalReportUpload;
