import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Endless - Advanced Storytelling AI',
  description: 'Craft extraordinary narratives with Endless, powered by Claude Opus 4.5',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        {/* Dreamlike background */}
        <div className="dream-bg">
          <div className="dream-orb dream-orb-1" />
          <div className="dream-orb dream-orb-2" />
          <div className="dream-orb dream-orb-3" />
        </div>
        {children}
      </body>
    </html>
  );
}
