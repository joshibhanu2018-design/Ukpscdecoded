// Unified token management system
// Used by both verify-payment and download-pdf routes

interface TokenData {
  token: string;
  expiresAt: number;
  pdfId: string;
  downloadCount: number;
  name?: string;
  phone?: string;
  email?: string;
}

// In-memory token storage
// In production, consider Redis for distributed systems
const activeTokens: Map<string, TokenData> = new Map();

// Generate secure token
export function generateSecureToken(): string {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

// Create token with 24-hour expiry
export function createToken(
  pdfId: string,
  name: string,
  phone: string,
  email?: string,
  expiryHours: number = 24
): string {
  const token = generateSecureToken();
  const expiresAt = Date.now() + expiryHours * 60 * 60 * 1000;

  activeTokens.set(token, {
    token,
    expiresAt,
    pdfId,
    downloadCount: 0,
    name,
    phone,
    email,
  });

  console.log(`🔑 Token created for ${name} (${pdfId}), expires in ${expiryHours}h`);
  return token;
}

// Validate token
export function validateToken(token: string): TokenData | null {
  const tokenData = activeTokens.get(token);

  if (!tokenData) {
    return null;
  }

  // Check expiry
  if (tokenData.expiresAt < Date.now()) {
    console.log(`⏰ Token expired: ${token}`);
    activeTokens.delete(token);
    return null;
  }

  return tokenData;
}

// Increment download count
export function incrementDownloadCount(token: string): void {
  const tokenData = activeTokens.get(token);
  if (tokenData) {
    tokenData.downloadCount++;
  }
}

// Delete token (one-time use)
export function deleteToken(token: string): void {
  activeTokens.delete(token);
  console.log(`🗑️ Token deleted: ${token}`);
}

// Get all active tokens (for monitoring)
export function getActiveTokensCount(): number {
  // Cleanup expired tokens
  for (const [token, data] of activeTokens.entries()) {
    if (data.expiresAt < Date.now()) {
      activeTokens.delete(token);
    }
  }
  return activeTokens.size;
}

// Export for debugging
export function getAllTokens(): TokenData[] {
  return Array.from(activeTokens.values());
}