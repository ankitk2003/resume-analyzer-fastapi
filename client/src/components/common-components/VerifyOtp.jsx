import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { loadingState } from "../../recoil/userAtom";
import axios from "axios";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const setLoading = useSetRecoilState(loadingState);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const role = localStorage.getItem("role");
    console.log("Entered OTP:", otp, "Role:", role);

    try {
      setLoading(true);
      const endpoint =
        role === "recruiter" ? "/recruiter/verify-otp" : "/user/verify-otp";

      const res = await axios.post(`${BASE_URL}${endpoint}`, {
        otp,
      });

      console.log("OTP Verification success:", res.data);
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      navigate("/recruiter-dashboard");
    } catch (error) {
      console.error("OTP verification error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 to-teal-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to your email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
            placeholder="Enter OTP"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-center tracking-widest text-xl font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
