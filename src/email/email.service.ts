import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Validate email credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('Email credentials are missing! Please check your .env file.');
    }

    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER?.trim(),
        pass: process.env.EMAIL_PASSWORD?.trim(),
      },
    });
  }

  async sendRegistrationEmail(
  email: string,
  fullName: string,
  userId: number,
  role: 'patient' | 'doctor' = 'patient',
): Promise<boolean> {
  const subject = role === 'doctor' 
    ? 'Welcome to Doctor Appointment Booking System - Doctor Registration'
    : 'Welcome to Doctor Appointment Booking System';
  const htmlContent = role === 'doctor'
    ? this.getDoctorRegistrationEmailTemplate(fullName, email, userId)
    : this.getPatientRegistrationEmailTemplate(fullName, email, userId);

  try {
    const result = await this.transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject,
      html: htmlContent,
    });
    return true;
  } catch (error: any) {
    console.error("Email sending failed:", error);
    return false;
  }
}



  async sendForgotPasswordEmail(email: string, fullName: string, resetToken: string): Promise<boolean> {
    const subject = 'Password Reset Request - Doctor Appointment Booking System';
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const htmlContent = this.getForgotPasswordEmailTemplate(fullName, email, resetLink);

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject,
        html: htmlContent,
      });
      console.log(`Password reset email sent successfully to ${email}`);
      return true;
    } catch (error) {
      console.error(`Email sending failed to ${email}:`, error.message);
      return false;
    }
  }

  async sendPasswordResetConfirmationEmail(email: string, fullName: string): Promise<boolean> {
    const subject = 'Password Reset Successful - Doctor Appointment Booking System';
    const htmlContent = this.getPasswordResetConfirmationEmailTemplate(fullName, email);

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject,
        html: htmlContent,
      });
      console.log(`Password reset confirmation email sent to ${email}`);
      return true;
    } catch (error) {
      console.error(`Email sending failed to ${email}:`, error.message);
      return false;
    }
  }

  private getPatientRegistrationEmailTemplate(fullName: string, email: string, userId: number): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Doctor Appointment Booking</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7fa;
                line-height: 1.6;
                color: #333;
            }
            
            .container {
                max-width: 600px;
                margin: 30px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }
            
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
            }
            
            .header p {
                font-size: 14px;
                opacity: 0.9;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .greeting {
                font-size: 18px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 20px;
            }
            
            .message {
                color: #555;
                font-size: 15px;
                margin-bottom: 25px;
                line-height: 1.8;
            }
            
            .info-box {
                background-color: #f8f9fa;
                border-left: 4px solid #667eea;
                padding: 20px;
                margin: 25px 0;
                border-radius: 4px;
            }
            
            .info-box p {
                color: #666;
                margin-bottom: 8px;
                font-size: 14px;
            }
            
            .info-box strong {
                color: #333;
            }
            
            .cta-button {
                display: inline-block;
                background-color: #667eea;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: 600;
                margin: 25px 0;
                transition: background-color 0.3s ease;
            }
            
            .cta-button:hover {
                background-color: #5568d3;
            }
            
            .features {
                margin: 30px 0;
            }
            
            .features h3 {
                color: #2c3e50;
                font-size: 16px;
                margin-bottom: 15px;
            }
            
            .feature-list {
                list-style: none;
            }
            
            .feature-list li {
                color: #666;
                font-size: 14px;
                padding: 8px 0;
                display: flex;
                align-items: center;
            }
            
            .feature-list li:before {
                content: "✓";
                color: #667eea;
                font-weight: bold;
                margin-right: 10px;
                font-size: 16px;
            }
            
            .footer {
                background-color: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e0e0e0;
            }
            
            .footer p {
                color: #777;
                font-size: 13px;
                margin-bottom: 10px;
            }
            
            .social-links {
                margin-top: 15px;
            }
            
            .social-links a {
                display: inline-block;
                margin: 0 8px;
                color: #667eea;
                text-decoration: none;
                font-size: 12px;
            }
            
            .social-links a:hover {
                text-decoration: underline;
            }
            
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                }
                
                .header {
                    padding: 30px 15px;
                }
                
                .header h1 {
                    font-size: 22px;
                }
                
                .content {
                    padding: 25px 15px;
                }
                
                .cta-button {
                    display: block;
                    text-align: center;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Doctor Appointment Booking System</h1>
                <p>Your trusted healthcare appointment platform</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Welcome, ${fullName}!
                </div>
                
                <div class="message">
                    Thank you for registering with Doctor Appointment Booking System as a <strong>Patient</strong>. We're excited to have you on board! 
                    You can now easily schedule appointments with qualified doctors at your convenience.
                </div>
                
                <div class="info-box">
                    <p><strong>Account Type:</strong> Patient</p>
                    <p><strong>Account Email:</strong> ${email}</p>
                    <p><strong>User ID:</strong> ${userId}</p>
                    <p><strong>Status:</strong> <span style="color: #27ae60; font-weight: bold;">Active ✓</span></p>
                </div>
                
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="cta-button">
                    Go to Dashboard
                </a>
                
                <div class="features">
                    <h3>What you can do now:</h3>
                    <ul class="feature-list">
                        <li>Browse available doctors by specialty</li>
                        <li>Check doctor availability and schedules</li>
                        <li>Book appointments at your preferred time</li>
                        <li>Manage your medical history</li>
                        <li>Receive appointment reminders</li>
                        <li>View appointment history</li>
                        <li>Rate and review doctors</li>
                    </ul>
                </div>
                
                <div class="message" style="font-size: 14px; color: #888; margin-top: 30px;">
                    If you need any assistance or have questions, please don't hesitate to contact our support team.
                    We're here to help!
                </div>
            </div>
            
            <div class="footer">
                <p>&copy; 2025 Doctor Appointment Booking System. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
                <div class="social-links">
                    <a href="#">Privacy Policy</a> | 
                    <a href="#">Terms of Service</a> | 
                    <a href="#">Contact Us</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private getDoctorRegistrationEmailTemplate(fullName: string, email: string, userId: number): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Doctor Appointment Booking - Doctor Portal</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7fa;
                line-height: 1.6;
                color: #333;
            }
            
            .container {
                max-width: 600px;
                margin: 30px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }
            
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
            }
            
            .header p {
                font-size: 14px;
                opacity: 0.9;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .greeting {
                font-size: 18px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 20px;
            }
            
            .message {
                color: #555;
                font-size: 15px;
                margin-bottom: 25px;
                line-height: 1.8;
            }
            
            .badge {
                display: inline-block;
                background-color: #16a34a;
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                margin-left: 8px;
            }
            
            .info-box {
                background-color: #f0fdf4;
                border-left: 4px solid #16a34a;
                padding: 20px;
                margin: 25px 0;
                border-radius: 4px;
            }
            
            .info-box p {
                color: #666;
                margin-bottom: 8px;
                font-size: 14px;
            }
            
            .info-box strong {
                color: #333;
            }
            
            .cta-button {
                display: inline-block;
                background-color: #16a34a;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: 600;
                margin: 25px 0;
                transition: background-color 0.3s ease;
            }
            
            .cta-button:hover {
                background-color: #15803d;
            }
            
            .features {
                margin: 30px 0;
            }
            
            .features h3 {
                color: #2c3e50;
                font-size: 16px;
                margin-bottom: 15px;
            }
            
            .feature-list {
                list-style: none;
            }
            
            .feature-list li {
                color: #666;
                font-size: 14px;
                padding: 8px 0;
                display: flex;
                align-items: center;
            }
            
            .feature-list li:before {
                content: "✓";
                color: #16a34a;
                font-weight: bold;
                margin-right: 10px;
                font-size: 16px;
            }
            
            .note-box {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
                font-size: 13px;
            }
            
            .note-box strong {
                color: #92400e;
            }
            
            .footer {
                background-color: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e0e0e0;
            }
            
            .footer p {
                color: #777;
                font-size: 13px;
                margin-bottom: 10px;
            }
            
            .social-links {
                margin-top: 15px;
            }
            
            .social-links a {
                display: inline-block;
                margin: 0 8px;
                color: #16a34a;
                text-decoration: none;
                font-size: 12px;
            }
            
            .social-links a:hover {
                text-decoration: underline;
            }
            
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                }
                
                .header {
                    padding: 30px 15px;
                }
                
                .header h1 {
                    font-size: 22px;
                }
                
                .content {
                    padding: 25px 15px;
                }
                
                .cta-button {
                    display: block;
                    text-align: center;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Doctor Portal <span style="font-size: 20px;">🏥</span></h1>
                <p>Doctor Appointment Booking System</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Welcome, Dr. ${fullName}!
                </div>
                
                <div class="message">
                    Thank you for registering with Doctor Appointment Booking System as a <strong>Doctor</strong>. We're thrilled to have you join our network of healthcare professionals! 
                    You can now manage your schedule and connect with patients seeking your expertise.
                </div>
                
                <div class="info-box">
                    <p><strong>Account Type:</strong> Doctor</p>
                    <p><strong>Account Email:</strong> ${email}</p>
                    <p><strong>User ID:</strong> ${userId}</p>
                    <p><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">Active ✓</span></p>
                </div>
                
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="cta-button">
                    Access Doctor Dashboard
                </a>
                
                <div class="features">
                    <h3>Doctor Portal Features:</h3>
                    <ul class="feature-list">
                        <li>Manage your profile and credentials</li>
                        <li>Set your availability schedule</li>
                        <li>View patient appointments</li>
                        <li>Accept or reschedule appointments</li>
                        <li>Communicate with patients</li>
                        <li>Track appointment history</li>
                        <li>Build your professional reputation</li>
                    </ul>
                </div>
                
                <div class="note-box">
                    <strong>📋 Next Steps:</strong> Please complete your doctor profile with your specialty, experience, education, and consultation fees to start receiving appointment requests.
                </div>
                
                <div class="message" style="font-size: 14px; color: #888; margin-top: 30px;">
                    If you need any assistance or have questions about using the Doctor Portal, please don't hesitate to contact our support team.
                    We're here to help you succeed!
                </div>
            </div>
            
            <div class="footer">
                <p>&copy; 2025 Doctor Appointment Booking System. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
                <div class="social-links">
                    <a href="#">Privacy Policy</a> | 
                    <a href="#">Terms of Service</a> | 
                    <a href="#">Contact Us</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }
  private getForgotPasswordEmailTemplate(fullName: string, email: string, resetLink: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7fa;
                line-height: 1.6;
                color: #333;
            }
            
            .container {
                max-width: 600px;
                margin: 30px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }
            
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
            }
            
            .header p {
                font-size: 14px;
                opacity: 0.9;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .greeting {
                font-size: 18px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 20px;
            }
            
            .message {
                color: #555;
                font-size: 15px;
                margin-bottom: 25px;
                line-height: 1.8;
            }
            
            .warning-box {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 20px;
                margin: 25px 0;
                border-radius: 4px;
            }
            
            .warning-box p {
                color: #856404;
                font-size: 14px;
                margin: 0;
            }
            
            .cta-button {
                display: inline-block;
                background-color: #e74c3c;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: 600;
                margin: 25px 0;
                transition: background-color 0.3s ease;
            }
            
            .cta-button:hover {
                background-color: #c0392b;
            }
            
            .info-box {
                background-color: #f8f9fa;
                border-left: 4px solid #17a2b8;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
                font-size: 13px;
                color: #666;
            }
            
            .footer {
                background-color: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e0e0e0;
            }
            
            .footer p {
                color: #777;
                font-size: 13px;
                margin-bottom: 10px;
            }
            
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                }
                
                .content {
                    padding: 25px 15px;
                }
                
                .cta-button {
                    display: block;
                    text-align: center;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request</h1>
                <p>Doctor Appointment Booking System</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hello, ${fullName}
                </div>
                
                <div class="message">
                    We received a request to reset the password for your account associated with this email address. 
                    If you made this request, click the button below to reset your password.
                </div>
                
                <a href="${resetLink}" class="cta-button">
                    Reset Your Password
                </a>
                
                <div class="warning-box">
                    <p><strong>⏰ Important:</strong> This link will expire in 15 minutes for security reasons.</p>
                </div>
                
                <div class="message" style="font-size: 14px; color: #666; margin-top: 30px;">
                    If you did not request a password reset, please ignore this email or contact our support team immediately.
                    Your account security is important to us.
                </div>
                
                <div class="info-box">
                    <p><strong>Account Email:</strong> ${email}</p>
                    <p style="margin-top: 5px;">If the button above doesn't work, copy and paste this link in your browser:<br/>
                    <code style="word-break: break-all;">${resetLink}</code></p>
                </div>
            </div>
            
            <div class="footer">
                <p>&copy; 2025 Doctor Appointment Booking System. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private getPasswordResetConfirmationEmailTemplate(fullName: string, email: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Successful</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7fa;
                line-height: 1.6;
                color: #333;
            }
            
            .container {
                max-width: 600px;
                margin: 30px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }
            
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
            }
            
            .header p {
                font-size: 14px;
                opacity: 0.9;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .greeting {
                font-size: 18px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 20px;
            }
            
            .message {
                color: #555;
                font-size: 15px;
                margin-bottom: 25px;
                line-height: 1.8;
            }
            
            .success-box {
                background-color: #d4edda;
                border-left: 4px solid #27ae60;
                padding: 20px;
                margin: 25px 0;
                border-radius: 4px;
            }
            
            .success-box p {
                color: #155724;
                font-size: 14px;
                margin: 0;
            }
            
            .cta-button {
                display: inline-block;
                background-color: #27ae60;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: 600;
                margin: 25px 0;
                transition: background-color 0.3s ease;
            }
            
            .cta-button:hover {
                background-color: #229954;
            }
            
            .footer {
                background-color: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e0e0e0;
            }
            
            .footer p {
                color: #777;
                font-size: 13px;
                margin-bottom: 10px;
            }
            
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                }
                
                .content {
                    padding: 25px 15px;
                }
                
                .cta-button {
                    display: block;
                    text-align: center;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Successful ✓</h1>
                <p>Doctor Appointment Booking System</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hello, ${fullName}
                </div>
                
                <div class="message">
                    Your password has been successfully reset. You can now log in with your new password.
                </div>
                
                <div class="success-box">
                    <p><strong>✓ Success:</strong> Your account password has been updated successfully.</p>
                </div>
                
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="cta-button">
                    Go to Login
                </a>
                
                <div class="message" style="font-size: 14px; color: #666; margin-top: 30px;">
                    If you did not make this change or believe someone unauthorized accessed your account, 
                    please contact our support team immediately.
                </div>
            </div>
            
            <div class="footer">
                <p>&copy; 2025 Doctor Appointment Booking System. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

