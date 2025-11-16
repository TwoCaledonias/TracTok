import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

/**
 * Encryption utilities for sensitive data (OAuth tokens)
 * Uses AES-256-GCM for encryption
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // For AES, this is always 16
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

/**
 * Get encryption key from environment
 * In production, this should be a secure random key
 */
function getEncryptionKey(): string {
  const key = process.env.TIKTOK_ENCRYPTION_KEY;

  if (!key) {
    // For development only - use a default key
    // NEVER use this in production!
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "⚠️  Using default encryption key for development. Generate a secure key for production!"
      );
      return "dev-default-key-32-chars-long!!!"; // Exactly 32 chars for AES-256
    }
    throw new Error("TIKTOK_ENCRYPTION_KEY environment variable is not set");
  }

  // Ensure key is exactly 32 bytes for AES-256
  if (key.length < 32) {
    throw new Error("TIKTOK_ENCRYPTION_KEY must be at least 32 characters");
  }

  return key.slice(0, 32); // Use first 32 chars
}

/**
 * Encrypt a string value
 * Returns base64-encoded encrypted data with salt, IV, and auth tag
 */
export function encrypt(text: string): string {
  const key = Buffer.from(getEncryptionKey());
  const iv = randomBytes(IV_LENGTH);
  const salt = randomBytes(SALT_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);

  const tag = cipher.getAuthTag();

  // Combine salt + iv + tag + encrypted data
  const result = Buffer.concat([salt, iv, tag, encrypted]);

  return result.toString("base64");
}

/**
 * Decrypt a string value
 * Expects base64-encoded encrypted data from encrypt()
 */
export function decrypt(encryptedData: string): string {
  const key = Buffer.from(getEncryptionKey());
  const data = Buffer.from(encryptedData, "base64");

  // Extract components
  // const salt = data.subarray(0, SALT_LENGTH); // Salt not used in decryption for AES-GCM
  const iv = data.subarray(SALT_LENGTH, TAG_POSITION);
  const tag = data.subarray(TAG_POSITION, ENCRYPTED_POSITION);
  const encrypted = data.subarray(ENCRYPTED_POSITION);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return decrypted.toString("utf8");
}

/**
 * Generate a secure random encryption key
 * Use this to generate your TIKTOK_ENCRYPTION_KEY
 */
export function generateEncryptionKey(): string {
  return randomBytes(32).toString("base64");
}

/**
 * Test encryption/decryption
 * For development and testing purposes
 */
export function testEncryption(): boolean {
  try {
    const testString = "test-token-12345";
    const encrypted = encrypt(testString);
    const decrypted = decrypt(encrypted);

    if (testString !== decrypted) {
      console.error("❌ Encryption test failed: decrypted value doesn't match");
      return false;
    }

    console.log("✅ Encryption test passed");
    return true;
  } catch (error) {
    console.error("❌ Encryption test failed:", error);
    return false;
  }
}
