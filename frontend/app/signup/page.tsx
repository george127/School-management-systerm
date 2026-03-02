"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css";
import signupImage from "../assets/signup.png";
import logoImage from "../components/Header/appcode.png";
import Header from "../components/Header/HeaderPage";
import Navigation from "../components/Navigation/NavPage";
import Footer from "../components/footer/Footer";


const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validations
  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Function to validate strong password
  const isPasswordValid = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Basic Validation
    if (!email || !password || !name || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    // Validate email
    if (!isEmailValid(email)) {
      setError("Invalid email format. Please provide a valid email.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Validate password
    if (!isPasswordValid(password)) {
      setError(
        "Password must have at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://acg-7euk.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Sign-up successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(data.message || "Sign-up failed.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
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
        <span>Sign Up</span>
      </div>

      {/* Sign Up Section */}
      <div className="signup-container container">
        <div className="image-container">
          <Image
            src={signupImage}
            alt="Signup Background"
            className="signup-image"
            width={570}
            height={600}
            priority
          />
        </div>
        
        <div className="signup-wrapper">
          <div className="signup-card">
            <div className="logo-container">
              <Image
                src={logoImage}
                alt="Logo"
                width={160}
                height={50}
              />
            </div>
            <h2 className="signup-title">Create a New Account</h2>

            {/* Error Alert */}
            {error && <div className="signup-alert error">{error}</div>}

            {/* Success Alert */}
            {success && <div className="signup-alert success">{success}</div>}

            <form onSubmit={handleSubmit} className="signup-form">
              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="form-group password-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  tabIndex={0}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              {/* Confirm Password Field */}
              <div className="form-group password-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  role="button"
                  tabIndex={0}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </span>
              </div>

              {/* Submit Button */}
              <div className="btn-container">
                <button type="submit" className="btn btn-submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Sign Up"}
                  <span className="material-symbols-outlined">east</span>
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="login-link">
              Already have an account?
              <Link href="/login">Login into Account</Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default SignUpPage;