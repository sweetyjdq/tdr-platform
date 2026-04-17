import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { useUsers } from '../context/UserContext';

const Registration = () => {
  const navigate = useNavigate();
  const { users, addUser, loginUser, verifyUser } = useUsers();
  const [isLoginMode, setIsLoginMode] = useState(false);
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

  const handleSendEmailOtp = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      alert("Please enter a valid email address first.");
      return;
    }

    // Check backend to see if email exists before sending OTP
    try {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const defaultApiUrl = isLocalhost ? 'http://localhost:5000/api' : `${window.location.origin}/api`;
      const apiUrl = import.meta.env.VITE_API_URL && isLocalhost ? import.meta.env.VITE_API_URL : defaultApiUrl;

      const checkRes = await fetch(`${apiUrl}/users`);
      if (checkRes.ok) {
        const allUsers = await checkRes.json();
        const existingUser = allUsers.find(u => u.email?.toLowerCase().trim() === emailToCheck);
        if (existingUser) {
          alert("This email is already registered in our database! Switching to Login.");
          setIsLoginMode(true);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend check failed, relying on local state:", err);
      const localCheck = users.find(u => u.email?.toLowerCase().trim() === emailToCheck);
      if (localCheck) {
        alert("This email is already registered! Switching to Login.");
        setIsLoginMode(true);
        return;
      }
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedEmailOtp(generatedOtp);
    console.log("OTP:", generatedOtp);
    
    try {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const defaultApiUrl = isLocalhost ? 'http://localhost:5000/api' : `${window.location.origin}/api`;
      const apiUrl = import.meta.env.VITE_API_URL && isLocalhost ? import.meta.env.VITE_API_URL : defaultApiUrl;
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoginMode) {
      const user = await verifyUser(formData.email);
      if (!user) {
        alert("No user registered with this email account!");
        return;
      }
      if (user.password && user.password !== formData.password) {
        alert("Invalid password!");
        return;
      }
      loginUser(user);
      alert("Login successful! Welcome back.");
      navigate("/");
      return;
    }

    // Check if user is already registered before proceeding with new registration
    const existingUser = users.find(u => u.email?.toLowerCase().trim() === formData.email?.toLowerCase().trim());
    if (existingUser) {
      alert("You have already registered with this email! Please login to continue.");
      setIsLoginMode(true); // switch to login mode automatically
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
    
    const newRegistration = {
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      password: formData.password
    };
    
    let createdUser;
    try {
      createdUser = await addUser(newRegistration);
    } catch (err) {
      alert(`Registration Failed: ${err.message}`);
      if (err.message.includes("already registered")) {
        setIsLoginMode(true);
      }
      return;
    }
    
    loginUser(createdUser || newRegistration);
    
    // Trigger successful registration email notification
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const defaultApiUrl = isLocalhost ? 'http://localhost:5000/api' : `${window.location.origin}/api`;
    const apiUrl = import.meta.env.VITE_API_URL && isLocalhost ? import.meta.env.VITE_API_URL : defaultApiUrl;
    fetch(`${apiUrl}/send-alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: "Welcome to SMC e-TDR Platform",
        message: `Hello ${formData.name},<br><br>We are thrilled to let you know that your account has been successfully registered on the Surat Municipal Corporation e-TDR Blockchain Platform.<br><br>Your registered contact details:<br>Email: <b>${formData.email}</b><br>Mobile: <b>${formData.mobile}</b><br><br>You can now use these credentials to interact securely with the application.`,
        to: formData.email // The alert backend accepts 'to' as property to overwrite default admin email
      })
    }).catch(err => console.error("Registration email dispatch error:", err));
    
    alert("User registered successfully! A notification has been sent to your email.");
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
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{isLoginMode ? 'User Login' : 'Register New User'}</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLoginMode ? "Don't have an account? " : "Already registered? "}
            <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} style={{ background: 'none', border: 'none', color: '#0D6EFD', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
              {isLoginMode ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            
            {!isLoginMode && (
              <>
                <div className="form-group">
                  <label className="label">Name <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" name="name" required={!isLoginMode} value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>

                <div className="form-group">
                  <label className="label">Mobile <span style={{ color: 'red' }}>*</span></label>
                  <input type="tel" name="mobile" required={!isLoginMode} value={formData.mobile} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>
              </>
            )}

            {/* ROW 2: Email & OTP */}
            <div className={`form-group ${isLoginMode ? 'col-span-2' : ''}`} style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label className="label">Email <span style={{ color: 'red' }}>*</span></label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              {!isLoginMode && (
                <button type="button" onClick={handleSendEmailOtp} className="btn-primary" style={{ backgroundColor: '#0D6EFD', padding: '0.5rem 1rem', height: '38px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                  Send OTP
                </button>
              )}
            </div>

            {/* Email OTP */}
            {!isLoginMode && (
              <div className="form-group">
                <label className="label">Email OTP <span style={{ color: 'red' }}>*</span></label>
                <input type="text" name="emailOtp" required={!isLoginMode} value={formData.emailOtp} onChange={handleChange} placeholder="Email OTP" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
            )}

            <div className={`form-group ${isLoginMode ? 'col-span-2' : ''}`}>
              <label className="label">Password <span style={{ color: 'red' }}>*</span></label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>

            {/* Confirm Passwords */}
            {!isLoginMode && (
              <div className="form-group">
                <label className="label">Confirm Password <span style={{ color: 'red' }}>*</span></label>
                <input type="password" name="confirmPassword" required={!isLoginMode} value={formData.confirmPassword} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
            )}
            
            {/* Blank space to keep columns aligned */}
            {!isLoginMode && <div className="form-group"></div>}

            {/* Captcha Display & Input */}
            {!isLoginMode && (
              <>
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
                  <input type="text" name="captcha" required={!isLoginMode} value={formData.captcha} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>
              </>
            )}

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" className="btn-primary" style={{ backgroundColor: '#6C757D', border: 'none', padding: '0.5rem 2rem', borderRadius: '4px', fontSize: '1rem', color: 'white' }}>
              {isLoginMode ? 'Login' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
