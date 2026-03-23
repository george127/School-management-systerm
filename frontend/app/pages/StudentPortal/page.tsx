"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
import "./style/StudentPortal.css";
import Logo from "./images/appcode.png";
import PaymentInfo from "./PaymentInfo";
import Dashboard from "./Dashboard";
import FeesPayment from "./FeesPayment";
import CourseModule from "./CourseModule";
import CourseMaterial from "./CourseMaterial";
import CoursePerformance from "./CoursePerformance";
import CourseAssignment from "./CourseAssignment";
import CourseGrade from "./CourseGrade";
import CourseQuiz from "./CourseQuiz";
import Settings from "./Settings";

interface ProfileModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  studentData: any;
  fetchStudentData: () => void;
}
// Profile Modal Component
const ProfileModal = ({
  isOpen,
  setIsOpen,
  studentData,
  fetchStudentData,
}: ProfileModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get user from localStorage instead of Redux
  const getUserFromStorage = () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  };

  const user = getUserFromStorage();

  // Check URL params for modal open
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("modal") === "profile") {
        setIsOpen(true);
      }
    }
  }, [setIsOpen]);

  useEffect(() => {
    if (!user?.email) return;

    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/students/${user?.email}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user?.email]);

  const [profileImage, setProfileImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Phone number states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [editPhone, setEditPhone] = useState(false);
  const [newPhone, setNewPhone] = useState("");

  // User info states
  const [userName, setUserName] = useState("");
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState("");

  const [userEmail, setUserEmail] = useState("");
  const [editEmail, setEditEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const [editPassword, setEditPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // General states
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check for user data in localStorage
const checkUserData = () => {
  try {
    // Safely get stored user
    const userStr = localStorage.getItem("user");

    let parsedUser: {
      email?: string;
      name?: string;
      phone?: string;
    } | null = null;

    if (userStr) {
      try {
        parsedUser = JSON.parse(userStr);
      } catch (e) {
        console.error("Invalid JSON in user:", e);
      }
    }

    // Get email safely
    const userEmail: string | null =
      localStorage.getItem("userEmail") ||
      localStorage.getItem("email") ||
      parsedUser?.email ||
      null;

    // Get any stored data
    const userDataStr =
      localStorage.getItem("user") ||
      localStorage.getItem("userData") ||
      localStorage.getItem("studentData");

    if (userDataStr) {
      try {
        const userData: {
          email?: string;
          name?: string;
          phone?: string;
        } = JSON.parse(userDataStr);

        setUserData(userData);

        if (userData.email) {
          setUserEmail(userData.email);
          setNewEmail(userData.email);
        }

        if (userData.name) {
          setUserName(userData.name);
          setNewName(userData.name);
        }

        if (userData.phone) {
          setPhoneNumber(userData.phone);
          setNewPhone(userData.phone);
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    if (userEmail) {
      setUserEmail(userEmail);
      setNewEmail(userEmail);
      fetchProfileData(userEmail); // ✅ now guaranteed string
    } else {
      setMessage("User email not found in storage. Please log in again.");
    }
  } catch (error: any) {
    console.error("Error accessing localStorage:", error);
    setMessage(
      error?.message ||
        "Error accessing browser storage. Please check if cookies are enabled."
    );
  }
};

    checkUserData();
  }, []);

const fetchProfileData = async (email: string) => {
  if (!email) {
    setMessage("No email provided for fetching profile data");
    return;
  }

  try {
    setLoading(true);
    const token = localStorage.getItem("token");

    /* ================= USER PROFILE ================= */

    try {
      const userResponse = await fetch(
        `http://localhost:5000/api/profile/${email}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const userData: {
        success: boolean;
        user?: {
          name?: string;
          email?: string;
        };
      } = await userResponse.json();

      if (userData.success && userData.user) {
        const userDataInfo = userData.user;

        if (userDataInfo.name) {
          setUserName(userDataInfo.name);
          setNewName(userDataInfo.name);
        }

        if (userDataInfo.email) {
          setUserEmail(userDataInfo.email);
          setNewEmail(userDataInfo.email);
        }

        // ✅ Safe localStorage update
        try {
          const existingStr = localStorage.getItem("user");

          if (existingStr) {
            const existingData: {
              name?: string;
              email?: string;
            } = JSON.parse(existingStr);

            existingData.name = userDataInfo.name;
            existingData.email = userDataInfo.email;

            localStorage.setItem("user", JSON.stringify(existingData));
          }
        } catch (e) {
          console.error("Error updating localStorage:", e);
        }
      }
    } catch (userError) {
      console.log("User endpoint issue:", userError);
    }

    /* ================= PROFILE IMAGE ================= */

    try {
      const imageResponse = await fetch(
        `http://localhost:5000/api/profile/profile-image/${email}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const imageData: {
        success: boolean;
        profileImage?: string;
      } = await imageResponse.json();

      if (imageData.success && imageData.profileImage) {
        setProfileImage(imageData.profileImage);
      }
    } catch (imageError) {
      console.log("Image endpoint issue:", imageError);
    }

    /* ================= PHONE ================= */

    try {
      const phoneResponse = await fetch(
        `http://localhost:5000/api/profile/phone/${email}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const phoneData: {
        success: boolean;
        phone?: string;
      } = await phoneResponse.json();

      if (phoneData.success && phoneData.phone) {
        setPhoneNumber(phoneData.phone);
        setNewPhone(phoneData.phone);
      }
    } catch (phoneError) {
      console.log("Phone endpoint issue:", phoneError);
    }

    setMessage("");
  } catch (error: any) {
    console.error("Error fetching profile data:", error);

    if (error?.message === "Failed to fetch") {
      setMessage(
        "Cannot connect to server. Make sure backend is running on port 5000."
      );
    } else {
      setMessage(
        "Failed to fetch profile data: " +
          (error?.message || "Unknown error")
      );
    }
  } finally {
    setLoading(false);
  }
};

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage("File size must be less than 2MB");
        return;
      }

      // Check file type
      if (!file.type.match("image.*")) {
        setMessage("Please select an image file (JPEG, PNG, etc.)");
        return;
      }

      setSelectedFile(file);
      setMessage("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!userEmail) {
      setMessage("User email not found. Please log in again.");
      return;
    }

    if (!selectedFile) {
      setMessage("Please select an image first");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Convert image to base64 for storage
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const base64Image = reader.result;
        const token = localStorage.getItem("token");

        try {
          const response = await fetch(
            `http://localhost:5000/api/profile/profile-image/${userEmail}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
              body: JSON.stringify({ profileImage: base64Image }),
            },
          );

          const data = await response.json();

          if (data.success) {
            setProfileImage(data.profileImage);
            setMessage("Profile image updated successfully!");
            setSelectedFile(null);
            setPreview("");
            // Refresh parent data
            if (fetchStudentData) fetchStudentData();
          } else {
            setMessage(data.message || "Failed to update profile image");
          }
        } catch (error) {
          console.error("Error updating profile image:", error);
          if (error.message === "Failed to fetch") {
            setMessage(
              "Cannot connect to server. Please make sure the backend is running.",
            );
          } else {
            setMessage("Failed to update profile image: " + error.message);
          }
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setMessage("Something went wrong while processing the image");
        setLoading(false);
      };
    } catch (error) {
      console.error("Error in handleUpload:", error);
      setMessage("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handlePhoneUpdate = async () => {
    if (!userEmail) {
      setMessage("User email not found. Please log in again.");
      return;
    }

    if (!newPhone) {
      setMessage("Please enter a valid phone number");
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    if (!phoneRegex.test(newPhone.replace(/[\s()-]/g, ""))) {
      setMessage("Please enter a valid phone number (10-15 digits)");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/profile/phone/${userEmail}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ phone: newPhone }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setPhoneNumber(newPhone);
        setEditPhone(false);
        setMessage("Phone number updated successfully!");

        // Update local storage if phone is stored there
        try {
          const userDataStr =
            localStorage.getItem("user") ||
            localStorage.getItem("userData") ||
            localStorage.getItem("studentData");
          if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            userData.phone = newPhone;
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch (e) {
          console.error("Error updating local storage:", e);
        }
        // Refresh parent data
        if (fetchStudentData) fetchStudentData();
      } else {
        setMessage(data.message || "Failed to update phone number");
      }
    } catch (error) {
      console.error("Error updating phone number:", error);
      if (error.message === "Failed to fetch") {
        setMessage(
          "Cannot connect to server. Please make sure the backend is running.",
        );
      } else {
        setMessage("Failed to update phone number: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNameUpdate = async () => {
    if (!userEmail) {
      setMessage("User email not found. Please log in again.");
      return;
    }

    if (!newName) {
      setMessage("Please enter a valid name");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/profile/name/${userEmail}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ name: newName }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setUserName(newName);
        setEditName(false);
        setMessage("Name updated successfully!");

        // Update local storage
        try {
          const userDataStr =
            localStorage.getItem("user") || localStorage.getItem("userData");
          if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            userData.name = newName;
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch (e) {
          console.error("Error updating local storage:", e);
        }
        // Refresh parent data
        if (fetchStudentData) fetchStudentData();
      } else {
        setMessage(data.message || "Failed to update name");
      }
    } catch (error) {
      console.error("Error updating name:", error);
      if (error.message === "Failed to fetch") {
        setMessage(
          "Cannot connect to server. Please make sure the backend is running.",
        );
      } else {
        setMessage("Failed to update name: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async () => {
    if (!userEmail) {
      setMessage("User email not found. Please log in again.");
      return;
    }

    if (!newEmail) {
      setMessage("Please enter a valid email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setMessage("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/profile/email/${userEmail}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ newEmail }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setUserEmail(newEmail);
        setEditEmail(false);
        setMessage("Email updated successfully!");

        // Update local storage
        try {
          const userDataStr =
            localStorage.getItem("user") || localStorage.getItem("userData");
          if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            userData.email = newEmail;
            localStorage.setItem("user", JSON.stringify(userData));
          }
          localStorage.setItem("userEmail", newEmail);
        } catch (e) {
          console.error("Error updating local storage:", e);
        }
        // Refresh parent data
        if (fetchStudentData) fetchStudentData();
      } else {
        setMessage(data.message || "Failed to update email");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      if (error.message === "Failed to fetch") {
        setMessage(
          "Cannot connect to server. Please make sure the backend is running.",
        );
      } else {
        setMessage("Failed to update email: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!userEmail) {
      setMessage("User email not found. Please log in again.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/profile/password/${userEmail}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setEditPassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage("Password updated successfully!");
      } else {
        setMessage(data.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.message === "Failed to fetch") {
        setMessage(
          "Cannot connect to server. Please make sure the backend is running.",
        );
      } else {
        setMessage("Failed to update password: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = (field) => {
    switch (field) {
      case "name":
        setNewName(userName);
        setEditName(false);
        break;
      case "email":
        setNewEmail(userEmail);
        setEditEmail(false);
        break;
      case "password":
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setEditPassword(false);
        break;
      case "phone":
        setNewPhone(phoneNumber);
        setEditPhone(false);
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? "active" : ""}`}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="modal-content profile-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-manager-container">
          {loading && <div className="loading">Loading...</div>}

          {message && (
            <div
              className={
                message.includes("success")
                  ? "message success"
                  : "message error"
              }
            >
              {message}
            </div>
          )}

          {/* User Info Section */}
          <div className="user-info-section">
            <h3>Personal Information</h3>
            <br />
            <br />
            {/* Profile Image Section */}
            <div className="profile-section">
              <div className="current-image">
                <h3>Profile Image</h3>
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="profile-img"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                      setMessage(
                        "Error loading profile image. Showing default avatar.",
                      );
                    }}
                  />
                ) : (
                  <div className="no-image">
                    <p>No profile image set</p>
                    <div className="default-avatar"></div>
                  </div>
                )}
              </div>

              <div className="update-section">
                <h3>Update Profile Image</h3>
                <div className="file-input-container">
                  <div className="btn-container">
                    <label htmlFor="profile-upload" className="btn">
                      Choose Image
                      <span className="material-symbols-outlined">east</span>
                    </label>
                  </div>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={loading || !userEmail}
                  />
                  {selectedFile && (
                    <span className="file-name">{selectedFile.name}</span>
                  )}
                </div>

                {preview && (
                  <div className="preview">
                    <h4>Preview</h4>
                    <img src={preview} alt="Preview" className="preview-img" />
                  </div>
                )}

                <div className="btn-container">
                  <button
                    onClick={handleImageUpload}
                    disabled={!selectedFile || loading || !userEmail}
                    className="btn"
                  >
                    {loading ? "Uploading..." : "Upload Image"}
                    <span className="material-symbols-outlined">east</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Name Field */}
            <div className="info-field">
              <label>Name</label>
              {editName ? (
                <div className="edit-field">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    disabled={loading}
                    className="info-input"
                  />
                  <div className="field-buttons">
                    <div className="btn-container">
                      <button
                        onClick={handleNameUpdate}
                        disabled={loading}
                        className="btn"
                      >
                        Save
                        <span className="material-symbols-outlined">east</span>
                      </button>
                      <button
                        onClick={() => cancelEdit("name")}
                        disabled={loading}
                        className="btn"
                      >
                        Cancel
                        <span className="material-symbols-outlined">east</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="display-field">
                  <span>{userName || "Not set"}</span>
                  <div className="btn-container">
                    <button onClick={() => setEditName(true)} className="btn">
                      Edit
                      <span className="material-symbols-outlined">east</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="info-field">
              <label>Email</label>
              {editEmail ? (
                <div className="edit-field">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    disabled={loading}
                    className="info-input"
                  />
                  <div className="field-buttons">
                    <div className="btn-container">
                      <button
                        onClick={handleEmailUpdate}
                        disabled={loading}
                        className="btn"
                      >
                        Save
                        <span className="material-symbols-outlined">east</span>
                      </button>
                      <button
                        onClick={() => cancelEdit("email")}
                        disabled={loading}
                        className="btn"
                      >
                        Cancel
                        <span className="material-symbols-outlined">east</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="display-field">
                  <span>{userEmail || "Not set"}</span>
                  <div className="btn-container">
                    <button onClick={() => setEditEmail(true)} className="btn">
                      Edit
                      <span className="material-symbols-outlined">east</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="info-field">
              <label>Password</label>
              {editPassword ? (
                <div className="edit-field">
                  <div className="password-input-container">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current password"
                      disabled={loading}
                      className="info-input"
                    />
                    <span
                      className="password-toggle"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      <span className="material-symbols-outlined">
                        {showCurrentPassword ? "visibility_off" : "visibility"}
                      </span>
                    </span>
                  </div>

                  <div className="password-input-container">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      disabled={loading}
                      className="info-input"
                    />
                    <span
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <span className="material-symbols-outlined">
                        {showNewPassword ? "visibility_off" : "visibility"}
                      </span>
                    </span>
                  </div>

                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      disabled={loading}
                      className="info-input"
                    />
                    <span
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <span className="material-symbols-outlined">
                        {showConfirmPassword ? "visibility_off" : "visibility"}
                      </span>
                    </span>
                  </div>

                  <div className="field-buttons">
                    <div className="btn-container">
                      <button
                        onClick={handlePasswordUpdate}
                        disabled={loading}
                        className="btn"
                      >
                        Save
                        <span className="material-symbols-outlined">east</span>
                      </button>
                      <button
                        onClick={() => cancelEdit("password")}
                        disabled={loading}
                        className="btn"
                      >
                        Cancel
                        <span className="material-symbols-outlined">east</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="display-field">
                  <span>••••••••</span>
                  <div className="btn-container">
                    <button
                      onClick={() => setEditPassword(true)}
                      className="btn"
                    >
                      Edit
                      <span className="material-symbols-outlined">east</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Phone Number Section */}
            <div className="info-field">
              <label>Phone Number</label>
              {editPhone ? (
                <div className="edit-field">
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    disabled={loading}
                    className="info-input"
                  />
                  <div className="phone-buttons">
                    <div className="btn-container">
                      <button
                        onClick={handlePhoneUpdate}
                        disabled={loading}
                        className="btn"
                      >
                        Save
                        <span className="material-symbols-outlined">east</span>
                      </button>
                      <button
                        onClick={() => cancelEdit("phone")}
                        disabled={loading}
                        className="btn"
                      >
                        Cancel
                        <span className="material-symbols-outlined">east</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="phone-display">
                  <p className="phone-number">
                    {phoneNumber || "No phone number set"}
                  </p>
                  <div className="btn-container">
                    <button onClick={() => setEditPhone(true)} className="btn">
                      Edit
                      <span className="material-symbols-outlined">east</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main StudentPortal Component
const StudentPortal = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Get user from localStorage instead of Redux
  const getUserFromStorage = () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  };

  const user = getUserFromStorage();
  const userEmail = user?.email;

  // Check if user is authenticated
  const isAuthenticated = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      return !!token && !!user;
    }
    return false;
  };

  const togglePaymentDropdown = () => {
    setIsPaymentDropdownOpen(!isPaymentDropdownOpen);
  };

  const toggleCoursesDropdown = () => {
    setIsCoursesDropdownOpen(!isCoursesDropdownOpen);
  };

  const fetchStudentData = useCallback(async () => {
    if (!user?.email) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/students/${user?.email}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch student data");
      }

      const data = await response.json();
      setStudentData(data.student);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  // Check authentication on mount and redirect if not authenticated
  useEffect(() => {
    if (typeof window !== "undefined" && !isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    // Clear all auth data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userData");
    localStorage.removeItem("studentData");

    // Redirect to login
    router.push("/login");
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p>Error: {error}</p>
      </div>
    );

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="p-container">
          <div
            className="sidebar-profile"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <img
              src={
                studentData?.personalDetails?.profileImage ||
                "/default-profile.png"
              }
              alt="Profile Icon"
              className="p-image"
              onError={(e) => {
                e.target.src = "/default-profile.png";
              }}
            />
          </div>
          <p className="name">{user?.name}</p>
        </div>
        <ul className="p-3 nav flex-column">
          <li className="mb-3 nav-item">
            <button
              className={`nav-link ${
                activeSection === "dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveSection("dashboard")}
            >
              <i className="bi bi-speedometer2 me-2"></i>
              Dashboard
            </button>
          </li>
          <li className="mb-3 nav-item">
            <div className="sidebar-item">
              <div className="dropdown-header" onClick={togglePaymentDropdown}>
                <button
                  className={`nav-link ${
                    isPaymentDropdownOpen ? "active" : ""
                  }`}
                >
                  <i className="bi bi-card-list me-2"></i>
                  Payment Info
                  <span
                    className={`arrow-icon ${
                      isPaymentDropdownOpen ? "open" : ""
                    }`}
                  >
                    &#9662;
                  </span>
                </button>
              </div>
              {isPaymentDropdownOpen && (
                <div className="dropdown-list">
                  <div
                    className={`dropdown-item ${
                      activeSection === "feespayment" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("feespayment")}
                  >
                    Fees Payment
                  </div>
                  <div
                    className={`dropdown-item ${
                      activeSection === "paymentdetails" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("paymentdetails")}
                  >
                    Payment Details
                  </div>
                </div>
              )}
            </div>
          </li>
          <li className="mb-3 nav-item">
            <div className="sidebar-item">
              <div className="dropdown-header" onClick={toggleCoursesDropdown}>
                <button
                  className={`nav-link ${
                    isCoursesDropdownOpen ? "active" : ""
                  }`}
                >
                  <i className="bi bi-book me-2"></i>
                  Courses
                  <span
                    className={`arrow-icon ${
                      isCoursesDropdownOpen ? "open" : ""
                    }`}
                  >
                    &#9662;
                  </span>
                </button>
              </div>
              {isCoursesDropdownOpen && (
                <div className="dropdown-list">
                  <div
                    className={`dropdown-item ${
                      activeSection === "course Module" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("course Module")}
                  >
                    course Module
                  </div>
                  <div
                    className={`dropdown-item ${
                      activeSection === "course material" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("course material")}
                  >
                    course material
                  </div>
                  <div
                    className={`dropdown-item ${
                      activeSection === "Performance" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("Performance")}
                  >
                    Performance
                  </div>
                  <div
                    className={`dropdown-item ${
                      activeSection === "Grade" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("Grade")}
                  >
                    Grade
                  </div>
                  <div
                    className={`dropdown-item ${
                      activeSection === "Assignment" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("Assignment")}
                  >
                    Assignment
                  </div>
                  <div
                    className={`dropdown-item ${
                      activeSection === "quiz" ? "active" : ""
                    }`}
                    onClick={() => setActiveSection("quiz")}
                  >
                    quiz
                  </div>
                </div>
              )}
            </div>
          </li>

          <li className="mb-3 nav-item">
            <button
              className={`nav-link ${
                activeSection === "settings" ? "active" : ""
              }`}
              onClick={() => setActiveSection("settings")}
            >
              <i className="bi bi-gear me-2"></i>
              Settings
            </button>
          </li>
          <li className="mb-3 nav-item">
            <button
              className={`nav-link ${
                activeSection === "logout" ? "active" : ""
              }`}
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Log Out
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="nav-container">
          <div className="navba">
            <div className="navbar-left">
              <Image
                src={Logo}
                alt="AppCode Logo"
                className="logo"
                width={120}
                height={40}
              />
            </div>
            <div className="navbar-center">
              <div className="search-bar">
                <i className="bi bi-search search-icon"></i>
                <input type="text" placeholder="Search..." />
              </div>
            </div>
            <div className="navbar-right">
              <i className="bi bi-envelope message-icon" title="Messages"></i>
              <i
                className="bi bi-bell notification-icon"
                title="Notifications"
              ></i>
            </div>
          </div>
        </div>
        {activeSection === "dashboard" && (
          <div className="md-4">
            <Dashboard studentData={studentData} />
          </div>
        )}
        {activeSection === "paymentdetails" && (
          <div className="mb-4">
            <PaymentInfo email={userEmail} />
          </div>
        )}
        {activeSection === "feespayment" && (
          <div className="mb-4">
            <FeesPayment studentData={studentData} />
          </div>
        )}
        {activeSection === "course Module" && (
          <div className="section">
            <CourseModule studentData={studentData} />
          </div>
        )}
        {activeSection === "course material" && (
          <div className="section">
            <CourseMaterial studentData={studentData} />
          </div>
        )}
        {activeSection === "Performance" && (
          <div className="section">
            <CoursePerformance studentData={studentData} />
          </div>
        )}
        {activeSection === "Grade" && (
          <div className="section">
            <CourseGrade studentData={studentData} />
          </div>
        )}
        {activeSection === "Assignment" && (
          <div className="section">
            <CourseAssignment studentData={studentData} />
          </div>
        )}
        {activeSection === "quiz" && (
          <div className="section">
            <CourseQuiz studentData={studentData} />
          </div>
        )}
        {activeSection === "settings" && (
          <div className="mb-4 section">
            <Settings studentData={studentData} />
          </div>
        )}
        {/* Footer */}
        <div className="footer">
          <p>
            &copy; {new Date().getFullYear()} AppCode Student Portal. All rights
            reserved.
          </p>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        setIsOpen={setIsProfileModalOpen}
        studentData={studentData}
        fetchStudentData={fetchStudentData}
      />
    </div>
  );
};

export default StudentPortal;
