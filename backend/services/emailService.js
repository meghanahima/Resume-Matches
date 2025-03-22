const nodemailer = require("nodemailer");

// Configure nodemailer
const transporter = nodemailer.createTransport({
  // service: 'gmail',
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "siddimeghana20@gmail.com",
    pass: "nblaoraqdixjcfto",
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    // console.log(process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD);
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

const sendVerificationEmail = async (frontendURL, email, token) => {
  const verificationUrl = `${frontendURL}/verify-email/${token}`;
  const html = `
    <h1>Email Verification</h1>
    <p>Please click this link to verify your email:</p>
    <a href="${verificationUrl}">${verificationUrl}</a>
    <p>This link will expire in 24 hours.</p>
  `;

  return sendEmail(email, "Verify your email", html);
};

const sendPasswordResetEmail = async (email, token, frontendURL) => {
  const resetUrl = `${frontendURL}/reset-password/${token}`;
  const html = `
    <h1>Password Reset Request</h1>
    <p>Please click this link to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return sendEmail(email, "Password Reset Request", html);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
