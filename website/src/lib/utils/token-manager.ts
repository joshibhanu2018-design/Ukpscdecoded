import fs from 'fs';
import path from 'path';

interface TokenData {
  token: string;
  expiresAt: number;
  pdfId: string;
  downloadCount: number;
  name?: string;
  phone?: string;
  email?: string;
}

// Store tokens in a file for persistence
const TOKENS_FILE = path.join(process.cwd(), '.tokens.json');

// Load tokens from file
function loadTokensFromFile(): Map<string, TokenData> {
  try {
    if (fs.existsSync(TOKENS_FILE)) {
      const data = fs.readFileSync(TOKENS_FILE, 'utf-8');
      const tokensArray = JSON.parse(data);
      return new Map(tokensArray);
    }
  } catch (error) {
    console.error('Error loading tokens from file:', error);
  }
  return new Map();
}

// Save tokens to file
function saveTokensToFile(tokens: Map<string, TokenData>): void {
  try {
    const tokensArray = Array.from(tokens.entries());
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokensArray, null, 2));
  } catch (error) {
    console.error('Error saving tokens to file:', error);
  }
}

// In-memory cache
let activeTokens: Map<string, TokenData> = loadTokensFromFile();

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

  const tokenData: TokenData = {
    token,
    expiresAt,
    pdfId,
    downloadCount: 0,
    name,
    phone,
    email,
  };

  activeTokens.set(token, tokenData);
  saveTokensToFile(activeTokens);

  console.log(`🔑 Token created for ${name} (${pdfId}), expires in ${expiryHours}h`);
  return token;
}

// Validate token
export function validateToken(token: string): TokenData | null {
  // Reload from file to get latest tokens
  activeTokens = loadTokensFromFile();
  
  const tokenData = activeTokens.get(token);

  if (!tokenData) {
    console.log(`❌ Token not found: ${token}`);
    return null;
  }

  // Check expiry
  if (tokenData.expiresAt < Date.now()) {
    console.log(`⏰ Token expired: ${token}`);
    activeTokens.delete(token);
    saveTokensToFile(activeTokens);
    return null;
  }

  console.log(`✅ Token validated for ${tokenData.name}`);
  return tokenData;
}

// Increment download count
export function incrementDownloadCount(token: string): void {
  activeTokens = loadTokensFromFile();
  const tokenData = activeTokens.get(token);
  if (tokenData) {
    tokenData.downloadCount++;
    saveTokensToFile(activeTokens);
  }
}

// Delete token (one-time use)
export function deleteToken(token: string): void {
  activeTokens = loadTokensFromFile();
  activeTokens.delete(token);
  saveTokensToFile(activeTokens);
  console.log(`🗑️ Token deleted: ${token}`);
}

// Get all active tokens (for monitoring)
export function getActiveTokensCount(): number {
  activeTokens = loadTokensFromFile();
  // Cleanup expired tokens
  for (const [token, data] of activeTokens.entries()) {
    if (data.expiresAt < Date.now()) {
      activeTokens.delete(token);
    }
  }
  saveTokensToFile(activeTokens);
  return activeTokens.size;
}

// Export for debugging
export function getAllTokens(): TokenData[] {
  activeTokens = loadTokensFromFile();
  return Array.from(activeTokens.values());
}