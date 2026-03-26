"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./LogInPage.css";
import loginImage from "../assets/login.png";
import logoImage from "../components/Header/appcode.png";
import Header from "../components/Header/HeaderPage";
import Navigation from "../components/Navigation/NavPage";
import Footer from "../components/footer/Footer";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Function to validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate inputs before form submission
  const validateInputs = () => {
    if (!email) {
      setErrorMessage("Email is required.");
      return false;
    }
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      setErrorMessage("Password is required.");
      return false;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: email.toLowerCase(), // Normalize email to lowercase
            password 
          }),
          // Removed credentials: "include" since backend uses token-based auth
        },
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases from backend
        setErrorMessage(data.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // Store user data and tokens in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token); // Store the JWT token
      
      // Optionally store Cognito tokens if needed for other services
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      
      // Store token expiry if needed
      if (data.expiresIn) {
        const expiryTime = new Date().getTime() + (data.expiresIn * 1000);
        localStorage.setItem("tokenExpiry", expiryTime.toString());
      }

      setSuccessMessage("Login successful! Redirecting...");

      // Determine redirect based on role
      const roleFromResponse = data?.user?.role;
      const isAdmin = roleFromResponse === "admin";
      const destination = isAdmin ? "/AdminDashboard" : "pages/StudentPortal";

      // Short timeout to show success message before redirect
      setTimeout(() => router.push(destination), 600);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Unable to connect to server. Please check your internet connection and try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Navigation />

      {/* Breadcrumb Navigation */}
      <div className="container navigate">
        <div className="items">
          <Link href="/">Home</Link>
          <span className="material-symbols-outlined">arrow_and_edge</span>
        </div>
        <span>Log In</span>
      </div>

      {/* Login Section */}
      <div className="login-container container">
        <div className="image-container">
          <Image
            src={loginImage}
            alt="Login Background"
            className="login-image"
            width={500}
            height={600}
            priority
          />
        </div>

        <div className="login-wrapper">
          <div className="login-card">
            <div className="logo-container">
              <Image src={logoImage} alt="Logo" width={120} height={50} />
            </div>
            <h2 className="login-title">Login into Your Account</h2>

            {/* Success Message */}
            {successMessage && (
              <div className="login-alert success">{successMessage}</div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="login-alert error">{errorMessage}</div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div className="form-group password-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <span
                  className="toggle-password"
                  onClick={() => !loading && setShowPassword(!showPassword)}
                  role="button"
                  tabIndex={0}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              {/* Submit Button */}
              <div className="btn-container">
                <button
                  type="submit"
                  className="btn btn-submit"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                  <span className="material-symbols-outlined">east</span>
                </button>
              </div>
            </form>

            {/* Forgot Password Link */}
            <div className="forgot-password">
              <Link href="/forgot-password">Forgot Password?</Link>
            </div>

            {/* Sign Up Link */}
            <div className="signup-link">
              Don&apos;t have an account?
              <Link href="/signup">Create an account</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LoginPage;