import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'mail.vatibangla.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOTP(email: string, otp: string, name?: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'SkillSync - Verify Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to SkillSync!</h2>
          <p>Hello ${name || 'User'},</p>
          <p>Thank you for signing up! Please use the following OTP to verify your account:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn't create an account, please ignore this email.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Best regards,<br>SkillSync Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`OTP sent successfully to ${email}`);
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP email');
    }
  }
}
