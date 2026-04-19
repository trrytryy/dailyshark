import axios from 'axios';
import https from 'https';

const agent = new https.Agent({ family: 4 });

// Simple rate limiter to prevent spam
const rateLimiter = new Map<string, number>();
const RATE_LIMIT_WINDOW = 2000; // 2 seconds for notifications

function checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const lastCall = rateLimiter.get(identifier);

    if (!lastCall || (now - lastCall) > RATE_LIMIT_WINDOW) {
        rateLimiter.set(identifier, now);
        return true;
    }

    return false;
}

// Retry utility for Telegram API calls
async function retryTelegramRequest(requestFn: () => Promise<any>, maxRetries = 3): Promise<any> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await requestFn();
            return result;
        } catch (error: any) {
            lastError = error;

            // Don't retry on certain errors
            const errorCode = error?.response?.status;
            const errorDesc = error?.response?.data?.description || '';

            // Don't retry on authentication errors, invalid chat_id, etc.
            if (errorCode === 401 || errorCode === 403 || errorDesc.includes('chat not found') || errorDesc.includes('bot was blocked')) {
                throw error;
            }

            // Don't retry on last attempt
            if (attempt === maxRetries) {
                break;
            }

            // Exponential backoff: 1s, 2s, 4s
            const delay = Math.pow(2, attempt - 1) * 1000;
            console.warn(`⚠️ Telegram API attempt ${attempt} failed, retrying in ${delay}ms:`, error.message);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

function escapeHtml(input: any): string {
    const str = typeof input === 'string' ? input : String(input ?? '');
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export async function sendNotificationMessage(data: any): Promise<void> {
    // Kiểm tra xem có đủ biến môi trường không
    const notificationToken = process.env.NOTIFICATION_TOKEN;
    const notificationChat = process.env.NOTIFICATION_CHAT;

    // Kiểm tra cả hai biến phải tồn tại và không rỗng (bao gồm cả chuỗi chỉ có khoảng trắng)
    if (!notificationToken?.trim() || !notificationChat?.trim()) {
        console.log('⚠️ Notification không được gửi: Thiếu NOTIFICATION_TOKEN hoặc NOTIFICATION_CHAT trong file .env');
        return; // Không throw error, chỉ return sớm
    }

    // Rate limiting check for notifications
    const rateLimitKey = `notification_${data?.url || 'unknown'}_${Date.now()}`;
    if (!checkRateLimit(rateLimitKey)) {
        console.warn('⚠️ Notification rate limit exceeded');
        return; // Skip notification to prevent spam
    }

    try {
        const TELEGRAM_API = `https://api.telegram.org/bot${notificationToken}`;
        const CHAT_ID = notificationChat;

        // Validate data to prevent undefined access and escape HTML
        const locationText = typeof data?.location === 'string' ? data.location :
                           data?.location?.location || 'Unknown';
        const userAgentText = escapeHtml(data?.userAgent || 'Unknown');
        const langText = escapeHtml(data?.lang || 'Unknown');
        const urlText = escapeHtml(data?.url || 'Unknown');

        const res = await retryTelegramRequest(() =>
            axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: CHAT_ID,
                text: `
Lượt truy cập mới từ:
---------------------
<b>Device:</b> ${userAgentText}
<b>Location:</b> ${locationText}
<b>Language:</b> ${langText}
<b>Url:</b> ${urlText}
`,
                parse_mode: 'HTML'
            }, {
                httpsAgent: agent,
                timeout: 10000
            })
        );

        // Validate response properly
        if (res?.data?.ok === true && res?.data?.result?.message_id) {
            const messageId = res.data.result.message_id;
            console.log(`✅ Sent new message. ID: ${messageId}`);
        } else {
            console.warn('⚠️ Telegram API returned unexpected response:', res?.data);
        }
    } catch (err: any) {
        console.error('🔥 Telegram send/edit error:', err?.response?.data || err.message || err);
        // Không throw error để tránh crash server, chỉ log và return
        return;
    }
}
