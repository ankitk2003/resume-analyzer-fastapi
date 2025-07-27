import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 to-teal-100 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Smart Resume Analysis for Job Seekers and Recruiters Alike
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Use AI to analyze your CV or find the best candidate for your job description.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/candidate-signup" className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition">
            Analyze Your CV
          </Link>
          <Link to="/recruiter-signup" className="px-6 py-3 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 transition">
            Recruiter: Find Matching CVs
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
