import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { verifyToken } from './middleware/auth.js';

// Load environment variables from .env
dotenv.config();

// ─── Verify SMTP config on startup ───────────────────────────────
const smtpConfigured = process.env.SMTP_USER && 
  process.env.SMTP_PASS &&
  !process.env.SMTP_USER.includes('your_gmail') &&
  !process.env.SMTP_PASS.includes('your_16_char');

if (!smtpConfigured) {
  console.warn('⚠️  SMTP not configured — edit .env and set SMTP_USER + SMTP_PASS');
} else {
  // Quick verify transporter
  const testTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: { rejectUnauthorized: false }
  });
  testTransporter.verify((error) => {
    if (error) {
      console.error('❌ SMTP Connection FAILED:', error.message);
      console.error('   → Check SMTP_USER and SMTP_PASS in your .env file');
    } else {
      console.log(`✅ SMTP ready — emails will be sent from: ${process.env.SMTP_USER}`);
    }
  });
}

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup writable base path for Serverless environments (Vercel uses /tmp)
const basePath = process.env.VERCEL ? '/tmp' : __dirname;

// Ensure uploads directory exists
const uploadsDir = path.join(basePath, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage config — saves PDFs locally to /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, uniqueName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only PDF, JPG, and PNG files are allowed'));
  }
});

const app = express();
app.use(express.json());
app.use(cors());

import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.VERCEL ? { rejectUnauthorized: false } : false
});

// Fallback users (in-memory) for Vercel if DB fails
let memoryUsers = [
  { id: 'USR-001', name: 'John Doe', mobile: '9876543210', email: 'john@example.com', status: 'Active', password: 'password123' },
  { id: 'USR-002', name: 'Ramesh Kumar', mobile: '8877665544', email: 'ramesh@example.com', status: 'Active', password: 'password123' }
];

const dataPath = path.join(basePath, 'data', 'users.json');

// Helper to determine if we should use DB
const useDb = async () => {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost')) {
        if (process.env.VERCEL) return false; // Never try localhost on Vercel
    }
    try {
        const c = await pool.connect();
        c.release();
        return true;
    } catch {
        return false;
    }
};

let dbMode = false;
const initDb = async () => {
    dbMode = await useDb();
    if (dbMode) {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    name TEXT,
                    mobile TEXT,
                    email TEXT UNIQUE,
                    password TEXT,
                    status TEXT DEFAULT 'Active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log("✅ Using PostgreSQL Storage");
        } catch (e) {
            console.error("❌ Table creation failed, falling back to file/memory");
            dbMode = false;
        }
    } else {
        console.warn("⚠️ Database unavailable. Using Local/Memory fallback.");
        if (fs.existsSync(dataPath)) {
            try { memoryUsers = JSON.parse(fs.readFileSync(dataPath, 'utf8')); } catch {}
        }
    }
};
initDb();

app.get('/api/users', async (req, res) => {
    if (dbMode) {
        try {
            const r = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
            return res.json(r.rows);
        } catch { dbMode = false; }
    }
    res.json(memoryUsers);
});

app.post('/api/users/register', async (req, res) => {
  try {
    const { email, name, mobile, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email/Pass required" });

    const userId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    const normalizedEmail = email.toLowerCase().trim();

    if (dbMode) {
        try {
            const check = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [normalizedEmail]);
            if (check.rows.length > 0) return res.status(409).json({ error: "Email already registered" });
            
            const r = await pool.query(
                'INSERT INTO users (id, name, mobile, email, password, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [userId, name, mobile, normalizedEmail, password, 'Active']
            );
            return res.json(r.rows[0]);
        } catch (err) {
            console.error("DB Register Error:", err.message);
            dbMode = false; 
        }
    }

    // Memory/File Fallback
    if (memoryUsers.find(u => u.email?.toLowerCase().trim() === normalizedEmail)) {
        return res.status(409).json({ error: "Email already registered" });
    }
    const newUser = { id: userId, name, mobile, email: normalizedEmail, password, status: 'Active' };
    memoryUsers.unshift(newUser);
    if (!process.env.VERCEL) {
        try { fs.writeFileSync(dataPath, JSON.stringify(memoryUsers, null, 2)); } catch {}
    }
    res.json(newUser);
  } catch(e) {
    res.status(500).json({error: "Registration failed"});
  }
});

app.put('/api/users/:id', async (req, res) => {
    if (dbMode) {
        try {
            const { name, mobile, status } = req.body;
            await pool.query('UPDATE users SET name = $1, mobile = $2, status = $3 WHERE id = $4', [name, mobile, status, req.params.id]);
            return res.json({success: true});
        } catch { dbMode = false; }
    }
    const idx = memoryUsers.findIndex(u => u.id === req.params.id);
    if (idx !== -1) {
        memoryUsers[idx] = { ...memoryUsers[idx], ...req.body };
        if (!process.env.VERCEL) fs.writeFileSync(dataPath, JSON.stringify(memoryUsers, null, 2));
    }
    res.json({success: true});
});

app.delete('/api/users/:id', async (req, res) => {
    if (dbMode) {
        try {
            await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
            return res.json({success: true});
        } catch { dbMode = false; }
    }
    memoryUsers = memoryUsers.filter(u => u.id !== req.params.id);
    if (!process.env.VERCEL) fs.writeFileSync(dataPath, JSON.stringify(memoryUsers, null, 2));
    res.json({success: true});
});

// Mock Database of Admin
const adminUsers = [
  {
    id: 1,
    username: "admin@tdr.local",
    password: bcrypt.hashSync("admin@123", 10)
  },
  {
    id: 2,
    username: "admin@trd.local", // Added alias to catch typo in screenshot
    password: bcrypt.hashSync("admin@123", 10)
  }
];

// Authentication API Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = adminUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: "User not found. Try admin@tdr.local" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // Generate securely signed JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  res.json({
    message: "Login successful",
    token
  });
});

// SMS OTP endpoint (Bypasses strict Twilio requirements for localhost)
app.post('/api/send-sms', async (req, res) => {
  const { to, otp } = req.body;
  
  console.log(`\n=============================================`);
  console.log(`📱 MOBILE OTP SIMULATION (Localhost Output)`);
  console.log(`📱 Phone: ${to}`);
  console.log(`🔢 OTP Code: ${otp}`);
  console.log(`=============================================\n`);

  // We will still attempt to send via Twilio if configured, but we won't block if it fails
  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.warn("⚠️ Twilio SID is missing. Bypassing real SMS, but OTP is logged above.");
    return res.status(200).json({ message: "SMS simulated on localhost fallback." });
  }

  let phone = to;
  if (!phone.startsWith('+')) {
    phone = `+91${phone}`;
  }

  try {
    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    console.log(`✅ REAL SMS successfully sent to ${phone}`);
    return res.status(200).json({ message: "SMS sent successfully via Twilio!" });
  } catch (error) {
    console.error("⚠️ Twilio SMS Error (Bypassed):", error.message);
    console.log("👉 Don't worry! You can use the OTP logged above to continue.");
    // Force a 200 success response even if Twilio complains about unverified numbers or auth errors
    return res.status(200).json({ message: "SMS simulated because real Twilio API failed." });
  }
});

// Real Email OTP endpoint using Nodemailer
app.post('/api/send-email', async (req, res) => {
  const { to, otp } = req.body;
  console.log(`📧 Sending Email OTP to: ${to} | OTP: ${otp}`);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("❌ SMTP credentials missing in .env");
    return res.status(500).json({ error: "SMTP credentials missing. Open .env and set SMTP_USER and SMTP_PASS (use a Gmail App Password)." });
  }
  if (process.env.SMTP_USER.includes('your_gmail') || process.env.SMTP_PASS.includes('your_16_char')) {
    console.error("❌ SMTP credentials are still placeholder values");
    return res.status(500).json({ error: "SMTP not configured. Replace placeholder values in .env with your real Gmail address and App Password." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SMC e-TDR OTP</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:30px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
              
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#1a3a6b 0%,#0d6efd 100%);padding:30px 40px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:1px;">
                    🏛️ Surat Municipal Corporation
                  </h1>
                  <p style="color:#c8d8f0;margin:6px 0 0 0;font-size:13px;letter-spacing:0.5px;">
                    e-TDR Platform — Secure Verification
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <p style="color:#333;font-size:16px;margin:0 0 10px 0;">Dear Applicant,</p>
                  <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 30px 0;">
                    You have requested an OTP for registration on the <strong>SMC e-TDR Platform</strong>. 
                    Please use the code below to verify your email address.
                  </p>

                  <!-- OTP Box -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:20px 0;">
                        <div style="display:inline-block;background:linear-gradient(135deg,#f0f7ff,#e8f0fe);border:2px dashed #0d6efd;border-radius:12px;padding:24px 48px;">
                          <p style="margin:0 0 8px 0;color:#666;font-size:13px;text-transform:uppercase;letter-spacing:2px;">Your OTP Code</p>
                          <p style="margin:0;font-size:42px;font-weight:800;letter-spacing:12px;color:#1a3a6b;font-family:monospace;">
                            ${otp}
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <p style="color:#888;font-size:13px;text-align:center;margin:20px 0;">
                    ⏰ This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.
                  </p>

                  <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">

                  <p style="color:#aaa;font-size:12px;text-align:center;margin:0;">
                    If you did not request this OTP, please ignore this email.<br>
                    This is an automated message from the SMC e-TDR System.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f8f9fa;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
                  <p style="color:#999;font-size:11px;margin:0;">
                    © ${new Date().getFullYear()} Surat Municipal Corporation | e-TDR Platform<br>
                    Muglisara, Surat, Gujarat - 395001
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    const info = await transporter.sendMail({
      from: `"SMC e-TDR Platform" <${process.env.SMTP_USER}>`,
      to: to,
      subject: `${otp} — Your SMC e-TDR Registration OTP`,
      text: `Your SMC e-TDR Registration OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.\n\n— SMC e-TDR Platform`,
      html: htmlBody
    });

    console.log(`✅ Email OTP sent to ${to} | Message ID: ${info.messageId}`);
    res.status(200).json({ message: "Email OTP sent successfully!" });
  } catch (error) {
    console.error("❌ Nodemailer Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Generic Notification Alert endpoint using Nodemailer
app.post('/api/send-alert', async (req, res) => {
  const { title, message, to } = req.body;
  const recipient = to || process.env.SMTP_USER;
  console.log(`📧 Sending Alert Notification to: ${recipient} | Title: ${title}`);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(500).json({ error: "SMTP credentials missing." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false }
    });

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f9;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1a3a6b; border-bottom: 2px solid #eee; padding-bottom: 10px;">SMC e-TDR Notification</h2>
          <div style="border-left: 4px solid #0d6efd; padding-left: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">${title}</h3>
            <p style="color: #555; line-height: 1.5;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
            This is an automated notification from the SMC e-TDR Platform.
          </p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"SMC e-TDR Alerts" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject: `TDR Alert: ${title}`,
      text: `${title}\n\n${message}`,
      html: htmlBody
    });

    console.log(`✅ Alert Email sent to ${recipient}`);
    res.status(200).json({ message: "Alert email sent successfully!" });
  } catch (error) {
    console.error("❌ Nodemailer Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Real Document Upload endpoint — stores PDF locally in /uploads
app.post('/api/upload-certificate', upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const uploadId = `REF-${Date.now()}`;
  console.log(`File saved: ${req.file.filename} (Upload ID: ${uploadId})`);
  res.status(200).json({
    message: 'Document uploaded successfully!',
    uploadId,
    filename: req.file.filename,
    size: req.file.size,
    path: `/uploads/${req.file.filename}`
  });
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Example Protected Route requiring verified JWT token
app.get('/api/admin/data', verifyToken, (req, res) => {
    res.json({ message: "Access Granted to encrypted TDR Admin Base", user: req.user });
});

const PORT = 5000;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
      console.log(`🚀 Authentication Backend Server running securely on http://localhost:${PORT}`);
  });
}

export default app;
