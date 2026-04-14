import React from 'react';
import { ShieldCheck, FileText, CheckCircle, Database } from 'lucide-react';

const LandingPage = () => {
  const stats = [
    { label: 'Blockchain Nodes', value: '14 Active', icon: <Database size={24} color="var(--primary)" />, bg: '#EEF2FF' },
    { label: 'Secured Documents', value: '1,24,845', icon: <ShieldCheck size={24} color="var(--success)" />, bg: 'var(--success-bg)' },
    { label: 'Total TDR Issued (Sq.M)', value: '8.4 Million', icon: <FileText size={24} color="var(--primary)" />, bg: '#FEF3C7' },
    { label: 'Verified Transfers', value: '18,502', icon: <CheckCircle size={24} color="var(--primary)" />, bg: '#EEF2FF' }
  ];

  return (
    <div style={{ background: 'linear-gradient(to bottom right, #f8fafc, #ffffff)', minHeight: '100vh', borderRadius: '8px' }}>
      <div className="page-header" style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none', paddingBottom: '0.5rem' }}>
        <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
          Surat Municipal Corporation
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>
          Transferable Development Rights (e-TDR) Blockchain Portal
        </p>
      </div>

      <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ maxWidth: '600px' }}>
          <h2 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 600 }}>Transparent & Immutable Record Keeping</h2>
          <p style={{ marginBottom: '2rem', lineHeight: '1.7', fontSize: '1.1rem', opacity: 0.9 }}>
            The SMC e-TDR platform leverages state-of-the-art DLT (Distributed Ledger Technology) to ensure 
            complete transparency in the issuance, tracking, and transfer of Transferable Development Rights.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" style={{ backgroundColor: 'white', color: 'var(--primary)', fontWeight: 'bold', padding: '0.75rem 1.5rem', cursor: 'pointer' }} onClick={() => window.location.href='/services'}>
              Explore Services
            </button>
            <button style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.25rem', cursor: 'pointer' }} onClick={() => window.location.href='/verification'}>
              View Public Ledger
            </button>
          </div>
        </div>
        <div style={{ padding: '2rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', boxShadow: '0 0 40px rgba(255,255,255,0.1)' }}>
          <Database size={120} color="white" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '3rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ border: 'none', boxShadow: 'var(--shadow-md)', transition: 'transform 0.2s', cursor: 'default' }} 
               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
              <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: stat.bg }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>{stat.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>

        {/* Left: Recent Blockchain Transactions */}
        <div className="card" style={{ border: 'none', boxShadow: 'var(--shadow-md)' }}>
          <div className="card-header" style={{ padding: '1.25rem 1.5rem', backgroundColor: 'white' }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Recent Blockchain Transactions</h2>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC' }}>
                  <th style={{ padding: '0.75rem 1.25rem' }}>Block Hash</th>
                  <th>Type</th>
                  <th>TDR ID</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th style={{ padding: '0.75rem 1.25rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontFamily: 'monospace', color: 'var(--primary)', paddingLeft: '1.25rem', fontSize: '0.82rem' }}>0x7a8...2f3a</td>
                  <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>Issue TDR</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>TDR-SMC-2309</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>2 mins ago</td>
                  <td><span className="status-badge status-verified">Confirmed</span></td>
                  <td style={{ paddingRight: '1.25rem' }}><button className="btn-secondary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}>View</button></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'monospace', color: 'var(--primary)', paddingLeft: '1.25rem', fontSize: '0.82rem' }}>0x9c3...b6e7</td>
                  <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>Transfer TDR</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>TDR-SMC-1842</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>15 mins ago</td>
                  <td><span className="status-badge status-verified">Confirmed</span></td>
                  <td style={{ paddingRight: '1.25rem' }}><button className="btn-secondary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}>View</button></td>
                </tr>
                <tr style={{ borderBottom: 'none' }}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--primary)', paddingLeft: '1.25rem', fontSize: '0.82rem' }}>0x1d4...f9a1</td>
                  <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>Upload Cert.</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>—</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>1 hr ago</td>
                  <td><span className="status-badge status-verified">Confirmed</span></td>
                  <td style={{ paddingRight: '1.25rem' }}><button className="btn-primary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}>Issue TDR</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Latest Updates */}
        <div className="card" style={{ border: 'none', boxShadow: 'var(--shadow-md)' }}>
          <div className="card-header" style={{ padding: '1.25rem 1.5rem', backgroundColor: 'white', borderBottom: '2px solid var(--primary)' }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary)' }}>Latest Updates</h2>
          </div>
          <div className="card-body" style={{ padding: '0.5rem 0' }}>
            {[
              { tag: 'Circular', color: '#1D4ED8', bg: '#EFF6FF', date: '10 Apr 2026', text: 'TDR Policy Amendment 2026 — New floor area ratio norms published.' },
              { tag: 'Tender',   color: '#065F46', bg: '#ECFDF5', date: '08 Apr 2026', text: 'Tender for GIS mapping of TDR zones in South Surat.' },
              { tag: 'Notice',   color: '#B45309', bg: '#FFFBEB', date: '05 Apr 2026', text: 'Mandatory re-verification of pre-2020 TDR certificates before 30 Jun 2026.' },
              { tag: 'Circular', color: '#1D4ED8', bg: '#EFF6FF', date: '01 Apr 2026', text: 'Fee schedule revised for TDR transfer processing effective immediately.' },
              { tag: 'Notice',   color: '#9D174D', bg: '#FDF2F8', date: '28 Mar 2026', text: 'Office closed on 14 Apr 2026 (Dr. Ambedkar Jayanti). Services resume 15 Apr.' },
            ].map((item, i, arr) => (
              <div key={i} style={{
                padding: '0.85rem 1.25rem',
                borderBottom: i < arr.length - 1 ? '1px solid #F1F5F9' : 'none',
                display: 'flex', flexDirection: 'column', gap: '0.3rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: item.color, backgroundColor: item.bg, padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.5px' }}>
                    {item.tag}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{item.date}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>{item.text}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid #F1F5F9', textAlign: 'right' }}>
            <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>View All Updates</a>
          </div>
        </div>

      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '4rem' }}>
        <button className="btn-primary" style={{ flex: 1, padding: '1.25rem', fontSize: '1.1rem', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-md)' }} onClick={() => window.location.href='/services'}>+ Upload Certificate</button>
        <button className="btn-primary" style={{ flex: 1, padding: '1.25rem', fontSize: '1.1rem', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-md)' }} onClick={() => window.location.href='/services'}>+ Issue New TDR</button>
        <button className="btn-primary" style={{ flex: 1, padding: '1.25rem', fontSize: '1.1rem', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-md)' }} onClick={() => window.location.href='/services'}>+ Transfer TDR</button>
      </div>

      {/* How To Apply Section */}
      <div id="how-to-apply" style={{ padding: '4rem 3rem', backgroundColor: '#F1F5F9', borderRadius: 'var(--radius-lg)', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 300, color: 'var(--text-main)' }}>
            How To <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Apply</span>
          </h2>
          <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--primary)', margin: '1rem auto 0', borderRadius: '2px' }}></div>
        </div>
        
        <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'var(--text-main)', lineHeight: '1.8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '2rem', backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}>
            <p style={{ margin: 0, flex: 1, fontSize: '1.1rem' }}>
              TDR application may be submitted by A Citizen or SMC Officer.<br/>
              Any Citizen who is surrendering / has surrendered his land, free of cost, to SMC for public purpose may apply to avail 'Transferable Development Right' Certificate.
            </p>
            <button className="btn-primary" onClick={() => window.location.href='/services'} style={{ padding: '0.75rem 2rem', fontSize: '1rem', letterSpacing: '0.5px' }}>
              APPLY NOW {'>'}
            </button>
          </div>
          
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {['Registration is mandatory after Registration Login with your credentials.',
              'Fill your personal details and land details.',
              'Click on Save button. Your TDR Application number is displayed with Success message.',
              'Upload At least THREE documents (Sale Deed, Encumbrance Certificate & Market Value Certificate).',
              'Submit the application.',
              'You will receive a SMS and Email notifying the submitted TDR application.'].map((step, idx) => (
                <div key={idx} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '1rem' }}>
                  <div style={{ backgroundColor: 'var(--primary)', color: 'white', width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <div style={{ fontSize: '1rem' }}>{step}</div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer style={{ backgroundColor: 'var(--primary)', color: '#CBD5E1', padding: '4rem', marginTop: '4rem', borderRadius: 'var(--radius-lg)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', boxShadow: 'var(--shadow-lg)' }}>
        <div>
          <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Get In Touch</h3>
          <p style={{ lineHeight: '1.7', margin: 0, fontSize: '1.05rem' }}>
            Your calls will be answered 24 hours a day, 7 days a week for any e-TDR portal assistance.
          </p>
        </div>
        
        <div>
          <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Working Hours</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2', fontSize: '1.05rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}><span>Mon - Friday</span> <span style={{ color: 'white' }}>10:30 AM - 5:00 PM</span></li>
            <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0' }}><span>Second Saturday</span> <span style={{ color: 'var(--accent)', fontWeight: 500 }}>Closed</span></li>
            <li style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}><span>Sunday</span> <span style={{ color: 'var(--accent)', fontWeight: 500 }}>Closed</span></li>
          </ul>
        </div>
        
        <div>
          <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Contact Us</h3>
          <h4 style={{ color: 'white', margin: '0 0 1rem 0', fontWeight: 500, fontSize: '1.1rem' }}>Surat Municipal Corporation</h4>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.2rem' }}>📍</span>
            <span style={{ lineHeight: '1.6', fontSize: '1rem' }}>SMC Head Quarter, Muglisara,<br/>Main Road, Surat : 395003</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem' }}>📞</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'white' }}>0261-2423750</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
