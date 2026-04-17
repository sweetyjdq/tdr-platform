import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, FileText, CheckCircle, Database,
  ArrowRight, Upload, GitBranch, Send, Clock,
  Phone, MapPin, Mail, ExternalLink, TrendingUp,
  Activity, Zap, Globe, Bell
} from 'lucide-react';

// ─── Animated Counter ─────────────────────────────────────────────────────────
const AnimatedCounter = ({ target, suffix = '', duration = 1800 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const numeric = parseInt(target.replace(/[^0-9]/g, ''));
    const step = numeric / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numeric) { setCount(numeric); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  const formatted = count.toLocaleString('en-IN');
  // Preserve non-numeric prefix/suffix
  const prefix = target.match(/^[^0-9]*/)?.[0] || '';
  const sfx    = target.match(/[^0-9]*$/)?.[0] || suffix;
  return <>{prefix}{formatted}{sfx}</>;
};

// ─── Live Pulse Dot ───────────────────────────────────────────────────────────
const LiveDot = () => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: 700, color: '#15803d', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '20px', border: '1px solid #bbf7d0' }}>
    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#15803d', animation: 'pulse-dot 1.5s ease-in-out infinite', display: 'inline-block' }} />
    LIVE
  </span>
);

const LandingPage = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Blockchain Nodes',        value: '14',        suffix: ' Active', icon: <Database size={22} />,     color: '#2563EB', bg: '#EFF6FF', trend: '+2 this month' },
    { label: 'Secured Documents',        value: '124845',    suffix: '',        icon: <ShieldCheck size={22} />,  color: '#15803D', bg: '#DCFCE7', trend: '+1,243 this week' },
    { label: 'TDR Issued (Sq.M)',        value: '8400000',   suffix: '',        icon: <FileText size={22} />,     color: '#D97706', bg: '#FEF3C7', trend: '8.4 Million total' },
    { label: 'Verified Transfers',       value: '18502',     suffix: '',        icon: <CheckCircle size={22} />,  color: '#7C3AED', bg: '#F5F3FF', trend: '+302 this month' },
  ];

  const transactions = [
    { hash: '0x7a8...2f3a', type: 'Issue TDR',    id: 'TDR-SMC-2309', time: '2 mins ago',  status: 'confirmed' },
    { hash: '0x9c3...b6e7', type: 'Transfer TDR', id: 'TDR-SMC-1842', time: '15 mins ago', status: 'confirmed' },
    { hash: '0x1d4...f9a1', type: 'Upload Cert.', id: 'TDR-SMC-0991', time: '1 hr ago',    status: 'confirmed' },
    { hash: '0xf5e...3c8d', type: 'Issue TDR',    id: 'TDR-SMC-2310', time: '2 hrs ago',   status: 'confirmed' },
  ];

  const updates = [
    { tag: 'Circular', color: '#1D4ED8', bg: '#EFF6FF', date: '10 Apr 2026', text: 'TDR Policy Amendment 2026 — New floor area ratio norms published.' },
    { tag: 'Tender',   color: '#065F46', bg: '#ECFDF5', date: '08 Apr 2026', text: 'Tender for GIS mapping of TDR zones in South Surat area.' },
    { tag: 'Notice',   color: '#B45309', bg: '#FFFBEB', date: '05 Apr 2026', text: 'Mandatory re-verification of pre-2020 TDR certificates before 30 Jun 2026.' },
    { tag: 'Circular', color: '#1D4ED8', bg: '#EFF6FF', date: '01 Apr 2026', text: 'Fee schedule revised for TDR transfer processing — effective immediately.' },
    { tag: 'Notice',   color: '#9D174D', bg: '#FDF2F8', date: '28 Mar 2026', text: 'Office closed on 14 Apr 2026 (Dr. Ambedkar Jayanti). Services resume 15 Apr.' },
  ];

  const quickActions = [
    { label: 'Upload Certificate', icon: <Upload size={20} />, path: '/services', color: '#2563EB', desc: 'Submit property documents' },
    { label: 'Issue New TDR',      icon: <FileText size={20} />, path: '/services', color: '#15803D', desc: 'Generate TDR certificate' },
    { label: 'Transfer TDR',       icon: <Send size={20} />,     path: '/services', color: '#7C3AED', desc: 'Initiate ownership transfer' },
    { label: 'Verify on Chain',    icon: <GitBranch size={20} />,path: '/verification', color: '#D97706', desc: 'View blockchain record' },
  ];

  const steps = [
    'Register with valid credentials to access the portal.',
    'Fill personal details and land / property information.',
    'Click Save — your TDR application number is generated.',
    'Upload at least THREE documents: Sale Deed, EC & MVC.',
    'Submit the application for SMC officer review.',
    'Receive SMS & Email confirmation after submission.',
  ];

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease both' }}>

      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f2544 0%, #1A365D 45%, #1e4a7a 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem 3.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        boxShadow: '0 20px 60px rgba(15,37,68,0.3)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background grid decoration */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(37,99,235,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-20px', right: '260px', width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20px', right: '220px', width: '120px', height: '120px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '580px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
            <LiveDot />
            <span style={{ fontSize: '0.72rem', color: 'rgba(203,213,225,0.7)', fontWeight: 500 }}>14 blockchain nodes · All systems operational</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '2.1rem', fontWeight: 800, marginBottom: '0.875rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Transparent &amp; Immutable<br />
            <span style={{ color: '#60a5fa' }}>TDR Record Keeping</span>
          </h1>
          <p style={{ color: 'rgba(203,213,225,0.85)', marginBottom: '2rem', lineHeight: 1.75, fontSize: '1rem' }}>
            The SMC e-TDR platform leverages Distributed Ledger Technology to ensure complete transparency in the issuance, tracking, and transfer of Transferable Development Rights.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/services')}
              style={{ background: 'white', color: 'var(--primary)', fontWeight: 700, padding: '0.7rem 1.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; }}
            >
              Explore Services <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/verification')}
              style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.7rem 1.5rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: 600, backdropFilter: 'blur(4px)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Globe size={16} /> View Public Ledger
            </button>
          </div>
        </div>

        {/* Right illustration */}
        <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <div style={{ width: '170px', height: '170px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 80px rgba(96,165,250,0.15)' }}>
            <div style={{ width: '130px', height: '130px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={64} color="rgba(255,255,255,0.85)" />
            </div>
          </div>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#22c55e', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 6px rgba(34,197,94,0.2)', border: '2px solid white' }}>
            <Zap size={16} color="white" />
          </div>
          <div style={{ position: 'absolute', bottom: '8px', left: '-14px', background: '#3b82f6', borderRadius: 'var(--radius-sm)', padding: '5px 10px', fontSize: '0.65rem', fontWeight: 700, color: 'white', boxShadow: 'var(--shadow-md)', whiteSpace: 'nowrap' }}>
            <Activity size={10} style={{ display: 'inline', marginRight: '4px' }} />
            Blockchain Synced
          </div>
        </div>
      </div>

      {/* ── Stats Row ────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }} className="stagger">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card animate-fade-in-up" style={{ animationDelay: `${i * 0.07}s` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: stat.bg, color: stat.color }}>
                {stat.icon}
              </div>
              <TrendingUp size={14} color={stat.color} style={{ opacity: 0.6, marginTop: '4px' }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{stat.label}</div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: stat.color, letterSpacing: '-0.02em', lineHeight: 1 }}>
              <AnimatedCounter target={stat.value} />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.4rem', fontWeight: 500 }}>{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Action Buttons ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => navigate(action.path)}
            style={{
              background: '#EBF4FF',
              border: '1.5px solid #BFDBFE',
              borderRadius: 'var(--radius-lg)',
              padding: '1.4rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.22s ease',
              boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
              textAlign: 'left',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.background = '#DBEAFE';
              e.currentTarget.style.borderColor = '#3B82F6';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.18)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = '#EBF4FF';
              e.currentTarget.style.borderColor = '#BFDBFE';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,99,235,0.08)';
            }}
          >
            <div style={{ color: '#1D4ED8', background: '#DBEAFE', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
              {action.icon}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e3a5f' }}>{action.label}</div>
              <div style={{ fontSize: '0.72rem', color: '#3B82F6', marginTop: '3px', fontWeight: 500 }}>{action.desc}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ArrowRight size={12} color="#3B82F6" />
              <span style={{ fontSize: '0.7rem', color: '#3B82F6', fontWeight: 600 }}>Open</span>
            </div>
          </button>
        ))}
      </div>

      {/* ── Main Content: Transactions + Updates ─────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>

        {/* Blockchain Transactions */}
        <div className="card" style={{ border: 'none', boxShadow: 'var(--shadow-md)' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Activity size={16} color="var(--primary-mid)" />
              <h2>Recent Blockchain Transactions</h2>
            </div>
            <LiveDot />
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: '1.25rem' }}>Block Hash</th>
                  <th>Type</th>
                  <th>TDR ID</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th style={{ paddingRight: '1.25rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={i}>
                    <td style={{ paddingLeft: '1.25rem', fontFamily: 'monospace', color: 'var(--primary-mid)', fontSize: '0.82rem', fontWeight: 600 }}>{tx.hash}</td>
                    <td style={{ fontWeight: 600, fontSize: '0.83rem' }}>{tx.type}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{tx.id}</td>
                    <td style={{ color: 'var(--text-light)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', paddingTop: '1rem' }}>
                      <Clock size={11} /> {tx.time}
                    </td>
                    <td><span className="status-badge status-verified">Confirmed</span></td>
                    <td style={{ paddingRight: '1.25rem' }}>
                      <button className="btn-secondary" style={{ padding: '0.25rem 0.7rem', fontSize: '0.73rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <ExternalLink size={11} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer" style={{ justifyContent: 'center' }}>
            <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 1.5rem' }} onClick={() => navigate('/verification')}>
              View Full Ledger <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Latest Updates & Logins */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Latest Updates */}
          <div className="card" style={{ border: 'none', boxShadow: 'var(--shadow-md)' }}>
            <div className="card-header" style={{ borderBottom: '2px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Bell size={16} color="var(--primary)" />
                <h2>Latest Updates</h2>
              </div>
            </div>
            <div className="card-body" style={{ padding: '0.25rem 0' }}>
              {updates.map((item, i, arr) => (
                <div key={i} style={{ padding: '0.875rem 1.25rem', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', transition: 'background 0.15s', cursor: 'default' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-raised)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: item.color, backgroundColor: item.bg, padding: '2px 9px', borderRadius: '20px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      {item.tag}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 500 }}>{item.date}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.55 }}>{item.text}</p>
                </div>
              ))}
            </div>
            <div className="card-footer" style={{ justifyContent: 'center' }}>
              <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary-mid)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>View All Circulars <ArrowRight size={13} /></a>
            </div>
          </div>
          
          {/* TDR LOGINS Widget */}
          <div className="card" style={{ 
            border: 'none', 
            boxShadow: 'var(--shadow-md)', 
            backgroundColor: '#e1f0fc', 
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#333', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
              TDR - LOGINS
            </h2>
            
            <button 
              onClick={() => navigate('/register')}
              style={{
                width: '100%',
                backgroundColor: '#0d5eb7',
                color: 'white',
                border: 'none',
                padding: '1rem',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                borderRadius: '0'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
              onMouseLeave={e => e.currentTarget.style.opacity = 1}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              CITIZENS LOGIN
            </button>

            <button 
              onClick={() => navigate('/admin')}
              style={{
                width: '100%',
                backgroundColor: '#0f7bc6',
                color: 'white',
                border: 'none',
                padding: '1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                borderRadius: '0'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
              onMouseLeave={e => e.currentTarget.style.opacity = 1}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
              OFFICERS LOGIN
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
              <span style={{ 
                backgroundColor: '#ffcc00', 
                color: '#cc0000', 
                fontWeight: 900, 
                padding: '1px 4px',
                fontSize: '0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                position: 'relative',
                textTransform: 'uppercase'
              }}>
                NEW
                <div style={{ position: 'absolute', right: '-12px', top: 0, width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '12px solid #ffcc00' }}></div>
              </span>
              <span style={{ color: '#cc0000', fontWeight: 800, fontSize: '1.1rem', marginLeft: '10px' }}>
                TDR Helpline No. &nbsp; 9398733102
              </span>
            </div>
            
            <p style={{ color: '#cc0000', fontWeight: 800, margin: 0, fontSize: '1rem' }}>
              (Monday - Friday &nbsp; from 10 AM to 5.30 PM)
            </p>
          </div>
        </div>
      </div>

      {/* ── How To Apply ─────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f0f7ff 100%)', borderRadius: 'var(--radius-xl)', padding: '3rem 3.5rem', marginBottom: '2.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary-mid)', padding: '4px 14px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <CheckCircle size={12} /> Step-by-Step Guide
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            How To <span style={{ color: 'var(--primary-mid)' }}>Apply</span>
          </h2>
          <div style={{ width: '48px', height: '4px', background: 'linear-gradient(90deg, var(--primary-mid), var(--accent))', margin: '0.875rem auto 0', borderRadius: '2px' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem', background: 'white', padding: '1.5rem 2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', lineHeight: 1.7 }}>
              Any citizen surrendering land <strong>free of cost</strong> to SMC for public purpose may apply for a <strong>Transferable Development Right (TDR) Certificate</strong>.
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate('/services')}
            style={{ padding: '0.75rem 2rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Apply Now <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{ background: 'white', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '1rem', alignItems: 'flex-start', border: '1px solid var(--border)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--primary-mid)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ background: 'linear-gradient(135deg, #1e4a7a, var(--primary-mid))', color: 'white', width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, fontSize: '0.85rem', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
                {String.fromCharCode(65 + idx)}
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.6 }}>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer style={{ background: 'linear-gradient(135deg, #0f2544 0%, #1A365D 100%)', color: '#CBD5E1', padding: '3rem 3.5rem', borderRadius: 'var(--radius-xl)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '3rem', boxShadow: '0 20px 60px rgba(15,37,68,0.3)' }}>
        <div>
          <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={16} color="var(--accent)" /> Get In Touch
          </h3>
          <p style={{ lineHeight: 1.8, fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.85 }}>
            Your calls will be answered 24 hours a day, 7 days a week for any e-TDR portal assistance.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
            <Phone size={14} color="var(--accent)" />
            0261-2423750
          </div>
        </div>

        <div>
          <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} color="var(--accent)" /> Working Hours
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' }}>
            {[
              { day: 'Mon – Friday',     time: '10:30 AM – 5:00 PM', open: true },
              { day: 'Second Saturday',  time: 'Closed',              open: false },
              { day: 'Sunday',           time: 'Closed',              open: false },
            ].map((h, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none', opacity: 0.85 }}>
                <span>{h.day}</span>
                <span style={{ color: h.open ? '#86efac' : '#fca5a5', fontWeight: 600 }}>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} color="var(--accent)" /> Contact Us
          </h3>
          <p style={{ fontWeight: 700, color: 'white', marginBottom: '0.875rem', fontSize: '0.95rem' }}>Surat Municipal Corporation</p>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.875rem', alignItems: 'flex-start', opacity: 0.85, fontSize: '0.88rem' }}>
            <MapPin size={15} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ lineHeight: 1.7 }}>SMC Head Quarter, Muglisara,<br />Main Road, Surat – 395003</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', opacity: 0.85, fontSize: '0.88rem' }}>
            <Mail size={15} color="var(--accent)" style={{ flexShrink: 0 }} />
            <span>etdr-support@suratmunicipal.gov.in</span>
          </div>
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.75rem', color: 'rgba(203,213,225,0.55)' }}>
            © {new Date().getFullYear()} Surat Municipal Corporation · All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
