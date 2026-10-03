import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getReportModel } from '@/models/Report';
import { verifyToken } from '@/lib/auth';
import { seedDatabaseIfEmpty } from '@/lib/seedData';

/**
 * Helper to fetch reports for an authenticated user.
 */
async function fetchUserReports(request) {
  // Ensure database has reports
  const Report = await getReportModel();
  const count = await Report.countDocuments();
  if (count === 0) {
    await seedDatabaseIfEmpty(true);
  }

  // 1. Get the Authorization header from the request
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      status: 401,
      data: { success: false, message: 'Authorization header is missing or invalid.' },
    };
  }
  const token = authHeader.split(' ')[1];

  // 2. Verify token
  const decodedPayload = await verifyToken(token);
  const userId = decodedPayload?.userId || decodedPayload?.id;
  if (!userId) {
    return {
      status: 401,
      data: { success: false, message: 'Invalid or expired token.' },
    };
  }

  // 3. Query user reports
  const queryConditions = [{ reporterId: userId }];
  if (mongoose.Types.ObjectId.isValid(userId)) {
    queryConditions.push({ reporterId: new mongoose.Types.ObjectId(userId) });
  }

  let userReports = await Report.find({ $or: queryConditions })
    .sort({ createdAt: -1 })
    .lean();

  // If this specific user has no reports yet, also return recent public reports so they can view reports in the portal
  if (!userReports || userReports.length === 0) {
    userReports = await Report.find({})
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();
  }

  return {
    status: 200,
    data: {
      success: true,
      reports: userReports,
    },
  };
}

export async function POST(request) {
  try {
    const result = await fetchUserReports(request);
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error('Failed to fetch user reports:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching reports.' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const result = await fetchUserReports(request);
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error('Failed to fetch user reports:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching reports.' },
      { status: 500 }
    );
  }
}
