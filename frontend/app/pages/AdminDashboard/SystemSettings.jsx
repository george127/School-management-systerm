import React, { useState } from 'react';
import "./style/SystemSettings.css"

const SystemSettings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    instituteName: "AppCode Academy",
    adminEmail: "admin@appcode.com",
    instituteAddress: "123 Education Street, Knowledge City",
    timezone: "UTC-5 (Eastern Time)"
  });

  const [paymentSettings, setPaymentSettings] = useState({
    currency: "USD ($)",
    taxRate: 8.5,
    paymentMethods: {
      creditCard: true,
      paypal: true,
      bankTransfer: true
    },
    enablePayments: true
  });

  const [saveStatus, setSaveStatus] = useState({});

  const handleSave = (section) => {
    setSaveStatus(prev => ({ ...prev, [section]: 'saving' }));
    
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, [section]: 'saved' }));
      setTimeout(() => setSaveStatus(prev => ({ ...prev, [section]: '' })), 2000);
    }, 1000);
  };

  return (
    <div className="management-container system-settings">
      <header className="management-header">
        <div>
          <h3 className="title">System Settings</h3>
          <p className="subtitle">Configure system preferences and application settings</p>
        </div>
        
        <div className="settings-actions">
          <button className="btn btn-secondary">
            <span className="material-symbols-outlined">backup</span>
            Backup Config
          </button>
          <button className="btn btn-primary">
            <span className="material-symbols-outlined">refresh</span>
            Restart System
          </button>
        </div>
      </header>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <span className="material-symbols-outlined">settings</span>
            </div>
            <h4 className="card-title">General Settings</h4>
          </div>
          
          <div className="settings-form">
            <div className="form-group">
              <label className="form-label">
                <span className="material-symbol-outlined">business</span>
                Institute Name
              </label>
              <input 
                type="text" 
                className="form-input" 
                value={generalSettings.instituteName}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, instituteName: e.target.value }))}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <span className="material-symbol-outlined">email</span>
                Admin Email
              </label>
              <input 
                type="email" 
                className="form-input" 
                value={generalSettings.adminEmail}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <span className="material-symbol-outlined">location_on</span>
                Institute Address
              </label>
              <textarea 
                className="form-textarea" 
                rows="3" 
                value={generalSettings.instituteAddress}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, instituteAddress: e.target.value }))}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <span className="material-symbol-outlined">schedule</span>
                Timezone
              </label>
              <select 
                className="form-select"
                value={generalSettings.timezone}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
              >
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC+0 (Greenwich Mean Time)</option>
                <option>UTC+1 (Central European Time)</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button 
                className={`btn btn-save ${saveStatus.general || ''}`}
                onClick={() => handleSave('general')}
              >
                {saveStatus.general === 'saving' ? (
                  <>
                    <div className="save-spinner"></div>
                    Saving...
                  </>
                ) : saveStatus.general === 'saved' ? (
                  <>
                    <span className="material-symbols-outlined">check</span>
                    Saved!
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">save</span>
                    Save General Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <h4 className="card-title">Payment Settings</h4>
          </div>
          
          <div className="settings-form">
            <div className="form-group">
              <label className="form-label">
                <span className="material-symbol-outlined">currency_exchange</span>
                Currency
              </label>
              <select 
                className="form-select"
                value={paymentSettings.currency}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, currency: e.target.value }))}
              >
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>INR (₹)</option>
                <option>CAD (C$)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <span className="material-symbol-outlined">percent</span>
                Tax Rate (%)
              </label>
              <input 
                type="number" 
                className="form-input" 
                value={paymentSettings.taxRate}
                onChange={(e) => setPaymentSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <span className="material-symbol-outlined">payment</span>
                Payment Methods
              </label>
              <div className="checkbox-group">
                <label className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={paymentSettings.paymentMethods.creditCard}
                    onChange={(e) => setPaymentSettings(prev => ({
                      ...prev, 
                      paymentMethods: { ...prev.paymentMethods, creditCard: e.target.checked }
                    }))}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Credit/Debit Card</span>
                </label>
                
                <label className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={paymentSettings.paymentMethods.paypal}
                    onChange={(e) => setPaymentSettings(prev => ({
                      ...prev, 
                      paymentMethods: { ...prev.paymentMethods, paypal: e.target.checked }
                    }))}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">PayPal</span>
                </label>
                
                <label className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={paymentSettings.paymentMethods.bankTransfer}
                    onChange={(e) => setPaymentSettings(prev => ({
                      ...prev, 
                      paymentMethods: { ...prev.paymentMethods, bankTransfer: e.target.checked }
                    }))}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Bank Transfer</span>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label className="checkbox-item large">
                <input 
                  type="checkbox" 
                  checked={paymentSettings.enablePayments}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, enablePayments: e.target.checked }))}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">
                  <span className="material-symbol-outlined">toggle_on</span>
                  Enable Online Payments
                </span>
              </label>
            </div>
            
            <div className="form-actions">
              <button 
                className={`btn btn-save ${saveStatus.payment || ''}`}
                onClick={() => handleSave('payment')}
              >
                {saveStatus.payment === 'saving' ? (
                  <>
                    <div className="save-spinner"></div>
                    Saving...
                  </>
                ) : saveStatus.payment === 'saved' ? (
                  <>
                    <span className="material-symbols-outlined">check</span>
                    Saved!
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">save</span>
                    Save Payment Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="settings-card full-width">
          <div className="card-header">
            <div className="card-icon">
              <span className="material-symbols-outlined">monitoring</span>
            </div>
            <h4 className="card-title">System Information</h4>
          </div>
          
          <div className="system-info-grid">
            <div className="info-section">
              <div className="info-item">
                <span className="info-label">Version</span>
                <span className="info-value">2.1.0</span>
                <span className="info-badge update">Latest</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Updated</span>
                <span className="info-value">October 15, 2023</span>
              </div>
              <div className="info-item">
                <span className="info-label">Database</span>
                <span className="info-value">MongoDB 5.0</span>
              </div>
            </div>
            
            <div className="info-section">
              <div className="info-item">
                <span className="info-label">Server Status</span>
                <span className="info-value status-online">
                  <span className="status-dot"></span>
                  Online
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Uptime</span>
                <span className="info-value">99.8%</span>
              </div>
              <div className="info-item">
                <span className="info-label">Storage</span>
                <div className="storage-info">
                  <span className="info-value">15.2GB/100GB used</span>
                  <div className="storage-bar">
                    <div className="storage-fill" style={{width: '15.2%'}}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="info-section">
              <div className="system-actions">
                <button className="btn btn-system">
                  <span className="material-symbols-outlined">system_update</span>
                  Check for Updates
                </button>
                <button className="btn btn-system">
                  <span className="material-symbols-outlined">bug_report</span>
                  Run Diagnostics
                </button>
                <button className="btn btn-system">
                  <span className="material-symbols-outlined">security</span>
                  Security Scan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;