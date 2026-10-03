import { NextResponse } from 'next/server';
import { seedDatabaseIfEmpty } from '@/lib/seedData';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';
    const result = await seedDatabaseIfEmpty(force);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('API seed error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const result = await seedDatabaseIfEmpty(true);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('API seed error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
