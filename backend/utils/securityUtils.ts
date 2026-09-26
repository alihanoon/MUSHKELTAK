import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 characters
const IV = process.env.IV;

export function encrypt(text: string): string {
  try {
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY as string, "hex"), Buffer.from(IV as string, "hex"));
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("hex");
  } catch (error) {
    console.error("Encryption error:", error);
    return text;
  }
}

export function decrypt(text: string): string {
  try {
    const encryptedText = Buffer.from(text, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY as string, "hex"), Buffer.from(IV as string, "hex"));
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    return text;
  }
}
