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
   Component
========================= */

export default function Header(): JSX.Element {
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  /* =========================
     Effects
  ========================= */

  useEffect(() => {
    checkAuthStatus();
  }, []);

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
        setLoading(false);
        return;
      }

      // Temporarily set stored user
      setUser(storedUser);

      const response = await fetch(
        "http://localhost:5000/api/auth/check-auth",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: storedUser.email }),
        },
      );

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
    setUser(null);
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
                      src={user.profileImage || "/default-avatar.png"}
                      alt={user.fullName}
                      className="profile-image"
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
                          src={user.profileImage || "/default-avatar.png"}
                          alt={user.fullName}
                          className="dropdown-profile-image"
                        />
                        <div className="dropdown-user-info">
                          <h4>{user.fullName}</h4>
                          <p>{user.email}</p>
                        </div>
                      </div>

                      <div className="dropdown-divider" />

                      <Link
                        href="/StudentPortal?modal=profile"
                        className="dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>

                      <Link
                        href="/StudentPortal"
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
