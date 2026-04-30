import "./style/AdminDashboard.css"

const PaymentManagement = () => {

  return (
    <div className="management-container payment-management">
      <header className="management-header">
        <div>
          <h3 className="title">Payment Management</h3>
          <p className="subtitle">Manage payment records, invoices and revenue tracking</p>
        </div>

        <div className="btn-container">
          <div className="btn" type="button" aria-label="Record manual payment">
            Record Payment
          <span className="material-symbols-outlined icon">add_circle</span>
          </div>
        </div>
      </header>

      <section className="management-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Total Revenue</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Completed Payments</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Pending Payments</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Average Payment</div>
          </div>
        </div>
      </section>

      <section className="table-wrap" aria-labelledby="payments-table">
        <table className="students-table" id="payments-table">
          <thead>
            <tr>
              <th className="col-name">Student</th>
              <th className="col-email">Amount</th>
              <th className="col-phone">Date</th>
              <th className="col-status">Status</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
              <tr  className="table-row">
                <td className="name-cell">
                  <div className="avatar" aria-hidden>
                    JD
                  </div>
                  <div>
                    <div className="student-name">Name</div>
                    <div className="student-sub">Course Payment</div>
                  </div>
                </td>

                <td className="email-cell">Amount</td>
                <td className="phone-cell">date</td>

                <td className="status-cell">
                  <span className={`badge ${status ?? "unknown"}`}>
                    status
                  </span>
                </td>

                <td className="actions-cell">
                  <button className="icon-btn view" title="View Details">
                    <span className="material-symbols-outlined">visibility</span>
                  </button>

                  <button className="icon-btn manage" title="Download Invoice">
                    <span className="material-symbols-outlined">receipt</span>
                  </button>

                    <button className="icon-btn edit" title="Approve Payment" >
                      <span className="material-symbols-outlined">check_circle</span>
                    </button>
                </td>
              </tr>
          </tbody>
        </table>
      </section>

      <footer className="management-footer">
        <div className="footer-left">Showing {length} payments</div>
        <nav className="pager" role="navigation" aria-label="Payment pagination">
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

export default PaymentManagement;