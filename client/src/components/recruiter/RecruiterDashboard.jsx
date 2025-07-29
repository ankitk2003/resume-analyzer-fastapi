import { loadingState } from "../../recoil/userAtom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";

function RecruiterDashboard() {
  const [jdFile, setJdFile] = useState(null);
  const [jdId, setJdId] = useState(null);
  const [resumeFiles, setResumeFiles] = useState([]);
  const [resumesUploaded, setResumesUploaded] = useState(false);
  const [matchedResumes, setMatchedResumes] = useState([]);
  const [top_k, setTopK] = useState(5); // NEW: Default top_k value
  const setLoading = useSetRecoilState(loadingState);
  const loading = useRecoilValue(loadingState);
  const navigate=useNavigate()
  const handleJdChange = (e) => setJdFile(e.target.files[0]);
  const handleResumesChange = (e) => setResumeFiles(Array.from(e.target.files));

  const uploadJD = async () => {
    if (!jdFile) return alert("Please select a JD file");

    const formData = new FormData();
    formData.append("file", jdFile);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recruiter/upload-jd`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
      setJdId(result.jd_id);
      alert("JD uploaded successfully!");
    } catch (err) {
      console.error("JD upload failed", err);
      alert("JD upload failed");
    } finally {
      setLoading(false);
    }
  };

  const uploadResumes = async () => {
    if (resumeFiles.length === 0 || !jdId) return alert("Please upload JD first and select resumes");

    const formData = new FormData();
    resumeFiles.forEach((file) => formData.append("files", file));

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/recruiter/upload-resumes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      setResumesUploaded(true);
      alert("Resumes uploaded successfully!");
    } catch (err) {
      console.error("Resume upload failed", err);
      alert("Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  const getMatches = async () => {
    if (!jdId) return alert("JD ID not found");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/recruiter/match-resumes/${jdId}/${top_k}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();
      setMatchedResumes(result.matches || []);
      alert("Matching resumes fetched!");
    } catch (err) {
      console.error("Matching failed", err);
      alert("Failed to fetch matching resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout=()=>{
    localStorage.removeItem("token")
        localStorage.removeItem("role")
        navigate("/")

  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Recruiter Dashboard</h2>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center mb-4">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8 animate-spin border-t-blue-600"></div>
          </div>
        )}

        {/* JD Upload */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">Upload Job Description (JD)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleJdChange}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm file:bg-blue-100 file:border-0 file:px-4 file:py-2 file:rounded file:text-blue-800 cursor-pointer"
          />
          {jdFile && <p className="text-sm text-green-600 mt-2">📄 {jdFile.name}</p>}
          <button
            onClick={uploadJD}
            disabled={loading}
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition text-sm disabled:opacity-50"
          >
            Upload JD
          </button>
        </div>

        {/* Resume Upload */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">Upload Resumes</label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleResumesChange}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm file:bg-purple-100 file:border-0 file:px-4 file:py-2 file:rounded file:text-purple-800 cursor-pointer"
          />
          {resumeFiles.length > 0 && (
            <ul className="mt-2 text-sm text-purple-600 list-disc list-inside">
              {resumeFiles.map((file, idx) => (
                <li key={idx}>📄 {file.name}</li>
              ))}
            </ul>
          )}
          <button
            onClick={uploadResumes}
            disabled={loading}
            className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition text-sm disabled:opacity-50"
          >
            Upload Resumes
          </button>
        </div>

        {/* Top-K Input */}
        {jdId && resumesUploaded && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Top Matches (Top-K)</label>
            <input
              type="number"
              min="1"
              value={top_k}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              placeholder="Enter number of top resumes"
              disabled={loading}
            />
          </div>
        )}

        {/* Matching Button */}
        {jdId && resumesUploaded && (
          <div className="text-center">
            <button
              onClick={getMatches}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition text-sm disabled:opacity-50"
            >
              Get Matching Resumes
            </button>
          </div>
        )}

        {/* Display Matches */}
        {matchedResumes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🔍 Matched Resumes:</h3>
            <div className="space-y-3">
              {matchedResumes.map((resume, idx) => (
                <div
                  key={idx}
                  className="border p-3 rounded-lg shadow-sm bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <div className="text-base font-medium text-gray-800">📄 {resume.filename}</div>
                    <div className="text-sm text-gray-600">Score: {(resume.score * 10).toFixed(4)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-2 mb-2 opacity-60">[Note: The score is between 0 to 10 , where 0 is minnimum and 10 is maximum]</p>
                 <button onClick={handleLogout} className="bg-green-600 rounded-sm p-1 text-white hover:cursor-pointer">Logout</button>

      </div>
    </div>
  );
}

export default RecruiterDashboard;
