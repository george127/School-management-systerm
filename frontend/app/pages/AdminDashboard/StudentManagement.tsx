import "./style/StudentManagement.css";

const StudentManagement = () => {

  return (
    <div className="management-container student-management">
      <header className="management-header">
        <div>
          <h3 className="title">Student Management</h3>
          <p className="subtitle">Manage student records, enrollments and progress</p>
        </div>

        <div className="btn-container">
          <div className="btn" type="button" aria-label="Add new student">
          Add New Student
          <span className="material-symbols-outlined icon">add_circle</span>
        </div>
        </div>
      </header>

      <section className="management-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Total Students</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Active Students</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Inactive Students</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Total Enrollments</div>
          </div>
        </div>
      </section>

      <section className="table-wrap" aria-labelledby="students-table">
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
              <tr className="table-row">
                <td className="name-cell">
                  <div className="avatar" aria-hidden>
                    JD
                  </div>
                  <div>
                    <div className="student-name">name</div>
                    <div className="student-sub">Student</div>
                  </div>
                </td>

                <td className="email-cell">email</td>
                <td className="phone-cell">phone</td>
                <td className="courses-cell">courses</td>

                <td className="status-cell">
                  <span className={`badge`}>
                    status 
                  </span>
                </td>

                <td className="actions-cell">
                  <button className="icon-btn edit" title="Edit Student" aria-label={`Edit ${name}`}>
                    <span className="material-symbols-outlined">edit</span>
                  </button>

                  <button className="icon-btn view" title="View Details" aria-label={`View ${name}`}>
                    <span className="material-symbols-outlined">visibility</span>
                  </button>

                  <button className="icon-btn delete" title="Delete Student" aria-label={`Delete ${name}`}>
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
          </tbody>
        </table>
      </section>

      <footer className="management-footer">
        <div className="footer-left">Showing 0 students</div>
        <nav className="pager" role="navigation" aria-label="Student pagination">
          <button className="pager-btn" disabled>Previous</button>
          <button className="pager-btn active">1</button>
          <button className="pager-btn">2</button>
          <button className="pager-btn">3</button>
          <button className="pager-btn">Next</button>
        </nav>
      </footer>
    </div>
  );
};

export default StudentManagement;
