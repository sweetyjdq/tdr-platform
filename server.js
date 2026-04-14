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

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
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

// Mock Database of Users
const users = [
  {
    id: 1,
    username: "admin@tdr.local", // Adjusted to match your frontend admin ID
    password: bcrypt.hashSync("admin@123", 10) // hashed password
  }
];

// Authentication API Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
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

// Real SMS OTP endpoint using Twilio
app.post('/api/send-sms', async (req, res) => {
  const { to, otp } = req.body;
  console.log("OTP:", otp);
  
  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.error("Attempted to send real SMS but Twilio SID is missing.");
    return res.status(500).json({ error: "Twilio credentials in .env are missing." });
  }

  // Ensure E.164 format (starts with +)
  let phone = to;
  if (!phone.startsWith('+')) {
    // Default to Indian country code +91
    phone = `+91${phone}`;
  }

  try {
    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    console.log(`REAL SMS sent to ${phone}`);
    res.status(200).json({ message: "SMS sent successfully!" });
  } catch (error) {
    console.error("Twilio SMS Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Real Email OTP endpoint using Nodemailer
app.post('/api/send-email', async (req, res) => {
  const { to, otp } = req.body;
  console.log(`📧 Sending Email OTP to: ${to} | OTP: ${otp}`);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("SMTP credentials missing in .env");
    return res.status(500).json({ error: "SMTP credentials in .env are missing." });
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
app.listen(PORT, () => {
    console.log(`🚀 Authentication Backend Server running securely on http://localhost:${PORT}`);
});
