import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style/DashboardOverview.css"


const DashboardOverview = () => {
  return (
    <div className="overview-container">
      <div className="overview-welcome">
        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="stat-card">
              <div className="stat-icon students">
                <i className="bi bi-people"></i>
              </div>
              <div className="stat-content">
                <h3>0</h3>
                <p>Total Students</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="stat-card">
              <div className="stat-icon courses">
                <i className="bi bi-book"></i>
              </div>
              <div className="stat-content">
                <h3>0</h3>
                <p>Active Courses</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="stat-card">
              <div className="stat-icon revenue">
                <i className="bi bi-currency-dollar"></i>
              </div>
              <div className="stat-content">
                <h3>0</h3>
                <p>Total Revenue</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="stat-card">
              <div className="stat-icon pending">
                <i className="bi bi-clock-history"></i>
              </div>
              <div className="stat-content">
                <h3>0</h3>
                <p>Pending Payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

   <div className="dashboard-grid">
      {/* Revenue Overview */}
      <div className="state-card">
        <h4 className="stat-title">Revenue Overview
          <div className="design">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
            </div>
        </h4>

        <div className="stat-content">
          <div className="stat-item">
            <div className="stat-left">
              <span className="material-symbols-outlined stat">paid</span>
              <p className="stat-label">Total Revenue:</p>
            </div>
            <div className="stat-right">
              <span className="stat-value">0</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-left">
              <span className="material-symbols-outlined stat">check_circle</span>
              <p className="stat-label">Completed Payments:</p>
            </div>
            <div className="stat-right">
              <span className="stat-value">0</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-left">
              <span className="material-symbols-outlined stat">hourglass_top</span>
              <p className="stat-label">Pending Payments:</p>
            </div>
            <div className="stat-right">
              <span className="stat-value">0</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-left">
              <span className="material-symbols-outlined stat">trending_up</span>
              <p className="stat-label">Average Payment:</p>
            </div>
            <div className="stat-right">
              <span className="stat-value">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Student Distribution */}
      <div className="state-card">
        <h4 className="stat-title">Student Distribution
          <div className="design">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
            </div>
        </h4>

        <div className="stat-content">
          <div className="stat-item">
            <div className="stat-left">
              <span className="material-symbols-outlined stat">person</span>
              <p className="stat-label">Active Students:</p>
            </div>
            <div className="stat-right">
              <span className="stat-value">
                0
              </span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-left">
              <span className="material-symbols-outlined stat">person_off</span>
              <p className="stat-label">Inactive Students:</p>
            </div>
            <div className="stat-right">
              <span className="stat-value">
                0
              </span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-left">
              <span className="material-symbols-outlined stat">person_add</span>
              <p className="stat-label">Pending Approval:</p>
            </div>
            <div className="stat-right">
              <span className="stat-value">
                0
              </span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-left">
              <span className="material-symbols-outlined stat">menu_book</span>
              <p className="stat-label">Avg Courses / Student:</p>
            </div>
            <div className="stat-right">
              <span className="stat-value">
               0.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

          <div className="chart-card">
            <h4>Recent Activity</h4>
            <div className="activity-list">
              <div className="activity-item">
                <i className="bi bi-person-plus text-success"></i>
                <div className="activity-content">
                  <p>New student registration: Emily Davis</p>
                  <small>2 hours ago</small>
                </div>
              </div>
              <div className="activity-item">
                <i className="bi bi-currency-dollar text-primary"></i>
                <div className="activity-content">
                  <p>Payment received from John Doe: $299.00</p>
                  <small>5 hours ago</small>
                </div>
              </div>
              <div className="activity-item">
                <i className="bi bi-book text-info"></i>
                <div className="activity-content">
                  <p>New course published: Cybersecurity</p>
                  <small>Yesterday</small>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
};

export default DashboardOverview
