import { NextResponse } from 'next/server';
import { getUserModel } from '@/models/User';
import { getAdministrativeHeadModel } from '@/models/Administrative';
import { getAdminModel } from '@/models/Admin';
import { verifyToken } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload file to Cloudinary
async function uploadToCloudinary(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'profile-pictures',
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                }
            );
            uploadStream.end(buffer);
        });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

export async function GET(request) {
    try {
        // Get token from cookies or authorization header
        const token = request.cookies.get('accessToken')?.value || 
                      request.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - No token provided' },
                { status: 401 }
            );
        }

        // Verify token and get userId
        const payload = await verifyToken(token);
        console.log('Token payload:', { userId: payload?.userId, role: payload?.role });
        
        if (!payload || !payload.userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - Invalid token' },
                { status: 401 }
            );
        }

        // Handle AdminHead role (Administrative Head)
        if (payload.role === 'adminHead') {
            const AdministrativeHead = await getAdministrativeHeadModel();
            const adminHead = await AdministrativeHead.findById(payload.userId).select('-password');

            if (adminHead) {
                console.log('Found administrative head:', adminHead._id);
                return NextResponse.json({
                    success: true,
                    fullName: adminHead.fullName,
                    email: adminHead.email,
                    phone: adminHead.phone,
                    age: adminHead.age,
                    designation: adminHead.designation,
                    authority: adminHead.authority,
                    municipality: adminHead.municipality,
                    userId: adminHead.userId,
                    profilePicture: adminHead.profilePicture,
                    municipalId: adminHead.municipalId,
                    _id: adminHead._id,
                    createdAt: adminHead.createdAt
                }, { status: 200 });
            }
            
            console.log('Administrative head not found for userId:', payload.userId);
            return NextResponse.json(
                { success: false, message: 'Administrative head not found' },
                { status: 404 }
            );
        }

        // Handle Admin role (Regular Admin)
        if (payload.role === 'admin') {
            const Admin = await getAdminModel();
            const admin = await Admin.findById(payload.userId).select('-password');

            if (admin) {
                console.log('Found admin:', admin._id);
                return NextResponse.json({
                    success: true,
                    fullName: admin.fullName,
                    email: admin.email,
                    phone: admin.phone,
                    age: admin.age,
                    address: admin.address,
                    userId: admin.userId,
                    profilePicture: admin.profilePicture,
                    _id: admin._id,
                    createdAt: admin.createdAt
                }, { status: 200 });
            }

            console.log('Admin not found for userId:', payload.userId);
            return NextResponse.json(
                { success: false, message: 'Admin not found' },
                { status: 404 }
            );
        }

        // Handle regular User role
        const User = await getUserModel();
        const user = await User.findById(payload.userId).select('-password');

        if (!user) {
            console.log('User not found for userId:', payload.userId, 'with role:', payload.role);
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                user: {
                    _id: user._id,
                    userName: user.userName,
                    email: user.email,
                    phone: user.phone,
                    address: user.Address,
                    age: user.age,
                    userId: user.userId,
                    timeOfLogin: user.timeOfLogin,
                    profilePicture: user.profilePicture
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        // Get token from cookies or authorization header
        const token = request.cookies.get('accessToken')?.value || 
                      request.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - No token provided' },
                { status: 401 }
            );
        }

        // Verify token and get userId
        const payload = await verifyToken(token);
        if (!payload || !payload.userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - Invalid token' },
                { status: 401 }
            );
        }

        // Parse form data or JSON
        let updateData = {};
        let profilePictureUrl = null;
        const contentType = request.headers.get('content-type');
        
        if (contentType?.includes('multipart/form-data')) {
            const formData = await request.formData();
            
            // Extract fields from FormData
            for (let [key, value] of formData) {
                if (key === 'profilePicture' && value instanceof File) {
                    // Upload to Cloudinary
                    try {
                        profilePictureUrl = await uploadToCloudinary(value);
                        updateData[key] = profilePictureUrl;
                        console.log('Profile picture uploaded to Cloudinary:', profilePictureUrl);
                    } catch (uploadError) {
                        console.error('Failed to upload profile picture:', uploadError);
                        return NextResponse.json(
                            { success: false, message: 'Failed to upload profile picture' },
                            { status: 400 }
                        );
                    }
                } else if (!(value instanceof File)) {
                    updateData[key] = value;
                }
            }
        } else {
            // Regular JSON update
            updateData = await request.json();
        }

        // Handle administrative head updates
        if (payload.role === 'adminHead') {
            const AdministrativeHead = await getAdministrativeHeadModel();
            
            // Allowed fields for update
            const allowedFields = ['fullName', 'phone', 'age', 'designation', 'authority', 'municipality', 'profilePicture'];
            const filteredData = {};
            
            allowedFields.forEach(field => {
                if (updateData[field] !== undefined) {
                    filteredData[field] = updateData[field];
                }
            });

            const adminHead = await AdministrativeHead.findByIdAndUpdate(
                payload.userId,
                filteredData,
                { new: true, select: '-password' }
            );

            if (!adminHead) {
                return NextResponse.json(
                    { success: false, message: 'Administrative head not found' },
                    { status: 404 }
                );
            }

            console.log('AdministrativeHead profile updated:', { 
                userId: adminHead.userId, 
                profilePictureUpdated: !!updateData.profilePicture 
            });

            return NextResponse.json({
                success: true,
                message: 'Profile updated successfully',
                fullName: adminHead.fullName,
                email: adminHead.email,
                phone: adminHead.phone,
                age: adminHead.age,
                designation: adminHead.designation,
                authority: adminHead.authority,
                municipality: adminHead.municipality,
                userId: adminHead.userId,
                profilePicture: adminHead.profilePicture,
                municipalId: adminHead.municipalId,
                _id: adminHead._id,
                createdAt: adminHead.createdAt
            }, { status: 200 });
        }

        // Handle admin updates (Regular Admin)
        if (payload.role === 'admin') {
            const Admin = await getAdminModel();
            
            // Allowed fields for update
            const allowedFields = ['fullName', 'phone', 'age', 'address', 'profilePicture'];
            const filteredData = {};
            
            allowedFields.forEach(field => {
                if (updateData[field] !== undefined) {
                    filteredData[field] = updateData[field];
                }
            });

            const admin = await Admin.findByIdAndUpdate(
                payload.userId,
                filteredData,
                { new: true, select: '-password' }
            );

            if (!admin) {
                return NextResponse.json(
                    { success: false, message: 'Admin not found' },
                    { status: 404 }
                );
            }

            console.log('Admin profile updated:', { 
                userId: admin.userId, 
                profilePictureUpdated: !!updateData.profilePicture 
            });

            return NextResponse.json({
                success: true,
                message: 'Profile updated successfully',
                fullName: admin.fullName,
                email: admin.email,
                phone: admin.phone,
                age: admin.age,
                address: admin.address,
                userId: admin.userId,
                profilePicture: admin.profilePicture,
                _id: admin._id,
                createdAt: admin.createdAt
            }, { status: 200 });
        }

        // Handle regular user updates
        const { phone, address } = updateData;

        const User = await getUserModel();
        
        // Build update object with only provided fields
        const userUpdateData = {};
        if (phone) userUpdateData.phone = phone;
        if (address) userUpdateData.Address = address;
        if (updateData.profilePicture) userUpdateData.profilePicture = updateData.profilePicture;

        // Validate that at least one field is being updated
        if (Object.keys(userUpdateData).length === 0) {
            return NextResponse.json(
                { success: false, message: 'No fields to update' },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndUpdate(
            payload.userId,
            userUpdateData,
            { new: true, select: '-password' }
        );

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        console.log('User profile updated:', { 
            userId: user.userId, 
            profilePictureUpdated: !!updateData.profilePicture 
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Profile updated successfully',
                user: {
                    _id: user._id,
                    userName: user.userName,
                    email: user.email,
                    phone: user.phone,
                    address: user.Address,
                    age: user.age,
                    userId: user.userId,
                    timeOfLogin: user.timeOfLogin,
                    profilePicture: user.profilePicture
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
