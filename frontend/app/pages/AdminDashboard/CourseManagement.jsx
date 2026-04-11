import "./style/StudentManagement.css";

const CourseManagement = () => {

  return (
    <div className="management-container course-management">
      <header className="management-header">
        <div>
          <h3 className="title">Course Catalog</h3>
          <p className="subtitle">Manage course offerings, content and enrollments</p>
        </div>
         <div className="btn-container">
          <div className="btn" type="button" aria-label="Add new student">
         Create New Course
          <span className="material-symbols-outlined icon">add_circle</span>
          </div>
        </div>
      </header>

      <section className="management-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Total Courses</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Active Courses</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Upcoming Courses</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Total Enrollments</div>
          </div>
        </div>
      </section>

      <section className="table-wrap" aria-labelledby="courses-table">
        <table className="students-table" id="courses-table">
          <thead>
            <tr>
              <th className="col-name">Course Name</th>
              <th className="col-email">Enrolled Students</th>
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
                    <div className="student-sub">instructor</div>
                  </div>
                </td>

                <td className="email-cell">students</td>

                <td className="status-cell">
                  <span className={`badge`}>
                   status
                  </span>
                </td>

                <td className="actions-cell">
                  <button className="icon-btn edit" title="Edit Course" aria-label={`Edit ${name}`}>
                    <span className="material-symbols-outlined">edit</span>
                  </button>

                  <button className="icon-btn view" title="View Details" aria-label={`View ${name}`}>
                    <span className="material-symbols-outlined">visibility</span>
                  </button>

                  <button className="icon-btn manage" title="Manage Content" aria-label={`Manage content for ${name}`}>
                    <span className="material-symbols-outlined">folder</span>
                  </button>

                  <button className="icon-btn delete" title="Delete Course" aria-label={`Delete ${name}`}>
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
          </tbody>
        </table>
      </section>

      <footer className="management-footer">
        <div className="footer-left">Showing 0 courses</div>
        <nav className="pager" role="navigation" aria-label="Course pagination">
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

export default CourseManagement;