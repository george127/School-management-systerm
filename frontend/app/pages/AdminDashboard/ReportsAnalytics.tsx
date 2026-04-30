import "./style/ReportsAnalytics.css";

const ReportsAnalytics = () => (  
  <div className="management-container reports-analytics">
    <header className="management-header">
      <div>
        <h3 className="title">Reports & Analytics</h3>
        <p className="subtitle">Track performance metrics and enrollment trends</p>
      </div>
      
      <div className="report-controls">
        <select className="period-select">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>This year</option>
        </select>
        <button className="btn btn-export">
          <span className="material-symbols-outlined">download</span>
          Export Report
        </button>
      </div>
    </header>

    <div className="analytics-grid">
      <div className="analytics-card">
        <div className="chart-header">
          <h4 className="chart-title">Enrollment Trends</h4>
          <span className="trend-badge positive">+15%</span>
        </div>
        <div className="chart-container">
          <div className="line-chart">
            {[65, 58, 70, 45, 72, 80, 85, 78, 90, 95, 88, 92].map((value, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="chart-fill" 
                  style={{ height: `${value}%` }}
                  data-value={value}
                ></div>
                <span className="chart-label">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-footer">
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color current"></span>
              <span>Current Year</span>
            </div>
            <div className="legend-item">
              <span className="legend-color previous"></span>
              <span>Previous Year</span>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-card">
        <div className="chart-header">
          <h4 className="chart-title">Revenue by Course</h4>
          <span className="trend-badge positive">+22%</span>
        </div>
        <div className="chart-container">
          <div className="donut-chart">
            <div className="chart-svg">
              <svg viewBox="0 0 42 42" className="donut">
                <circle className="donut-hole" cx="21" cy="21" r="15.915" fill="#fff"></circle>
                <circle className="donut-ring" cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="3"></circle>
                <circle className="donut-segment" cx="21" cy="21" r="15.915" fill="transparent" stroke="#4f46e5" strokeWidth="3" strokeDasharray="40 60" strokeDashoffset="25"></circle>
                <circle className="donut-segment" cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="85"></circle>
                <circle className="donut-segment" cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="55"></circle>
                <circle className="donut-segment" cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="3" strokeDasharray="10 90" strokeDashoffset="75"></circle>
              </svg>
            </div>
            <div className="chart-center">
              <div className="chart-value">$24.8K</div>
              <div className="chart-label">Total Revenue</div>
            </div>
          </div>
        </div>
        <div className="chart-legend vertical">
          <div className="legend-item">
            <span className="legend-color" style={{background: '#4f46e5'}}></span>
            <span>Web Development</span>
            <span className="legend-value">$9,920</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: '#10b981'}}></span>
            <span>Data Science</span>
            <span className="legend-value">$7,440</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: '#f59e0b'}}></span>
            <span>Cloud Computing</span>
            <span className="legend-value">$4,960</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: '#ef4444'}}></span>
            <span>Cybersecurity</span>
            <span className="legend-value">$2,480</span>
          </div>
        </div>
      </div>

      <div className="analytics-card full-width">
        <div className="chart-header">
          <h4 className="chart-title">Monthly Performance</h4>
          <div className="time-filters">
            <button className="time-filter active">Monthly</button>
            <button className="time-filter">Quarterly</button>
            <button className="time-filter">Yearly</button>
          </div>
        </div>
        <div className="chart-container large">
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon conversion">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <div className="metric-content">
                <div className="metric-value">24.5%</div>
                <div className="metric-label">Conversion Rate</div>
                <div className="metric-trend positive">+2.3%</div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon retention">
                <span className="material-symbols-outlined">group</span>
              </div>
              <div className="metric-content">
                <div className="metric-value">78.3%</div>
                <div className="metric-label">Student Retention</div>
                <div className="metric-trend positive">+5.1%</div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon completion">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <div className="metric-content">
                <div className="metric-value">65.8%</div>
                <div className="metric-label">Course Completion</div>
                <div className="metric-trend positive">+3.7%</div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon satisfaction">
                <span className="material-symbols-outlined">star</span>
              </div>
              <div className="metric-content">
                <div className="metric-value">4.7/5.0</div>
                <div className="metric-label">Satisfaction Score</div>
                <div className="metric-trend positive">+0.2</div>
              </div>
            </div>
          </div>
          
          <div className="performance-chart">
            <div className="chart-bars">
              {[
                {month: 'Jan', conversion: 22, retention: 72, completion: 60, satisfaction: 4.5},
                {month: 'Feb', conversion: 24, retention: 75, completion: 62, satisfaction: 4.6},
                {month: 'Mar', conversion: 26, retention: 76, completion: 63, satisfaction: 4.6},
                {month: 'Apr', conversion: 23, retention: 74, completion: 61, satisfaction: 4.5},
                {month: 'May', conversion: 25, retention: 77, completion: 64, satisfaction: 4.7},
                {month: 'Jun', conversion: 27, retention: 78, completion: 65, satisfaction: 4.7},
                {month: 'Jul', conversion: 28, retention: 79, completion: 66, satisfaction: 4.8},
                {month: 'Aug', conversion: 26, retention: 77, completion: 64, satisfaction: 4.7},
                {month: 'Sep', conversion: 29, retention: 80, completion: 67, satisfaction: 4.8},
                {month: 'Oct', conversion: 30, retention: 81, completion: 68, satisfaction: 4.8},
                {month: 'Nov', conversion: 28, retention: 79, completion: 66, satisfaction: 4.7},
                {month: 'Dec', conversion: 31, retention: 82, completion: 69, satisfaction: 4.9}
              ].map((data, index) => (
                <div key={index} className="chart-column">
                  <div className="column-bars">
                    <div className="bar conversion" style={{height: `${data.conversion * 3}px`}}></div>
                    <div className="bar retention" style={{height: `${data.retention * 2.5}px`}}></div>
                    <div className="bar completion" style={{height: `${data.completion * 2.5}px`}}></div>
                    <div className="bar satisfaction" style={{height: `${data.satisfaction * 40}px`}}></div>
                  </div>
                  <span className="column-label">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ReportsAnalytics;