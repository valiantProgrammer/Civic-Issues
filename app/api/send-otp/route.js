import { NextResponse } from 'next/server';
import { getOTPModel } from '@/models/otpUser';
import { getUserModel } from '@/models/User';
import nodemailer from 'nodemailer';
import { generateOTP } from '@/utils/generateOTP';



const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});


export async function POST(req) {
    try {
        const body = await req.json();
        
        const { email, username } = body;

        
        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        const otpCode = generateOTP();
        const otpExpiry = new Date(Date.now() + 30 * 60 * 1000);
        const OTP = await getOTPModel();

        
        await OTP.findOneAndUpdate(
            { email },
            {
                email,
                otp: otpCode,
                expiresAt: otpExpiry,
                createdAt: new Date(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );


        const mailOptions = {
            from: `"Your App Name" <${process.env.EMAIL_FROM || process.env.SMTP_USERNAME}>`,
            to: email,
            subject: 'Verify Your Email Address',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px;">
          <h2 style="color: #2563eb; text-align: center;">Email Verification</h2>
          <p>Hello ${username},</p>
          <p>Thank you for starting the registration process. Please use the following One-Time Password (OTP) to verify your email address:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="margin: 0; color: #2563eb; letter-spacing: 5px; font-size: 2.5rem;">${otpCode}</h1>
          </div>
          <p>This OTP is valid for 30 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p style="margin-top: 30px; color: #6b7280; font-size: 0.9rem;">
            Best regards,<br>
            Your App Team
          </p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);


        return NextResponse.json(
            {
                success: true,
                message: 'OTP has been sent to your email address.',
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('OTP sending error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'An internal server error occurred',
            },
            { status: 500 }
        );
    }
}
