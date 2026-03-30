"use client";

import "../Header/HeaderPage.css";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import logo from "./appcode.png";

/* =========================
   Types
========================= */

interface User {
  id?: string;
  fullName: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface CheckAuthResponse {
  success: boolean;
  user?: User;
}

/* =========================
   Helper Functions
========================= */

// Function to get initials from full name
const getInitials = (fullName: string): string => {
  if (!fullName) return "U";
  
  const names = fullName.trim().split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  if (names.length >= 2) return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  return "U";
};

// Function to get avatar URL - uses name for initials
const getAvatarUrl = (user: User | null): string => {
  // If no user at all → avatar
  if (!user) {
    return "https://ui-avatars.com/api/?background=4F46E5&color=fff&bold=true&size=128&name=User";
  }

  // If real profile image exists → USE IT
  if (user.profileImage && user.profileImage.trim() !== "") {
    return user.profileImage;
  }

  // Otherwise generate avatar from name
  const nameForAvatar = user.fullName || "User";

  return `https://ui-avatars.com/api/?background=4F46E5&color=fff&bold=true&size=128&name=${encodeURIComponent(nameForAvatar)}`;
};

// Function to fetch user profile data (same as StudentPortal)
const fetchUserProfileData = async (email: string): Promise<{ name: string; email: string; profileImage?: string } | null> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/api/profile/${email}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    
    const data = await response.json();
    
    if (data.success && data.user) {
      return {
        name: data.user.name,
        email: data.user.email,
        profileImage: data.user.profileImage
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Function to fetch profile image only
const fetchProfileImage = async (email: string): Promise<string | null> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const token = localStorage.getItem("token");
    
    const response = await fetch(
      `${API_URL}/api/profile/profile-image/${email}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    
    const data = await response.json();
    
    if (data.success && data.profileImage) {
      return data.profileImage;
    }
    return null;
  } catch (error) {
    console.error("Error fetching profile image:", error);
    return null;
  }
};

/* =========================
   Component
========================= */

export default function Header() {
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string>("");

  /* =========================
     Effects
  ========================= */

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Fetch profile data when user is loaded (same as StudentPortal)
  useEffect(() => {
    if (user?.email) {
      loadUserProfileData(user.email);
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | globalThis.MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside as EventListener);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as EventListener,
      );
    };
  }, []);

  /* =========================
     Auth Logic
  ========================= */

  // Load user profile data - same method as StudentPortal
  const loadUserProfileData = async (email: string) => {
    const profileData = await fetchUserProfileData(email);
    
    if (profileData) {
      // Update user with fresh data from API
      const updatedUser = {
        ...user,
        fullName: profileData.name,
        email: profileData.email,
        profileImage: profileData.profileImage || user?.profileImage
      };
      
      setUser(updatedUser as User);
      
      // Update localStorage with fresh data
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Load profile image separately if needed
      if (profileData.profileImage) {
        setProfileImage(profileData.profileImage);
      } else {
        // Try to fetch profile image from separate endpoint
        const image = await fetchProfileImage(email);
        if (image) {
          setProfileImage(image);
          const userWithImage = { ...updatedUser, profileImage: image };
          setUser(userWithImage as User);
          localStorage.setItem("user", JSON.stringify(userWithImage));
        }
      }
    }
  };

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const storedUserRaw = localStorage.getItem("user");

      if (!storedUserRaw) {
        setLoading(false);
        return;
      }

      const storedUser: User = JSON.parse(storedUserRaw);

      const roleLower = storedUser.role?.toLowerCase() ?? "";
      const emailLower = storedUser.email?.toLowerCase() ?? "";

      // Admin shortcut
      if (roleLower === "admin" || emailLower === "admin@appcode.com") {
        setUser(storedUser);
        if (storedUser.profileImage) {
          setProfileImage(storedUser.profileImage);
        }
        setLoading(false);
        return;
      }

      // Temporarily set stored user
      setUser(storedUser);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/auth/check-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: storedUser.email }),
      });

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data: CheckAuthResponse = await response.json();

      if (data.success && data.user) {
        const mergedUser: User = {
          ...data.user,
          role: storedUser.role || data.user.role || "student",
        };

        setUser(mergedUser);
        localStorage.setItem("user", JSON.stringify(mergedUser));
        
        // Fetch full profile data (name, etc.) from profile endpoint
        await loadUserProfileData(mergedUser.email);
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth error:", error);
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Helpers
  ========================= */

  const isAdmin: boolean =
    user?.role?.toLowerCase() === "admin" ||
    user?.email?.toLowerCase() === "admin@appcode.com";

  const toggleSearch = (): void => {
    setIsSearchVisible((prev) => !prev);
  };

  const toggleDropdown = (): void => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = (): void => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userData");
    localStorage.removeItem("studentData");
    setUser(null);
    setProfileImage("");
    setIsDropdownOpen(false);
    router.push("/login");
  };

  /* =========================
     Loading UI
  ========================= */

  if (loading) {
    return (
      <header className="site-header">
        <div className="container">
          <div className="loading-placeholder">Loading...</div>
        </div>
      </header>
    );
  }

  /* =========================
     Render
  ========================= */

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="logo">
          <Image src={logo} alt="Logo" width={120} height={50} />
        </Link>

        <div className="header-contact">
          {/* Search */}
          <div className="search-bar-container">
            {!isSearchVisible ? (
              <button
                className="search-icon-button"
                onClick={toggleSearch}
                type="button"
              >
                <span className="material-symbols-outlined">search</span>
              </button>
            ) : (
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                />
                <button
                  className="close-icon-button"
                  onClick={toggleSearch}
                  type="button"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}
          </div>

          {/* Auth Section */}
          <div className="login-container">
            {user ? (
              isAdmin ? (
                <div className="btn-container">
                  <Link href="/AdminDashboard" className="btn admin-btn">
                    Admin
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn logout-btn"
                    type="button"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="profile-dropdown" ref={dropdownRef}>
                  <div
                    className="profile-tri"
                    onClick={toggleDropdown}
                    role="button"
                  >
                    <img
                      src={getAvatarUrl({ ...user, profileImage })}
                      alt={user.fullName || "User"}
                      className="profile-image"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        const initials = getInitials(user.fullName);
                        target.src = `https://ui-avatars.com/api/?background=4F46E5&color=fff&bold=true&size=128&name=${encodeURIComponent(initials)}`;
                      }}
                    />
                    <span
                      className={`material-symbols-outlined arrow ${
                        isDropdownOpen ? "rotate" : ""
                      }`}
                    >
                      arrow_drop_down
                    </span>
                  </div>

                  {isDropdownOpen && (
                    <div className="dropdown-Menu show">
                      <div className="dropdown-header">
                        <img
                          src={getAvatarUrl({ ...user, profileImage })}
                          alt={user.fullName || "User"}
                          className="dropdown-profile-image"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const initials = getInitials(user.fullName);
                            target.src = `https://ui-avatars.com/api/?background=4F46E5&color=fff&bold=true&size=128&name=${encodeURIComponent(initials)}`;
                          }}
                        />
                        <div className="dropdown-user-info">
                          <h4>{user.fullName || "User"}</h4>
                          <p>{user.email}</p>
                        </div>
                      </div>

                      <div className="dropdown-divider" />

                      <Link
                        href="/pages/StudentPortal?modal=profile"
                        className="dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>

                      <Link
                        href="/pages/StudentPortal"
                        className="dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Student Portal
                      </Link>

                      <div className="dropdown-divider" />

                      <button
                        onClick={handleLogout}
                        className="dropdown-item"
                        type="button"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="btn-container">
                <Link href="/login" className="btn">
                  Login
                  <span className="material-symbols-outlined">login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}