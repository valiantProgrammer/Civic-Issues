import { NextResponse } from 'next/server';
import {
  classifySeverityFromDescription,
  compareSeverities,
  generateVerificationReport
} from '@/utils/mlSeverityClassifier';

/**
 * API Endpoint: POST /api/validate-severity
 * 
 * Validates user-provided severity against ML-predicted severity
 * Returns whether the image should be auto-verified or requires manual review
 * 
 * Request Body:
 * {
 *   title: string (required) - Report title
 *   description: string (required) - Issue description
 *   category: string (required) - Issue category
 *   severity: string (required) - User's reported severity (low/medium/high)
 *   imageUrl: string (optional) - Image URL for verification report
 * }
 * 
 * Response:
 * {
 *   aiVerified: boolean - Whether AI verified the severity
 *   finalSeverity: string - Final severity to use (may override user input)
 *   reason: string - Explanation of decision
 *   warning: string|null - Warning if there's a mismatch
 *   mlPrediction: {
 *     severity: string,
 *     confidence: 0-1
 *   },
 *   recommendedAction: string - 'AUTO_APPROVED' or 'MANUAL_REVIEW'
 * }
 */
export async function POST(request) {
  try {
    const { title, description, category, severity, imageUrl } = await request.json();

    // Validate required fields
    if (!title || !description || !category || !severity) {
      return NextResponse.json(
        { message: 'Missing required fields: title, description, category, severity' },
        { status: 400 }
      );
    }

    // Validate severity input
    const validSeverities = ['low', 'medium', 'high', 'Low', 'Medium', 'High', 'LOW', 'MEDIUM', 'HIGH'];
    if (!validSeverities.map(s => s.toLowerCase()).includes(severity.toLowerCase())) {
      return NextResponse.json(
        { message: `Invalid severity. Must be one of: low, medium, high` },
        { status: 400 }
      );
    }

    // Normalize severity to title case
    const normalizedSeverity = severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase();

    // --- Step 1: Classify severity using ML ---
    const mlResult = classifySeverityFromDescription(description, category, title);

    // --- Step 2: Compare with user-provided severity ---
    const validation = compareSeverities(
      mlResult.severity,
      normalizedSeverity,
      mlResult.confidence
    );

    // --- Step 3: Generate detailed response ---
    const response = {
      aiVerified: validation.aiVerified,
      finalSeverity: validation.finalSeverity,
      reason: validation.reason,
      warning: validation.warning,
      mlPrediction: {
        severity: mlResult.severity,
        confidence: mlResult.confidence,
        matchedKeywords: mlResult.matchedKeywords
      },
      recommendedAction: validation.warning ? 'MANUAL_REVIEW' : 'AUTO_APPROVED',
      details: validation.details
    };

    // --- Step 4: Log verification for audit trail ---
    if (imageUrl) {
      const report = generateVerificationReport(
        imageUrl,
        description,
        category,
        title,
        severity.toLowerCase()
      );
      console.log('Severity Verification Report:', JSON.stringify(report, null, 2));
    }

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error in /api/validate-severity:', error);
    return NextResponse.json(
      {
        message: 'Error validating severity',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/validate-severity?category=Road
 * Returns expected severity range for a category
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
      return NextResponse.json(
        { message: 'Missing category parameter' },
        { status: 400 }
      );
    }

    const { getExpectedSeverityRange } = await import('@/utils/mlSeverityClassifier');
    const range = getExpectedSeverityRange(category);

    return NextResponse.json({
      category,
      expectedRange: range,
      severityLevels: ['low', 'medium', 'high']
    });

  } catch (error) {
    console.error('Error in GET /api/validate-severity:', error);
    return NextResponse.json(
      { message: 'Error fetching severity expectations' },
      { status: 500 }
    );
  }
}
