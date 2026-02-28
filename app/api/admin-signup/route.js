import { NextResponse } from 'next/server';
import { getAdminModel } from '@/models/Admin';
import { generateNumericId } from '@/utils/idGeneratorAdmin';
import { hashPassword } from '@/lib/auth';
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});


export async function POST(request) {
    try {

        const body = await request.json();
        const { fullName, email, phone, address, age, password } = body;

        
        if (!fullName || !email || !phone || !address || !age || !password) {
            return NextResponse.json(
                { success: false, message: 'All fields, including password, are required.' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { success: false, message: 'Password must be at least 8 characters long.' },
                { status: 400 }
            );
        }

        const Admin = await getAdminModel();
        
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json(
                { success: false, message: 'An admin with this email already exists.' },
                { status: 409 }
            );
        }
        
        const hashedPassword = await hashPassword(password);

        
        const userId = generateNumericId();

        
        const newAdmin = new Admin({
            fullName,
            email,
            phone,
            address,
            age,
            password: hashedPassword,
            userId
        });

        await newAdmin.save();

        
        const { password: _, ...adminData } = newAdmin.toObject();


        try {
            const mailOptions = {
                from: `"Your App Name" <${process.env.EMAIL_FROM || process.env.SMTP_USERNAME}>`,
                to: email,
                subject: 'Welcome to Your New Admin Account!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px;">
                        <h2 style="color: #2563eb; text-align: center;">Welcome, ${fullName}!</h2>
                        <p>Hello ${fullName},</p>
                        <p>Your admin account has been successfully created. You can now log in using your email and password.</p>
                        <p>Your Admin User ID is: <strong>${userId}</strong></p>
                        <p>If you have any questions, please don't hesitate to contact our support team.</p>
                        <p style="margin-top: 30px; color: #6b7280; font-size: 0.9rem;">
                            Best regards,<br>
                            Your App Team
                        </p>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
        }

        
        return NextResponse.json({
            success: true,
            message: 'Admin account created successfully!',
            data: adminData
        }, { status: 201 });

    } catch (error) {
        console.error('Admin Signup Error:', error);

        
        if (error.name === 'ValidationError') {
             return NextResponse.json(
                { success: false, message: 'Validation failed.', errors: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: 'An internal server error occurred.',
                error: error.message
            },
            { status: 500 }
        );
    }
}


