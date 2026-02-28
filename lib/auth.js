import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-for-development-32-chars');
const ACCESS_TOKEN_EXPIRY = '3d';
const REFRESH_TOKEN_EXPIRY = '30d';

export const hashPassword = async (password) => {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );
    const key = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );
    return `${Buffer.from(salt).toString('hex')}:${Buffer.from(key).toString('hex')}`;
};


export const verifyPassword = async (password, hashedPassword) => {
    const [saltHex, keyHex] = hashedPassword.split(':');
    const salt = Buffer.from(saltHex, 'hex');
    const storedKey = Buffer.from(keyHex, 'hex');

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );
    const derivedKey = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );

    return Buffer.from(derivedKey).equals(storedKey);
};


export const generateAccessToken = async (user) => {
    return await new SignJWT({
        userId: user.userId,
        role: user.role 
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(ACCESS_TOKEN_EXPIRY)
        .sign(JWT_SECRET);
};

export const generateRefreshToken = async (user) => {
    return await new SignJWT({
        userId: user.id,
        role: user.role 
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(REFRESH_TOKEN_EXPIRY)
        .sign(JWT_SECRET);
};

export const verifyToken = async (token) => {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch (error) {

        return null;
    }
};


export const getUserIdFromToken = async (token) => {
    const payload = await verifyToken(token);
    return payload?.userId || null;
};

export const getUserRoleFromToken = async (token) => {
    const payload = await verifyToken(token);
    return payload?.role || null;
};


export const getCurrentUser = async (req) => {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) return null;

    try {
        const decoded = await verifyToken(token);
        if (!decoded || !decoded.role) return null;

        let apiUrl;


        switch (decoded.role) {
            case 'admin':
                apiUrl = `/api/admin`;
                break;
            case 'adminHead':
                apiUrl = `/api/administration`;
                break;
            case 'user':
                apiUrl = `/api/user`;
                break;
            default:
                return null;
        }
        const response = await fetch(apiUrl, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) return null;
        
        return await response.json();

    } catch (error) {
        console.error("Get current user error:", error);
        return null;
    }
};