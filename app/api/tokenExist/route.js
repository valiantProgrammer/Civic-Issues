import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

/**
 * Checks for the existence and validity of a JWT from the Authorization header.
 * This includes checking if the token has expired (timed out).
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} A JSON response with the token's status.
 */
export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) {
            // If no token is found, it's considered invalid.
            return NextResponse.json({ valid: false, reason: 'missing' });
        }

        // The verifyToken utility function handles all validation, including checking the signature
        // and the expiration time (timeout). It returns the decoded payload if the token is
        // completely valid, and null otherwise.
        const decodedPayload = await verifyToken(token);

        if (decodedPayload) {
            // A non-null payload means the token exists, is correctly signed, and has not expired.
            return NextResponse.json({ valid: true });
        } else {
            // A null payload means the token is either invalid or has timed out.
            // For security, we don't differentiate between the two specific reasons in the public response.
            return NextResponse.json({ valid: false, reason: 'invalid_or_expired' });
        }

    } catch (error) {
        console.error('Token verification route error:', error);
        // In case of any unexpected server errors, report the token as not valid.
        return NextResponse.json({ valid: false, reason: 'server_error' }, { status: 500 });
    }
}