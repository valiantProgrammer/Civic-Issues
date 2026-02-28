import { NextResponse } from 'next/server';
import { getAdministrativeHeadModel } from '@/models/Administrative';
import { getMunicipalityModel } from '@/models/Municipalities';
import { hashPassword } from '@/lib/auth';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: { user: process.env.SMTP_USERNAME, pass: process.env.SMTP_PASSWORD },
});

export async function POST(request) {
    try {

        const { fullName, email, phone, age, designation, authority, municipality, password } = await request.json();

        
        if (!fullName || !email || !phone || !age || !designation || !authority || !municipality || !password) {
            return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ success: false, message: 'Password must be at least 6 characters long.' }, { status: 400 });
        }

        const AdministrativeModel = await getAdministrativeHeadModel();
        const MunicipalityModel = await getMunicipalityModel();

        
        const existingHead = await AdministrativeModel.findOne({ email });
        if (existingHead) {
            return NextResponse.json({ success: false, message: 'An account with this email already exists.' }, { status: 409 });
        }
        
        
        const hashedPassword = await hashPassword(password);

        
        const newHead = new AdministrativeModel({
            fullName, email, phone, age, designation, authority, municipality,
            password: hashedPassword,
        });
        
        const savedHead = await newHead.save();

        
        const updatedMunicipality = await MunicipalityModel.findOneAndUpdate(
            { name: municipality },
            { $inc: { lastAssignedId: 1 } },
            { new: true }
        );
        console.log(updatedMunicipality)

        if (!updatedMunicipality) {
            
            await AdministrativeModel.findByIdAndDelete(savedHead._id);
            return NextResponse.json({ success: false, message: `Municipality '${municipality}' not found.` }, { status: 404 });
        }

        
        const userId = updatedMunicipality.lastAssignedId;
        console.log(userId)
        const municipalIdHex = updatedMunicipality._id;
        console.log(municipalIdHex)
        const finalAdmin = await AdministrativeModel.findByIdAndUpdate(
            savedHead._id,
            { userId, municipalId: municipalIdHex },
            { new: true }
        );

        
        try {
            await transporter.sendMail({
                from: `"Civic Saathi" <${process.env.EMAIL_FROM}>`,
                to: finalAdmin.email,
                subject: 'Your Administrative Account Has Been Created',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
                        <h2 style="text-align: center;">Welcome, ${finalAdmin.fullName}!</h2>
                        <p>Your Administrative account for the Civic Saathi platform is ready.</p>
                        <p><strong>Municipality:</strong> ${finalAdmin.municipality}</p>
                        <p><strong>Your unique User ID is:</strong> ${finalAdmin.userId}</p>
                    </div>
                `,
            });
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
        }

        const { password: _, ...headData } = finalAdmin.toObject();
        return NextResponse.json({ success: true, message: 'Administrative account created successfully.', user: headData }, { status: 201 });

    } catch (error) {
        console.error('Administrative Signup Error:', error);
        return NextResponse.json({ success: false, message: 'An internal server error occurred.' }, { status: 500 });
    }
}

