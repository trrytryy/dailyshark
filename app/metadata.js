import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = headers();
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  const host = headersList.get('host') || 'localhost:3000';
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: "Furniture Next App - Somor Mk",
    description: "Designed by Somor Mk",
    icons: {
      icon: '/favicon.png',
    },
    openGraph: {
      images: [`${metadataBase.origin}/thumbnail.png`],
      description: "Online furniture apps simplify home shopping with convenience, variety, and affordability. Browse easily, compare prices."
    }
  };
}
