import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { useUsers } from '../context/UserContext';

const Registration = () => {
  const navigate = useNavigate();
  const { addUser } = useUsers();
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
  const [expectedOtp, setExpectedOtp] = useState('');
  const [expectedEmailOtp, setExpectedEmailOtp] = useState('');

  const handleSendOtp = async () => {
    if (!formData.mobile || formData.mobile.length < 10) {
      alert("Please enter a valid mobile number first.");
      return;
    }
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedOtp(generatedOtp);
    console.log("OTP:", generatedOtp);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: formData.mobile, otp: generatedOtp })
      });
      
      if (response.ok) {
        alert("OTP sent to your phone");
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to send real SMS: ${errorData.error || response.statusText}. Please check your Twilio credentials in the backend server!`);
      }
    } catch (err) {
      console.error("Backend connection error:", err);
      alert(`Backend connection error: Is the server.js running on localhost:5000?`);
    }
  };

  const handleSendEmailOtp = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      alert("Please enter a valid email address first.");
      return;
    }
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedEmailOtp(generatedOtp);
    console.log("OTP:", generatedOtp);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: formData.email, otp: generatedOtp })
      });
      
      if (response.ok) {
        alert("Email OTP sent successfully to your inbox!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to send real Email: ${errorData.error || response.statusText}. Please check your SMTP credentials in the backend server!`);
      }
    } catch (err) {
      console.error("Backend connection error:", err);
      alert(`Backend connection error: Is the server.js running on localhost:5000?`);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expectedOtp || formData.otp !== expectedOtp) {
      alert("Invalid Mobile OTP! Please request and enter the correct Mobile OTP.");
      return;
    }
    if (!expectedEmailOtp || formData.emailOtp !== expectedEmailOtp) {
      alert("Invalid Email OTP! Please request and enter the correct Email OTP.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (formData.captcha !== captchaText) {
      alert("Invalid Captcha!");
      return;
    }
    
    addUser({
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email
    });
    
    alert("User registered successfully!");
    navigate("/");
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', backgroundColor: 'var(--background)', minHeight: '80vh' }}>
      
      {/* Top action bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <button 
           onClick={() => navigate('/')} 
           className="btn-primary" 
           style={{ backgroundColor: '#008CBA', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
        >
          <ArrowLeft size={16} />
          Back To Home
        </button>
      </div>

      <div className="card" style={{ padding: '2rem', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            
            {/* ROW 1: Name & Mobile */}
            <div className="form-group">
              <label className="label">Name <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label className="label">Mobile <span style={{ color: 'red' }}>*</span></label>
                <input type="tel" name="mobile" required value={formData.mobile} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <button type="button" onClick={handleSendOtp} className="btn-primary" style={{ backgroundColor: '#0D6EFD', padding: '0.5rem 1rem', height: '38px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                Send OTP
              </button>
            </div>

            {/* ROW 2: Email & Mobile OTP */}
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label className="label">Email <span style={{ color: 'red' }}>*</span></label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <button type="button" onClick={handleSendEmailOtp} className="btn-primary" style={{ backgroundColor: '#0D6EFD', padding: '0.5rem 1rem', height: '38px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                Send OTP
              </button>
            </div>

            <div className="form-group">
              <label className="label">Mobile OTP <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="otp" required value={formData.otp} onChange={handleChange} placeholder="Mobile OTP" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>

            {/* ROW 3: Email OTP and Password */}
            <div className="form-group">
              <label className="label">Email OTP <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="emailOtp" required value={formData.emailOtp} onChange={handleChange} placeholder="Email OTP" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>

            <div className="form-group">
              <label className="label">Password <span style={{ color: 'red' }}>*</span></label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>

            {/* ROW 4: Confirm Passwords */}
            <div className="form-group">
              <label className="label">Confirm Password <span style={{ color: 'red' }}>*</span></label>
              <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            
            {/* Blank space to keep columns aligned */}
            <div className="form-group"></div>

            {/* ROW 4: Captcha Display & Input */}
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                flex: 1, 
                backgroundColor: '#F3F4F6', 
                border: '1px solid #ccc', 
                padding: '0.75rem', 
                fontSize: '1.5rem', 
                fontStyle: 'italic', 
                color: '#0D6EFD', 
                fontFamily: 'monospace',
                letterSpacing: '3px',
                textAlign: 'center',
                userSelect: 'none'
              }}>
                {captchaText}
              </div>
              <button type="button" onClick={() => setCaptchaText(generateCaptcha())} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333' }}>
                <RefreshCw size={24} />
              </button>
            </div>

            <div className="form-group">
              <label className="label">Enter Captcha <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="captcha" required value={formData.captcha} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" className="btn-primary" style={{ backgroundColor: '#6C757D', border: 'none', padding: '0.5rem 2rem', borderRadius: '4px', fontSize: '1rem', color: 'white' }}>
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
