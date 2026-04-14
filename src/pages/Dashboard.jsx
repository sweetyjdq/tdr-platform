import React from 'react';
import { FileText, CheckCircle, Clock, AlertTriangle, LayoutDashboard } from 'lucide-react';
import { useCertificates } from '../context/CertificateContext';

const Dashboard = () => {
  const { certificates, updateCertificateStatus } = useCertificates();

  const stats = [
    { label: 'Total TDR Issued', value: certificates.length.toString(), icon: <FileText size={24} color="var(--primary)" />, bg: '#E0E7FF' },
    { label: 'Verified Documents', value: certificates.filter(c => c.status === 'Verified').length.toString(), icon: <CheckCircle size={24} color="var(--success)" />, bg: 'var(--success-bg)' },
    { label: 'Pending Approvals', value: certificates.filter(c => c.status === 'Pending').length.toString(), icon: <Clock size={24} color="#D97706" />, bg: '#FEF3C7' },
    { label: 'Rejected Applications', value: certificates.filter(c => c.status === 'Rejected').length.toString(), icon: <AlertTriangle size={24} color="var(--danger)" />, bg: 'var(--danger-bg)' }
  ];

  return (
    <div>
      <div style={{ backgroundColor: 'white', boxShadow: 'var(--shadow-lg)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LayoutDashboard size={28} color="var(--text-muted)" />
          Dashboard
        </h1>
        <button className="btn-primary">Generate Report</button>
      </div>

      <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card">
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: stat.bg }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card">
          <div className="card-header">
            <h2>Recent TDR Registrations</h2>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>TDR ID</th>
                  <th>Owner</th>
                  <th>Proof ID (Aadhaar)</th>
                  <th>Zone</th>
                  <th>Area</th>
                  <th>Status</th>
                  <th>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((tdr, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, color: 'var(--primary)' }}>{tdr.id}</td>
                    <td>{tdr.owner}</td>
                    <td>{tdr.aadhaar || 'N/A'}</td>
                    <td>{tdr.zone}</td>
                    <td>{tdr.area}</td>
                    <td>
                      <span className={`status-badge status-${tdr.status.toLowerCase()}`}>
                        {tdr.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: tdr.status === 'Verified' ? 'var(--success-bg)' : undefined, color: tdr.status === 'Verified' ? 'var(--success)' : undefined }}
                          onClick={() => updateCertificateStatus(tdr.id, 'Verified')}
                          disabled={tdr.status === 'Verified'}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: tdr.status === 'Rejected' ? 'var(--danger-bg)' : undefined, color: tdr.status === 'Rejected' ? 'var(--danger)' : undefined }}
                          onClick={() => updateCertificateStatus(tdr.id, 'Rejected')}
                          disabled={tdr.status === 'Rejected'}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer" style={{ justifyContent: 'center' }}>
            <button className="btn-secondary" style={{ width: '100%' }}>View All Records</button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>System Alerts</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', borderLeft: '4px solid var(--accent)', backgroundColor: '#F8FAFC', borderRadius: '0.25rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Server Maintenance</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Scheduled for Oct 28, 02:00 AM IST</div>
              </div>
              <div style={{ padding: '1rem', borderLeft: '4px solid var(--danger)', backgroundColor: '#F8FAFC', borderRadius: '0.25rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>High API Latency</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>/verify-document endpoint is experiencing delays</div>
              </div>
              <div style={{ padding: '1rem', borderLeft: '4px solid var(--success)', backgroundColor: '#F8FAFC', borderRadius: '0.25rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>New Policy Update</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>TDR issuance guidelines updated. Click to read.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
