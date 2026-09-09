import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kodsnickerboa.com'),
  title: 'Kodsnickerboa — Independent app studio',
  description:
    'Thoughtful software for everyday life, play, and the places in between.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kodsnickerboa — Independent app studio',
    description:
      'Thoughtful software for everyday life, play, and the places in between.',
    url: 'https://kodsnickerboa.com/',
    siteName: 'Kodsnickerboa',
    type: 'website',
    images: ['/assets/images/kodsnickerboa-hero.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kodsnickerboa — Independent app studio',
    description:
      'Thoughtful software for everyday life, play, and the places in between.',
    images: ['/assets/images/kodsnickerboa-hero.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
