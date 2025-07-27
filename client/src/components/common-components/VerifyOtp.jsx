import React, { useState } from 'react';

function VerifyOtp() {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Entered OTP:', otp);
    // TODO: Send OTP to backend for verification
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 to-teal-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Verify OTP</h2>

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
