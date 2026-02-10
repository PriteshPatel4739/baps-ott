"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/lib/api";
import { CheckCircle, X } from "lucide-react";

type AuthMode = "login" | "register";

interface LoginPageProps {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ mode, setMode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Auto-hide popup after 5 seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await loginUser({
        username: loginUsername,
        password: loginPassword,
      });

      // Check for success status (200 or 201)
      if (response.status === 200 || response.status === 201) {
        // Store token and token_type in localStorage
        if (response.token) {
          localStorage.setItem("authToken", response.token);
        }
        if (response.tokenType) {
          localStorage.setItem("tokenType", response.tokenType);
        }
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        // Redirect to home page
        router.push("/");
      } else {
        // Show error message from API
        setError(response.message || "Login failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (registerPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (registerPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser({
        email: registerEmail,
        username: registerUsername,
        password: registerPassword,
        name: registerName,
      });

      // Check for success status (200 or 201)
      if (response.status === 200 || response.status === 201) {
        // Clear registration form
        setRegisterName("");
        setRegisterEmail("");
        setRegisterUsername("");
        setRegisterPassword("");
        setConfirmPassword("");
        
        // Show success popup and switch to login
        setSuccessMessage("Registered successfully! Please login with your credentials.");
        setShowPopup(true);
        setMode("login");
      } else {
        // Show error message from API
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSuccessMessage(null);
  };

  return (
    <>
      {/* Success Popup */}
      {showPopup && successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-md">
            <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
            <p className="text-green-800 font-medium flex-1">{successMessage}</p>
            <button
              onClick={closePopup}
              className="text-green-600 hover:text-green-800 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/30 backdrop-blur-xl shadow-xl p-8 rounded-2xl w-full max-w-md">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Welcome Back
            </h2>

            {/* Username Field */}
            <div>
              <label htmlFor="loginUsername" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="loginUsername"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full rounded-full px-4 py-3 bg-white/60 outline-none border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition text-gray-800"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="loginPassword"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-full px-4 py-3 bg-white/60 outline-none border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition text-gray-800"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            {/* Switch to Register */}
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                  setShowPopup(false);
                }}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Register
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Create Account
            </h2>

            {/* Full Name Field */}
            <div>
              <label htmlFor="registerName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="registerName"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-full px-4 py-3 bg-white/60 outline-none border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition text-gray-800"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="registerEmail"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-full px-4 py-3 bg-white/60 outline-none border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition text-gray-800"
                required
              />
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="registerUsername" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="registerUsername"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                placeholder="Choose a username"
                className="w-full rounded-full px-4 py-3 bg-white/60 outline-none border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition text-gray-800"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="registerPassword"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Create a password (min 8 characters)"
                className="w-full rounded-full px-4 py-3 bg-white/60 outline-none border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition text-gray-800"
                required
                minLength={8}
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-full px-4 py-3 bg-white/60 outline-none border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition text-gray-800"
                required
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? "Creating Account..." : "Register"}
            </button>

            {/* Switch to Login */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Login
              </button>
            </p>
          </form>
        )}
      </div>
    </>
  );
};

export default LoginPage;
