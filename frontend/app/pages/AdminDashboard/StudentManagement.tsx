"use client";

import { useState, useEffect, useCallback } from "react";
import "./style/StudentManagement.css";

interface Student {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  profileImage: string;
  gender: string;
  status: "active" | "inactive";
  enrollments?: Enrollment[];
  address?: string;
  nationality?: string;
  dob?: string;
  programName?: string;
  courseDetails?: string;
  qualification?: string;
  institution?: string;
  graduationYear?: number;
  studyArea?: string;
  certifications?: string;
  guardianFullName?: string;
  relationship?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardianOccupation?: string;
}

interface Enrollment {
  id: number;
  courseId: number;
  course?: {
    id: number;
    name: string;
  };
  status: string;
  progress: number;
}

interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  totalEnrollments: number;
}

const StudentManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<StudentStats>({
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    totalEnrollments: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalStudentsCount, setTotalStudentsCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal states
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [studentToDelete, setStudentToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<Partial<Student>>({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch students with pagination and filters
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(
        `${API_URL}/api/student-management/students?${queryParams}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data.students);
      setTotalPages(data.pagination.totalPages);
      setTotalStudentsCount(data.pagination.total);
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setError(err.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, API_URL]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/student-management/students/stats`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      console.error("Error fetching stats:", err);
    }
  }, [API_URL]);

  // Fetch single student details
  const fetchStudentDetails = async (studentId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/student-management/students/${studentId}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch student details");
      }

      const data = await response.json();
      return data.student;
    } catch (err: any) {
      console.error("Error fetching student details:", err);
      alert(err.message || "Failed to fetch student details");
      return null;
    }
  };

  // Update student
  const handleUpdateStudent = async () => {
    if (!selectedStudent) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/student-management/students/${selectedStudent.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      alert("Student updated successfully!");
      setIsEditModalOpen(false);
      setSelectedStudent(null);
      setEditFormData({});
      await fetchStudents();
      await fetchStats();
    } catch (err: any) {
      console.error("Error updating student:", err);
      alert(err.message || "Failed to update student");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete student
  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/student-management/students/${studentToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      alert(`${studentToDelete.name} has been deleted successfully!`);
      setIsDeleteConfirmOpen(false);
      setStudentToDelete(null);
      await fetchStudents();
      await fetchStats();
    } catch (err: any) {
      console.error("Error deleting student:", err);
      alert(err.message || "Failed to delete student");
    }
  };

  // Toggle student status
  const handleToggleStatus = async (
    studentId: number,
    currentStatus: string,
  ) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const action = newStatus === "active" ? "activate" : "deactivate";

    if (confirm(`Are you sure you want to ${action} this student?`)) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_URL}/api/student-management/students/${studentId}/status`,
          {
            method: "PATCH",
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to update student status");
        }

        await fetchStudents();
        await fetchStats();
      } catch (err: any) {
        console.error("Error updating student status:", err);
        alert(err.message || "Failed to update student status");
      }
    }
  };

  // View student details
  const handleViewStudent = async (student: Student) => {
    const fullStudent = await fetchStudentDetails(student.id);
    if (fullStudent) {
      setSelectedStudent(fullStudent);
      setIsViewModalOpen(true);
    }
  };

  // Edit student
  const handleEditStudent = async (student: Student) => {
    const fullStudent = await fetchStudentDetails(student.id);
    if (fullStudent) {
      setSelectedStudent(fullStudent);
      setEditFormData({
        fullName: fullStudent.fullName,
        email: fullStudent.email,
        phone: fullStudent.phone,
        address: fullStudent.address || "",
        nationality: fullStudent.nationality || "",
        programName: fullStudent.programName || "",
        qualification: fullStudent.qualification || "",
        institution: fullStudent.institution || "",
        studyArea: fullStudent.studyArea || "",
        guardianFullName: fullStudent.guardianFullName || "",
        guardianPhone: fullStudent.guardianPhone || "",
        guardianEmail: fullStudent.guardianEmail || "",
      });
      setIsEditModalOpen(true);
    }
  };

  // Add new student
  const handleAddStudent = () => {
    alert(
      "Add new student functionality - Implement modal or navigate to add student page",
    );
  };

  // Close modals
  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteConfirmOpen(false);
    setSelectedStudent(null);
    setStudentToDelete(null);
    setEditFormData({});
  };

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, [fetchStudents, fetchStats]);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchStudents();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchStudents, currentPage]);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "badge active";
      case "inactive":
        return "badge inactive";
      default:
        return "badge unknown";
    }
  };

  if (loading && students.length === 0) {
    return (
      <div className="management-container student-management">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="management-container student-management">
        <div className="error-state">
          <p>Error: {error}</p>
          <button onClick={() => fetchStudents()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="management-container student-management">
      <header className="management-header">
        <div>
          <h3 className="title">Student Management</h3>
          <p className="subtitle">
            Manage student records, enrollments and progress
          </p>
        </div>
        <div className="btn-container">
          <div
            className="btn"
            onClick={handleAddStudent}
            aria-label="Add new student"
          >
            Add New Student
            <span className="material-symbols-outlined icon">add_circle</span>
          </div>
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-wrapper">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-field"
          />
        </div>
        <div className="filter-wrapper">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="management-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalStudents}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.activeStudents}</div>
            <div className="stat-label">Active Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.inactiveStudents}</div>
            <div className="stat-label">Inactive Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalEnrollments}</div>
            <div className="stat-label">Total Enrollments</div>
          </div>
        </div>
      </div>

      <div className="table-wrap" aria-labelledby="students-table">
        <table className="students-table" id="students-table">
          <thead>
            <tr>
              <th className="col-name">Name</th>
              <th className="col-email">Email</th>
              <th className="col-phone">Phone</th>
              <th className="col-courses">Courses</th>
              <th className="col-status">Status</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-data-cell">
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr className="table-row" key={student.id}>
                  <td className="name-cell">
                    <div className="avatar" aria-hidden>
                      {student.profileImage ? (
                        <img
                          src={student.profileImage}
                          alt={student.fullName}
                          className="avatar-img"
                        />
                      ) : (
                        getInitials(student.fullName)
                      )}
                    </div>
                    <div>
                      <div className="student-name">{student.fullName}</div>
                      <div className="student-sub">Student</div>
                    </div>
                  </td>
                  <td className="email-cell">{student.email}</td>
                  <td className="phone-cell">{student.phone || "N/A"}</td>
                  <td className="courses-cell">
                    {student.enrollments?.length || 0} courses
                  </td>
                  <td className="status-cell">
                    <span
                      className={getStatusBadgeClass(student.status)}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleToggleStatus(student.id, student.status)
                      }
                      title="Click to toggle status"
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="icon-btn edit"
                      title="Edit Student"
                      aria-label={`Edit ${student.fullName}`}
                      onClick={() => handleEditStudent(student)}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      className="icon-btn view"
                      title="View Details"
                      aria-label={`View ${student.fullName}`}
                      onClick={() => handleViewStudent(student)}
                    >
                      <span className="material-symbols-outlined">
                        visibility
                      </span>
                    </button>
                    <button
                      className="icon-btn delete"
                      title="Delete Student"
                      aria-label={`Delete ${student.fullName}`}
                      onClick={() => {
                        setStudentToDelete({
                          id: student.id,
                          name: student.fullName,
                        });
                        setIsDeleteConfirmOpen(true);
                      }}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer className="management-footer">
        <div className="footer-left">
          Showing {students.length} of {totalStudentsCount} students
        </div>
        <nav
          className="pager"
          role="navigation"
          aria-label="Student pagination"
        >
          <button
            className="pager-btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                className={`pager-btn ${currentPage === pageNum ? "active" : ""}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            className="pager-btn"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </nav>
      </footer>

      {/* View Student Modal */}
      {isViewModalOpen && selectedStudent && (
        <div className="modal-overlay" onClick={closeModals}>
          <div
            className="modal-container view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Student Details</h2>
              <button className="modal-close" onClick={closeModals}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="student-profile-header">
                <div className="profile-avatar large">
                  {selectedStudent.profileImage ? (
                    <img
                      src={selectedStudent.profileImage}
                      alt={selectedStudent.fullName}
                    />
                  ) : (
                    getInitials(selectedStudent.fullName)
                  )}
                </div>
                <div className="profile-info">
                  <h3>{selectedStudent.fullName}</h3>
                  <p className="status-badge">{selectedStudent.status}</p>
                </div>
              </div>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Email</label>
                  <p>{selectedStudent.email}</p>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <p>{selectedStudent.phone || "N/A"}</p>
                </div>
                <div className="detail-item">
                  <label>Gender</label>
                  <p>{selectedStudent.gender || "N/A"}</p>
                </div>
                <div className="detail-item">
                  <label>Nationality</label>
                  <p>{selectedStudent.nationality || "N/A"}</p>
                </div>
                <div className="detail-item">
                  <label>Address</label>
                  <p>{selectedStudent.address || "N/A"}</p>
                </div>
                <div className="detail-item">
                  <label>Date of Birth</label>
                  <p>
                    {selectedStudent.dob
                      ? new Date(selectedStudent.dob).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="detail-item">
                  <label>Program</label>
                  <p>{selectedStudent.programName || "N/A"}</p>
                </div>
                <div className="detail-item">
                  <label>Qualification</label>
                  <p>{selectedStudent.qualification || "N/A"}</p>
                </div>
                <div className="detail-item">
                  <label>Institution</label>
                  <p>{selectedStudent.institution || "N/A"}</p>
                </div>
                <div className="detail-item">
                  <label>Study Area</label>
                  <p>{selectedStudent.studyArea || "N/A"}</p>
                </div>
              </div>
              {selectedStudent.enrollments &&
                selectedStudent.enrollments.length > 0 && (
                  <div className="enrollments-section">
                    <h4>Enrolled Courses</h4>
                    <div className="enrollments-list">
                      {selectedStudent.enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="enrollment-item">
                          <span className="course-name">
                            {enrollment.course?.name || "Course"}
                          </span>
                          <span className="course-progress">
                            Progress: {enrollment.progress}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              <div className="guardian-section">
                <h4>Guardian Information</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Guardian Name</label>
                    <p>{selectedStudent.guardianFullName || "N/A"}</p>
                  </div>
                  <div className="detail-item">
                    <label>Relationship</label>
                    <p>{selectedStudent.relationship || "N/A"}</p>
                  </div>
                  <div className="detail-item">
                    <label>Guardian Phone</label>
                    <p>{selectedStudent.guardianPhone || "N/A"}</p>
                  </div>
                  <div className="detail-item">
                    <label>Guardian Email</label>
                    <p>{selectedStudent.guardianEmail || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditModalOpen && selectedStudent && (
        <div className="edit-modal-overlay" onClick={closeModals}>
          <div
            className="edit-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="edit-modal-header">
              <h2>Edit Student</h2>
              <button className="edit-modal-close" onClick={closeModals}>
                ×
              </button>
            </div>
            <div className="edit-modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateStudent();
                }}
              >
                <div className="edit-form-grid">
                  <div className="edit-form-group">
                    <label>
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.fullName || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          fullName: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      value={editFormData.email || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          email: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>
                      Phone <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      value={editFormData.phone || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          phone: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      value={editFormData.address || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          address: e.target.value,
                        })
                      }
                      placeholder="Enter address"
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>Nationality</label>
                    <input
                      type="text"
                      value={editFormData.nationality || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          nationality: e.target.value,
                        })
                      }
                      placeholder="Enter nationality"
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>Program Name</label>
                    <input
                      type="text"
                      value={editFormData.programName || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          programName: e.target.value,
                        })
                      }
                      placeholder="Enter program name"
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>Qualification</label>
                    <input
                      type="text"
                      value={editFormData.qualification || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          qualification: e.target.value,
                        })
                      }
                      placeholder="Enter qualification"
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>Institution</label>
                    <input
                      type="text"
                      value={editFormData.institution || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          institution: e.target.value,
                        })
                      }
                      placeholder="Enter institution"
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>Study Area</label>
                    <input
                      type="text"
                      value={editFormData.studyArea || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          studyArea: e.target.value,
                        })
                      }
                      placeholder="Enter study area"
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>Guardian Name</label>
                    <input
                      type="text"
                      value={editFormData.guardianFullName || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          guardianFullName: e.target.value,
                        })
                      }
                      placeholder="Enter guardian name"
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>Guardian Phone</label>
                    <input
                      type="tel"
                      value={editFormData.guardianPhone || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          guardianPhone: e.target.value,
                        })
                      }
                      placeholder="Enter guardian phone"
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>Guardian Email</label>
                    <input
                      type="email"
                      value={editFormData.guardianEmail || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          guardianEmail: e.target.value,
                        })
                      }
                      placeholder="Enter guardian email"
                    />
                  </div>
                </div>
                <div className="edit-modal-footer">
                  <button
                    type="button"
                    className="edit-btn-cancel"
                    onClick={closeModals}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="edit-btn-save"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && studentToDelete && (
        <div className="delete-modal-overlay" onClick={closeModals}>
          <div
            className="delete-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-modal-header">
              <h2>
                <i className="bi bi-trash3-fill"></i>
                Confirm Delete
              </h2>
              <button className="delete-modal-close" onClick={closeModals}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="delete-modal-body">
              <div className="delete-warning">
                <div className="warning-icon-wrapper">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                </div>
                <p className="warning-message">
                  Are you sure you want to delete{" "}
                  <strong>{studentToDelete.name}</strong>?
                </p>
                <p className="warning-text">
                  <i className="bi bi-info-circle"></i>
                  This action cannot be undone. All associated data including
                  enrollments, payments, and submissions will be permanently
                  removed.
                </p>
              </div>
            </div>
            <div className="delete-modal-footer">
              <button className="delete-btn-cancel" onClick={closeModals}>
                <i className="bi bi-x-circle"></i>
                Cancel
              </button>
              <button
                className="delete-btn-confirm"
                onClick={handleDeleteStudent}
              >
                <i className="bi bi-trash3"></i>
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
