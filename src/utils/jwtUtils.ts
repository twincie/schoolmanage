import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getUserById } from './authUtils';

// Configuration (should be stored in environment variables in production)
const JWT_SECRET = 'your-jwt-secret-key';
const REFRESH_SECRET = 'your-refresh-secret-key';
const JWT_EXPIRES_IN = '1h'; // Short-lived access token
const REFRESH_EXPIRES_IN = '1d'; // Longer-lived refresh token

interface TokenPayload {
  userId: string;
  email?: string;
  username?: string;
  role?: string; // Include role in the token payload
  [key: string]: any;
}

interface TokenResponse {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

/**
 * Generates a new JWT token and refresh token
 * @param payload Data to include in the JWT token
 * @returns Object containing the tokens and expiration time
 */
export const generateTokens = (payload: TokenPayload): TokenResponse => {
  // Current timestamp in seconds
  const currentTimestamp = Math.floor(Date.now() / 1000);
  
  // Calculate expiration time
  // const jwtExpiresIn = parseInt(JWT_EXPIRES_IN) || 900; // Default 15 minutes in seconds
  // const expiresAt = currentTimestamp + jwtExpiresIn;
  
  // Generate JWT token
  const token = jwt.sign(
    { 
      ...payload,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } // Let jwt.sign handle the expiration
  );

  const decoded = jwt.decode(token) as { exp: number };
  const expiresAt = decoded.exp; // Expiration time in seconds
  
  // Generate refresh token (with longer expiration)
  const refreshToken = jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
      role: payload.role,
      type: 'refresh',
      // Random token ID to allow revocation if needed
      jti: crypto.randomBytes(16).toString('hex')
    },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN }
  );
  
  return {
    token,
    refreshToken,
    expiresAt
  };
};

/**
 * Uses a refresh token to generate a new JWT token and a new refresh token
 * @param refreshToken The refresh token to use
 * @returns Object containing the new tokens and expiration time
 * @throws Error if refresh token is invalid or expired
 */
export const refreshAccessToken = async (refreshToken: string): Promise<TokenResponse> => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as TokenPayload & { jti: string };
    
    // Ensure it's a refresh token
    if (!decoded.userId || decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }

    // Get user from database
    const existingUser = await getUserById(Number(decoded.userId));
    if (!existingUser) {
      throw new Error('User not found');
    }
    
    // Current timestamp in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);
    
    // Calculate expiration time
    // const jwtExpiresIn = parseInt(JWT_EXPIRES_IN) || 900; // Default 15 minutes in seconds
    // const expiresAt = currentTimestamp + jwtExpiresIn;
    
    // Generate new access token with user details
    const token = jwt.sign(
      {
        userId: decoded.userId,
        email: existingUser.email,
        username: existingUser.username,
        // Add any other user fields needed for your application
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } // Let jwt.sign handle the expiration
    );

    const decode = jwt.decode(token) as { exp: number };
    const expiresAt = decode.exp; // Expiration time in seconds
    
    
    // Generate new refresh token (token rotation for security)
    const newRefreshToken = jwt.sign(
      {
        userId: decoded.userId,
        type: 'refresh',
        // New random token ID
        jti: crypto.randomBytes(16).toString('hex')
      },
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRES_IN }
    );
    
    return {
      token,
      refreshToken: newRefreshToken,
      expiresAt
    };
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Verifies and decodes a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Extracts the userId from the JWT token.
 * @param token The JWT token.
 * @returns The userId if the token is valid, otherwise null.
 */
export const extractUserIdFromToken = (token: string): string | null => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return payload.userId; // Return the userId from the token payload
  } catch (error) {
    console.error("Token verification failed:", error);
    return null; // Return null if the token is invalid or expired
  }
};

/**
 * Extracts the role from the JWT token.
 * @param token The JWT token.
 * @returns The role if the token is valid, otherwise null.
 */
export const extractRoleFromToken = (token: string): string | null => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    var role = payload.role
    return payload.role || null; // Return the role from the token payload
  } catch (error) {
    console.error("Token verification failed:", error);
    return null; // Return null if the token is invalid or expired
  }
};
