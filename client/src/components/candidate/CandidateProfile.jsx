import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from 'recoil';
import { loadingState } from '../../recoil/userAtom';
import { useNavigate } from "react-router-dom";

function CandidateProfile() {
  const [resumes, setResumes] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState({});
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const setLoading = useSetRecoilState(loadingState);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "candidate") {
      fetchResumes();
    }
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/resume/get-resumes-of-the-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResumes(res.data);
    } catch (err) {
      console.error("Error fetching resumes:", err);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8000/resume/delete-resume${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResumes(resumes.filter((resume) => resume.id !== id));
    } catch (err) {
      console.error("Error deleting resume:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAnalysis = (id) => {
    setShowAnalysis((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (role !== "candidate") {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        Access Denied: Not a candidate
      </div>
    );
  }

  const handleLogout=()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/")
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">📄 Your Uploaded Resumes</h2>

      {resumes.length === 0 ? (
        <div className="text-center text-gray-500">No resumes uploaded yet.</div>
      ) : (
        <ul className="space-y-6">
          {resumes.map((resume) => {
            const analysis = JSON.parse(resume.resume_ai_response || "{}");
            return (
              <li key={resume.id} className="bg-white shadow-md rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-medium text-gray-800">{resume.resume_name}</span>
                  <div className="space-x-2">
                    <a
                      href={resume.resume_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </a>
                    <button
                      onClick={() => toggleAnalysis(resume.id)}
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    >
                      {showAnalysis[resume.id] ? "Hide" : "Show"} Analysis Report
                    </button>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {showAnalysis[resume.id] && (
                  <div className="bg-gray-50 border rounded-lg p-4 mt-4 text-sm space-y-2">
                    <div>
                      <strong>✅ Strengths:</strong>
                      <ul className="list-disc list-inside text-green-700">
                        {analysis.strengths?.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>⚠️ Weaknesses:</strong>
                      <ul className="list-disc list-inside text-yellow-700">
                        {analysis.weaknesses?.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>💼 Suggested Roles:</strong>
                      <ul className="list-disc list-inside text-blue-700">
                        {analysis.job_role_suggestions?.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>📌 Overall Suggestions:</strong>
                      <ul className="list-disc list-inside text-gray-700">
                        {analysis.overall_suggestions?.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Go back to Dashboard link */}
      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/candidate-dashboard")}
          className="text-blue-600 hover:underline text-sm cursor-pointer"
        >
          ← Go back to Dashboard
        </button> <br></br><br></br>
         <button onClick={handleLogout} className="bg-green-600 rounded-sm p-1 text-white hover:cursor-pointer">Logout</button>
      </div>
     
    </div>

    
  );
}

export default CandidateProfile;
