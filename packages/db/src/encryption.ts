import crypto from "crypto";

const ALGO = "aes-256-gcm";

const getSecretKey = (): Buffer => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    // For development, provide a fallback to avoid breaking local dev
    // In production, ENCRYPTION_KEY must be provided
    console.warn("⚠️ ENCRYPTION_KEY missing. Using insecure dev fallback.");
    return crypto.scryptSync("dev-fallback-password-do-not-use", "salt", 32);
  }
  
  if (key.length !== 32) {
    console.warn("⚠️ ENCRYPTION_KEY should be exactly 32 bytes for aes-256-gcm.");
    return crypto.scryptSync(key, "salt", 32); // derive 32 bytes safely
  }

  return Buffer.from(key, "utf8");
};

export const encryptToken = (text: string | null): string | null => {
  if (!text) return null;
  
  try {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGO, getSecretKey(), iv);
    
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");
    
    // Format: iv:authTag:encrypted
    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
  } catch (error) {
    console.error("[Encryption] Failed to encrypt token");
    throw error;
  }
};

export const decryptToken = (hash: string | null): string | null => {
  if (!hash) return null;
  
  try {
    const parts = hash.split(":");
    // If it doesn't match our specific pattern, it might be legacy plaintext
    if (parts.length !== 3) {
      return hash; 
    }

    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encryptedText = parts[2];

    const decipher = crypto.createDecipheriv(ALGO, getSecretKey(), iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    console.error("[Decryption] Failed to decrypt token");
    // Returning null enforces failure if the token was corrupted or key rotated
    return null;
  }
};
