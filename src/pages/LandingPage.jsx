import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, FileText, CheckCircle, Database,
  ArrowRight, Upload, GitBranch, Send, Clock,
  Phone, MapPin, Mail, ExternalLink, TrendingUp,
  Activity, Zap, Globe, Bell, Cpu, Link as LinkIcon
} from 'lucide-react';
import api from '../api/client';

const AnimatedCounter = ({ target, suffix = '', duration = 1800 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const numeric = parseInt(target.replace(/[^0-9]/g, '')) || 0;
    if (numeric === 0) return;
    const step = numeric / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numeric) { setCount(numeric); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  const formatted = count.toLocaleString('en-IN');
  return <>{formatted}{suffix}</>;
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { label: 'Network Nodes',    value: '14',     suffix: ' Active', icon: <Database size={24} />,     color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { label: 'Blockchain Height', value: '482',    suffix: ' Blocks', icon: <Cpu size={24} />,          color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Secured Assets',    value: '0',      suffix: '',        icon: <ShieldCheck size={24} />,  color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Live Transactions', value: '0',      suffix: '',        icon: <Activity size={24} />,     color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  ]);

  const [logs, setLogs] = useState([
    { time: '12:04:21', text: 'Peer Node SMC-04 successfully validated block #481', type: 'info' },
    { time: '12:03:55', text: 'Inter-node gossip protocol initialized', type: 'success' },
    { time: '12:02:10', text: 'Mainnet connection established via TLS 1.3', type: 'info' },
  ]);

  useEffect(() => {
    const syncData = async () => {
      try {
        const response = await api.get('/api/admin/data');
        if (response && response.stats) {
          setStats(prev => {
            const next = [...prev];
            next[2].value = (response.stats.total_users + response.stats.total_certs).toString();
            next[3].value = response.stats.total_certs.toString();
            return next;
          });
        }
      } catch (err) {
        console.error("Link fail:", err);
      }
    };
    syncData();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      style={{ paddingBottom: '4rem' }}
    >
      {/* ─── HERO SECTION ─── */}
      <section style={{ 
        height: '480px', 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '2rem',
        padding: '4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '2rem',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        {/* Animated Background Mesh */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '600px', zIndex: 10 }}>
          <motion.div 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '1.5rem' }}
          >
            <div className="status-dot" style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }} />
            <span style={{ fontSize: '0.8rem', color: '#93c5fd', fontWeight: 700, letterSpacing: '0.05em' }}>MAINNET v2.4.0 ONLINE</span>
          </motion.div>

          <h1 style={{ color: 'white', fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            Next-Gen <span style={{ color: '#3b82f6' }}>Blockchain</span><br />
            Registry for TDR.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Empowering Surat with tamper-proof land records and transparent transferable development rights using Hyperledger Fabric.
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => navigate('/services')}
              className="btn-primary" 
              style={{ padding: '1rem 2rem', borderRadius: '12px', fontSize: '1rem', background: '#3b82f6' }}
            >
              Launch Services <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => navigate('/verification')}
              style={{ padding: '1rem 2rem', borderRadius: '12px', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Scan Ledger
            </button>
          </div>
        </div>

        {/* Floating Chain Illustration */}
        <div style={{ position: 'relative', width: '300px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <motion.div 
             animate={{ rotate: 360 }} 
             transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
             style={{ width: '280px', height: '280px', border: '2px dashed rgba(59, 130, 246, 0.2)', borderRadius: '50%', position: 'absolute' }}
           />
           <Database size={100} color="#3b82f6" />
           <div style={{ position: 'absolute', top: -10, left: -10, background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '15px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <LinkIcon color="#3b82f6" />
           </div>
        </div>
      </section>

      {/* ─── LIVE NODE STATS ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="card"
            style={{ padding: '1.5rem', borderLeft: `4px solid ${s.color}` }}
          >
            <div style={{ color: s.color, marginBottom: '1rem' }}>{s.icon}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, marginBottom: '0.25rem' }}>{s.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              <AnimatedCounter target={s.value} suffix={s.suffix} />
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
         <div className="card">
            <div className="card-header" style={{ border: 'none', background: 'transparent' }}>
               <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Activity size={20} color="#3b82f6" />
                  Live Event Feed
               </h2>
            </div>
            <div style={{ padding: '1.5rem', background: '#0f172a', borderRadius: '0 0 1.25rem 1.25rem', overflow: 'hidden' }}>
               <div style={{ fontFamily: 'monospace', color: '#10b981', fontSize: '0.9rem' }}>
                  {logs.map((log, i) => (
                    <div key={i} style={{ marginBottom: '0.5rem', display: 'flex', gap: '1rem' }}>
                       <span style={{ color: '#475569' }}>[{log.time}]</span>
                       <span>{log.text}</span>
                    </div>
                  ))}
                  <motion.div 
                    animate={{ opacity: [1, 0, 1] }} 
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{ width: '8px', height: '16px', background: '#10b981', display: 'inline-block', verticalAlign: 'middle' }}
                  />
               </div>
            </div>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none' }}>
               <div style={{ padding: '2rem', color: 'white' }}>
                  <Globe size={32} style={{ marginBottom: '1rem' }} />
                  <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>View Public Explorer</h2>
                  <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>Search any transaction, block or TDR certificate ID publicly.</p>
                  <button onClick={() => navigate('/verification')} style={{ background: 'white', color: '#1A365D', width: '100%', padding: '0.8rem', borderRadius: '10px', fontWeight: 800 }}>Explore Ledger</button>
               </div>
            </div>

            <div className="card">
               <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>System Health</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     {['Gateway API', 'Fabric Peer', 'CouchDB', 'MSP Auth'].map((s) => (
                       <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{s}</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>Operational</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
