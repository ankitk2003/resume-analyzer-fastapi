import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../recoil/userAtom";
import axios from "axios";

function Recruiter_signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const setLoading = useSetRecoilState(loadingState);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup Data:", formData);

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/recruiter/sign-up`, {
        user_name: formData.username,
        email: formData.email,
        password: formData.password,
      });

      console.log("Recruiter signup success:", res.data);
      localStorage.setItem("role", "recruiter");
            navigate("/verify-otp");

    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 to-teal-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Recruiter Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/recruiter-login" className="text-teal-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Recruiter_signup;
