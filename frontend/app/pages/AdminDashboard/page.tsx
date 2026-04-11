// app/pages/AdminDashboard/page.tsx
"use client";

import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Image from "next/image";
import DashboardOverview from "./DashboardOverview";
import StudentManagement from "./StudentManagement";
import CourseManagement from "./CourseManagement";
import PaymentManagement from "./PaymentManagement";
import ReportsAnalytics from "./ReportsAnalytics";
import SystemSettings from "./SystemSettings";
import CourseContentManagement from "./CourseContentManagement";
import Logo from "../StudentPortal/images/appcode.png";
import "./style/AdminDashboard.css";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  
  const toggleSearch = (): void => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <div className="d-flex admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h3>Admin Panel</h3>
          <p>Welcome, Admin</p>
        </div>

        <ul className="p-3 nav flex-column">
          <li className="mb-3 nav-item">
            <button 
              className={`nav-link ${activeSection === "overview" ? "active" : ""}`} 
              onClick={() => setActiveSection("overview")}
            >
              <i className="bi bi-speedometer2 me-2"></i>
              Overview
            </button>
          </li>

          <li className="mb-3 nav-item">
            <button 
              className={`nav-link ${activeSection === "students" ? "active" : ""}`} 
              onClick={() => setActiveSection("students")}
            >
              <i className="bi bi-people me-2"></i>
              Students
            </button>
          </li>

          <li className="mb-3 nav-item">
            <button 
              className={`nav-link ${activeSection === "courses" ? "active" : ""}`} 
              onClick={() => setActiveSection("courses")}
            >
              <i className="bi bi-book me-2"></i>
              Courses
            </button>
          </li>

          <li className="mb-3 nav-item">
            <button 
              className={`nav-link ${activeSection === "content" ? "active" : ""}`} 
              onClick={() => setActiveSection("content")}
            >
              <i className="bi bi-play-btn me-2"></i>
              Course Content
            </button>
          </li>

          <li className="mb-3 nav-item">
            <button 
              className={`nav-link ${activeSection === "payments" ? "active" : ""}`} 
              onClick={() => setActiveSection("payments")}
            >
              <i className="bi bi-credit-card me-2"></i>
              Payments
            </button>
          </li>

          <li className="mb-3 nav-item">
            <button 
              className={`nav-link ${activeSection === "reports" ? "active" : ""}`} 
              onClick={() => setActiveSection("reports")}
            >
              <i className="bi bi-bar-chart me-2"></i>
              Reports
            </button>
          </li>

          <li className="mb-3 nav-item">
            <button 
              className={`nav-link ${activeSection === "settings" ? "active" : ""}`} 
              onClick={() => setActiveSection("settings")}
            >
              <i className="bi bi-gear me-2"></i>
              Settings
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="admin-main-content">
        <div className="admin-header">
          <h2>
            {activeSection === "overview" && "Dashboard Overview"}
            {activeSection === "students" && "Student Management"}
            {activeSection === "courses" && "Course Management"}
            {activeSection === "content" && "Course Content Management"}
            {activeSection === "payments" && "Payment Management"}
            {activeSection === "reports" && "Reports & Analytics"}
            {activeSection === "settings" && "System Settings"}
          </h2>

          <div className="logo-container">
            <Image 
              src={Logo} 
              alt="AppCode Logo" 
              className="logo"
              width={120}
              height={40}
              priority
            />
          </div>

          <div className="search-bar-container">
            {!isSearchVisible && (
              <button className="search-icon-button" onClick={toggleSearch}>
                <span className="material-symbols-outlined">search</span>
              </button>
            )}
            {isSearchVisible && (
              <div className="search-wrapper">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="search-input" 
                />
                <button className="close-icon-button" onClick={toggleSearch}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content based on active section */}
        <div className="admin-content">
          {activeSection === "overview" && <DashboardOverview />}
          {activeSection === "students" && <StudentManagement />}
          {activeSection === "courses" && <CourseManagement />}
          {activeSection === "content" && <CourseContentManagement />}
          {activeSection === "payments" && <PaymentManagement />}
          {activeSection === "reports" && <ReportsAnalytics />}
          {activeSection === "settings" && <SystemSettings />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;