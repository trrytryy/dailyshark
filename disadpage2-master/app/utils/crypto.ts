import CryptoJS from 'crypto-js';

const secretKey = 'HDNDT-JDHT8FNEK-JJHR';

export function decryptAES(encryptedData: string): string | null {
    try {
        if (!encryptedData || typeof encryptedData !== 'string') {
            console.warn('⚠️ Invalid encrypted input provided to decryptAES');
            return null;
        }

        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        if (!decrypted) {
            console.warn('⚠️ Decryption failed - empty result');
            return null;
        }

        return decrypted;
    } catch (error) {
        console.error('🔥 Decryption error:', error);
        return null;
    }
}
