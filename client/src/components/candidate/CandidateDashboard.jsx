import React, { useState } from "react";
import axios from "axios";
import SummaryResult from "./SummaryResult";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../recoil/userAtom";

function CandidateDashboard() {
  const [summaryFile, setSummaryFile] = useState(null);
  const [scoreFile, setScoreFile] = useState(null);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [resumeScore, setResumeScore] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
 
  const [result, setResult] = useState(null);
  const setLoading = useSetRecoilState(loadingState);

  const handleSummarySubmit = async () => {
    if (!summaryFile) {
      alert("Please select a resume file first.");
      return;
    }

    setGenerateLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", summaryFile);

      const token = localStorage.getItem("token");

      const response = await axios.post(`${BASE_URL}/resume/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Summary Result:", response.data.analysis);
      setResult(response.data); //
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to generate summary. Please try again.");
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleResumeSave = async () => {
    if (!summaryFile) {
      alert("Please select a resume file first.");
      return;
    }
    setGenerateLoading(true);

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", summaryFile);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/resume/save-resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Summary Result:", response.data);
      setLoading(false);
      alert("resume saved");
      setResult(null);
      // setResult(response.data);
      setGenerateLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error saving file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      // setGenerateLoading(false);
    }
  };

  const handleScoreSubmit = async () => {
    if (!scoreFile) {
      alert("Please select a resume file first.");
      return;
    }
    setGenerateLoading(true);

    try {
      //   setLoading(true);
      const formData = new FormData();
      formData.append("file", scoreFile);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/resume/rate-resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.rating);
      setResumeScore(response.data.rating);
      setGenerateLoading(false);
      setResult(null);
    //   setScoreFile(null)
      // setResult(response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error getting score", error);
      alert("Failed to get score. Please try again.");
    } finally {
      // setGenerateLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white via-green-100 to-purple-200 px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Is your resume good enough?
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
          A free and fast AI resume checker with two tools: summary generation
          and scoring.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Resume Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Resume Summary
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Get a concise AI-generated summary of your uploaded resume.
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0 file:text-sm file:font-semibold
                file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                onChange={(e) => setSummaryFile(e.target.files[0])}
              />
            </div>
            <button
              onClick={handleSummarySubmit}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-xl transition"
            >
              Generate Summary
            </button>
          </div>

          {/* Resume Score */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Resume Score
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Upload your resume to receive a detailed performance score.
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0 file:text-sm file:font-semibold
                file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                onChange={(e) => setScoreFile(e.target.files[0])}
              />
            </div>
            <button
              onClick={handleScoreSubmit}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition"
            >
              Get Score
            </button>
          </div>
        </div>

        {generateLoading && (
          <div className="max-w-5xl mx-auto mt-4">
            <div className="bg-white p-6 rounded-2xl shadow animate-pulse space-y-4">
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-100 rounded w-full"></div>
            </div>
          </div>
        )}
            {resumeScore !== null && (
  <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded-2xl shadow-md">
    <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">📊 Your Resume Score</h2>
    
    <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-700 ease-in-out"
        style={{ width: `${resumeScore*10}%` }}
      ></div>
    </div>

    <div className="text-center mt-4 text-3xl font-bold text-green-700">
      {resumeScore} / 10
    </div>

    <p className="text-sm text-gray-600 mt-2 text-center">
      This score is based on resume clarity, keyword usage, formatting, and relevance.
    </p>
  </div>
)}

        <p className="text-center text-xs text-gray-500 mt-10">
          🛡️ Privacy guaranteed. Your files are never stored.
        </p>
        <SummaryResult data={result} />
      </div>
      {result && (
        <button
          onClick={handleResumeSave}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition"
        >
          Save Resume
        </button>
      )}

    </>
  );
}

export default CandidateDashboard;
