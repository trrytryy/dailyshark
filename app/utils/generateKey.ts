import crypto from 'crypto';

const IMPORTANT_FIELDS = ['ip', 'email', 'phone', 'business'];

export function generateKey(data: Record<string, any>): string {
    // Normalize undefined/null values to empty strings for consistent key generation
    const normalizedData = IMPORTANT_FIELDS.reduce((acc, key) => {
        acc[key] = data[key] ?? '';
        return acc;
    }, {} as Record<string, string>);

    const parts = IMPORTANT_FIELDS.map(key => `${key}:${normalizedData[key]}`).join('|');
    return crypto.createHash('md5').update(parts).digest('hex');
}
