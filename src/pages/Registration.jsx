import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, ArrowLeft, User, Mail, 
  Phone, Lock, ShieldCheck, Zap, 
  ChevronRight, Key, Shield
} from 'lucide-react';
import { useUsers } from '../context/UserContext';
import api from '../api/client';

const Registration = () => {
  const navigate = useNavigate();
  const { users, addUser, loginUser } = useUsers();
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    otp: '',
    emailOtp: '',
    password: '',
    confirmPassword: '',
    captcha: ''
  });

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const [captchaText, setCaptchaText] = useState(generateCaptcha());
  const [expectedEmailOtp, setExpectedEmailOtp] = useState('');
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);

  const handleSendEmailOtp = async () => {
    const emailToCheck = formData.email.toLowerCase().trim();
    if (!emailToCheck || !emailToCheck.includes('@')) {
      alert("Please enter a valid email address first.");
      return;
    }

    setLoading(true);
    try {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setExpectedEmailOtp(generatedOtp);
      
      await api.post('/api/send-email', { to: formData.email, otp: generatedOtp });
      setIsEmailOtpSent(true);
      alert("Security OTP dispatched to your registered email.");
    } catch (err) {
      alert(`Network Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLoginMode) {
        const loginData = await api.post('/api/login', { username: formData.email, password: formData.password });
        localStorage.setItem('tdr_auth_token', loginData.token);
        loginUser(loginData.user);
        alert("Authentication Successful. Welcome back.");
        navigate("/");
        return;
      }

      if (formData.emailOtp !== expectedEmailOtp) { alert("Invalid Security OTP!"); return; }
      if (formData.password !== formData.confirmPassword) { alert("Passwords do not match!"); return; }
      if (formData.captcha !== captchaText) { alert("Captcha verification failed!"); return; }

      const createdUser = await addUser({
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password
      });
      
      loginUser(createdUser);
      alert("Registration Successful. Your blockchain identity is active.");
      navigate("/");
    } catch (err) {
      alert(`Operation Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at 50% 10%, #f8fafc 0%, #e2e8f0 100%)',
      padding: '4rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '900px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: 700, color: '#64748b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
          >
            <ArrowLeft size={18} /> Exit Registry
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#3b82f6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.4)' }}>
            <ShieldCheck size={18} /> SMC SECURE GATEWAY
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', background: 'white', padding: '4rem', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.8)' }}>
          
          {/* Left Side: Info */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              {isLoginMode ? 'Access Your' : 'Create Your'}<br /> 
              <span style={{ color: '#3b82f6' }}>Blockchain Identity.</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Securely manage your Transferable Development Rights on Surat's official distributed ledger network.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {[
                 { icon: <Shield size={20} />, title: 'Immutable Records', desc: 'Tamper-proof TDR storage' },
                 { icon: <Zap size={20} />, title: 'Instant Verification', desc: 'Real-time asset validationov' },
                 { icon: <Key size={20} />, title: 'Private Keys', desc: 'Complete control over your assets' }
               ].map((feat, i) => (
                 <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.75rem', borderRadius: '12px' }}>{feat.icon}</div>
                    <div>
                       <div style={{ fontWeight: 800, color: '#1e293b' }}>{feat.title}</div>
                       <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{feat.desc}</div>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <div style={{ paddingLeft: '3rem', borderLeft: '1px solid #f1f5f9' }}>
             <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <button 
                    onClick={() => setIsLoginMode(false)}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none', background: !isLoginMode ? '#0f172a' : '#f1f5f9', color: !isLoginMode ? 'white' : '#64748b', fontWeight: 700, cursor: 'pointer' }}
                  >Register</button>
                  <button 
                    onClick={() => setIsLoginMode(true)}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none', background: isLoginMode ? '#0f172a' : '#f1f5f9', color: isLoginMode ? 'white' : '#64748b', fontWeight: 700, cursor: 'pointer' }}
                  >Login</button>
                </div>
             </div>

             <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {!isLoginMode && (
                  <>
                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>LEGAL FULL NAME</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <User size={18} color="#94a3b8" />
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ background: 'none', border: 'none', width: '100%', fontWeight: 600 }} placeholder="Ex: Rahul Sharma" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>MOBILE NUMBER</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <Phone size={18} color="#94a3b8" />
                        <input type="tel" name="mobile" required value={formData.mobile} onChange={handleChange} style={{ background: 'none', border: 'none', width: '100%', fontWeight: 600 }} placeholder="+91 98765 43210" />
                      </div>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>OFFICIAL EMAIL</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <Mail size={18} color="#94a3b8" />
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ background: 'none', border: 'none', width: '100%', fontWeight: 600 }} placeholder="name@example.com" />
                    {!isLoginMode && (
                      <button type="button" onClick={handleSendEmailOtp} disabled={isEmailOtpSent || loading} style={{ background: isEmailOtpSent ? '#10b981' : '#3b82f6', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>
                        {isEmailOtpSent ? 'SENT' : 'OTP'}
                      </button>
                    )}
                  </div>
                </div>

                {!isLoginMode && (
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>EMAIL SECURITY CODE</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '12px', border: isEmailOtpSent ? '1px solid #10b981' : '1px solid #e2e8f0' }}>
                      <Lock size={18} color="#94a3b8" />
                      <input type="text" name="emailOtp" required value={formData.emailOtp} onChange={handleChange} style={{ background: 'none', border: 'none', width: '100%', fontWeight: 600 }} placeholder="6-digit code" />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>PASSWORD</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <Lock size={18} color="#94a3b8" />
                    <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ background: 'none', border: 'none', width: '100%', fontWeight: 600 }} placeholder="••••••••" />
                  </div>
                </div>

                {!isLoginMode && (
                  <div className="form-group">
                     <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>HUMAN VERIFICATION</label>
                     <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '10px', fontSize: '1.2rem', fontWeight: 800, fontFamily: 'monospace', color: '#3b82f6', letterSpacing: '4px', textDecoration: 'line-through' }}>{captchaText}</div>
                        <button type="button" onClick={() => setCaptchaText(generateCaptcha())} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><RefreshCw size={20} /></button>
                        <input type="text" name="captcha" required value={formData.captcha} onChange={handleChange} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 700 }} placeholder="CODE" />
                     </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    marginTop: '1rem',
                    padding: '1.25rem', 
                    borderRadius: '12px', 
                    background: '#0f172a', 
                    color: 'white', 
                    fontWeight: 800, 
                    border: 'none', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 15px 30px -10px rgba(15,23,42,0.4)'
                  }}
                >
                  {loading ? 'Processing...' : (isLoginMode ? 'Access My Account' : 'Verify & Register')} <ChevronRight size={18} />
                </button>
             </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Registration;
