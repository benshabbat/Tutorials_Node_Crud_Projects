import crypto from 'crypto';

export function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

export function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}
