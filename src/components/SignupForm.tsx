"use client";
import { useState } from "react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white/30 backdrop-blur-xl shadow-xl p-8 rounded-2xl w-full max-w-md">
      <h2 className="text-xl font-semibold mb-1">Register</h2>
      <p className="text-xs text-gray-700 mb-5">
        Enter your personal information
      </p>

      {/* Username */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full rounded-full px-4 py-2 bg-white/40 outline-none"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full rounded-full px-4 py-2 bg-white/40 outline-none"
        />
      </div>

      {/* Password */}
      <div className="mb-4 relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          className="w-full rounded-full px-4 py-2 bg-white/40 outline-none"
        />
        <button
          className="absolute right-4 top-2 text-xs"
          onClick={() => setShowPassword(!showPassword)}
        >
          👁
        </button>
      </div>

      {/* Confirm Password */}
      <div className="mb-6 relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter confirm password"
          className="w-full rounded-full px-4 py-2 bg-white/40 outline-none"
        />
        <button
          className="absolute right-4 top-2 text-xs"
          onClick={() => setShowPassword(!showPassword)}
        >
          👁
        </button>
      </div>

      {/* Register Button */}
      <button className="w-full bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition">
        Register
      </button>
    </div>
  );
}
