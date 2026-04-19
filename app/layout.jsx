import './globals.css';
import { DM_Sans } from 'next/font/google';
import { optimisticFont } from './fonts';

export { generateMetadata } from './metadata';

const dmSans = DM_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} ${optimisticFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
